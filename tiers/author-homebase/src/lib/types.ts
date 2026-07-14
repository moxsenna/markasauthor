export type Tier = 'starter' | 'hero' | 'signature';

export interface Work {
  slug: string;
  title: string;
  genre: string;
  hook: string;
  readers: string;
  tag: string;
  coverBg: string;
  coverSize: string;
  kbmUrl: string;
  status: 'TAMAT' | 'TAYANG';
  series?: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  detail: string;
  dot: string;
}

export interface LatestChapter {
  workSlug: string;
  workTitle: string;
  title: string;
  date: string;
  kbmUrl: string;
  teaser?: string;
}

export interface BonusItem {
  id: string;
  jenis: string;
  title: string;
  karya: string;
  teaser: string;
  excerpt: string;
  published: boolean;
  opens?: string;
}

export interface ReadingNode {
  workSlug: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  border: string;
  coverBg: string;
  desc: string;
  kbmUrl: string;
  showArrow?: boolean;
}

export interface DemoReader {
  name: string;
  wa: string;
  source: string;
  date: string;
  when: string;
  initials: string;
  universe?: string;
}

export interface Character {
  slug: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  relations: string[];
}

export interface AuthorData {
  tier: Tier;
  penName: string;
  tagline: string;
  bioShort: string;
  bioLong: string;
  kbmProfileUrl: string;
  waChannelUrl: string;
  managementWa: string;
  socials: { label: string; url: string }[];
  works: Work[];
  timeline: TimelineItem[];
  latestChapters: LatestChapter[];
  bonuses: BonusItem[];
  readingMain: ReadingNode[];
  readingSide: { title: string; desc: string; coverBg: string; kbmUrl: string }[];
  collab: {
    stats: { value: string; label: string }[];
    openTo: string[];
    kitNote: string;
  };
  demoReaders: DemoReader[];
  universe?: {
    name: string;
    blurb: string;
    characters: Character[];
    storyTimeline: { id: string; title: string; spoiler: boolean; body: string }[];
    locations: { id: string; name: string; blurb: string }[];
    trivia: { q: string; a: string }[];
    playlistUrl?: string;
  };
}
