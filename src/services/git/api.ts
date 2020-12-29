import request from "@/services/git/services";

import { GithubSearchType, GitSearchType } from "@/views/GithubModel/types";
import dayjs from "dayjs";

export async function getOrderList(params: GitSearchType) {
  const res = await request.get<unknown, GithubSearchType>(
    "search/repositories",
    {
      params: params
    }
  );
  return {
    list: res.items.map(item => {
      return {
        fullName: item.full_name,
        stargazersCount: item.stargazers_count,
        language: item.language,
        createdAt: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: dayjs(item.updated_at).format("YYYY-MM-DD HH:mm:ss"),
        htmlUrl: item.html_url,
        description: item.description
      };
    }),
    total: res.total_count
  };
}
