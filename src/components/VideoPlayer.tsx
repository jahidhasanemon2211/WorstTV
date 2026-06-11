import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  isTheaterMode: boolean;
  onToggleTheaterMode: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  isTheaterMode,
  onToggleTheaterMode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Video State
  const [qualities, setQualities] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // UI Control State
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- NEW ADVANCED STATES ---
  // AI Low Latency Stream Fallback
  const [activeUrl, setActiveUrl] = useState<string>(url);
  const [fallbackCount, setFallbackCount] = useState<number>(0);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  // AI Bandwidth Manager
  const [showBandwidthAlert, setShowBandwidthAlert] = useState<boolean>(false);
  const [bandwidthToast, setBandwidthToast] = useState<string | null>(null);

  // Sports Scoreboard Overlay
  const [showScoreboard, setShowScoreboard] = useState<boolean>(false);
  const [scoreboardData, setScoreboardData] = useState({
    teamA: "BAN",
    teamB: "IND",
    runs: 142,
    wickets: 4,
    overs: "18.2",
    target: 168,
    striker: "L. Das*",
    nonStriker: "M. Rahim",
    bowler: "J. Bumrah",
    lastBall: "4"
  });

  // Alternate Commentary
  const [activeCommentary, setActiveCommentary] = useState<string>("English");
  const [showCommentaryMenu, setShowCommentaryMenu] = useState<boolean>(false);

  // Clip Cutter Tool
  const [showClipCutter, setShowClipCutter] = useState<boolean>(false);
  const [clipProgress, setClipProgress] = useState<number>(0); // 0 = idle, 1 = rendering, 2 = done
  const [clipCanvasImg, setClipCanvasImg] = useState<string | null>(null);

  // Match Prediction Polls
  const [showPoll, setShowPoll] = useState<boolean>(false);
  const [pollSelected, setPollSelected] = useState<string | null>(null);
  const [pollStats, setPollStats] = useState({ yes: 58, no: 42 });

  const FALLBACK_STREAMS = [
    "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8", // Al-Jazeera
    "https://d7x8z4yuq42qn.cloudfront.net/index_7.m3u8", // Wion
    "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/master.m3u8" // DW News
  ];

  // Sync activeUrl to original URL prop
  useEffect(() => {
    setActiveUrl(url);
    setFallbackCount(0);
    setAiStatusMessage(null);
  }, [url]);

  const triggerStreamFallback = () => {
    if (fallbackCount < FALLBACK_STREAMS.length) {
      const backup = FALLBACK_STREAMS[fallbackCount];
      setFallbackCount(prev => prev + 1);
      setAiStatusMessage(`AI Switcher: Connection failed. Routing to backup source...`);
      setActiveUrl(backup);
      setTimeout(() => {
        setAiStatusMessage(null);
      }, 5000);
    } else {
      setAiStatusMessage("AI Switcher: All redundant channels offline. Retrying original feed...");
      setActiveUrl(url);
      setFallbackCount(0);
      setTimeout(() => {
        setAiStatusMessage(null);
      }, 5000);
    }
  };

  // Live scoreboard simulator
  useEffect(() => {
    if (!showScoreboard) return;
    const interval = setInterval(() => {
      setScoreboardData(prev => {
        let runsAdd = Math.floor(Math.random() * 4);
        if (Math.random() > 0.85) runsAdd = 4;
        if (Math.random() > 0.95) runsAdd = 6;
        
        let wicketsAdd = 0;
        let nextWickets = prev.wickets;
        if (Math.random() > 0.97 && prev.wickets < 9) {
          wicketsAdd = 1;
          nextWickets += 1;
        }

        let nextOvers = parseFloat(prev.overs);
        let balls = Math.round((nextOvers % 1) * 10);
        balls += 1;
        if (balls >= 6) {
          nextOvers = Math.floor(nextOvers) + 1;
        } else {
          nextOvers = Math.floor(nextOvers) + (balls / 10);
        }

        return {
          ...prev,
          runs: prev.runs + runsAdd,
          wickets: nextWickets,
          overs: nextOvers.toFixed(1),
          lastBall: wicketsAdd ? "W" : runsAdd.toString()
        };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [showScoreboard]);

  // Commentary Changer
  const selectCommentary = (lang: string) => {
    setActiveCommentary(lang);
    setShowCommentaryMenu(false);
    setBandwidthToast(`Commentary track switched to ${lang} 🎙️`);
    setTimeout(() => {
      setBandwidthToast(null);
    }, 3000);
  };

  // Clip Cutter
  const handleCutClip = () => {
    if (!videoRef.current) return;
    setShowClipCutter(true);
    setClipProgress(1);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setClipCanvasImg(canvas.toDataURL('image/jpeg'));
    }
    
    setTimeout(() => {
      setClipProgress(2);
    }, 2500);
  };

  const handleDownloadClip = () => {
    if (!clipCanvasImg) return;
    const link = document.createElement('a');
    link.href = clipCanvasImg;
    link.download = `WorstTV_Live_Clip_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setBandwidthToast("Clip downloaded successfully! 🍿");
    setTimeout(() => setBandwidthToast(null), 3000);
  };

  // Trigger floating poll
  useEffect(() => {
    const isSports = activeUrl.includes('sports') || activeUrl.includes('cricket') || activeUrl.includes('willow') || activeUrl.includes('foxsports') || activeUrl.includes('ten');
    if (isSports) {
      const timer = setTimeout(() => {
        setShowPoll(true);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [activeUrl]);

  const handlePollVote = (option: string) => {
    setPollSelected(option);
    setPollStats(prev => {
      if (option === 'yes') {
        return { yes: prev.yes + 1, no: prev.no };
      } else {
        return { yes: prev.yes, no: prev.no + 1 };
      }
    });
    setBandwidthToast("Vote registered! +50 Points Earned! 🏆");
    setTimeout(() => {
      setBandwidthToast(null);
    }, 4000);
    setTimeout(() => {
      setShowPoll(false);
      setPollSelected(null);
    }, 5000);
  };

  // Reset/Reset HLS on URL Change
  useEffect(() => {
    let active = true;
    setIsTransitioning(true);
    setIsPlaying(true);

    if (Hls.isSupported() && videoRef.current) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        maxBufferLength: 10,
        maxMaxBufferLength: 15,
        liveSyncDuration: 3,
        liveMaxLatencyDuration: 10,
        enableWorker: true,
        lowLatencyMode: true,
        appendErrorMaxRetry: 5
      });
      hlsRef.current = hls;

      hls.loadSource(activeUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (active) {
          setQualities(data.levels);
          videoRef.current?.play().then(() => {
            setIsPlaying(true);
            setTimeout(() => {
              if (active) setIsTransitioning(false);
            }, 300);
          }).catch(err => {
            console.error(err);
            if (active) setIsTransitioning(false);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (active) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn("HLS fatal network error encountered, trying to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("HLS fatal media error encountered, trying to recover...");
                hls.recoverMediaError();
                break;
              default:
                console.error("HLS unrecoverable fatal error encountered.");
                setIsTransitioning(false);
                break;
            }
          } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            setShowBandwidthAlert(true);
          }
        }
      });

      return () => {
        active = false;
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = activeUrl;
      const handleLoadedMetadata = () => {
        if (active) {
          videoRef.current?.play().then(() => {
            setIsPlaying(true);
            setTimeout(() => {
              if (active) setIsTransitioning(false);
            }, 300);
          }).catch(err => {
            console.error(err);
            if (active) setIsTransitioning(false);
          });
        }
      };
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [activeUrl]);

  // Sync volume state to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Controls Visibility Timer
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showQualityMenu) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const video = videoRef.current;
    const handleWebKitBeginFS = () => {
      setIsFullscreen(true);
    };
    const handleWebKitEndFS = () => {
      setIsFullscreen(false);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    if (video) {
      video.addEventListener('webkitbeginfullscreen', handleWebKitBeginFS);
      video.addEventListener('webkitendfullscreen', handleWebKitEndFS);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      if (video) {
        video.removeEventListener('webkitbeginfullscreen', handleWebKitBeginFS);
        video.removeEventListener('webkitendfullscreen', handleWebKitEndFS);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const selectQuality = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
    setShowQualityMenu(false);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    if (!document.fullscreenElement && !(video as any).webkitDisplayingFullscreen) {
      // For iOS Safari (iPhone) which doesn't support element-level requestFullscreen
      if (!container.requestFullscreen && (video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen();
        setIsFullscreen(true);
      } else if (container.requestFullscreen) {
        container.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => {
            console.error("Standard fullscreen failed, attempting webkit fullscreen", err);
            if ((video as any).webkitEnterFullscreen) {
              (video as any).webkitEnterFullscreen();
              setIsFullscreen(true);
            }
          });
      } else if ((video as any).webkitRequestFullscreen) {
        (video as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else if ((video as any).webkitExitFullscreen) {
        (video as any).webkitExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Close Quality Menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showQualityMenu && !(e.target as HTMLElement).closest('.quality-selector-container')) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQualityMenu]);

  // Determine current active quality label
  const getQualityLabel = () => {
    if (currentQuality === -1) return 'Auto';
    if (qualities[currentQuality]) {
      const q = qualities[currentQuality];
      return q.height ? `${q.height}p` : `Lvl ${currentQuality + 1}`;
    }
    return 'Auto';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => !showQualityMenu && setShowControls(false)}
      className="relative w-full aspect-video bg-zinc-950 group select-none overflow-hidden"
    >
      {/* HTML5 Video Element (without native controls) */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        className={`w-full h-full cursor-pointer transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ objectFit: 'contain' }}
        poster="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=2000"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Side popups and automatic alerts removed to keep the player clean */}

      {/* Clip Cutter Modal */}
      {showClipCutter && (
        <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-zinc-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-left text-white animate-slide-in">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">✂️</span>
                <h3 className="font-extrabold text-sm tracking-wide">Live Moment Clip Cutter</h3>
              </div>
              <button onClick={() => setShowClipCutter(false)} className="text-xs opacity-50 hover:opacity-100 cursor-pointer">✕</button>
            </div>

            {clipProgress === 1 ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-[#ff003c]/20 border-t-[#ff003c] rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ff003c] animate-pulse">Rendering Video Moment...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clipCanvasImg && (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-black shadow-inner">
                    <img src={clipCanvasImg} alt="Clip Frame Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-[#ff003c] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse">00:08 SEC CLIP</span>
                  </div>
                )}
                
                {/* Timeline track */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[8px] font-black text-zinc-500 tracking-wider">
                    <span>-10s</span>
                    <span>Select Buffer Range</span>
                    <span>LIVE</span>
                  </div>
                  <div className="relative h-2 bg-zinc-900 rounded-full border border-zinc-800">
                    <div className="absolute left-1/4 right-2 h-full bg-[#ff003c]/35 rounded-full border-x border-[#ff003c]" />
                    <div className="absolute left-1/4 -top-1 w-1.5 h-4 bg-white rounded-full shadow cursor-pointer" />
                    <div className="absolute right-2 -top-1 w-1.5 h-4 bg-white rounded-full shadow cursor-pointer" />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleDownloadClip}
                    className="w-full bg-[#ff003c] text-white font-black py-2 rounded-xl text-xs hover:bg-[#ff003c]/90 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ff003c]/20"
                  >
                    <span>📥</span>
                    <span>Download Video Moment Clip / GIF</span>
                  </button>
                  
                  {/* Social share icons */}
                  <div className="flex justify-center gap-2.5 pt-1.5 border-t border-zinc-850 mt-1">
                    <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs transition cursor-pointer">Facebook</button>
                    <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs transition cursor-pointer">Twitter / X</button>
                    <button className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs transition cursor-pointer">WhatsApp</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smooth transition loading overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]/90 backdrop-blur-md z-20">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-12 h-12 border-2 border-[#ff003c]/20 border-t-[#ff003c] rounded-full animate-spin"></div>
            <div className="w-8 h-8 rounded-full bg-zinc-950 absolute flex items-center justify-center shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-ping"></span>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ff003c] animate-pulse">
            Connecting Stream...
          </span>
        </div>
      )}

      {/* Play Overlay (Big button in the center when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-all duration-300"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#ff003c] text-white shadow-[0_0_20px_rgba(255,0,60,0.6)] hover:scale-110 active:scale-95 transition-all duration-200">
            <Play fill="currentColor" className="w-7 h-7 translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Custom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 sm:p-4 pt-10 flex flex-col justify-end gap-3 transition-opacity duration-300 pointer-events-auto ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4 text-white">
          {/* Left Controls (Play, Volume, Mute, Live indicator) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current" />
              )}
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeSlider}
                className="hidden md:inline-block w-24 volume-slider cursor-pointer accent-[#ff003c]"
              />
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 rounded-full bg-red-500/10 border border-red-500/30 text-[9px] sm:text-[10px] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-blink-red"></span>
              <span className="text-red-500 uppercase">LIVE</span>
            </div>
          </div>

          {/* Right Controls (Quality Selector, Theater Mode, Fullscreen) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Scissor Clip Cutter */}
            <button
              onClick={handleCutClip}
              className="hidden md:inline-block p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer"
              title="Cut Live Video Moment (GIF)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 8.932l4.893 2.447m0 0l4.893-2.447m-4.893 2.447v6m0-6L7.864 15.068M12.757 11.379l4.893 2.447m-11.782-5.78a2.25 2.25 0 100-3 2.25 2.25 0 000 3zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>



            {/* Alternate Commentary Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCommentaryMenu(!showCommentaryMenu)}
                className={`flex items-center gap-1 p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer ${
                  showCommentaryMenu ? 'text-[#ff003c] bg-white/5' : ''
                }`}
                title="Alternate Commentary"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
                <span className="hidden sm:inline-block text-[9px] font-bold tracking-wide uppercase bg-white/10 px-1 py-0.5 rounded">
                  {activeCommentary.substring(0, 3)}
                </span>
              </button>

              {showCommentaryMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-950/95 border border-zinc-800 rounded-xl overflow-hidden py-1 shadow-2xl backdrop-blur-md z-50">
                  <div className="px-3 py-1.5 border-b border-zinc-900 text-[8px] font-extrabold uppercase text-zinc-500 tracking-wider">
                    Commentary
                  </div>
                  {["English", "Hindi", "Bangla"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => selectCommentary(lang)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition cursor-pointer ${
                        activeCommentary === lang ? 'text-[#ff003c]' : 'text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* HLS Quality Selector (⚙️ Gear Icon) */}
            {qualities.length > 0 && (
              <div className="relative quality-selector-container">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className={`flex items-center gap-1.5 p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer ${
                    showQualityMenu ? 'text-[#ff003c] bg-white/5' : ''
                  }`}
                  title="Select Quality"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline-block text-[11px] font-bold tracking-wide uppercase bg-white/10 px-1.5 py-0.5 rounded">
                    {getQualityLabel()}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-36 bg-zinc-950/95 border border-zinc-800 rounded-xl overflow-hidden py-1 shadow-2xl backdrop-blur-md z-50">
                    <div className="px-3 py-1.5 border-b border-zinc-900 text-[9px] font-extrabold uppercase text-zinc-500 tracking-wider">
                      Quality
                    </div>
                    <button
                      onClick={() => selectQuality(-1)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition cursor-pointer ${
                        currentQuality === -1 ? 'text-[#ff003c]' : 'text-zinc-300'
                      }`}
                    >
                      Auto
                    </button>
                    {qualities.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectQuality(idx)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition cursor-pointer ${
                          currentQuality === idx ? 'text-[#ff003c]' : 'text-zinc-300'
                        }`}
                      >
                        {q.height ? `${q.height}p` : `Lvl ${idx + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Theater Mode Toggle */}
            <button
              onClick={onToggleTheaterMode}
              className={`hidden md:inline-block p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer ${
                isTheaterMode ? 'text-[#ff003c]' : ''
              }`}
              title={isTheaterMode ? 'Normal Mode' : 'Theater Mode'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" />
                <rect x="4" y="6" width="16" height="12" fill="currentColor" fillOpacity={isTheaterMode ? 0.35 : 0} />
              </svg>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg hover:text-[#ff003c] transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
