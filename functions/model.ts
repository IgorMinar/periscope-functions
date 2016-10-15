export interface User {
  login: string;
  id: number;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Milestone {
  url: string;
  html_url: string;
  labels_url: string;
  id: number;
  number: number;
  title: string;
  description: string;
  creator: User;
  open_issues: number;
  closed_issues: number;
  state: string;
  created_at: string;
  updated_at: string;
  due_on: string;
  closed_at: string;
}

export interface PullRequestRef {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
}

export interface LabelRef {
  url: string;
  name: string;
  color: string;
}

export interface BaseIssue {
  url: string;
  id: number;
  number: number;
  title: string;
  user: User;
  body: string;
  assignee: User;
  milestone: Milestone;
  created_at: string;
  updated_at: string;
  comments: number;
  commits_url: string;
  html_url: string;
  labels_url: string;
  events_url: string;
}

export interface Issue extends BaseIssue {
  repository_url: string;
  state: string;
  locked: boolean;
  closed_at: any;
  pull_request: PullRequestRef;
  closed_by: any;
}

export interface PullRequest extends BaseIssue {
  diff_url: string;
  patch_url: string;
  issue_url: string;
  state: string;
  locked: boolean;
  closed_at: string;
  merged_at: string;
  merge_commit_sha: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: any;
  base: any;
  //_links: any;
  merged: boolean;
  mergeable: boolean;
  mergeable_state: string;
  merged_by: User;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}


export interface Event {
  action: string;
  comment?: Comment;
  issue?: Issue;
  pull_request?: PullRequest;
  organization: any;
  repository: any;
  sender: User;
}