import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  loadVideo as apiLoadVideo,
  sendMessage as apiSendMessage,
  getTranscript as apiGetTranscript,
  getSession as apiGetSession,
  getSummary as apiGetSummary,
  getQuiz as apiGetQuiz,
  getKeyPoints as apiGetKeyPoints,
  getErrorMessage,
} from '../services/api';

const AppContext = createContext(null);

const SESSION_KEY = 'yta-session';

const buildVideoMeta = (url) => {
  const match = url?.match(/(?:v=|\/v\/|youtu\.be\/|embed\/|^)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;
  return {
    id: videoId,
    url,
    thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '',
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : '',
    title: 'Untitled video',
    channel: 'YouTube',
  };
};

export function extractVideoId(url) {
  const match = url?.match(/(?:v=|\/v\/|youtu\.be\/|embed\/|^)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentVideo, setCurrentVideo] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [keyPoints, setKeyPoints] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);

  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [isKeyPointsLoading, setIsKeyPointsLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [quizError, setQuizError] = useState(null);
  const [keyPointsError, setKeyPointsError] = useState(null);

  const sessionIdRef = useRef(null);
  const [sessionId, setSessionIdState] = useState(null);
  const restoredRef = useRef(false);
  const [isHydrating, setIsHydrating] = useState(true);

  const setSessionId = useCallback((id) => {
    sessionIdRef.current = id;
    setSessionIdState(id);
  }, []);

  const resetAnalysisData = useCallback(() => {
    setChatMessages([]);
    setSummary(null);
    setKeyPoints([]);
    setQuiz([]);
    setTranscriptSegments([]);
    setSummaryError(null);
    setQuizError(null);
    setKeyPointsError(null);
    setActiveTab('chat');
  }, []);

  /** Fetch transcript segments in the background. */
  const hydrateTranscript = useCallback(async (sid) => {
    try {
      const data = await apiGetTranscript(sid);
      setTranscriptSegments(data.segments || []);
    } catch (e) {
      console.error('Failed to fetch transcript:', e);
    }
  }, []);

  // Restore previous session on first mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      setIsHydrating(false);
      return;
    }

    const { sessionId: savedSessionId, url } = JSON.parse(stored) || {};
    if (!savedSessionId || !url) {
      setIsHydrating(false);
      return;
    }

    (async () => {
      try {
        const data = await apiGetSession(savedSessionId);
        const meta = buildVideoMeta(url);
        setCurrentVideo({
          ...meta,
          title: `Video ${data.video_id}`,
          transcriptLoaded: true,
        });
        setChatMessages(
          (data.chat_history || []).map((m, i) => ({
            id: `${Date.now()}-${i}`,
            role: m.role,
            content: m.content,
          }))
        );
        setSessionId(savedSessionId);
        hydrateTranscript(savedSessionId);
      } catch {
        // Backend restarted and lost the session - clear stale data
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsHydrating(false);
      }
    })();
  }, [setSessionId, hydrateTranscript]);

  /** Lazily generate summary when the user opens that tab. */
  const ensureSummary = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid || summary || isSummaryLoading) return;
    setIsSummaryLoading(true);
    setSummaryError(null);
    try {
      setSummary(await apiGetSummary(sid));
    } catch (e) {
      setSummaryError(getErrorMessage(e, 'Failed to generate summary'));
    } finally {
      setIsSummaryLoading(false);
    }
  }, [summary, isSummaryLoading]);

  /** Lazily generate key points when the user opens that tab. */
  const ensureKeyPoints = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid || keyPoints.length > 0 || isKeyPointsLoading) return;
    setIsKeyPointsLoading(true);
    setKeyPointsError(null);
    try {
      const data = await apiGetKeyPoints(sid);
      setKeyPoints(data.keyPoints || []);
    } catch (e) {
      setKeyPointsError(getErrorMessage(e, 'Failed to generate key points'));
    } finally {
      setIsKeyPointsLoading(false);
    }
  }, [keyPoints.length, isKeyPointsLoading]);

  /** Lazily generate quiz when the user opens that tab. */
  const ensureQuiz = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid || quiz.length > 0 || isQuizLoading) return;
    setIsQuizLoading(true);
    setQuizError(null);
    try {
      const data = await apiGetQuiz(sid);
      setQuiz(data.quiz || []);
    } catch (e) {
      setQuizError(getErrorMessage(e, 'Failed to generate quiz'));
    } finally {
      setIsQuizLoading(false);
    }
  }, [quiz.length, isQuizLoading]);

  const loadVideo = useCallback(async (url) => {
    setIsProcessingVideo(true);
    resetAnalysisData();
    setCurrentVideo({ ...buildVideoMeta(url), title: 'Loading…', transcriptLoaded: false });

    try {
      const data = await apiLoadVideo(url);
      setSessionId(data.session_id);
      localStorage.setItem(SESSION_KEY, JSON.stringify({ sessionId: data.session_id, url }));

      setCurrentVideo({
        ...buildVideoMeta(url),
        title: `Video ${data.video_id}`,
        transcriptLoaded: true,
      });

      // Transcript loads fast; kick it off right away
      hydrateTranscript(data.session_id);

      return data;
    } catch (error) {
      setCurrentVideo(null);
      throw new Error(getErrorMessage(error, 'Failed to load video'));
    } finally {
      setIsProcessingVideo(false);
    }
  }, [resetAnalysisData, hydrateTranscript, setSessionId]);

  const startNewSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setCurrentVideo(null);
    resetAnalysisData();
  }, [resetAnalysisData, setSessionId]);

  const addChatMessage = useCallback((message) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (message) => {
    const sid = sessionIdRef.current;
    if (!sid) throw new Error('No active session. Load a video first.');

    addChatMessage({
      id: `u-${Date.now()}`,
      role: 'user',
      content: message,
    });

    setIsSendingMessage(true);
    try {
      const data = await apiSendMessage(sid, message);
      addChatMessage({
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.response,
      });
    } catch (error) {
      addChatMessage({
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I ran into a problem: ${getErrorMessage(error)}. Please try again.`,
        isError: true,
      });
    } finally {
      setIsSendingMessage(false);
    }
  }, [addChatMessage]);

  const value = {
    activeTab,
    setActiveTab,
    currentVideo,
    chatMessages,
    addChatMessage,
    summary,
    keyPoints,
    quiz,
    transcriptSegments,
    transcriptModalOpen,
    setTranscriptModalOpen,
    isProcessingVideo,
    isSendingMessage,
    isSummaryLoading,
    isQuizLoading,
    isKeyPointsLoading,
    summaryError,
    quizError,
    keyPointsError,
    sessionId,
    isHydrating,
    loadVideo,
    startNewSession,
    sendMessage,
    ensureSummary,
    ensureKeyPoints,
    ensureQuiz,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
