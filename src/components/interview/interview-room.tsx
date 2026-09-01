'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { UIMessage } from 'ai';
import { useRouter } from '@/i18n/routing';
import { useInterviewStore } from '@/stores/interview-store';
import { useInterviewChat } from '@/hooks/use-interview-chat';
import { useSettingsStore } from '@/stores/settings-store';
import { INIT_TRIGGER } from '@/lib/interview/constants';
import { dbInterviewMessagesToUIMessages } from '@/lib/interview/ui-message-adapter';
import { shouldAutoStartRound } from '@/lib/interview/round-state';
import { isRoundViewOnly } from '@/lib/interview/round-status';
import { ProgressBar } from './progress-bar';
import { InterviewerBanner } from './interviewer-banner';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useInterviewControls } from './control-bar';
import { RoundTransition } from './round-transition';
import { ThinkingIndicator } from './thinking-indicator';
import type { InterviewerConfig } from '@/types/interview';

interface InterviewRoomProps {
  sessionId: string;
  initialMessages?: UIMessage[];
}

export function InterviewRoom({ sessionId, initialMessages }: InterviewRoomProps) {
  const t = useTranslations('interview.room');
  const router = useRouter();
  const { rounds, currentRoundIndex, setCurrentRoundIndex, advanceToNextRound, setIsGeneratingReport, status: sessionStatus } =
    useInterviewStore();
  const [showTransition, setShowTransition] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [loadingRoundId, setLoadingRoundId] = useState<string | null>(null);

  const currentRound = rounds[currentRoundIndex];
  const interviewerConfig = currentRound?.interviewerConfig as InterviewerConfig;
  const isRoundDone = isRoundViewOnly(currentRound?.status, sessionStatus);

  const { messages, input, handleInputChange, handleSubmit, isLoading, resetMessages, sendMessage, setMessages } =
    useInterviewChat({
      sessionId,
      roundId: currentRound?.id || '',
      selectedModel: useSettingsStore.getState().aiModel,
    });

  // Load initial messages from DB on first render
  const loadedInitialRoundRef = useRef<string | null>(null);
  const sentInitRef = useRef<string | null>(null);
  useEffect(() => {
      if (
        initialMessages &&
        initialMessages.length > 0 &&
        currentRound?.id &&
        loadedInitialRoundRef.current !== currentRound.id
      ) {
        loadedInitialRoundRef.current = currentRound.id;
        sentInitRef.current = currentRound.id;
        setMessages(initialMessages);
      }
    }, [currentRound?.id, initialMessages, setMessages]);

    // Auto-send trigger to start interview (only if no history and round is active)
    useEffect(() => {
    if (shouldAutoStartRound({
      roundId: currentRound?.id,
      messageCount: messages.length,
      isLoading,
      isViewingHistory,
      isRoundDone,
      loadingRoundId,
      lastInitRoundId: sentInitRef.current,
    })) {
      sentInitRef.current = currentRound.id;
      sendMessage({ text: INIT_TRIGGER });
    }
  }, [currentRound?.id, isLoading, isRoundDone, isViewingHistory, loadingRoundId, messages.length, sendMessage]);

  // Auto-set viewing history when the whole session is done. Deliberately NOT
  // keyed on isRoundDone: a single round completing (AI's [ROUND_COMPLETE]) must
  // still show the transition screen — only a completed session goes read-only.
  useEffect(() => {
    if (currentRound && sessionStatus === 'completed') {
      setIsViewingHistory(true);
      setShowTransition(false);
      loadedInitialRoundRef.current = currentRound.id;
    }
  }, [currentRound?.id, sessionStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  // Detect round completion
  useEffect(() => {
    if (!messages.length || isLoading || isViewingHistory) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;
    const text = lastMsg.parts?.find((p: any) => p.type === 'text');
    if ((text as any)?.text?.includes('[ROUND_COMPLETE]')) {
      setShowTransition(true);
    }
  }, [messages, isLoading, isViewingHistory]);

  // Switch round: load messages from API
  const switchRoundRequestRef = useRef(0);
  const handleSwitchRound = useCallback(async (index: number) => {
    const targetRound = rounds[index];
    if (!targetRound) return;

    setShowTransition(false);
    setLoadingRoundId(targetRound.id);
    setCurrentRoundIndex(index);
    const requestId = ++switchRoundRequestRef.current;

    // Fetch messages for this round
    const fp = localStorage.getItem('jade_fingerprint');
    try {
      const res = await fetch(`/api/interview/${sessionId}`, {
        headers: fp ? { 'x-fingerprint': fp } : {},
      });
      // Ignore stale responses when rounds were switched again mid-flight.
      if (requestId !== switchRoundRequestRef.current) return;
      const { rounds: roundsWithMessages } = await res.json();
      const roundData = roundsWithMessages.find((r: any) => r.id === targetRound.id);

      if (roundData?.messages?.length > 0) {
        setMessages(dbInterviewMessagesToUIMessages(roundData.messages));
        sentInitRef.current = targetRound.id;
      } else {
        setMessages([]);
        sentInitRef.current = targetRound.status === 'completed' || targetRound.status === 'skipped'
          ? targetRound.id
          : null;
      }
    } catch (err) {
      console.error('Failed to load round messages:', err);
      if (requestId !== switchRoundRequestRef.current) return;
      setMessages([]);
      sentInitRef.current = targetRound.status === 'completed' || targetRound.status === 'skipped'
        ? targetRound.id
        : null;
    } finally {
      if (requestId === switchRoundRequestRef.current) {
        setLoadingRoundId(null);
      }
    }

    const isDone = isRoundViewOnly(targetRound.status, sessionStatus);
    setIsViewingHistory(isDone);
    if (isDone) setShowTransition(false);

    // Mark this round as loaded so the initial-messages effect doesn't clobber the
    // switched round's messages. Deliberately do NOT touch sentInitRef here — the
    // try/catch above sets it to null for empty unfinished rounds, which is what
    // lets shouldAutoStartRound fire INIT_TRIGGER when the user switches into a
    // not-yet-started round.
    loadedInitialRoundRef.current = targetRound.id;
  }, [rounds, sessionId, sessionStatus, setCurrentRoundIndex, setMessages]);

  const handleNextRound = useCallback(() => {
    setShowTransition(false);
    setIsViewingHistory(false);
    advanceToNextRound();
    resetMessages();
    sentInitRef.current = null;
  }, [advanceToNextRound, resetMessages]);

  const handleGenerateReport = useCallback(async () => {
    setIsGeneratingReport(true);
    router.push(`/interview/${sessionId}/report`);
  }, [sessionId, router, setIsGeneratingReport]);

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');

  const handleTriggerAI = useCallback((text: string) => {
    sendMessage({ text });
  }, [sendMessage]);

  const handleEndRound = useCallback(() => {
    setShowTransition(true);
  }, []);

  const controls = useInterviewControls({
    sessionId,
    roundId: currentRound?.id ?? '',
    lastAssistantMessageId: lastAssistantMsg?.id,
    isLoading,
    onTriggerAI: handleTriggerAI,
    onEndRound: handleEndRound,
  });

  if (!currentRound) return null;

  const isLastRound = currentRoundIndex >= rounds.length - 1;

  if (showTransition && !isViewingHistory) {
    const nextRound = rounds[currentRoundIndex + 1];
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <ProgressBar onSwitchRound={handleSwitchRound} />
        <RoundTransition
          nextInterviewer={(nextRound?.interviewerConfig as InterviewerConfig) || interviewerConfig}
          onContinue={isLastRound ? handleGenerateReport : handleNextRound}
          isLastRound={isLastRound}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-3 h-[calc(100dvh-120px)] md:h-[calc(100vh-180px)]">
      <ProgressBar onSwitchRound={handleSwitchRound} />
      <InterviewerBanner config={interviewerConfig} questionCount={messages.filter((m) => m.role === 'assistant').length} />
      <MessageList messages={messages} interviewerConfig={interviewerConfig} />
      {isLoading && (
        <div className="px-4">
          <ThinkingIndicator config={interviewerConfig} />
        </div>
      )}
      {isViewingHistory ? (
        <div className="border-t border-zinc-100 px-4 py-3 text-center text-sm text-zinc-400 dark:border-zinc-800">
          {t('roundComplete')}
        </div>
      ) : (
        <div className="space-y-2 border-t border-zinc-100 pt-2 pb-2 dark:border-zinc-800">
          {controls}
          <MessageInput
            input={input}
            isLoading={isLoading}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
