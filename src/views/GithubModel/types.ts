export type GithubBO = {
  full_name: string;
  stargazers_count: string;
  language: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  description: string;
};

export type GithubSearchType = {
  total_count: number;
  items: GithubBO[];
};

export type GitSearchType = {
  q: string;
  per_page: number;
  page: number;
  sort: string;
  sortText: string;
  order: string;
};

export const sortList = [
  {
    type: "best match",
    text: "最佳匹配",
    order: "desc"
  },
  {
    type: "stars",
    text: "最多stars",
    order: "desc"
  },
  {
    type: "stars",
    text: "最少stars",
    order: "asc"
  },
  {
    type: "forks",
    text: "最多forks",
    order: "desc"
  },
  {
    type: "forks",
    text: "最少forks",
    order: "asc"
  },
  {
    type: "updated",
    text: "最近updated",
    order: "desc"
  },
  {
    type: "updated",
    text: "最远updated",
    order: "asc"
  }
];
