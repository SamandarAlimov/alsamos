import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { IncomingCallDialog } from '@/components/messages/IncomingCallDialog';
import { useNavigate, useLocation } from 'react-router-dom';

interface IncomingCall {
  id: string;
  conversation_id: string;
  host_id: string;
  call_type: 'audio' | 'video';
  host_profile: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface GlobalCallContextType {
  incomingCall: IncomingCall | null;
  handleCallHandled: (callId: string) => void;
  acceptCall: () => void;
  declineCall: () => void;
}

const GlobalCallContext = createContext<GlobalCallContextType | undefined>(undefined);

export function GlobalCallProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const handledCallIdsRef = useRef<Set<string>>(new Set());
  const incomingCallIdRef = useRef<string | null>(null);

  useEffect(() => {
    incomingCallIdRef.current = incomingCall?.id ?? null;
  }, [incomingCall]);

  const handleCallHandled = useCallback((callId: string) => {
    handledCallIdsRef.current.add(callId);
    setIncomingCall((prev) => (prev?.id === callId ? null : prev));
  }, []);

  const acceptCall = useCallback(() => {
    if (incomingCall) {
      handleCallHandled(incomingCall.id);
      navigate(`/messages?call=${incomingCall.id}&type=${incomingCall.call_type}`);
    }
  }, [incomingCall, handleCallHandled, navigate]);

  const declineCall = useCallback(async () => {
    if (!incomingCall) return;
    const callId = incomingCall.id;
    try {
      if (user?.id) {
        await supabase
          .from('call_participants')
          .update({ left_at: new Date().toISOString() })
          .eq('call_id', callId)
          .eq('user_id', user.id);
      }
      await supabase
        .from('video_calls')
        .update({ status: 'declined', ended_at: new Date().toISOString() })
        .eq('id', callId)
        .in('status', ['ringing', 'waiting', 'active']);
    } catch (err) {
      console.error('[GlobalCall] decline failed', err);
    }
    handleCallHandled(callId);
  }, [incomingCall, handleCallHandled, user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`global-incoming-calls:${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'video_calls' },
        async (payload) => {
          const newCall = payload.new as {
            id: string;
            conversation_id: string;
            host_id: string;
            call_type: string;
            status: string;
          };

          console.log('[GlobalCall] New call detected:', newCall);

          if (newCall.host_id === user.id || handledCallIdsRef.current.has(newCall.id)) return;
          if (['ended', 'declined', 'missed'].includes(newCall.status)) return;

          const { data: callMember } = await supabase
            .from('call_participants')
            .select('id')
            .eq('call_id', newCall.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (!callMember) {
            const { data: convMembers } = await supabase
              .from('conversation_participants')
              .select('user_id')
              .eq('conversation_id', newCall.conversation_id);

            const memberIds = (convMembers || []).map((m) => m.user_id);
            const isDirectOther =
              memberIds.length === 2 &&
              memberIds.includes(user.id) &&
              memberIds.includes(newCall.host_id);

            if (!isDirectOther) {
              console.log('[GlobalCall] Not invitee / not 1:1 peer — skip');
              return;
            }
          }

          const { data: hostProfile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url')
            .eq('id', newCall.host_id)
            .single();

          setIncomingCall({
            id: newCall.id,
            conversation_id: newCall.conversation_id,
            host_id: newCall.host_id,
            call_type: newCall.call_type as 'audio' | 'video',
            host_profile: hostProfile,
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'video_calls' },
        (payload) => {
          const updatedCall = payload.new as { id: string; status: string };
          if (['ended', 'declined', 'missed'].includes(updatedCall.status)) {
            handledCallIdsRef.current.add(updatedCall.id);
            if (incomingCallIdRef.current === updatedCall.id) setIncomingCall(null);
          }
        }
      )
      .subscribe((status) => console.log('[GlobalCall] channel status', status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const showDialog = incomingCall && location.pathname !== '/messages';

  return (
    <GlobalCallContext.Provider value={{ incomingCall, handleCallHandled, acceptCall, declineCall }}>
      {children}
      {showDialog && (
        <IncomingCallDialog
          isOpen={true}
          callerName={incomingCall.host_profile?.display_name || incomingCall.host_profile?.username || 'Unknown'}
          callerAvatar={incomingCall.host_profile?.avatar_url || undefined}
          callType={incomingCall.call_type}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}
    </GlobalCallContext.Provider>
  );
}

export function useGlobalCall() {
  const context = useContext(GlobalCallContext);
  if (context === undefined) {
    throw new Error('useGlobalCall must be used within a GlobalCallProvider');
  }
  return context;
}
