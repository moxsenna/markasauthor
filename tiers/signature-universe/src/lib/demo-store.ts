import type {
  AuthorData,
  BonusItem,
  DemoReader,
  LatestChapter,
  ReadingNode,
  Work,
} from './types';

export type ContentState = {
  latestChapters: LatestChapter[];
  history: LatestChapter[];
  unlocked?: boolean;
  readerName?: string;
  works: Work[];
  bonuses: BonusItem[];
  readingMain: ReadingNode[];
  readingSide: { title: string; desc: string; coverBg: string; kbmUrl: string }[];
  demoReaders: DemoReader[];
  theme?: string;
  universe?: AuthorData['universe'];
};

export type DemoState = ContentState;

export function storageKey(tier: string) {
  return `ma-demo-${tier}`;
}

export function defaultFromAuthor(author: AuthorData): ContentState {
  return {
    latestChapters: author.latestChapters || [],
    history: author.latestChapters || [],
    works: structuredClone(author.works),
    bonuses: structuredClone(author.bonuses),
    readingMain: structuredClone(author.readingMain),
    readingSide: structuredClone(author.readingSide),
    demoReaders: structuredClone(author.demoReaders),
    universe: author.universe ? structuredClone(author.universe) : undefined,
    theme: 'maroon',
  };
}

export function loadDemoState(tier: string, fallback: LatestChapter[]): ContentState {
  const empty: ContentState = {
    latestChapters: fallback,
    history: fallback,
    works: [],
    bonuses: [],
    readingMain: [],
    readingSide: [],
    demoReaders: [],
  };
  if (typeof window === 'undefined') return empty;
  try {
    const raw = localStorage.getItem(storageKey(tier));
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    return {
      latestChapters: parsed.latestChapters?.length ? parsed.latestChapters : fallback,
      history: parsed.history?.length ? parsed.history : fallback,
      unlocked: parsed.unlocked,
      readerName: parsed.readerName,
      works: parsed.works || [],
      bonuses: parsed.bonuses || [],
      readingMain: parsed.readingMain || [],
      readingSide: parsed.readingSide || [],
      demoReaders: parsed.demoReaders || [],
      theme: parsed.theme,
      universe: parsed.universe,
    };
  } catch {
    return empty;
  }
}

/** Merge JSON seed with any stored overrides (stored wins when present). */
export function loadContent(tier: string, author: AuthorData): ContentState {
  const seed = defaultFromAuthor(author);
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(storageKey(tier));
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Partial<ContentState>;
    return {
      latestChapters: parsed.latestChapters?.length ? parsed.latestChapters : seed.latestChapters,
      history: parsed.history?.length ? parsed.history : seed.history,
      unlocked: parsed.unlocked ?? seed.unlocked,
      readerName: parsed.readerName ?? seed.readerName,
      works: parsed.works?.length ? parsed.works : seed.works,
      bonuses: parsed.bonuses?.length ? parsed.bonuses : seed.bonuses,
      readingMain: parsed.readingMain?.length ? parsed.readingMain : seed.readingMain,
      readingSide: parsed.readingSide?.length ? parsed.readingSide : seed.readingSide,
      demoReaders: parsed.demoReaders?.length ? parsed.demoReaders : seed.demoReaders,
      theme: parsed.theme || seed.theme,
      universe: parsed.universe || seed.universe,
    };
  } catch {
    return seed;
  }
}

export function saveDemoState(tier: string, state: ContentState) {
  localStorage.setItem(storageKey(tier), JSON.stringify(state));
}

export function saveContent(tier: string, patch: Partial<ContentState>, author: AuthorData) {
  const current = loadContent(tier, author);
  const next = { ...current, ...patch };
  saveDemoState(tier, next);
  return next;
}

export function publishChapter(tier: string, chapter: LatestChapter, previous: LatestChapter[]) {
  // Prefer full content if available
  let current: ContentState;
  try {
    const raw = localStorage.getItem(storageKey(tier));
    current = raw
      ? (JSON.parse(raw) as ContentState)
      : {
          latestChapters: previous,
          history: previous,
          works: [],
          bonuses: [],
          readingMain: [],
          readingSide: [],
          demoReaders: [],
        };
  } catch {
    current = {
      latestChapters: previous,
      history: previous,
      works: [],
      bonuses: [],
      readingMain: [],
      readingSide: [],
      demoReaders: [],
    };
  }
  const next: ContentState = {
    ...current,
    latestChapters: [
      chapter,
      ...(current.latestChapters || []).filter((c) => c.workSlug !== chapter.workSlug),
    ].slice(0, 5),
    history: [chapter, ...(current.history || [])].slice(0, 20),
  };
  saveDemoState(tier, next);
  return next;
}

export function buildWaMessage(chapter: LatestChapter) {
  return (
    `📖 BAB BARU TERBIT\n` +
    `${chapter.workTitle} — ${chapter.title}\n\n` +
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

export function moveItem<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir;
  if (index < 0 || j < 0 || j >= arr.length) return arr.slice();
  const next = arr.slice();
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

export function toast(msg: string) {
  let el = document.getElementById('ops-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ops-toast';
    el.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;background:#5C2430;color:#FBF6EF;padding:12px 20px;border-radius:999px;font-family:Lora,serif;font-size:14px;font-weight:600;box-shadow:0 8px 28px rgba(59,42,40,.28);max-width:90vw;text-align:center';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.display = 'block';
  window.clearTimeout((el as HTMLElement & { _t?: number })._t);
  (el as HTMLElement & { _t?: number })._t = window.setTimeout(() => {
    el!.style.display = 'none';
  }, 2200);
}
