export type Site = {
  website: string;
  author: string;
  description: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
};

export const SITE: Site = {
  website: "https://web.vyke.dev",
  author: "Jose Albizures",
  description: "Several web tools",
  title: "Web tools by Vyke",

  // ogImage: 'main.jpg',
  lightAndDarkMode: true,
  postPerPage: 6,
};
