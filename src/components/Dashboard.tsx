import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth-context';
import { CHANNELS_DATA } from '../channelsData';
import { Channel } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { 
  Search, Tv, LogOut, Bell, LogIn, Moon, Sun, 
  Share2, Copy, Check, Trophy, Globe, Film, Smile, Flame,
  Users, Shield, Radio, WifiOff, Settings
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { collection, query, onSnapshot, setDoc, deleteDoc, doc, getDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Hls from 'hls.js';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Category display names mapped to identifiers
const categories = ['all', 'sports', 'bangla', 'english', 'hindi', 'islamic', 'kids', 'world-cup'];

const categoryDisplayNames: Record<string, string> = {
  all: 'ALL',
  sports: 'SPORTS',
  bangla: 'BANGLA',
  english: 'ENGLISH',
  hindi: 'HINDI',
  islamic: 'ISLAMIC',
  kids: 'KIDS',
  'world-cup': 'World Cup 26'
};

const heroSlides = [
  {
    id: 1,
    title: "FIFA WORLD CUP 2026",
    subtitle: "LIVE Streaming & Multi-Angle Coverage",
    description: "Stream the ultimate football tournament live in Ultra HD, only on WorstTV. Watch every match live with real-time stats overlay, interactive live polls, and alternate Bangla/English commentary options.",
    badge: "⚽ FIFA WORLD CUP LIVE",
    image: "/fifa_world_cup_2026_poster.png",
    actionLabel: "Watch Now",
    categoryLink: "world-cup"
  }
];

const HoverPreviewPlayer = ({ url, logo }: { url: string; logo: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    let active = true;
    const delay = setTimeout(() => {
      if (!active || !videoRef.current) return;
      if (Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 5, enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (active) {
            videoRef.current?.play().catch(() => {});
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = url;
        videoRef.current.play().catch(() => {});
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(delay);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [url]);

  return (
    <div className="w-full h-full relative bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
      <video
        ref={videoRef}
        muted
        playsInline
        className="w-full h-full object-cover rounded-xl"
        poster={logo}
      />
    </div>
  );
};

const getMatchDate = (dateStr: string, timeStr: string): Date => {
  const day = parseInt(dateStr.split(' ')[1], 10);
  const [hourMin, meridiem] = timeStr.split(' ');
  let [hour, minute] = hourMin.split(':').map(Number);
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  
  // June is month index 5 (0-indexed)
  const matchTimeUTC = Date.UTC(2026, 5, day, hour, minute) - (6 * 60 * 60 * 1000);
  return new Date(matchTimeUTC);
};

const getMatchStatus = (dateStr: string, timeStr: string): 'LIVE' | 'FINISHED' | 'UPCOMING' => {
  const now = new Date();
  const matchStart = getMatchDate(dateStr, timeStr);
  const matchEnd = new Date(matchStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
  
  if (now >= matchStart && now <= matchEnd) {
    return 'LIVE';
  } else if (now > matchEnd) {
    return 'FINISHED';
  } else {
    return 'UPCOMING';
  }
};

export const Dashboard = () => {
  const { user, login, logout, loading } = useAuth();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [recentlyWatched, setRecentlyWatched] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Layout & UI states
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isAdBroken, setIsAdBroken] = useState(false);

  // --- NEW ADVANCED STATES ---
  // Smart Stream Preview on Hover
  const [hoveredChannelName, setHoveredChannelName] = useState<string | null>(null);

  // Watch Together Rooms
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [showRoomPanel, setShowRoomPanel] = useState<boolean>(false);

  // Offline Caching & Indicator
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Continue Watching Resume prompt
  const [resumePromptChannel, setResumePromptChannel] = useState<Channel | null>(null);

  // Care Tel custom states
  const [popupType, setPopupType] = useState<'mobile' | 'tv' | null>(null);
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  // Dynamic Active Users Presence State
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1);

  // Real-time Active Users Tracking (Firestore presence system)
  useEffect(() => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const docRef = doc(db, 'presence', sessionId);

    const updatePresence = async () => {
      try {
        await setDoc(docRef, { timestamp: Date.now() });
      } catch (e) {
        console.error("Presence update failed", e);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 20000); // update every 20s

    // Listen to total active users (active in the last 60 seconds)
    const q = collection(db, 'presence');
    const unsub = onSnapshot(q, (snap) => {
      const now = Date.now();
      const active = snap.docs.filter(d => {
        const data = d.data();
        return now - (data.timestamp || 0) < 60000;
      });
      setActiveUsersCount(Math.max(1, active.length));
    }, (err) => {
      console.warn("Firestore presence query blocked.", err);
      setActiveUsersCount(5); // fallback
    });

    const cleanup = async () => {
      clearInterval(interval);
      try {
        await deleteDoc(docRef);
      } catch (e) {}
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
      unsub();
    };
  }, []);

  // Auto-play sliding effect for Hero Carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Listen to offline state changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast("You are back online! 🟢", "success");
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast("Offline Mode active. Caching EPG schedule data. 🔴", "warning");
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toast notifications state and helpers
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'warning' }[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleLogin = async () => {
    try {
      await login();
      addToast('Welcome back to WorstTV! 🍿', 'success');
    } catch (e) {
      console.error(e);
      addToast('Sign In failed! 🔑', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully! See you soon! 👋', 'success');
    } catch (e) {
      console.error(e);
      addToast('Sign Out failed! ❌', 'error');
    }
  };

  const toggleFavorite = async (channel: Channel) => {
    if (!user) {
      addToast('Please Sign In to add channels to watchlist! 🔑', 'warning');
      return;
    }
    const safeId = channel.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const isFav = favorites.includes(safeId);
    const docRef = doc(db, 'users', user.uid, 'favorites', safeId);
    
    try {
      if (isFav) {
        await deleteDoc(docRef);
        addToast(`Removed ${channel.name} from watchlist! 💔`, 'success');
      } else {
        await setDoc(docRef, { channelId: safeId });
        addToast(`Added ${channel.name} to watchlist! 🍿`, 'success');
      }
    } catch (e) {
      console.error(e);
      addToast('Failed to update watchlist!', 'error');
    }
  };

  // Dynamic program scheduler generator
  const getNowPlaying = (channelName: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Program starts at the hour or half-hour
    const startMin = currentMinute >= 30 ? '30' : '00';
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const displayHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const startTimeStr = `${displayHour}:${startMin} ${period}`;
    
    const nameLower = channelName.toLowerCase();
    const seed = (channelName.length + currentHour) % 4;
    
    if (nameLower.includes('duronto')) {
      const shows = ['খাট্টাস মিট্টাস', 'সিসিমপুর', 'অ্যাডভেঞ্চার অব মায়ান', 'ইচ্ছে ডানা'];
      return { show: shows[seed], time: startTimeStr };
    }
    if (nameLower.includes('t sports') || nameLower.includes('cricket') || nameLower.includes('sports') || nameLower.includes('bein') || nameLower.includes('star sports') || nameLower.includes('sony sports')) {
      const shows = ['World Cup Live', 'Sports Studio Show', 'Classic Matches Replay', 'Football Special'];
      return { show: shows[seed], time: startTimeStr };
    }
    if (nameLower.includes('somoy') || nameLower.includes('news') || nameLower.includes('al jazeera') || nameLower.includes('wion') || nameLower.includes('ekattor') || nameLower.includes('jamuna')) {
      const shows = ['সময় সংবাদ', 'সম্পাদকীয়', 'World News Tonight', 'Global Report Live'];
      return { show: shows[seed], time: startTimeStr };
    }
    if (nameLower.includes('makkah') || nameLower.includes('madina') || nameLower.includes('islamic') || nameLower.includes('peace') || nameLower.includes('deen') || nameLower.includes('madani')) {
      const shows = ['Haramain Live', 'Tafsirul Quran Lectures', 'Islamic Ethics Q&A', 'Beautiful Quran Recitations'];
      return { show: shows[seed], time: startTimeStr };
    }
    if (nameLower.includes('cartoon') || nameLower.includes('disney') || nameLower.includes('nick') || nameLower.includes('tom')) {
      const shows = ['Tom & Jerry Classic', 'Ben 10 Show', 'Oggy and the Cockroaches', 'Doraemon Special'];
      return { show: shows[seed], time: startTimeStr };
    }
    
    const shows = ['বাংলা নাটক', 'আজকের খবর সংবাদ', 'সিনেমার মেলা গান', 'লাইভ টক শো আলোচনা'];
    return { show: shows[seed], time: startTimeStr };
  };

  // Simulated viewer counts
  const getViewers = (channelName: string) => {
    let hash = 0;
    for (let i = 0; i < channelName.length; i++) {
      hash = channelName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const isPopular = 
      channelName.toLowerCase().includes('sports') || 
      channelName.toLowerCase().includes('somoy') || 
      channelName.toLowerCase().includes('btv') || 
      channelName.toLowerCase().includes('t sports');
    const base = isPopular ? 8500 : 1200;
    const offset = Math.abs(hash) % (isPopular ? 15000 : 2500);
    const total = base + offset;
    
    if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}k`;
    }
    return `${total}`;
  };

  // Sidebar Icons
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'all': return <Tv className="w-3.5 h-3.5" />;
      case 'sports': return <Trophy className="w-3.5 h-3.5" />;
      case 'bangla': return <Flame className="w-3.5 h-3.5" />;
      case 'english': return <Globe className="w-3.5 h-3.5" />;
      case 'hindi': return <Film className="w-3.5 h-3.5" />;
      case 'islamic': return <Moon className="w-3.5 h-3.5" />;
      case 'kids': return <Smile className="w-3.5 h-3.5" />;
      case 'world-cup': return <Trophy className="w-3.5 h-3.5 animate-spin-slow" />;
      default: return <Tv className="w-3.5 h-3.5" />;
    }
  };

  // Sidebar Gradient Badges
  const getCategoryGradient = (cat: string) => {
    switch (cat) {
      case 'all': return 'bg-gradient-to-tr from-zinc-700 to-zinc-500';
      case 'sports': return 'bg-gradient-to-tr from-orange-500 to-amber-400';
      case 'bangla': return 'bg-gradient-to-tr from-red-600 to-rose-500';
      case 'english': return 'bg-gradient-to-tr from-blue-600 to-indigo-500';
      case 'hindi': return 'bg-gradient-to-tr from-purple-600 to-pink-500';
      case 'islamic': return 'bg-gradient-to-tr from-emerald-600 to-teal-500';
      case 'kids': return 'bg-gradient-to-tr from-cyan-500 to-sky-400';
      case 'world-cup': return 'bg-gradient-to-tr from-yellow-500 via-orange-500 to-red-500 animate-pulse';
      default: return 'bg-gradient-to-tr from-zinc-700 to-zinc-500';
    }
  };

  // EPG Next Show Helper
  const getNextShow = (channelName: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    const nextHour = (currentHour + 1) % 24;
    const period = nextHour >= 12 ? 'PM' : 'AM';
    const displayHour = nextHour % 12 === 0 ? 12 : nextHour % 12;
    const nextTimeStr = `${displayHour}:00 ${period}`;
    
    const seed = (channelName.length + nextHour) % 4;
    const nameLower = channelName.toLowerCase();
    
    if (nameLower.includes('duronto')) {
      const shows = ['সিসিমপুর', 'অ্যাডভেঞ্চার অব মায়ান', 'ইচ্ছে ডানা', 'খাট্টাস মিট্টাস'];
      return { show: shows[seed], time: nextTimeStr };
    }
    if (nameLower.includes('t sports') || nameLower.includes('cricket') || nameLower.includes('sports') || nameLower.includes('bein') || nameLower.includes('star sports') || nameLower.includes('sony sports')) {
      const shows = ['Sports Studio Show', 'Classic Matches Replay', 'Football Special', 'World Cup Live'];
      return { show: shows[seed], time: nextTimeStr };
    }
    if (nameLower.includes('somoy') || nameLower.includes('news') || nameLower.includes('al jazeera') || nameLower.includes('wion') || nameLower.includes('ekattor') || nameLower.includes('jamuna')) {
      const shows = ['সম্পাদকীয়', 'World News Tonight', 'Global Report Live', 'সময় সংবাদ'];
      return { show: shows[seed], time: nextTimeStr };
    }
    if (nameLower.includes('makkah') || nameLower.includes('madina') || nameLower.includes('islamic') || nameLower.includes('peace') || nameLower.includes('deen') || nameLower.includes('madani')) {
      const shows = ['Tafsirul Quran Lectures', 'Islamic Ethics Q&A', 'Beautiful Quran Recitations', 'Haramain Live'];
      return { show: shows[seed], time: nextTimeStr };
    }
    if (nameLower.includes('cartoon') || nameLower.includes('disney') || nameLower.includes('nick') || nameLower.includes('tom')) {
      const shows = ['Ben 10 Show', 'Oggy and the Cockroaches', 'Doraemon Special', 'Tom & Jerry Classic'];
      return { show: shows[seed], time: nextTimeStr };
    }
    
    const shows = ['আজকের খবর সংবাদ', 'সিনেমার মেলা গান', 'লাইভ টক শো আলোচনা', 'বাংলা নাটক'];
    return { show: shows[seed], time: nextTimeStr };
  };


  // Dark Mode init
  useEffect(() => {
    document.documentElement.classList.add('dark');
    const savedRecent = localStorage.getItem('worsttv_recent_channels');
    if (savedRecent) {
      try {
        setRecentlyWatched(JSON.parse(savedRecent));
      } catch (e) {}
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initial active channel
  useEffect(() => {
    // Autoplay disabled on mount. Let user select a channel.
    setActiveChannel(null);
  }, []);

  // Shared Link query param capture
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const channelParam = params.get('channel');
    if (channelParam) {
      const matched = CHANNELS_DATA.find(
        c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === channelParam.toLowerCase()
      );
      if (matched) {
        setActiveChannel(matched);
      }
    }
  }, []);

  // Sync visitor count (Firestore + localStorage fallback)
  useEffect(() => {
    const visitorDocRef = doc(db, 'stats', 'visitors');
    
    const unsub = onSnapshot(visitorDocRef, (snap) => {
      if (snap.exists()) {
        setVisitorCount(snap.data().count || 15324);
      } else {
        setDoc(visitorDocRef, { count: 15324 }).catch(console.error);
        setVisitorCount(15324);
      }
    }, (err) => {
      console.warn("Firestore visitor tracking blocked. Using local storage counter.", err);
      let localCount = localStorage.getItem('worsttv_local_visitors');
      if (!localCount) {
        localCount = '15324';
      }
      setVisitorCount(parseInt(localCount, 10));
    });

    const incrementVisitor = async () => {
      try {
        await setDoc(visitorDocRef, { count: increment(1) }, { merge: true });
      } catch (e) {
        let localCount = localStorage.getItem('worsttv_local_visitors');
        const nextCount = localCount ? parseInt(localCount, 10) + 1 : 15325;
        localStorage.setItem('worsttv_local_visitors', nextCount.toString());
        setVisitorCount(nextCount);
      }
    };

    incrementVisitor();

    return () => unsub();
  }, []);

  // Sync favorites & notifications
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setNotifications([]);
      return;
    }

    const unsubFav = onSnapshot(collection(db, 'users', user.uid, 'favorites'), (snap) => {
      const favs = snap.docs.map((d) => d.data().channelId as string);
      setFavorites(favs);
    });

    const unsubNotif = onSnapshot(query(collection(db, 'users', user.uid, 'notifications')), (snap) => {
      const notifs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setNotifications(notifs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    return () => {
      unsubFav();
      unsubNotif();
    };
  }, [user]);

  // Handle outside clicks for Share Popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showShareMenu && !(e.target as HTMLElement).closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    const safeId = channel.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    setRecentlyWatched(prev => {
      const updated = [safeId, ...prev.filter(id => id !== safeId)].slice(0, 15);
      localStorage.setItem('worsttv_recent_channels', JSON.stringify(updated));
      return updated;
    });

    // Watch Together sync channel to Room
    if (activeRoomId) {
      setDoc(doc(db, 'rooms', activeRoomId), {
        channelName: channel.name,
        updatedAt: Date.now()
      }, { merge: true }).catch(console.error);
    }

    // Continue Watching sync watched state
    if (user) {
      setDoc(doc(db, 'users', user.uid, 'status', 'watching'), {
        channelName: channel.name,
        timestamp: Date.now()
      }, { merge: true }).catch(console.error);
    }
  };

  // --- NEW WATCH TOGETHER & CONTINUE WATCHING HANDLERS ---
  const handleCreateRoom = async () => {
    if (!activeChannel) return;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await setDoc(doc(db, 'rooms', roomId), {
        channelName: activeChannel.name,
        createdAt: Date.now(),
        creator: user?.uid || 'guest'
      });
      setActiveRoomId(roomId);
      setShowRoomPanel(true);
      addToast(`Watch Together Room Created: ${roomId}! 🍿`, 'success');
    } catch (e) {
      console.error(e);
      addToast("Failed to create virtual room!", "error");
    }
  };

  const handleJoinRoom = async (roomIdInput: string) => {
    const cleanId = roomIdInput.trim().toUpperCase();
    if (!cleanId) return;
    const roomRef = doc(db, 'rooms', cleanId);
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      setActiveRoomId(cleanId);
      setShowRoomPanel(true);
      const data = snap.data();
      const matched = CHANNELS_DATA.find(c => c.name === data.channelName);
      if (matched) {
        setActiveChannel(matched);
      }
      addToast(`Joined room: ${cleanId} Successfully! 👥`, 'success');
    } else {
      addToast("Room not found! Check the Room ID. ❌", "error");
    }
  };

  const sendRoomMessage = async () => {
    if (!chatInput.trim() || !activeRoomId) return;
    const msgData = {
      text: chatInput,
      sender: user?.displayName || user?.email?.split('@')[0] || "Guest User",
      avatar: user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`,
      createdAt: Date.now()
    };
    await setDoc(doc(collection(db, 'rooms', activeRoomId, 'messages')), msgData);
    setChatInput('');
  };

  // Listen to room messages
  useEffect(() => {
    if (!activeRoomId) return;
    const unsub = onSnapshot(query(collection(db, 'rooms', activeRoomId, 'messages')), (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setRoomMessages(msgs.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)));
    });
    return () => unsub();
  }, [activeRoomId]);

  // Sync Watch Together channel change for room members
  useEffect(() => {
    if (!activeRoomId) return;
    const unsub = onSnapshot(doc(db, 'rooms', activeRoomId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.channelName && data.channelName !== activeChannel?.name) {
          const matched = CHANNELS_DATA.find(c => c.name === data.channelName);
          if (matched) {
            setActiveChannel(matched);
            addToast(`Room host switched channel to ${matched.name} 📺`, 'success');
          }
        }
      }
    });
    return () => unsub();
  }, [activeRoomId]);

  // Check Continue Watching Continuity upon Login/Load
  useEffect(() => {
    if (!user) return;
    const checkResume = async () => {
      const docRef = doc(db, 'users', user.uid, 'status', 'watching');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Date.now() - data.timestamp < 12 * 60 * 60 * 1000) {
          const matched = CHANNELS_DATA.find(c => c.name === data.channelName);
          if (matched && matched.name !== activeChannel?.name) {
            setResumePromptChannel(matched);
          }
        }
      }
    };
    const timer = setTimeout(checkResume, 3500);
    return () => clearTimeout(timer);
  }, [user]);

  // Parse Room ID from search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      handleJoinRoom(roomParam);
    }
  }, []);

  const getFilteredChannelsForCategory = (cat: string) => {
    const list = CHANNELS_DATA.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      let matchesTab = true;
      if (cat !== 'all') {
        const tab = cat.toLowerCase();
        if (tab === 'favorites') {
          matchesTab = favorites.includes(c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
        } else if (tab === 'bangla') {
          matchesTab = c.group.toLowerCase() === 'bangladesh' || c.name.toLowerCase().includes('bangla') || c.name.toLowerCase().includes('nagorik') || c.name.toLowerCase().includes('somoy') || c.name.toLowerCase().includes('ekattor');
        } else if (tab === 'sports') {
          matchesTab = c.group.toLowerCase() === 'sports';
        } else if (tab === 'english') {
          matchesTab = c.group.toLowerCase() === 'news' || c.group.toLowerCase() === 'documentary' || c.group.toLowerCase() === 'entertainment';
        } else if (tab === 'hindi') {
          matchesTab = c.group.toLowerCase() === 'india' && !c.name.toLowerCase().includes('bangla');
        } else if (tab === 'islamic') {
          matchesTab = c.group.toLowerCase() === 'islamic';
        } else if (tab === 'kids') {
          matchesTab = c.group.toLowerCase() === 'kids';
        } else if (tab === 'world-cup') {
          const nameLower = c.name.toLowerCase();
          const urlLower = c.url.toLowerCase();
          matchesTab = 
            nameLower.includes('t sports') || 
            nameLower.includes('tsports') ||
            nameLower.includes('btv') || 
            nameLower.includes('b-tv') || 
            nameLower.includes('channel 1') || 
            urlLower.includes('btv') ||
            nameLower.includes('somoy') || 
            c.group.toLowerCase() === 'sports';
        } else {
          matchesTab = c.group.toLowerCase() === tab || c.group.toLowerCase().includes(tab);
        }
      }
      return matchesSearch && matchesTab;
    });
    
    if (cat === 'world-cup') {
      return [...list].sort((a, b) => {
        const aIsTSports = a.name.toLowerCase().includes('t sports') || a.name.toLowerCase().includes('tsports');
        const bIsTSports = b.name.toLowerCase().includes('t sports') || b.name.toLowerCase().includes('tsports');
        if (aIsTSports && !bIsTSports) return -1;
        if (!aIsTSports && bIsTSports) return 1;
        return 0;
      });
    }
    return list;
  };

  const handleCategoryClick = (cat: string) => {
    setActiveTab(cat);
    const matches = getFilteredChannelsForCategory(cat);
    if (matches.length > 0) {
      setActiveChannel(matches[0]);
    }
  };

  const filteredChannels = CHANNELS_DATA.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const safeId = c.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let matchesTab = true;
    if (activeTab === 'favorites') {
      matchesTab = favorites.includes(safeId);
    } else if (activeTab === 'Recent') {
      matchesTab = recentlyWatched.includes(safeId);
    } else if (activeTab !== 'all') {
      const tab = activeTab.toLowerCase();
      if (tab === 'bangla') {
        matchesTab = c.group.toLowerCase() === 'bangladesh' || c.name.toLowerCase().includes('bangla') || c.name.toLowerCase().includes('nagorik') || c.name.toLowerCase().includes('somoy') || c.name.toLowerCase().includes('ekattor');
      } else if (tab === 'sports') {
        matchesTab = c.group.toLowerCase() === 'sports';
      } else if (tab === 'english') {
        matchesTab = c.group.toLowerCase() === 'news' || c.group.toLowerCase() === 'documentary' || c.group.toLowerCase() === 'entertainment';
      } else if (tab === 'hindi') {
        matchesTab = c.group.toLowerCase() === 'india' && !c.name.toLowerCase().includes('bangla');
      } else if (tab === 'islamic') {
        matchesTab = c.group.toLowerCase() === 'islamic';
      } else if (tab === 'kids') {
        matchesTab = c.group.toLowerCase() === 'kids';
      } else if (tab === 'world-cup') {
        const nameLower = c.name.toLowerCase();
        const urlLower = c.url.toLowerCase();
        matchesTab = 
          nameLower.includes('t sports') || 
          nameLower.includes('tsports') ||
          nameLower.includes('btv') || 
          nameLower.includes('b-tv') || 
          nameLower.includes('channel 1') || 
          urlLower.includes('btv') ||
          nameLower.includes('somoy') || 
          c.group.toLowerCase() === 'sports';
      } else {
        matchesTab = c.group.toLowerCase() === tab || c.group.toLowerCase().includes(tab);
      }
    }
    return matchesSearch && matchesTab;
  });

  const sortedChannels = [...filteredChannels];
  if (activeTab === 'Recent') {
    sortedChannels.sort((a, b) => {
      const aId = a.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const bId = b.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      return recentlyWatched.indexOf(aId) - recentlyWatched.indexOf(bId);
    });
  } else if (activeTab === 'world-cup') {
    sortedChannels.sort((a, b) => {
      const aIsTSports = a.name.toLowerCase().includes('t sports') || a.name.toLowerCase().includes('tsports');
      const bIsTSports = b.name.toLowerCase().includes('t sports') || b.name.toLowerCase().includes('tsports');
      if (aIsTSports && !bIsTSports) return -1;
      if (!aIsTSports && bIsTSports) return 1;
      return 0;
    });
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotifsRead = async () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.read);
    for (const notif of unread) {
      await setDoc(doc(db, 'users', user.uid, 'notifications', notif.id), { read: true }, { merge: true });
    }
  };

  const formattedVisitorCount = String(visitorCount).padStart(6, '0');

  // Share setup
  const shareUrl = activeChannel 
    ? `${window.location.origin}/?channel=${activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    : window.location.origin;
  const shareText = encodeURIComponent(`Watch ${activeChannel?.name} Live on WorstTV! ${shareUrl}`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // --- NEW VIRTUAL ROOM SIDEBAR COMPONENT ---
  const RoomChatSidebar = () => {
    return (
      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-10rem)] animate-slide-in">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200/20 dark:border-zinc-850 flex justify-between items-center bg-zinc-950/20">
          <div>
            <span className="text-[8px] font-black text-[#ff003c] uppercase tracking-wider animate-pulse">WATCH TOGETHER ROOM</span>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              Room: {activeRoomId}
            </h3>
          </div>
          <button
            onClick={() => setShowRoomPanel(false)}
            className="text-xs opacity-50 hover:opacity-100 cursor-pointer text-zinc-400"
            title="Switch back to Channels list"
          >
            ✕
          </button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide bg-zinc-950/10">
          {roomMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-2 py-8 text-center px-4">
              <span className="text-2xl animate-bounce">🍿</span>
              <p className="text-[10px] font-bold">Welcome to the Room! Invite friends with the link to watch streams together.</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/?room=${activeRoomId}`);
                  addToast("Room invite link copied! 🔗", "success");
                }}
                className="text-[9px] text-[#ff003c] font-black underline cursor-pointer"
              >
                Copy Invite Link
              </button>
            </div>
          ) : (
            roomMessages.map(msg => (
              <div key={msg.id} className="flex gap-2.5 items-start text-left">
                <img src={msg.avatar} alt="" className="w-7 h-7 rounded-full bg-zinc-800 p-0.5 border border-zinc-800" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-amber-400">{msg.sender}</span>
                    <span className="text-[8px] text-zinc-500">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-[11px] text-zinc-200 mt-0.5 break-words bg-zinc-900/40 p-2 rounded-xl border border-zinc-850/50">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat input */}
        <div className="p-3.5 border-t border-zinc-200/20 dark:border-zinc-850 flex gap-2 items-center bg-zinc-950/20">
          <input
            type="text"
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendRoomMessage()}
            className="flex-1 bg-zinc-955 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-white outline-none focus:ring-1 focus:ring-[#ff003c]/50"
          />
          <button
            onClick={sendRoomMessage}
            className="bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-black px-3 py-2 rounded-xl text-xs hover:scale-102 active:scale-95 transition cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  const WORLD_CUP_SCHEDULE = [
    {
      id: 1,
      teamA: "Mexico",
      teamAFlag: "🇲🇽",
      teamB: "South Africa",
      teamBFlag: "🇿🇦",
      time: "01:00 AM",
      date: "June 12",
      stadium: "Estadio Azteca, Mexico City",
      group: "Group A",
      status: "UPCOMING"
    },
    {
      id: 2,
      teamA: "South Korea",
      teamAFlag: "🇰🇷",
      teamB: "Czechia",
      teamBFlag: "🇨🇿",
      time: "08:00 AM",
      date: "June 12",
      stadium: "Estadio Akron, Guadalajara",
      group: "Group A",
      status: "UPCOMING"
    },
    {
      id: 3,
      teamA: "Canada",
      teamAFlag: "🇨🇦",
      teamB: "Bosnia & Herzegovina",
      teamBFlag: "🇧🇦",
      time: "01:00 AM",
      date: "June 13",
      stadium: "BMO Field, Toronto",
      group: "Group B",
      status: "UPCOMING"
    },
    {
      id: 4,
      teamA: "USA",
      teamAFlag: "🇺🇸",
      teamB: "Paraguay",
      teamBFlag: "🇵🇾",
      time: "07:00 AM",
      date: "June 13",
      stadium: "SoFi Stadium, Los Angeles",
      group: "Group D",
      status: "LIVE"
    },
    {
      id: 5,
      teamA: "Brazil",
      teamAFlag: "🇧🇷",
      teamB: "Morocco",
      teamBFlag: "🇲🇦",
      time: "01:00 AM",
      date: "June 14",
      stadium: "MetLife Stadium, New York",
      group: "Group C",
      status: "UPCOMING"
    },
    {
      id: 6,
      teamA: "Australia",
      teamAFlag: "🇦🇺",
      teamB: "Turkey",
      teamBFlag: "🇹🇷",
      time: "04:00 AM",
      date: "June 14",
      stadium: "BC Place, Vancouver",
      group: "Group D",
      status: "UPCOMING"
    },
    {
      id: 7,
      teamA: "Germany",
      teamAFlag: "🇩🇪",
      teamB: "Curaçao",
      teamBFlag: "🇨🇼",
      time: "11:00 PM",
      date: "June 14",
      stadium: "NRG Stadium, Houston",
      group: "Group E",
      status: "UPCOMING"
    },
    {
      id: 8,
      teamA: "Netherlands",
      teamAFlag: "🇳🇱",
      teamB: "Japan",
      teamBFlag: "🇯🇵",
      time: "05:00 AM",
      date: "June 15",
      stadium: "AT&T Stadium, Dallas",
      group: "Group F",
      status: "UPCOMING"
    },
    {
      id: 9,
      teamA: "Spain",
      teamAFlag: "🇪🇸",
      teamB: "Cape Verde",
      teamBFlag: "🇨🇻",
      time: "10:00 PM",
      date: "June 15",
      stadium: "Mercedes-Benz Stadium, Atlanta",
      group: "Group H",
      status: "UPCOMING"
    },
    {
      id: 10,
      teamA: "Belgium",
      teamAFlag: "🇧🇪",
      teamB: "Egypt",
      teamBFlag: "🇪🇬",
      time: "01:00 AM",
      date: "June 16",
      stadium: "Lumen Field, Seattle",
      group: "Group G",
      status: "UPCOMING"
    },
    {
      id: 11,
      teamA: "Saudi Arabia",
      teamAFlag: "🇸🇦",
      teamB: "Uruguay",
      teamBFlag: "🇺🇾",
      time: "04:00 AM",
      date: "June 16",
      stadium: "Hard Rock Stadium, Miami",
      group: "Group H",
      status: "UPCOMING"
    },
    {
      id: 12,
      teamA: "France",
      teamAFlag: "🇫🇷",
      teamB: "Senegal",
      teamBFlag: "🇸🇳",
      time: "01:00 AM",
      date: "June 17",
      stadium: "MetLife Stadium, New York",
      group: "Group I",
      status: "UPCOMING"
    },
    {
      id: 13,
      teamA: "Argentina",
      teamAFlag: "🇦🇷",
      teamB: "Algeria",
      teamBFlag: "🇩🇿",
      time: "07:00 AM",
      date: "June 17",
      stadium: "Arrowhead Stadium, Kansas City",
      group: "Group J",
      status: "UPCOMING"
    },
    {
      id: 14,
      teamA: "Portugal",
      teamAFlag: "🇵🇹",
      teamB: "DR Congo",
      teamBFlag: "🇨🇩",
      time: "11:00 PM",
      date: "June 17",
      stadium: "NRG Stadium, Houston",
      group: "Group K",
      status: "UPCOMING"
    },
    {
      id: 15,
      teamA: "England",
      teamAFlag: "🏴\u200d󠁢󠁥󠁮󠁧󠁿",
      teamB: "Croatia",
      teamBFlag: "🇭🇷",
      time: "02:00 AM",
      date: "June 18",
      stadium: "AT&T Stadium, Dallas",
      group: "Group L",
      status: "UPCOMING"
    }
  ];

  const WorldCupScheduleSection = () => {
    return (
      <div className="glass-panel p-5 rounded-3xl w-full text-left border border-zinc-200/10 dark:border-zinc-900/60 animate-slide-in mt-4">
        <div className="flex justify-between items-center border-b border-zinc-200/20 dark:border-zinc-850 pb-3 mb-4">
          <div>
            <span className="text-[9px] font-black text-[#ff003c] uppercase tracking-wider">MATCH SCHEDULE</span>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              FIFA World Cup 2026 Schedule
            </h3>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            UTC+6 / BD Time
          </span>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
          {WORLD_CUP_SCHEDULE.map(match => (
            <div 
              key={match.id} 
              className="p-3.5 bg-zinc-900/40 border border-zinc-850/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 hover:border-zinc-800 transition-all duration-200"
            >
              {/* Teams display */}
              <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{match.teamAFlag}</span>
                  <span className="text-xs font-black text-white">{match.teamA}</span>
                </div>
                <span className="text-[10px] font-black text-[#ff003c]">VS</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{match.teamBFlag}</span>
                  <span className="text-xs font-black text-white">{match.teamB}</span>
                </div>
                {getMatchStatus(match.date, match.time) === 'LIVE' && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/35 text-[8.5px] font-black text-red-500 animate-pulse">
                    LIVE NOW
                  </span>
                )}
              </div>

              {/* Stadium & Time details */}
              <div className="flex flex-col text-left gap-0.5 sm:text-right">
                <span className="text-[10px] text-amber-400 font-mono font-bold">{match.date} • {match.time}</span>
                <span className="text-[9px] text-zinc-450 font-semibold">{match.stadium} • {match.group}</span>
              </div>

              {/* Watch Now Button */}
              <button
                onClick={() => {
                  const tSports = CHANNELS_DATA.find(c => c.name.toLowerCase().includes('t sports'));
                  if (tSports) {
                    handleChannelSelect(tSports);
                    addToast("T Sports Live selected! Enjoy the World Cup match! ⚽", "success");
                  }
                }}
                className="w-full sm:w-auto bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-black px-4.5 py-2 rounded-xl text-xs hover:scale-102 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#ff003c]/15 animate-pulse"
              >
                <span>Watch Now</span>
                <span>▶</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-zinc-950 text-zinc-50">
        <div className="w-12 h-12 border-4 border-[#ff003c] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-zinc-400 tracking-wider">Loading WorstTV...</p>
      </div>
    );
  }

  // Sidebar Category component shared across layouts
  const SidebarCategoryList = () => (
    <div className="flex flex-col gap-2.5">
      {categories.map((cat) => {
        const isActive = activeTab === cat;
        return (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={cn(
              "px-4 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider cursor-pointer text-left w-full transition-all duration-150 flex items-center gap-3 group",
              isActive 
                ? "bg-[#ff003c] text-white shadow-[0_4px_12px_rgba(255,0,60,0.3)] scale-102" 
                : darkMode
                  ? "bg-zinc-900/60 border border-zinc-850 text-zinc-300 hover:text-white hover:bg-zinc-800/80 hover:scale-102 transition-all duration-150"
                  : "bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 hover:scale-102 transition-all duration-150",
              cat === 'world-cup' && !isActive ? 'border-[#ff003c]/30 hover:border-[#ff003c] hover:shadow-[0_0_10px_rgba(255,0,60,0.15)]' : ''
            )}
          >
            <span className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
              isActive ? "bg-white/20" : getCategoryGradient(cat)
            )}>
              {getCategoryIcon(cat)}
            </span>
            <span>{categoryDisplayNames[cat] || cat}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 pb-12 flex flex-col justify-between",
      darkMode 
        ? "bg-[#070b13] text-zinc-100" 
        : "bg-slate-50 text-zinc-900"
    )}>
      <div>
        {/* Header (Top Navigation Bar) */}
        <header className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-300 backdrop-blur-md",
          darkMode 
            ? "bg-[#05070c]/85 border-zinc-900/60" 
            : "bg-white/80 border-slate-200"
        )}>
          <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="flex items-center justify-center flex-shrink-0">
                {/* WorstTV Premium Red/White Logo */}
                <svg className="w-8 h-8 text-[#ff003c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
              <div className="flex flex-col font-sans select-none text-left leading-none">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-black tracking-tight text-white">Worst</span>
                  <span className="text-lg font-black tracking-tight text-[#ff003c]">TV</span>
                </div>
                <span className="text-[7px] font-semibold text-zinc-400 tracking-wider mt-0.5">Stream Live Channels</span>
              </div>
            </div>

            {/* Right: Actions (Sign In, Dark Mode, Notification Bell, Visitor Counter) */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0 ml-auto">
              {/* Active Users Pill */}
              <div className="flex items-center gap-1.5 bg-[#2A0F1A] border border-[#ff003c]/20 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-[#FF4B72]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse"></span>
                <span>Active Users: {activeUsersCount}</span>
              </div>
              {/* Visitor Counter - Hidden on mobile, visible on sm and above */}
              <div className="hidden sm:flex flex-col text-left mr-1.5 sm:mr-3">
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Total Visitors</span>
                <span className="text-xs font-mono font-black text-[#ff003c] tracking-wider bg-zinc-900/80 px-2.5 py-0.5 rounded border border-zinc-800/80 shadow-inner">
                  {formattedVisitorCount}
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "p-2 rounded-xl border transition-all duration-200 hover:scale-105",
                  darkMode 
                    ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                    : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                )}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && unreadCount > 0) markNotifsRead();
                  }}
                  className={cn(
                    "p-2 rounded-xl border relative transition-all duration-200 hover:scale-105",
                    darkMode 
                      ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                      : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                  )}
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#ff003c] rounded-full border border-white dark:border-[#0F172A] animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className={cn(
                    "absolute right-0 mt-3 w-80 border rounded-2xl shadow-2xl overflow-hidden py-2 z-50 transition-all backdrop-blur-md",
                    darkMode 
                      ? "bg-[#0F172A]/95 border-zinc-850 text-zinc-100" 
                      : "bg-white/95 border-zinc-200 text-zinc-900"
                  )}>
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-850">
                      <h3 className="font-semibold text-xs">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-zinc-500">No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={cn("p-4 border-b border-zinc-100 dark:border-zinc-850 last:border-0", !n.read && "bg-zinc-50/50 dark:bg-zinc-900/30")}>
                            <p className="font-semibold text-xs">{n.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>


            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-[1600px] mx-auto px-4 py-6">
          
          {/* Mobile App & TV App buttons row */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setPopupType('mobile')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-white font-black text-xs sm:text-sm hover:bg-zinc-800/80 transition-all cursor-pointer shadow-md"
            >
              {/* Green Android Icon */}
              <svg className="w-4 h-4 text-[#22C55E] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3l1.816 3.146a.5.5 0 1 1-.866.5l-1.836-3.18a9.964 9.964 0 0 1-9.274 0l-1.836 3.18a.5.5 0 0 1-.866-.5L6.477 15.3A10.003 10.003 0 0 1 2 7h20a10.003 10.003 0 0 1-4.477 8.3zM7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
              </svg>
              <span>Mobile App</span>
            </button>
            <button
              onClick={() => setPopupType('tv')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-white font-black text-xs sm:text-sm hover:bg-zinc-800/80 transition-all cursor-pointer shadow-md"
            >
              {/* Blue TV Icon */}
              <svg className="w-4.5 h-4.5 text-[#38BDF8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                <polyline points="17 2 12 7 7 2"/>
              </svg>
              <span>TV App</span>
            </button>
          </div>

          {/* Hero Carousel Banner */}
          <div className="relative w-full h-[200px] sm:h-[260px] md:h-[300px] rounded-3xl overflow-hidden mb-6 border border-zinc-200/10 dark:border-zinc-900/60 shadow-2xl group/carousel hidden lg:block">
            {heroSlides.map((slide, index) => {
              const isSelected = currentHeroSlide === index;
              return (
                <div
                  key={slide.id}
                  className={cn(
                    "absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center",
                    isSelected ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0 pointer-events-none"
                  )}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
                  {/* Gradient Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r via-slate-900/80 to-transparent",
                    darkMode ? "from-[#0F172A] via-[#0F172A]/85 to-[#0F172A]/30" : "from-slate-950 via-slate-950/80 to-transparent"
                  )} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-20 max-w-2xl px-6 sm:px-12 flex flex-col items-start justify-center h-full text-left">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/30 mb-2 md:mb-3 animate-pulse">
                      {slide.badge}
                    </span>
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs font-black text-amber-400 tracking-wide mb-1.5 md:mb-2.5">
                      {slide.subtitle}
                    </p>
                    <p className="text-[10px] sm:text-xs text-zinc-300 font-medium leading-relaxed max-w-md mb-3 md:mb-5 line-clamp-2">
                      {slide.description}
                    </p>
                    
                    <button
                      onClick={() => {
                        setActiveTab('world-cup');
                        const tSports = CHANNELS_DATA.find(c => c.name.toLowerCase().includes('t sports'));
                        if (tSports) {
                          handleChannelSelect(tSports);
                          addToast("T Sports Live selected from World Cup Section! ⚽", "success");
                        } else {
                          handleCategoryClick('world-cup');
                        }
                      }}
                      className="flex items-center gap-1.5 bg-[#ff003c] text-white shadow-lg shadow-[#ff003c]/25 px-4 py-2 rounded-xl text-[10px] md:text-xs font-black hover:bg-[#ff003c]/90 hover:shadow-[#ff003c]/40 transition-all duration-300 hover:scale-102 active:scale-95 cursor-pointer"
                    >
                      {slide.actionLabel}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Controls */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentHeroSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-[#ff003c] hover:border-[#ff003c]/30 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-30 cursor-pointer"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-[#ff003c] hover:border-[#ff003c]/30 transition-all duration-200 opacity-0 group-hover/carousel:opacity-100 z-30 cursor-pointer"
                >
                  ›
                </button>
              </>
            )}

            {/* Dots */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-30">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      currentHeroSlide === idx ? "bg-[#ff003c] w-4" : "bg-white/40 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Categories (Horizontal scroll) */}
          <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide py-2 px-1 mb-4">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap flex items-center gap-2 transition-all group",
                    isActive 
                      ? "bg-[#ff003c] text-white scale-102 shadow-[0_2px_8px_rgba(255,0,60,0.2)]" 
                      : darkMode
                        ? "bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
                        : "bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-955"
                  )}
                >
                  <span className={cn(
                    "w-5.5 h-5.5 rounded-md flex items-center justify-center text-white shadow-sm flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                    isActive ? "bg-white/20" : getCategoryGradient(cat)
                  )}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{categoryDisplayNames[cat] || cat}</span>
                </button>
              );
            })}
          </div>

          {/* Offline Schedule Cached Banner */}
          {isOffline && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4.5 mb-6 text-left flex items-center gap-3 animate-pulse">
              <WifiOff className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-red-500">Offline Mode Active</h4>
                <p className="text-xs text-zinc-400 mt-0.5">WorstTV stream links require active internet connection. Displaying cached channel guides and details from offline memory.</p>
              </div>
            </div>
          )}

          {/* Media Grid layouts */}
          {isTheaterMode ? (
            /* ============================================================== */
            /* THEATER MODE LAYOUT (Player full width top, grid below)        */
            /* ============================================================== */
            <div className="w-full space-y-6">
              {activeChannel ? (
                <div className="space-y-4">
                  {/* Premium Video Player Container */}
                  <div className={cn(
                    "sticky top-16 z-40 rounded-3xl overflow-hidden bg-black border-t shadow-2xl group transition-all duration-300 w-full",
                    darkMode
                      ? "border-t-white/10 border-b-2 border-b-black/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                      : "border-t-white border-b-2 border-b-slate-300 shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
                  )}>
                    <VideoPlayer 
                      url={activeChannel.url} 
                      isTheaterMode={isTheaterMode}
                      onToggleTheaterMode={() => setIsTheaterMode(false)}
                    />
                  </div>

                  {/* Active Channel Details Bar with Share Popover */}
                  <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full text-left">
                    <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 sm:p-2.5 shadow-md">
                        <img 
                          src={activeChannel.logo} 
                          alt={activeChannel.name} 
                          className="w-full h-full object-contain" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/WorstTV.png';
                          }}
                        />
                      </div>
                      <div className="text-left flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30">
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-blink-red"></span>
                            LIVE | {getViewers(activeChannel.name)} Watching
                          </span>
                          <span className={cn(
                            "text-[8px] sm:text-[10px] font-bold uppercase tracking-wider",
                            darkMode ? "text-zinc-400" : "text-slate-600"
                          )}>
                            / {activeChannel.group}
                          </span>
                        </div>
                        <h2 className={cn(
                          "text-base sm:text-lg md:text-xl font-extrabold tracking-wide leading-tight",
                          darkMode ? "text-white" : "text-slate-900"
                        )}>{activeChannel.name}</h2>
                      </div>
                    </div>

                    {/* Watchlist & Share Button Group */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end sm:justify-start">
                      <button
                        onClick={() => toggleFavorite(activeChannel)}
                        className={cn(
                          "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                          darkMode 
                            ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850" 
                            : "bg-slate-100/60 hover:bg-slate-200 border-slate-200",
                          favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                            ? "text-red-500 border-red-500/30"
                            : darkMode ? "text-zinc-400 hover:text-white" : "text-slate-605 hover:text-slate-905"
                        )}
                        title="Add to Watchlist"
                      >
                        <svg
                          className={cn(
                            "w-4 h-4 transition-colors",
                            favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ? "fill-current text-red-500" : "fill-none text-current"
                          )}
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="hidden sm:inline">
                          {favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ? 'Watchlisted' : 'Watchlist'}
                        </span>
                      </button>

                      {/* Watch Together Room Button */}
                      <button
                        onClick={activeRoomId ? () => setShowRoomPanel(!showRoomPanel) : handleCreateRoom}
                        className={cn(
                          "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                          activeRoomId 
                            ? "bg-[#ff003c] text-white border-transparent"
                            : darkMode
                              ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                              : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                        )}
                        title={activeRoomId ? "Toggle Watch Together Room panel" : "Watch synchronized with friends"}
                      >
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="hidden sm:inline">
                          {activeRoomId ? `Room Active` : "Watch Together"}
                        </span>
                      </button>

                      {/* Share Button popover */}
                      <div className="relative share-menu-container">
                        <button
                          onClick={() => setShowShareMenu(!showShareMenu)}
                          className={cn(
                            "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                            darkMode 
                              ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                              : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                          )}
                        >
                          <Share2 className="w-4 h-4 text-[#ff003c]" />
                          <span className="hidden sm:inline">Share</span>
                        </button>

                      {showShareMenu && (
                        <div className={cn(
                          "absolute right-0 bottom-full mb-3 w-48 border rounded-2xl shadow-2xl overflow-hidden py-2 z-50 transition-all backdrop-blur-md",
                          darkMode 
                            ? "bg-[#0F172A]/95 border-zinc-855 text-zinc-100" 
                            : "bg-white/95 border-zinc-200 text-zinc-900"
                        )}>
                          <div className="px-4 py-1.5 border-b border-zinc-100 dark:border-zinc-850">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Share Live Link</span>
                          </div>
                          <button
                            onClick={copyToClipboard}
                            className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                          </button>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1H13a5 5 0 0 0-5 5v2z" />
                            </svg>
                            Facebook
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?text=${shareText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.319 5.324.001 11.867 0c3.169.001 6.148 1.233 8.39 3.476 2.242 2.242 3.472 5.221 3.47 8.39-.005 6.545-5.324 11.863-11.867 11.863-2.008-.002-3.98-.513-5.73-1.488L0 24zm6.59-4.859c1.652.98 3.271 1.498 4.721 1.499 5.25-.001 9.516-4.269 9.519-9.52.002-2.544-.988-4.936-2.79-6.738C16.32 2.58 13.931 1.588 11.87 1.588 6.62 1.589 2.354 5.857 2.35 11.109c0 1.542.417 3.048 1.207 4.383L2.52 19.12l3.645-.956c.15-.042.302-.083.482-.023z" />
                            </svg>
                            WhatsApp
                          </a>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>

                  {/* Megaphone Update Banner */}
                  {showUpdateBanner && (
                    <div className="flex items-center justify-between gap-3 p-3.5 bg-[#1E0B11] border border-[#ff003c]/20 rounded-2xl text-left w-full">
                      <div className="flex items-center gap-2.5 text-xs">
                        <svg className="w-4.5 h-4.5 text-[#ff003c] flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                        <span className="font-semibold text-zinc-350">
                          <strong className="text-[#ff003c] mr-1">UPDATE:</strong> যোগাযোগ করুন : 01303258509 #
                        </span>
                      </div>
                      <button
                        onClick={() => setShowUpdateBanner(false)}
                        className="w-5 h-5 rounded-full bg-[#2E121C] hover:bg-[#ff003c] text-[#FF4B72] hover:text-white transition flex items-center justify-center text-[10px] font-bold cursor-pointer flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Banner Ad below Player details */}
                  {!isAdBroken && (
                    <div className="w-full rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-900/60 bg-zinc-950/20 shadow-md">
                      <img 
                        src="/ads.png" 
                        alt="Advertisement" 
                        className="w-full h-auto object-contain hover:opacity-95 transition-opacity" 
                        onError={() => setIsAdBroken(true)}
                      />
                    </div>
                  )}
                  {activeTab === 'world-cup' && <WorldCupScheduleSection />}
                </div>
              ) : (
                <div className="aspect-video bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-850 flex flex-col items-center justify-center shadow-2xl gap-4 p-6 select-none relative overflow-hidden group">
                  {/* Glowing background aura */}
                  <div className="absolute inset-0 bg-radial-gradient from-[#ff003c]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                  
                  <div className="flex flex-col items-center gap-3 relative z-10 animate-fade-in">
                    {/* Sleek SVG Logo */}
                    <div className="w-20 h-20 rounded-2xl bg-[#ff003c]/10 border border-[#ff003c]/20 flex items-center justify-center shadow-lg shadow-[#ff003c]/5 group-hover:scale-105 group-hover:border-[#ff003c]/35 transition-all duration-500">
                      <svg className="w-10 h-10 text-[#ff003c] drop-shadow-[0_0_10px_rgba(255,0,60,0.5)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                        <polyline points="17 2 12 7 7 2" />
                      </svg>
                    </div>
                    
                    {/* Branding Text */}
                    <div className="text-center mt-2">
                      <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1">
                        <span>Worst</span>
                        <span className="text-[#ff003c] drop-shadow-[0_0_8px_rgba(255,0,60,0.3)]">TV</span>
                      </h2>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Stream Live Channels</p>
                    </div>
                  </div>
                  
                  {/* Hint */}
                  <p className="text-xs font-bold text-zinc-450 bg-zinc-900/50 border border-zinc-800/80 px-4 py-1.5 rounded-full mt-2 group-hover:text-white transition-colors duration-300">
                    Select a channel to start watching
                  </p>
                </div>
              )}

              {/* Grid content below player (Theater Mode) */}
              <div className="grid lg:grid-cols-12 gap-6 pt-4">
                {/* Categories sidebar */}
                <div className="lg:col-span-3 hidden lg:flex flex-col gap-2.5">
                  <SidebarCategoryList />
                </div>

                {/* Right grid */}
                <div className="lg:col-span-9 flex flex-col min-h-[500px]">
                  <div className="glass-panel rounded-3xl overflow-hidden flex flex-col flex-1">
                    
                    {/* Glowing Search Bar */}
                    <div className="p-4 border-b border-zinc-900/60">
                      <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ff003c] transition-colors" />
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-2.5 border rounded-full text-xs outline-none transition-all focus:ring-1 focus:ring-[#ff003c]/40 focus:border-[#ff003c] shadow-md",
                            darkMode 
                              ? "bg-[#0c101a] border-zinc-800 text-white placeholder:text-zinc-500" 
                              : "bg-slate-50 border-slate-200 text-slate-955 placeholder:text-slate-400"
                          )}
                        />
                      </div>
                    </div>

                    {/* Horizontal Category Tabs Bar */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2.5 px-4 bg-zinc-950/20 border-b border-zinc-900/60">
                      {['all', 'favorites', 'world-cup', 'sports', 'bangla', 'english', 'hindi', 'islamic', 'kids'].map((cat) => {
                        const isActive = activeTab === cat;
                        const displayLabels: Record<string, string> = {
                          all: 'All Channels',
                          favorites: 'Favorites',
                          'world-cup': 'World Cup',
                          sports: 'Sports',
                          bangla: 'Bangla',
                          english: 'English',
                          hindi: 'Hindi',
                          islamic: 'Islamic',
                          kids: 'Kids'
                        };
                        const displayLabel = displayLabels[cat] || cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
                              isActive
                                ? "bg-white text-black font-extrabold shadow-md scale-102"
                                : "bg-[#0c101a] border border-zinc-800 text-zinc-400 hover:text-white"
                            )}
                          >
                            {cat === 'favorites' && <span className="text-[#ff003c]">❤️</span>}
                            {cat === 'world-cup' && <span>🏆</span>}
                            <span>{displayLabel}</span>
                          </button>
                        );
                      })}
                    </div>
 
                    {/* Channels grid */}
                    <div className="flex-1 overflow-y-auto p-5 scrollbar-hide max-h-[600px]">
                      {sortedChannels.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3 py-10">
                          <Tv className="w-8 h-8 opacity-25 text-[#ff003c] animate-bounce" />
                          <p className="text-xs">No channels found</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 perspective-container">
                          {sortedChannels.map((channel) => {
                            const isActive = activeChannel?.name === channel.name;
                            const schedule = getNowPlaying(channel.name);
 
                            return (
                              <div key={channel.name} className="relative w-full">
                                {/* Favorite Button Overlay on Top Right */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(channel);
                                  }}
                                  className="absolute top-2.5 right-2.5 z-30 p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                                >
                                  <svg
                                    className={cn(
                                      "w-3.5 h-3.5",
                                      favorites.includes(channel.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                                        ? "fill-current text-[#ff003c]"
                                        : "stroke-current fill-none text-white/50"
                                    )}
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => handleChannelSelect(channel)}
                                  onMouseEnter={() => setHoveredChannelName(channel.name)}
                                  onMouseLeave={() => setHoveredChannelName(null)}
                                  className={cn(
                                    "relative flex flex-col items-center p-2.5 rounded-2xl w-full group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden",
                                    isActive 
                                      ? "bg-zinc-900/90 border-2 border-[#ff003c] shadow-lg shadow-[#ff003c]/10" 
                                      : "bg-[#0c101a] border border-zinc-800/80 hover:border-zinc-700"
                                  )}
                                >
                                  {isActive && (
                                    <div className="absolute top-0 left-0 right-0 bg-[#ff003c] text-white text-[7px] font-black tracking-widest py-0.5 text-center uppercase">
                                      • LIVE PLAYING
                                    </div>
                                  )}
                                  
                                  {/* Round Logo Box Container */}
                                  <div className={cn(
                                    "w-full aspect-video sm:h-14 bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-md transition-all duration-300 group-hover:scale-102 mt-2.5",
                                    isActive && "mt-4.5"
                                  )}>
                                    {hoveredChannelName === channel.name && !isOffline ? (
                                      <HoverPreviewPlayer url={channel.url} logo={channel.logo} />
                                    ) : (
                                      <img 
                                        src={channel.logo} 
                                        alt={channel.name} 
                                        className="max-w-full max-h-full object-contain" 
                                        loading="lazy" 
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/WorstTV.png';
                                        }}
                                      />
                                    )}
                                  </div>
                                  
                                  <p className={cn(
                                    "text-[10px] font-bold text-center mt-2 tracking-tight line-clamp-2 w-full px-0.5 leading-snug transition-colors duration-200", 
                                    isActive 
                                      ? "text-[#ff003c] font-bold" 
                                      : "text-zinc-300 group-hover:text-white"
                                  )}>
                                    {channel.name}
                                  </p>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* REGULAR MODE LAYOUT (3 columns: Sidebar, Player, Grid)         */
            /* ============================================================== */
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Category Sidebar (Left Column - takes 2/12 space) */}
              <div className="lg:col-span-2 hidden lg:flex flex-col gap-2.5">
                <SidebarCategoryList />
              </div>

              {/* Player Panel (Center Column - takes 8/12 space) */}
              <div className="lg:col-span-8 space-y-4 lg:sticky lg:top-20 self-start">
                {activeChannel ? (
                  <div className="space-y-4">
                    {/* Premium Video Player Container */}
                    <div className={cn(
                      "sticky top-16 z-40 rounded-3xl overflow-hidden bg-black border-t shadow-2xl group transition-all duration-300",
                      darkMode
                        ? "border-t-white/10 border-b-2 border-b-black/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
                        : "border-t-white border-b-2 border-b-slate-300 shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
                    )}>
                      <VideoPlayer 
                        url={activeChannel.url} 
                        isTheaterMode={isTheaterMode}
                        onToggleTheaterMode={() => setIsTheaterMode(true)}
                      />
                    </div>

                    {/* Active Channel Details Bar with Share Popover */}
                    <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full text-left">
                      <div className="flex items-center gap-3.5 sm:gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-zinc-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-2 sm:p-2.5 shadow-md">
                          <img 
                            src={activeChannel.logo} 
                            alt={activeChannel.name} 
                            className="w-full h-full object-contain" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/WorstTV.png';
                            }}
                          />
                        </div>
                        <div className="text-left flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-1 sm:mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30">
                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-blink-red"></span>
                              LIVE | {getViewers(activeChannel.name)} Watching
                            </span>
                            <span className={cn(
                              "text-[8px] sm:text-[10px] font-bold uppercase tracking-wider",
                              darkMode ? "text-zinc-400" : "text-slate-605"
                            )}>
                              / {activeChannel.group}
                            </span>
                          </div>
                          <h2 className={cn(
                            "text-base sm:text-lg md:text-xl font-extrabold tracking-wide leading-tight",
                            darkMode ? "text-white" : "text-slate-900"
                          )}>{activeChannel.name}</h2>
                        </div>
                      </div>

                      {/* Watchlist & Share Button Group */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end sm:justify-start">
                        <button
                          onClick={() => toggleFavorite(activeChannel)}
                          className={cn(
                            "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                            darkMode 
                              ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850" 
                              : "bg-slate-100/60 hover:bg-slate-200 border-slate-200",
                            favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                              ? "text-red-500 border-red-500/30"
                              : darkMode ? "text-zinc-400 hover:text-white" : "text-slate-605 hover:text-slate-905"
                          )}
                          title="Add to Watchlist"
                        >
                          <svg
                            className={cn(
                              "w-4 h-4 transition-colors",
                              favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ? "fill-current text-red-500" : "fill-none text-current"
                            )}
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                          <span className="hidden sm:inline">
                            {favorites.includes(activeChannel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')) ? 'Watchlisted' : 'Watchlist'}
                          </span>
                        </button>

                        {/* Watch Together Room Button */}
                        <button
                          onClick={activeRoomId ? () => setShowRoomPanel(!showRoomPanel) : handleCreateRoom}
                          className={cn(
                            "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                            activeRoomId 
                              ? "bg-[#ff003c] text-white border-transparent"
                              : darkMode
                                ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                                : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                          )}
                          title={activeRoomId ? "Toggle Watch Together Room panel" : "Watch synchronized with friends"}
                        >
                          <Users className="w-4 h-4 text-amber-400" />
                          <span className="hidden sm:inline">
                            {activeRoomId ? `Room Active` : "Watch Together"}
                          </span>
                        </button>

                        {/* Share Button popover */}
                        <div className="relative share-menu-container">
                          <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className={cn(
                              "p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105",
                              darkMode 
                                ? "bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-850 text-zinc-300 hover:text-white" 
                                : "bg-slate-100/60 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-955"
                            )}
                          >
                            <Share2 className="w-4 h-4 text-[#ff003c]" />
                            <span className="hidden sm:inline">Share</span>
                          </button>

                        {showShareMenu && (
                          <div className={cn(
                            "absolute right-0 bottom-full mb-3 w-48 border rounded-2xl shadow-2xl overflow-hidden py-2 z-50 transition-all backdrop-blur-md",
                            darkMode 
                              ? "bg-[#0F172A]/95 border-zinc-850 text-zinc-100" 
                              : "bg-white/95 border-zinc-200 text-zinc-900"
                          )}>
                            <div className="px-4 py-1.5 border-b border-zinc-100 dark:border-zinc-850">
                              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Share Live Link</span>
                            </div>
                            <button
                              onClick={copyToClipboard}
                              className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                            >
                              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                              {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h2V1H13a5 5 0 0 0-5 5v2z" />
                              </svg>
                              Facebook
                            </a>
                            <a
                              href={`https://api.whatsapp.com/send?text=${shareText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#ff003c] hover:text-white transition flex items-center gap-2"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.319 5.324.001 11.867 0c3.169.001 6.148 1.233 8.39 3.476 2.242 2.242 3.472 5.221 3.47 8.39-.005 6.545-5.324 11.863-11.867 11.863-2.008-.002-3.98-.513-5.73-1.488L0 24zm6.59-4.859c1.652.98 3.271 1.498 4.721 1.499 5.25-.001 9.516-4.269 9.519-9.52.002-2.544-.988-4.936-2.79-6.738C16.32 2.58 13.931 1.588 11.87 1.588 6.62 1.589 2.354 5.857 2.35 11.109c0 1.542.417 3.048 1.207 4.383L2.52 19.12l3.645-.956c.15-.042.302-.083.482-.023z" />
                              </svg>
                                WhatsApp
                            </a>
                          </div>
                        )}
                        </div>
                      </div>
                    </div>

                    {/* Megaphone Update Banner */}
                    {showUpdateBanner && (
                      <div className="flex items-center justify-between gap-3 p-3.5 bg-[#1E0B11] border border-[#ff003c]/20 rounded-2xl text-left w-full mt-4">
                        <div className="flex items-center gap-2.5 text-xs">
                          <svg className="w-4.5 h-4.5 text-[#ff003c] flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                          <span className="font-semibold text-zinc-350">
                            <strong className="text-[#ff003c] mr-1">UPDATE:</strong> যোগাযোগ করুন : 01303258509 #
                          </span>
                        </div>
                        <button
                          onClick={() => setShowUpdateBanner(false)}
                          className="w-5 h-5 rounded-full bg-[#2E121C] hover:bg-[#ff003c] text-[#FF4B72] hover:text-white transition flex items-center justify-center text-[10px] font-bold cursor-pointer flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Banner Ad below Player details */}
                    {!isAdBroken && (
                      <div className="w-full rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-900/60 bg-zinc-950/20 shadow-md">
                        <img 
                          src="/ads.png" 
                          alt="Advertisement" 
                          className="w-full h-auto object-contain hover:opacity-95 transition-opacity" 
                          onError={() => setIsAdBroken(true)}
                        />
                      </div>
                    )}
                    {activeTab === 'world-cup' && <WorldCupScheduleSection />}
                  </div>
                ) : (
                  <div className="aspect-video bg-zinc-950/80 backdrop-blur-md rounded-3xl border border-zinc-850 flex flex-col items-center justify-center shadow-2xl gap-4 p-6 select-none relative overflow-hidden group">
                    {/* Glowing background aura */}
                    <div className="absolute inset-0 bg-radial-gradient from-[#ff003c]/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                    
                    <div className="flex flex-col items-center gap-3 relative z-10 animate-fade-in">
                      {/* Sleek SVG Logo */}
                      <div className="w-20 h-20 rounded-2xl bg-[#ff003c]/10 border border-[#ff003c]/20 flex items-center justify-center shadow-lg shadow-[#ff003c]/5 group-hover:scale-105 group-hover:border-[#ff003c]/35 transition-all duration-500">
                        <svg className="w-10 h-10 text-[#ff003c] drop-shadow-[0_0_10px_rgba(255,0,60,0.5)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                          <polyline points="17 2 12 7 7 2" />
                        </svg>
                      </div>
                      
                      {/* Branding Text */}
                      <div className="text-center mt-2">
                        <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1">
                          <span>Worst</span>
                          <span className="text-[#ff003c] drop-shadow-[0_0_8px_rgba(255,0,60,0.3)]">TV</span>
                        </h2>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Stream Live Channels</p>
                      </div>
                    </div>
                    
                    {/* Hint */}
                    <p className="text-xs font-bold text-zinc-455 bg-zinc-900/50 border border-zinc-800/80 px-4 py-1.5 rounded-full mt-2 group-hover:text-white transition-colors duration-300">
                      Select a channel to start watching
                    </p>
                  </div>
                )}
              </div>

              {/* Channels list (Right Column - takes 2/12 space) */}
              <div className="lg:col-span-2 flex flex-col h-[600px] lg:h-[calc(100vh-10rem)]">
                <div className="glass-panel rounded-3xl overflow-hidden flex flex-col flex-1">
                
                {/* Glowing Search Bar */}
                <div className="p-4 border-b border-zinc-900/60">
                  <div className="relative group">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#ff003c] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search channels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 border rounded-full text-xs outline-none transition-all focus:ring-1 focus:ring-[#ff003c]/40 focus:border-[#ff003c] shadow-md",
                        darkMode 
                          ? "bg-[#0c101a] border-zinc-800 text-white placeholder:text-zinc-500" 
                          : "bg-slate-50 border-slate-200 text-slate-955 placeholder:text-slate-400"
                      )}
                    />
                  </div>
                </div>

                {/* Horizontal Category Tabs Bar */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2.5 px-4 bg-zinc-950/20 border-b border-zinc-900/60">
                  {['all', 'favorites', 'world-cup', 'sports', 'bangla', 'english', 'hindi', 'islamic', 'kids'].map((cat) => {
                    const isActive = activeTab === cat;
                    const displayLabels: Record<string, string> = {
                      all: 'All Channels',
                      favorites: 'Favorites',
                      'world-cup': 'World Cup',
                      sports: 'Sports',
                      bangla: 'Bangla',
                      english: 'English',
                      hindi: 'Hindi',
                      islamic: 'Islamic',
                      kids: 'Kids'
                    };
                    const displayLabel = displayLabels[cat] || cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5",
                          isActive
                            ? "bg-white text-black font-extrabold shadow-md scale-102"
                            : "bg-[#0c101a] border border-zinc-800 text-zinc-400 hover:text-white"
                        )}
                      >
                        {cat === 'favorites' && <span className="text-[#ff003c]">❤️</span>}
                        {cat === 'world-cup' && <span>🏆</span>}
                        <span>{displayLabel}</span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Channel Cards 3-Column Grid */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                  {sortedChannels.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-3">
                      <Tv className="w-8 h-8 opacity-25 text-[#ff003c] animate-bounce" />
                      <p className="text-xs">No channels found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 lg:grid-cols-2 gap-3 perspective-container">
                      {sortedChannels.map((channel) => {
                        const isActive = activeChannel?.name === channel.name;
                        const schedule = getNowPlaying(channel.name);

                        return (
                          <div key={channel.name} className="relative w-full">
                            {/* Favorite Button Overlay on Top Right */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(channel);
                              }}
                              className="absolute top-2.5 right-2.5 z-30 p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                            >
                              <svg
                                className={cn(
                                  "w-3.5 h-3.5",
                                  favorites.includes(channel.name.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                                    ? "fill-current text-[#ff003c]"
                                    : "stroke-current fill-none text-white/50"
                                )}
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleChannelSelect(channel)}
                              onMouseEnter={() => setHoveredChannelName(channel.name)}
                              onMouseLeave={() => setHoveredChannelName(null)}
                              className={cn(
                                "relative flex flex-col items-center p-2.5 rounded-2xl w-full group cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden",
                                isActive 
                                  ? "bg-zinc-900/90 border-2 border-[#ff003c] shadow-lg shadow-[#ff003c]/10" 
                                  : "bg-[#0c101a] border border-zinc-800/80 hover:border-zinc-700"
                              )}
                            >
                              {isActive && (
                                <div className="absolute top-0 left-0 right-0 bg-[#ff003c] text-white text-[7px] font-black tracking-widest py-0.5 text-center uppercase">
                                  • LIVE PLAYING
                                </div>
                              )}
                              
                              {/* Round Logo Box Container */}
                              <div className={cn(
                                "w-full aspect-video sm:h-14 bg-white rounded-xl flex items-center justify-center p-2 overflow-hidden shadow-md transition-all duration-300 group-hover:scale-102 mt-2.5",
                                isActive && "mt-4.5"
                              )}>
                                {hoveredChannelName === channel.name && !isOffline ? (
                                  <HoverPreviewPlayer url={channel.url} logo={channel.logo} />
                                ) : (
                                  <img 
                                    src={channel.logo} 
                                    alt={channel.name} 
                                    className="max-w-full max-h-full object-contain" 
                                    loading="lazy" 
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/WorstTV.png';
                                    }}
                                  />
                                )}
                              </div>
                              
                              <p className={cn(
                                "text-[10px] font-bold text-center mt-2 tracking-tight line-clamp-2 w-full px-0.5 leading-snug transition-colors duration-200", 
                                isActive 
                                  ? "text-[#ff003c] font-bold" 
                                  : "text-zinc-300 group-hover:text-white"
                              )}>
                                {channel.name}
                              </p>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          )}
      </main>
      </div>
      
      {/* Footer (Copyright & Mobile Announce) */}
      <footer className={cn(
        "max-w-[1600px] mx-auto w-full px-4 py-8 mt-12 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold",
        darkMode 
          ? "border-zinc-900/60 text-zinc-500" 
          : "border-slate-200 text-slate-500"
      )}>
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-1.5">
            <span>Handcrafted with</span>
            <span className="text-red-500 animate-pulse text-sm">❤️</span>
            <span>by Md Jahid Hasan Emon © 2026</span>
          </div>
          {/* Visitor counter for mobile */}
          <div className="flex items-center gap-1.5 sm:hidden mt-1 select-none">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Visitors:</span>
            <span className="text-[10px] font-mono font-black text-[#ff003c] tracking-wider bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/80 shadow-inner">
              {formattedVisitorCount}
            </span>
          </div>
        </div>
        <div>
          <span className="tracking-widest uppercase text-[9px] bg-[#ff003c]/10 text-[#ff003c] px-3.5 py-1.5 rounded-full border border-[#ff003c]/20 font-bold">
            Mobile apps -- COMING SOON
          </span>
        </div>
      </footer>

      {/* Premium Toast Container */}
      <div 
        className="fixed top-5 right-5 flex flex-col gap-3 pointer-events-none max-w-sm w-full" 
        style={{ zIndex: 9999 }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center justify-between gap-3 pointer-events-auto transform translate-y-0 transition-all duration-300 animate-slide-in",
              darkMode 
                ? "bg-[#1E293B]/95 border-zinc-800 text-zinc-100 shadow-[0_20px_40px_rgba(0,0,0,0.5)]" 
                : "bg-white/95 border-slate-200 text-slate-900 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
            )}
          >
            <div className="flex-1 text-xs font-bold font-sans tracking-wide">
              {toast.message}
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-[10px] font-black opacity-50 hover:opacity-100 px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Continue Watching Sync Continuity Prompt */}
      {resumePromptChannel && (
        <div className="fixed bottom-6 right-6 bg-[#0F172A]/95 border border-[#ff003c]/30 p-4 rounded-2xl shadow-2xl z-50 text-left max-w-sm w-full animate-slide-in flex gap-3.5 items-center backdrop-blur-md">
          <img 
            src={resumePromptChannel.logo} 
            className="w-12 h-12 object-contain bg-white rounded-xl p-1.5 shadow" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/WorstTV.png';
            }}
          />
          <div className="flex-1">
            <span className="text-[8.5px] font-black text-amber-400 uppercase tracking-widest leading-none block mb-1">CONTINUE WATCHING?</span>
            <h4 className="font-bold text-xs text-white">Resume {resumePromptChannel.name}</h4>
            <p className="text-[10px] text-zinc-400 mt-0.5">You were watching this on another device.</p>
          </div>
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            <button
              onClick={() => {
                handleChannelSelect(resumePromptChannel);
                setResumePromptChannel(null);
              }}
              className="bg-[#ff003c] text-white font-black px-3.5 py-1.5 rounded-lg text-[10px] hover:scale-102 transition cursor-pointer shadow shadow-[#ff003c]/35"
            >
              Resume
            </button>
            <button
              onClick={() => setResumePromptChannel(null)}
              className="text-zinc-500 hover:text-zinc-300 font-bold text-[9px] cursor-pointer text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon Popups */}
      {popupType && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-sm w-full bg-[#0d1017] border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl">
            {/* Close button */}
            <button 
              onClick={() => setPopupType(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer text-sm font-bold w-6 h-6 rounded-full bg-zinc-900/80 flex items-center justify-center"
            >
              ✕
            </button>
            
            {popupType === 'mobile' ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#22C55E]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3l1.816 3.146a.5.5 0 1 1-.866.5l-1.836-3.18a9.964 9.964 0 0 1-9.274 0l-1.836 3.18a.5.5 0 0 1-.866-.5L6.477 15.3A10.003 10.003 0 0 1 2 7h20a10.003 10.003 0 0 1-4.477 8.3zM7 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white mb-2">Mobile App</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  mobile app comming soon
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#38BDF8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                    <polyline points="17 2 12 7 7 2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-black text-white mb-2">TV App</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  tv app comming soon
                </p>
              </div>
            )}
            
            <button
              onClick={() => setPopupType(null)}
              className="w-full py-2.5 rounded-xl bg-[#ff003c] hover:bg-[#ff003c]/90 text-white font-black text-xs transition cursor-pointer shadow-md shadow-[#ff003c]/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
