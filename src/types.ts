export interface GitHubIssueEvent {
  action: 'opened' | 'edited' | 'closed';
  issue: {
    number: number;
    body: string;
    title: string;
    html_url: string;
  };
}

export interface GitHubIssueCommentEvent {
  action: 'created' | 'edited';
  comment: {
    id: number;
    body: string;
    html_url: string;
  };
  issue: GitHubIssueEvent['issue'];
}
