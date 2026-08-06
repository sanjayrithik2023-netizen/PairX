import React, { useEffect, useRef, useState } from 'react';
import { 
  PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff, 
  ShieldCheck, Volume2, PhoneIncoming, Maximize, RotateCcw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoCallView: React.FC = () => {
  const { 
    callState, 
    endCall, 
    acceptCall, 
    declineCall, 
    toggleMuteCall, 
    toggleVideoCall 
  } = useApp();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

  // Initialize camera preview
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    if (callState.active && !callState.incoming && !callState.isVideoOff) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          activeStream = stream;
          setHasCameraPermission(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log('WebRTC camera preview info:', err);
          setStreamError('Camera preview simulation active');
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callState.active, callState.incoming, callState.isVideoOff]);

  if (!callState.active || !callState.remoteUser) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const remoteUser = callState.remoteUser;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 select-none">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10 bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-semibold tracking-wide text-emerald-400">
            {callState.connectionQuality} • E2E Encrypted WebRTC
          </span>
        </div>

        <div className="bg-slate-800/80 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest">
          {formatDuration(callState.durationSeconds)}
        </div>
      </div>

      {/* Main Video View Area */}
      {callState.incoming ? (
        /* Incoming Call Ringing Screen */
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500 shadow-2xl animate-pulse">
              <img
                src={remoteUser.avatar}
                alt={remoteUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-2 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {callState.type} Call
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold">{remoteUser.name}</h2>
            <p className="text-xs text-rose-300 mt-1">Incoming Encrypted {callState.type.toUpperCase()} Call from Tiruppur</p>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <button
              onClick={declineCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg transition-transform active:scale-90"
              title="Decline Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            <button
              onClick={acceptCall}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 animate-bounce"
              title="Accept Call"
            >
              <PhoneIncoming className="w-7 h-7" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Video Call Screen */
        <div className="relative flex-1 rounded-3xl overflow-hidden my-4 border border-slate-800 bg-slate-900 flex items-center justify-center">
          
          {/* Remote User Simulated Video Feed */}
          <div className="absolute inset-0 z-0">
            <img
              src={remoteUser.photos[0] || remoteUser.avatar}
              alt={remoteUser.name}
              className="w-full h-full object-cover opacity-90 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40"></div>
          </div>

          {/* User's Local Webcam Box */}
          <div className="absolute bottom-4 right-4 z-20 w-32 h-44 sm:w-40 sm:h-56 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
            {callState.isVideoOff ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-2 text-center text-[10px]">
                <VideoOff className="w-6 h-6 mb-1 text-slate-400" />
                <span>Camera Off</span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            )}
            <span className="absolute bottom-1 left-2 text-[9px] bg-slate-900/80 px-1.5 py-0.5 rounded text-slate-300 font-medium">
              You (Local)
            </span>
          </div>

          {/* Overlay Caller Name */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">PairX Single Broker Concierge Desk (Tiruppur)</span>
          </div>

        </div>
      )}

      {/* Bottom Controls Bar */}
      {!callState.incoming && (
        <div className="flex items-center justify-center gap-4 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 max-w-md mx-auto w-full">
          <button
            onClick={toggleMuteCall}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              callState.isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={callState.isMuted ? 'Unmute' : 'Mute'}
          >
            {callState.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideoCall}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              callState.isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
            title={callState.isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {callState.isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg transition-transform active:scale-90"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};
