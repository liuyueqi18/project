export type GithubBO = {
  full_name: string;
};

export type GithubSearchType = {
  total_count: number;
  items: GithubBO[];
};
