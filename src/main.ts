import * as core from '@actions/core';
import { GitHubContext } from '@tangro/tangro-github-toolkit';
import { GitHubIssueEvent, GitHubIssueCommentEvent } from './types';
import {
  onIssueClosed,
  onIssueBodyChanged,
  onIssueComment
} from './githubEvents';

async function run() {
  try {
    if (
      !process.env.GITHUB_CONTEXT ||
      process.env.GITHUB_CONTEXT.length === 0
    ) {
      throw new Error(
        'You have to set the GITHUB_CONTEXT in your secrets configuration'
      );
    }
    if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN.length === 0) {
      throw new Error(
        'You have to set the GITHUB_TOKEN in your secrets configuration'
      );
    }

    const context = JSON.parse(
      process.env.GITHUB_CONTEXT || ''
    ) as GitHubContext<{}>;

    if (context.event_name === 'issues') {
      const issueContext = context as GitHubContext<GitHubIssueEvent>;

      if (
        issueContext.event.action === 'opened' ||
        issueContext.event.action === 'edited'
      ) {
        await onIssueBodyChanged(issueContext);
      } else if (issueContext.event.action === 'closed') {
        await onIssueClosed(issueContext);
      } else {
        console.log(
          `Unsuppoted event.action found: ${issueContext.event.action}`
        );
      }
    } else if (context.event_name === 'issue_comment') {
      const issueCommentContext = context as GitHubContext<
        GitHubIssueCommentEvent
      >;
      if (
        issueCommentContext.event.action === 'created' ||
        issueCommentContext.event.action === 'edited'
      ) {
        await onIssueComment(issueCommentContext);
      } else {
        console.log(
          `Unsuppoted event.action found: ${issueCommentContext.event.action}`
        );
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
