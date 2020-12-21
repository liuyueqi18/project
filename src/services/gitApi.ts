// eslint-disable-next-line @typescript-eslint/no-unused-vars
import requestGit from "./gitservices";
import {
  GithubBO,
  GithubSearchType,
  GitSearchType
} from "@/views/GithubModel/types";

export async function getGitSearchList(params: GitSearchType) {
  const res = await requestGit.get<unknown, GithubSearchType>(
    "search/repositories",
    { params: params }
  );
  return {
    list: res.items as GithubBO[],
    total: res.total_count
  };
}
