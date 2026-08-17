import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
}

interface ConnectionQuality {
  bitrate: number;
  packetLoss: number;
  latency: number;
  quality: "excellent" | "good" | "poor" | "disconnected";
}

type MediaState = {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
};

type Signal = {
  from: string;
  to?: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  mediaState?: MediaState;
};

const FALLBACK_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  {
    urls: [
      "turn:openrelay.metered.ca:80",
      "turn:openrelay.metered.ca:443",
      "turn:openrelay.metered.ca:443?transport=tcp",
    ],
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

function getIceServers(): RTCIceServer[] {
  const turnUrl = import.meta.env.VITE_TURN_URL as string | undefined;
  const turnUsername = import.meta.env.VITE_TURN_USERNAME as string | undefined;
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL as string | undefined;

  if (turnUrl && turnUsername && turnCredential) {
    return [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: turnUrl, username: turnUsername, credential: turnCredential },
    ];
  }

  return FALLBACK_ICE_SERVERS;
}

const RTC_CONFIG: RTCConfiguration = {
  iceServers: getIceServers(),
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

export function useWebRTC(roomId: string | null) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>({
    bitrate: 0,
    packetLoss: 0,
    latency: 0,
    quality: "disconnected",
  });

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const roomRef = useRef<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingIceRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const subscribedRef = useRef(false);
  const qualityTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leavingRef = useRef(false);

  const send = useCallback(async (event: string, payload: Signal) => {
    const channel = channelRef.current;
    if (!channel || !subscribedRef.current) return;
    try {
      await channel.send({ type: "broadcast", event, payload });
    } catch (err) {
      console.error("[RTC] signaling send failed", event, err);
    }
  }, []);

  const updateConnected = useCallback(() => {
    const states = [...peersRef.current.values()].map((pc) => pc.connectionState);
    setIsConnected(states.some((state) => state === "connected"));
  }, []);

  const closePeer = useCallback((peerId: string) => {
    const pc = peersRef.current.get(peerId);
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.oniceconnectionstatechange = null;
      pc.close();
    }
    peersRef.current.delete(peerId);
    pendingIceRef.current.delete(peerId);
    setParticipants((current) => current.filter((participant) => participant.id !== peerId));
    updateConnected();
  }, [updateConnected]);

  const createPeer = useCallback((peerId: string) => {
    const existing = peersRef.current.get(peerId);
    if (existing && existing.connectionState !== "closed") return existing;

    const pc = new RTCPeerConnection(RTC_CONFIG);
    peersRef.current.set(peerId, pc);

    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && user?.id) {
        void send("ice", {
          from: user.id,
          to: peerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0] ?? (() => {
        const created = new MediaStream();
        created.addTrack(event.track);
        return created;
      })();

      setParticipants((current) => {
        const existingParticipant = current.find((participant) => participant.id === peerId);
        if (existingParticipant) {
          return current.map((participant) =>
            participant.id === peerId ? { ...participant, stream } : participant,
          );
        }
        return [
          ...current,
          {
            id: peerId,
            stream,
            isMuted: false,
            isVideoOn: true,
            isScreenSharing: false,
            isHandRaised: false,
          },
        ];
      });
    };

    pc.onconnectionstatechange = () => {
      console.log("[RTC]", peerId, "connectionState", pc.connectionState);
      updateConnected();
      if (pc.connectionState === "failed") {
        try { pc.restartIce(); } catch { /* closed */ }
      }
      if (pc.connectionState === "closed") closePeer(peerId);
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[RTC]", peerId, "iceConnectionState", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        try { pc.restartIce(); } catch { /* closed */ }
      }
    };

    return pc;
  }, [closePeer, send, updateConnected, user?.id]);

  const flushIce = useCallback(async (peerId: string, pc: RTCPeerConnection) => {
    const pending = pendingIceRef.current.get(peerId) ?? [];
    pendingIceRef.current.delete(peerId);
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn("[RTC] queued ICE candidate rejected", peerId, err);
      }
    }
  }, []);

  const makeOffer = useCallback(async (peerId: string) => {
    if (!user?.id || user.id.localeCompare(peerId) >= 0) return;
    const pc = peersRef.current.get(peerId) ?? createPeer(peerId);
    if (pc.signalingState !== "stable") return;
    try {
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await pc.setLocalDescription(offer);
      await send("offer", { from: user.id, to: peerId, sdp: pc.localDescription ?? offer });
      console.log("[RTC] offer sent", peerId);
    } catch (err) {
      console.error("[RTC] offer failed", peerId, err);
    }
  }, [createPeer, send, user?.id]);

  const handleOffer = useCallback(async (signal: Signal) => {
    if (!user?.id || !signal.sdp || signal.from === user.id) return;
    if (signal.to && signal.to !== user.id) return;
    const pc = peersRef.current.get(signal.from) ?? createPeer(signal.from);
    try {
      if (pc.signalingState !== "stable") {
        if (user.id.localeCompare(signal.from) < 0) return;
        await pc.setLocalDescription({ type: "rollback" });
      }
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushIce(signal.from, pc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await send("answer", { from: user.id, to: signal.from, sdp: pc.localDescription ?? answer });
      console.log("[RTC] answer sent", signal.from);
    } catch (err) {
      console.error("[RTC] offer handling failed", signal.from, err);
    }
  }, [createPeer, flushIce, send, user?.id]);

  const handleAnswer = useCallback(async (signal: Signal) => {
    if (!signal.sdp || !signal.from || signal.to !== user?.id) return;
    const pc = peersRef.current.get(signal.from);
    if (!pc) return;
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      await flushIce(signal.from, pc);
      updateConnected();
      console.log("[RTC] answer applied", signal.from);
    } catch (err) {
      console.error("[RTC] answer handling failed", signal.from, err);
    }
  }, [flushIce, updateConnected, user?.id]);

  const handleIce = useCallback(async (signal: Signal) => {
    if (!signal.candidate || !signal.from || signal.from === user?.id) return;
    if (signal.to && signal.to !== user?.id) return;
    const pc = peersRef.current.get(signal.from);
    if (!pc || !pc.remoteDescription) {
      const queue = pendingIceRef.current.get(signal.from) ?? [];
      queue.push(signal.candidate);
      pendingIceRef.current.set(signal.from, queue);
      return;
    }
    try {
      await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
    } catch (err) {
      console.warn("[RTC] ICE candidate rejected", signal.from, err);
    }
  }, [user?.id]);

  const startLocalStream = useCallback(async (video = true, audio = true) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const message = "This browser does not support microphone/camera access.";
      setError(message);
      toast({ title: "Call unavailable", description: message, variant: "destructive" });
      return null;
    }
    if (localStreamRef.current) return localStreamRef.current;

    const constraints: MediaStreamConstraints = {
      video: video ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 }, facingMode: "user" } : false,
      audio: audio ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true } : false,
    };

    try {
      console.log("[RTC] requesting media", { video, audio });
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoOn(video);
      setIsMuted(false);
      setError(null);
      return stream;
    } catch (err: any) {
      console.error("[RTC] getUserMedia failed", err);
      const name = err?.name;
      const message = name === "NotAllowedError" ? "Microphone/camera permission was denied." : name === "NotFoundError" ? (video ? "Camera or microphone was not found." : "Microphone was not found.") : name === "NotReadableError" ? "The microphone/camera is already in use." : "Unable to access microphone/camera.";
      setError(message);
      toast({ title: "Media error", description: message, variant: "destructive" });
      return null;
    }
  }, [toast]);

  const joinRoom = useCallback(async () => {
    if (!roomId || !user?.id || leavingRef.current) return;
    if (roomRef.current === roomId && subscribedRef.current) return;

    setIsConnecting(true);
    setError(null);
    leavingRef.current = false;
    roomRef.current = roomId;

    let callType: "audio" | "video" = "video";
    try {
      const { data } = await supabase.from("video_calls").select("call_type").eq("id", roomId).maybeSingle();
      if (data?.call_type === "audio") callType = "audio";
    } catch (err) {
      console.warn("[RTC] could not read call type; defaulting to video", err);
    }

    const stream = await startLocalStream(callType === "video", true);
    if (!stream) {
      setIsConnecting(false);
      return;
    }

    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase.channel(`webrtc:${roomId}`, {
      config: { presence: { key: user.id }, broadcast: { self: false, ack: true } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const peerIds = Object.keys(state).filter((id) => id !== user.id);
        for (const peerId of peerIds) {
          createPeer(peerId);
          void makeOffer(peerId);
        }
      })
      .on("presence", { event: "join" }, ({ key }) => {
        if (key && key !== user.id) {
          createPeer(key);
          void makeOffer(key);
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key && key !== user.id) closePeer(key);
      })
      .on("broadcast", { event: "hello" }, ({ payload }) => {
        const signal = payload as Signal;
        if (!signal.from || signal.from === user.id) return;
        createPeer(signal.from);
        void makeOffer(signal.from);
      })
      .on("broadcast", { event: "offer" }, ({ payload }) => void handleOffer(payload as Signal))
      .on("broadcast", { event: "answer" }, ({ payload }) => void handleAnswer(payload as Signal))
      .on("broadcast", { event: "ice" }, ({ payload }) => void handleIce(payload as Signal))
      .on("broadcast", { event: "media" }, ({ payload }) => {
        const signal = payload as Signal;
        if (!signal.from || signal.from === user.id || !signal.mediaState) return;
        setParticipants((current) => current.map((participant) => participant.id === signal.from ? { ...participant, ...signal.mediaState } : participant));
      })
      .on("broadcast", { event: "leave" }, ({ payload }) => {
        const signal = payload as Signal;
        if (signal.from && signal.from !== user.id) closePeer(signal.from);
      });

    channelRef.current = channel;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const finish = (fn: () => void) => { if (settled) return; settled = true; fn(); };
      channel.subscribe((status) => {
        console.log("[RTC] signaling status", status);
        if (status === "SUBSCRIBED") finish(resolve);
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") finish(() => reject(new Error(`Supabase Realtime status: ${status}`)));
      });
    }).then(async () => {
      subscribedRef.current = true;
      await channel.track({ online_at: new Date().toISOString() });
      await send("hello", { from: user.id });
      setIsConnecting(false);
    }).catch(async (err) => {
      console.error("[RTC] signaling subscribe failed", err);
      subscribedRef.current = false;
      setIsConnecting(false);
      setError("Realtime signaling connection failed.");
      toast({ title: "Connection error", description: "Realtime signaling could not connect.", variant: "destructive" });
      await supabase.removeChannel(channel);
      channelRef.current = null;
    });
  }, [closePeer, createPeer, handleAnswer, handleIce, handleOffer, makeOffer, roomId, send, startLocalStream, toast, user?.id]);

  const leaveRoom = useCallback(() => {
    leavingRef.current = true;
    if (user?.id && subscribedRef.current) void send("leave", { from: user.id });
    if (qualityTimerRef.current) { clearInterval(qualityTimerRef.current); qualityTimerRef.current = null; }
    for (const peerId of peersRef.current.keys()) closePeer(peerId);
    peersRef.current.clear();
    pendingIceRef.current.clear();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    screenStreamRef.current = null;
    setLocalStream(null);
    setScreenStream(null);
    setParticipants([]);
    setIsConnected(false);
    setIsConnecting(false);
    setIsMuted(false);
    setIsVideoOn(true);
    setIsScreenSharing(false);
    setIsHandRaised(false);
    setConnectionQuality({ bitrate: 0, packetLoss: 0, latency: 0, quality: "disconnected" });
    const channel = channelRef.current;
    channelRef.current = null;
    subscribedRef.current = false;
    roomRef.current = null;
    if (channel) void supabase.removeChannel(channel);
  }, [closePeer, send, user?.id]);

  const broadcastMediaState = useCallback((mediaState: MediaState) => {
    if (user?.id) void send("media", { from: user.id, mediaState });
  }, [send, user?.id]);

  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    const muted = !track.enabled;
    setIsMuted(muted);
    broadcastMediaState({ isMuted: muted, isVideoOn, isScreenSharing, isHandRaised });
  }, [broadcastMediaState, isHandRaised, isScreenSharing, isVideoOn]);

  const toggleVideo = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    const videoOn = track.enabled;
    setIsVideoOn(videoOn);
    broadcastMediaState({ isMuted, isVideoOn: videoOn, isScreenSharing, isHandRaised });
  }, [broadcastMediaState, isHandRaised, isMuted, isScreenSharing]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing && screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) peersRef.current.forEach((pc) => void pc.getSenders().find((sender) => sender.track?.kind === "video")?.replaceTrack(cameraTrack));
      broadcastMediaState({ isMuted, isVideoOn, isScreenSharing: false, isHandRaised });
      return;
    }
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const screenTrack = display.getVideoTracks()[0];
      screenStreamRef.current = display;
      setScreenStream(display);
      setIsScreenSharing(true);
      peersRef.current.forEach((pc) => void pc.getSenders().find((sender) => sender.track?.kind === "video")?.replaceTrack(screenTrack));
      screenTrack.onended = () => {
        screenStreamRef.current = null;
        setScreenStream(null);
        setIsScreenSharing(false);
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        if (cameraTrack) peersRef.current.forEach((pc) => void pc.getSenders().find((sender) => sender.track?.kind === "video")?.replaceTrack(cameraTrack));
        broadcastMediaState({ isMuted, isVideoOn, isScreenSharing: false, isHandRaised });
      };
      broadcastMediaState({ isMuted, isVideoOn, isScreenSharing: true, isHandRaised });
    } catch (err) {
      console.error("[RTC] screen share failed", err);
    }
  }, [broadcastMediaState, isHandRaised, isMuted, isScreenSharing, isVideoOn]);

  const toggleHandRaise = useCallback(() => {
    const next = !isHandRaised;
    setIsHandRaised(next);
    broadcastMediaState({ isMuted, isVideoOn, isScreenSharing, isHandRaised: next });
  }, [broadcastMediaState, isHandRaised, isMuted, isScreenSharing, isVideoOn]);

  useEffect(() => {
    if (!roomId || !user?.id) return;
    return () => { if (roomRef.current === roomId) leaveRoom(); };
  }, [leaveRoom, roomId, user?.id]);

  useEffect(() => {
    qualityTimerRef.current = setInterval(async () => {
      const pcs = [...peersRef.current.values()];
      if (!pcs.length) return;
      let latency = 0;
      let bitrate = 0;
      let samples = 0;
      for (const pc of pcs) {
        try {
          const stats = await pc.getStats();
          stats.forEach((report: any) => {
            if (report.type === "candidate-pair" && report.state === "succeeded" && report.currentRoundTripTime != null) {
              latency += report.currentRoundTripTime * 1000;
              samples++;
            }
            if (report.type === "outbound-rtp" && report.kind === "video" && report.bytesSent != null && report.timestamp) {
              bitrate += (report.bytesSent * 8) / (report.timestamp / 1000);
            }
          });
        } catch { /* peer closed while collecting stats */ }
      }
      const avgLatency = samples ? latency / samples : 0;
      const avgBitrate = pcs.length ? bitrate / pcs.length : 0;
      const quality: ConnectionQuality["quality"] = !samples ? "disconnected" : avgLatency < 100 && avgBitrate > 500000 ? "excellent" : avgLatency < 200 && avgBitrate > 200000 ? "good" : "poor";
      setConnectionQuality({ bitrate: avgBitrate, packetLoss: 0, latency: avgLatency, quality });
    }, 5000);
    return () => {
      if (qualityTimerRef.current) clearInterval(qualityTimerRef.current);
      qualityTimerRef.current = null;
    };
  }, []);

  return {
    localStream,
    screenStream,
    participants,
    isConnected,
    isConnecting,
    isMuted,
    isVideoOn,
    isScreenSharing,
    isHandRaised,
    error,
    connectionQuality,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
  };
}
