import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, BarChart2 } from 'lucide-react';
import { blobToBase64 } from '../utils/audioUtils';

interface AudioRecorderProps {
  onRecordingComplete: (base64: string) => void;
  isProcessing: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'; 
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        const base64 = await blobToBase64(blob);
        onRecordingComplete(base64);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Visualizer / Timer Circle */}
      <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-50 border-4 border-red-100' : 'bg-slate-50 border-4 border-slate-100'}`}>
        
        {/* Pulsing Rings when recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-[ping_2s_ease-in-out_infinite] opacity-50"></div>
            <div className="absolute -inset-4 rounded-full border border-red-100 animate-[ping_3s_ease-in-out_infinite] delay-150 opacity-30"></div>
          </>
        )}

        <div className="z-10 flex flex-col items-center">
            {isRecording ? (
                <div className="flex gap-1 items-end h-8 mb-2">
                    <div className="w-1.5 bg-red-500 animate-[bounce_1s_infinite] h-4"></div>
                    <div className="w-1.5 bg-red-500 animate-[bounce_1.2s_infinite] h-8"></div>
                    <div className="w-1.5 bg-red-500 animate-[bounce_0.8s_infinite] h-5"></div>
                    <div className="w-1.5 bg-red-500 animate-[bounce_1.1s_infinite] h-7"></div>
                </div>
            ) : (
                <div className="text-slate-300 mb-2">
                    <Mic size={32} />
                </div>
            )}
            <span className={`text-2xl font-mono font-bold tabular-nums ${isRecording ? 'text-red-600' : 'text-slate-400'}`}>
                {formatTime(recordingTime)}
            </span>
        </div>
      </div>

      <div className="flex gap-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="group relative flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-xl shadow-red-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
          >
            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse group-hover:hidden"></span>
            <Mic size={24} />
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Square size={20} fill="currentColor" />
            Stop Recording
          </button>
        )}

        {audioBlob && !isRecording && (
          <div className="flex gap-3 animate-fade-in-up">
            <button
              onClick={() => {
                if (audioUrl) {
                  const audio = new Audio(audioUrl);
                  audio.play();
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Play size={20} fill="currentColor" />
              Playback
            </button>
            <button
              onClick={resetRecording}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCcw size={20} />
              Retry
            </button>
          </div>
        )}
      </div>
      
      {isProcessing && (
         <div className="flex items-center gap-2 text-blue-600 font-medium animate-pulse">
            <BarChart2 size={20} />
            AI is analyzing your pronunciation...
         </div>
      )}
    </div>
  );
};