import type { LatestChapter } from './types';

export type DemoState = {
  latestChapters: LatestChapter[];
  history: LatestChapter[];
  unlocked?: boolean;
  readerName?: string;
};

export function storageKey(tier: string) {
  return `ma-demo-${tier}`;
}

export function loadDemoState(tier: string, fallback: LatestChapter[]): DemoState {
  if (typeof window === 'undefined') {
    return { latestChapters: fallback, history: fallback };
  }
  try {
    const raw = localStorage.getItem(storageKey(tier));
    if (!raw) return { latestChapters: fallback, history: fallback };
    const parsed = JSON.parse(raw) as DemoState;
    return {
      latestChapters: parsed.latestChapters?.length ? parsed.latestChapters : fallback,
      history: parsed.history?.length ? parsed.history : fallback,
      unlocked: parsed.unlocked,
      readerName: parsed.readerName,
    };
  } catch {
    return { latestChapters: fallback, history: fallback };
  }
}

export function saveDemoState(tier: string, state: DemoState) {
  localStorage.setItem(storageKey(tier), JSON.stringify(state));
}

export function publishChapter(tier: string, chapter: LatestChapter, previous: LatestChapter[]) {
  const current = loadDemoState(tier, previous);
  const next: DemoState = {
    ...current,
    latestChapters: [chapter, ...current.latestChapters.filter((c) => c.workSlug !== chapter.workSlug)].slice(0, 5),
    history: [chapter, ...current.history].slice(0, 20),
  };
  saveDemoState(tier, next);
  return next;
}

export function buildWaMessage(chapter: LatestChapter) {
  return (
    `\u{1F4D6} BAB BARU TERBIT\n` +
    `${chapter.workTitle} \u2014 ${chapter.title}\n\n` +
    `${chapter.teaser || 'Bab baru sudah tayang.'}\n\n` +
    `Baca sekarang di KBM:\n${chapter.kbmUrl}`
  );
}

export function unlockReader(tier: string, name: string, fallback: LatestChapter[]) {
  const current = loadDemoState(tier, fallback);
  const next = { ...current, unlocked: true, readerName: name };
  saveDemoState(tier, next);
  return next;
}
