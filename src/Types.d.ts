
export interface PicUrl {
  thumbnail_pic: string;
}

export interface Status {
  source: string;
  created_at: string;
  idstr: string,
  text: string;
  user: User;
  pic_urls: PicUrl[];
  retweeted_status?: Status;
  comments_count: Number;
  reposts_count: Number;
  attitudes_count: Number;
}

export interface Comment {
  source: string;
  created_at: string;
  idstr: string,
  text: string;
  user: User;
  statusId: string;
}

export interface WBFetchOptions {
  id?: string,
  since_id?: string,
  max_id?: string
}


export interface User {
  name: string;
  idstr: string;
  avatar_large: string;
  description: string;
  location: string;
  friends_count: number;
  followers_count: number;
  statuses_count: number;
  following: boolean;
  follow_me: boolean;
}

export interface Emotion {
  value: string;
  url: string;
  category: string
}