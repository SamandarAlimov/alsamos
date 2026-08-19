import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Maximum number of participants in a mesh (p2p) group call.
 * Mesh scales as N*(N-1) peer connections, so this is a hard ceiling until an
 * SFU media backend is deployed (see docs/call-architecture.md).
 */
export const MESH_PARTICIPANT_CAP = 8;

interface VideoCallRecord {
  id: string;
  conversation_id: string | null;
  host_id: string;
  call_type: string;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  is_group_call?: boolean;
  max_participants?: number | null;
}

interface CallParticipant {
  id: string;
  call_id: string;
  user_id: string;
  joined_at: string | null;
  left_at: string | null;
  is_muted: boolean;
  is_video_on: boolean;
  is_screen_sharing: boolean;
  is_hand_raised: boolean;
  profile?: {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface CreateCallOptions {
  isGroupCall?: boolean;
  maxParticipants?: number;
}

// The generated Supabase types are regenerated separately; the RTC RPCs and the
// is_group_call column are addressed through this loosely typed handle.
const db = supabase as any;

function rpcErrorMessage(error: unknown): string {
  const message = String((error as { message?: string })?.message ?? '');
  if (message.includes('call_full')) {
    return `This call is full (maximum ${MESH_PARTICIPANT_CAP} participants).`;
  }
  if (message.includes('call_ended')) return 'This call has already ended';
  if (message.includes('call_not_found')) return 'This call no longer exists';
  if (message.includes('not_call_host')) return 'Only the host can end the call for everyone';
  return 'Something went wrong with the call. Please try again.';
}

export function useVideoCall() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentCall, setCurrentCall] = useState<VideoCallRecord | null>(null);
  const [callParticipants, setCallParticipants] = useState<CallParticipant[]>([]);
  const [isCreatingCall, setIsCreatingCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const callSubscriptionRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to call status changes.
  // Only a real 'ended' status tears the call down — a single participant
  // leaving a group call no longer produces this event (see rpc_leave_video_call).
  useEffect(() => {
    if (!currentCall) return;

    console.log('[VideoCall] Subscribing to call status:', currentCall.id);

    callSubscriptionRef.current = supabase
      .channel(`call_status_${currentCall.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'video_calls',
          filter: `id=eq.${currentCall.id}`,
        },
        (payload) => {
          const updated = payload.new as VideoCallRecord;
          console.log('[VideoCall] Call status updated:', updated.status);

          setCurrentCall(updated);

          if (['ended', 'declined', 'missed'].includes(updated.status)) {
            console.log('[VideoCall] Call ended');
            setCallEnded(true);
            toast({
              title: 'Call Ended',
              description: 'The call has ended',
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (callSubscriptionRef.current) {
        console.log('[VideoCall] Unsubscribing from call status');
        supabase.removeChannel(callSubscriptionRef.current);
        callSubscriptionRef.current = null;
      }
    };
  }, [currentCall, toast]);

  // Create a new call (1:1 or group)
  const createCall = useCallback(async (
    conversationId: string,
    callType: 'audio' | 'video',
    options: CreateCallOptions = {}
  ): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to start a call',
        variant: 'destructive',
      });
      return null;
    }

    const isGroupCall = options.isGroupCall ?? false;
    const maxParticipants = isGroupCall
      ? Math.min(options.maxParticipants ?? MESH_PARTICIPANT_CAP, MESH_PARTICIPANT_CAP)
      : 2;

    setIsCreatingCall(true);
    setCallEnded(false);

    try {
      const { data: call, error: callError } = await db
        .from('video_calls')
        .insert({
          conversation_id: conversationId,
          host_id: user.id,
          call_type: callType,
          status: 'active',
          started_at: null,
          is_group_call: isGroupCall,
          max_participants: maxParticipants,
        })
        .select()
        .single();

      if (callError) {
        console.error('Error creating call:', callError);
        throw callError;
      }

      // Host joins through the same server-side path as everyone else so the
      // participant row, cap check and call status stay consistent.
      const { data: joined, error: joinError } = await db.rpc('rpc_join_video_call', {
        p_call_id: call.id,
      });

      if (joinError) {
        console.error('Error joining created call:', joinError);
        await db.from('video_calls').delete().eq('id', call.id);
        throw joinError;
      }

      setCurrentCall((joined as VideoCallRecord) ?? (call as VideoCallRecord));

      toast({
        title: 'Call Started',
        description: `${callType === 'video' ? 'Video' : 'Audio'} ${isGroupCall ? 'group ' : ''}call started`,
      });

      return call.id as string;
    } catch (error) {
      console.error('Failed to create call:', error);
      toast({
        title: 'Error',
        description: rpcErrorMessage(error),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreatingCall(false);
    }
  }, [user?.id, toast]);

  // Join an existing call. The participant cap is enforced server-side and a
  // full call surfaces an explicit message instead of failing silently.
  const joinCall = useCallback(async (callId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setCallEnded(false);

    try {
      const { data, error } = await db.rpc('rpc_join_video_call', { p_call_id: callId });
      if (error) throw error;

      setCurrentCall(data as VideoCallRecord);
      return true;
    } catch (error) {
      console.error('Failed to join call:', error);
      toast({
        title: 'Unable to join call',
        description: rpcErrorMessage(error),
        variant: 'destructive',
      });
      return false;
    }
  }, [user?.id, toast]);

  // Reset call state (called after cleanup is complete)
  const resetCallState = useCallback(() => {
    setCurrentCall(null);
    setCallParticipants([]);
    setCallEnded(false);
  }, []);

  /**
   * Leave the call for THIS client only.
   *
   * The server decides whether the call itself ends:
   *  - 1:1 call            -> call ends for both sides (unchanged behaviour)
   *  - group call, others still connected -> call continues without this user
   *  - group call, last participant leaves -> call ends
   */
  const leaveCall = useCallback(async () => {
    if (!currentCall || !user?.id) return;

    const callId = currentCall.id;
    console.log('[VideoCall] Leaving call:', callId);

    try {
      const { error } = await db.rpc('rpc_leave_video_call', { p_call_id: callId });
      if (error) throw error;
      console.log('[VideoCall] Left call (server decided whether the call ends)');
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  }, [currentCall, user?.id]);

  /** Host-only: end the call for every participant. */
  const endCallForEveryone = useCallback(async () => {
    if (!currentCall || !user?.id) return;
    if (currentCall.host_id !== user.id) return;

    try {
      const { error } = await db.rpc('rpc_end_video_call_for_everyone', {
        p_call_id: currentCall.id,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error ending call for everyone:', error);
      toast({
        title: 'Error',
        description: rpcErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [currentCall, user?.id, toast]);

  // Update participant media state in database
  const updateMediaState = useCallback(async (
    isMuted: boolean,
    isVideoOn: boolean,
    isScreenSharing: boolean,
    isHandRaised: boolean
  ) => {
    if (!currentCall || !user?.id) return;

    try {
      await db
        .from('call_participants')
        .update({
          is_muted: isMuted,
          is_video_on: isVideoOn,
          is_screen_sharing: isScreenSharing,
          is_hand_raised: isHandRaised,
        })
        .eq('call_id', currentCall.id)
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating media state:', error);
    }
  }, [currentCall, user?.id]);

  // Fetch participants with profiles
  const fetchParticipants = useCallback(async () => {
    if (!currentCall) return [];

    try {
      const { data } = await db
        .from('call_participants')
        .select(`
          *,
          profile:profiles!call_participants_user_id_fkey (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('call_id', currentCall.id)
        .is('left_at', null);

      const participants = (data || []) as CallParticipant[];
      setCallParticipants(participants);
      return participants;
    } catch (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
  }, [currentCall]);

  // Subscribe to participant changes
  const subscribeToParticipants = useCallback(() => {
    if (!currentCall) return () => {};

    const channel = supabase
      .channel(`call_participants_${currentCall.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_participants',
          filter: `call_id=eq.${currentCall.id}`,
        },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentCall, fetchParticipants]);

  return {
    currentCall,
    callParticipants,
    isCreatingCall,
    callEnded,
    isGroupCall: currentCall?.is_group_call ?? false,
    createCall,
    joinCall,
    leaveCall,
    endCallForEveryone,
    resetCallState,
    updateMediaState,
    fetchParticipants,
    subscribeToParticipants,
  };
}
