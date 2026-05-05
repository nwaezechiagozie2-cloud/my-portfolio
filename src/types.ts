export interface Profile {
  id: number;
  headline: string;
  about_me: string;
  stack: string[];
  experience: string;
  contact_links: {
    phone?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  chat_enabled: boolean;
  profile_pic?: string;
}

export interface Project {
  id: number;
  title: string;
  short_description: string;
  description: string;
  github_link: string;
  live_link: string;
  display_pic: string;
  additional_media: string[];
}
