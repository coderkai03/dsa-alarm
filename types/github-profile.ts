export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  followers: number;
  following: number;
}

export type GitHubProfile = {
  user: GitHubUser;
};
