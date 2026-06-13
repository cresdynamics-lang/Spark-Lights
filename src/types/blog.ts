export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogRelatedLink {
  label: string;
  path: string;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  image: string;
  seoTitle: string;
  metaDescription: string;
  seoKeywords: string;
  sections: BlogSection[];
  relatedLinks: BlogRelatedLink[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
