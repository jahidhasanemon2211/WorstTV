export interface Channel {
  name: string;
  logo: string;
  group: string;
  url: string;
}

export interface MatchHighlight {
  id: string;
  title: string;
  coverImage: string;
  url: string; // m3u8 or embedded
  duration: string;
  year: string;
}
