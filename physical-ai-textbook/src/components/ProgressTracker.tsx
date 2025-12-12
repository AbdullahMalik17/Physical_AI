/**
 * Progress Tracker Component
 *
 * Tracks user progress through chapters using localStorage
 * Features:
 * - Chapter completion tracking
 * - Reading time tracking
 * - Progress percentage calculation
 * - Visual progress indicators
 */

import React, { useState, useEffect } from 'react';

interface ChapterProgress {
  chapterId: string;
  title: string;
  completed: boolean;
  lastVisited?: string;
  timeSpent?: number; // in seconds
  scrollProgress?: number; // percentage
}

interface ProgressData {
  chapters: Record<string, ChapterProgress>;
  totalCompleted: number;
  lastUpdated: string;
}

export function useProgressTracker(chapterId: string, chapterTitle: string) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [currentChapter, setCurrentChapter] = useState<ChapterProgress | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load progress from localStorage
    const loadProgress = (): ProgressData => {
      const stored = localStorage.getItem('physical-ai-progress');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse progress data:', e);
        }
      }
      return {
        chapters: {},
        totalCompleted: 0,
        lastUpdated: new Date().toISOString(),
      };
    };

    const progressData = loadProgress();

    // Initialize current chapter if not exists
    if (!progressData.chapters[chapterId]) {
      progressData.chapters[chapterId] = {
        chapterId,
        title: chapterTitle,
        completed: false,
        lastVisited: new Date().toISOString(),
        timeSpent: 0,
        scrollProgress: 0,
      };
    } else {
      progressData.chapters[chapterId].lastVisited = new Date().toISOString();
    }

    setProgress(progressData);
    setCurrentChapter(progressData.chapters[chapterId]);

    // Save updated progress
    localStorage.setItem('physical-ai-progress', JSON.stringify(progressData));

    // Track time spent
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      updateTimeSpent(chapterId, timeSpent);
    }, 10000); // Update every 10 seconds

    // Track scroll progress
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      updateScrollProgress(chapterId, Math.min(scrollPercentage, 100));

      // Auto-mark as completed if scrolled to bottom
      if (scrollPercentage > 90) {
        markChapterCompleted(chapterId);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [chapterId, chapterTitle]);

  const updateTimeSpent = (id: string, additionalTime: number) => {
    const stored = localStorage.getItem('physical-ai-progress');
    if (!stored) return;

    const data: ProgressData = JSON.parse(stored);
    if (data.chapters[id]) {
      data.chapters[id].timeSpent = (data.chapters[id].timeSpent || 0) + additionalTime;
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem('physical-ai-progress', JSON.stringify(data));
    }
  };

  const updateScrollProgress = (id: string, percentage: number) => {
    const stored = localStorage.getItem('physical-ai-progress');
    if (!stored) return;

    const data: ProgressData = JSON.parse(stored);
    if (data.chapters[id]) {
      data.chapters[id].scrollProgress = Math.round(percentage);
      localStorage.setItem('physical-ai-progress', JSON.stringify(data));
      setCurrentChapter({ ...data.chapters[id] });
    }
  };

  const markChapterCompleted = (id: string) => {
    const stored = localStorage.getItem('physical-ai-progress');
    if (!stored) return;

    const data: ProgressData = JSON.parse(stored);
    if (data.chapters[id] && !data.chapters[id].completed) {
      data.chapters[id].completed = true;
      data.totalCompleted = Object.values(data.chapters).filter(c => c.completed).length;
      data.lastUpdated = new Date().toISOString();
      localStorage.setItem('physical-ai-progress', JSON.stringify(data));
      setProgress(data);
      setCurrentChapter({ ...data.chapters[id] });
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('physical-ai-progress');
    setProgress(null);
    setCurrentChapter(null);
  };

  return {
    progress,
    currentChapter,
    markChapterCompleted,
    resetProgress,
  };
}

// Progress Badge Component
export function ProgressBadge({ chapterId, chapterTitle }: { chapterId: string; chapterTitle: string }) {
  const { currentChapter } = useProgressTracker(chapterId, chapterTitle);

  if (!currentChapter) return null;

  return (
    <div className="tw-mt-6 tw-p-4 tw-bg-gradient-to-r tw-from-indigo-50 tw-to-purple-50 dark:tw-from-gray-800 dark:tw-to-gray-700 tw-rounded-xl tw-border tw-border-indigo-200 dark:tw-border-gray-600">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
        <div className="tw-flex tw-items-center tw-gap-2">
          <svg className="tw-w-5 tw-h-5 tw-text-indigo-600 dark:tw-text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="tw-text-sm tw-font-semibold tw-text-gray-900 dark:tw-text-white">
            Your Progress
          </span>
        </div>
        {currentChapter.completed && (
          <span className="tw-px-2 tw-py-1 tw-bg-green-100 dark:tw-bg-green-900 tw-text-green-800 dark:tw-text-green-200 tw-text-xs tw-font-medium tw-rounded-full">
            ✓ Completed
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="tw-relative tw-w-full tw-h-2 tw-bg-gray-200 dark:tw-bg-gray-600 tw-rounded-full tw-overflow-hidden">
        <div
          className="tw-absolute tw-top-0 tw-left-0 tw-h-full tw-bg-gradient-to-r tw-from-indigo-500 tw-to-purple-600 tw-transition-all tw-duration-500"
          style={{ width: `${currentChapter.scrollProgress || 0}%` }}
        />
      </div>

      <div className="tw-mt-2 tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-gray-600 dark:tw-text-gray-400">
        <span>{currentChapter.scrollProgress || 0}% read</span>
        {currentChapter.timeSpent && currentChapter.timeSpent > 0 && (
          <span>{formatTime(currentChapter.timeSpent)} spent</span>
        )}
      </div>
    </div>
  );
}

// Global Progress Overview Component
export function ProgressOverview() {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('physical-ai-progress');
    if (stored) {
      try {
        setProgressData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress data:', e);
      }
    }
  }, []);

  if (!progressData) return null;

  const chapters = Object.values(progressData.chapters);
  const totalChapters = 7; // Update as more chapters are added
  const completedCount = chapters.filter(c => c.completed).length;
  const progressPercentage = Math.round((completedCount / totalChapters) * 100);

  return (
    <div className="tw-p-6 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-gray-700">
      <h3 className="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-white tw-mb-4">
        Overall Progress
      </h3>

      <div className="tw-mb-6">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
          <span className="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300">
            {completedCount} of {totalChapters} chapters completed
          </span>
          <span className="tw-text-sm tw-font-bold tw-text-indigo-600 dark:tw-text-indigo-400">
            {progressPercentage}%
          </span>
        </div>
        <div className="tw-w-full tw-h-3 tw-bg-gray-200 dark:tw-bg-gray-700 tw-rounded-full tw-overflow-hidden">
          <div
            className="tw-h-full tw-bg-gradient-to-r tw-from-indigo-500 tw-to-purple-600 tw-transition-all tw-duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="tw-space-y-2">
        {chapters.sort((a, b) => a.chapterId.localeCompare(b.chapterId)).map(chapter => (
          <div key={chapter.chapterId} className="tw-flex tw-items-center tw-gap-3 tw-p-2 tw-rounded-lg hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
            <div className={`tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center ${
              chapter.completed ? 'tw-bg-green-500' : 'tw-bg-gray-300 dark:tw-bg-gray-600'
            }`}>
              {chapter.completed && (
                <svg className="tw-w-4 tw-h-4 tw-text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="tw-flex-1">
              <p className="tw-text-sm tw-font-medium tw-text-gray-900 dark:tw-text-white tw-m-0">
                {chapter.title}
              </p>
              {chapter.scrollProgress !== undefined && chapter.scrollProgress > 0 && !chapter.completed && (
                <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-m-0">
                  {chapter.scrollProgress}% read
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
