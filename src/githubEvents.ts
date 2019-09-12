import * as core from '@actions/core';
import { GitHubContext, github } from '@tangro/tangro-github-toolkit';
import { GitHubIssueEvent, GitHubIssueCommentEvent } from './types';
import { getOtrsTicketsFromText, prettifyUrlInText } from './otrs/utils';
import { addNoteToTicket, getTicketInformation } from './otrs/ticket';
import { OtrsTicket } from './otrs/types';

export async function onIssueBodyChanged(
  context: GitHubContext<GitHubIssueEvent>
): Promise<void> {
  const [owner, repo] = context.repository.split('/');
  const issueNumber = context.event.issue.number;
  const issueBody: string = context.event.issue.body;
  const issueTitle: string = context.event.issue.title;
  const issueUrl: string = context.event.issue.html_url;
  const label = core.getInput('label');

  const ticketsInIssueBody = getOtrsTicketsFromText(issueBody);
  let newIssueBody = issueBody;

  if (ticketsInIssueBody.length > 0) {
    await github.issues.addLabels({
      labels: [label],
      owner,
      repo,
      issue_number: issueNumber
    });

    for (const ticket of ticketsInIssueBody) {
      // only add a note to the ticket if it has not been notified
      if (!ticket.url.includes('notified=true')) {
        await addNoteToTicket({
          body: `Dieses Ticket wurde in einem Issue referenziert: <a href="${issueUrl}" norefer target="_blank">#${issueNumber} ${issueTitle}</a>`,
          subject: 'Notiz',
          ticketId: ticket.id
        });

        const ticketInfo: OtrsTicket = await getTicketInformation(ticket.id);

        newIssueBody = prettifyUrlInText(newIssueBody, ticketInfo, ticket);

        await github.issues.update({
          body: newIssueBody,
          issue_number: issueNumber,
          owner,
          repo
        });
      } else {
        // prettier-ignore
        core.debug(`Skipped: Ticket ${ticket.id} because there should already be a note.`);
      }
    }
  }
}

export async function onIssueClosed(
  context: GitHubContext<GitHubIssueEvent>
): Promise<void> {
  const issueNumber = context.event.issue.number;
  const issueBody: string = context.event.issue.body;
  const issueTitle: string = context.event.issue.title;

  const ticketsInIssueBody = getOtrsTicketsFromText(issueBody);
  const issueUrl: string = context.event.issue.html_url;

  if (ticketsInIssueBody.length > 0) {
    for (const ticket of ticketsInIssueBody) {
      // we always notify tickets on close (even if they have not been notified before)
      await addNoteToTicket({
        body: `Das Issue: <a href="${issueUrl}" norefer target="_blank">#${issueNumber} ${issueTitle}</a>, welches dieses Ticket referenziert hat, wurde geschlossen.`,
        subject: 'Notiz',
        ticketId: ticket.id
      });
    }
  }
}

export async function onIssueComment(
  context: GitHubContext<GitHubIssueCommentEvent>
): Promise<void> {
  const [owner, repo] = context.repository.split('/');
  const label = core.getInput('label');

  const issueNumber = context.event.issue.number;
  const issueTitle: string = context.event.issue.title;
  const commentBody: string = context.event.comment.body;
  const commentUrl: string = context.event.comment.html_url;
  const commentId: number = context.event.comment.id;

  const ticketsInCommentBody = getOtrsTicketsFromText(commentBody);
  let newCommentBody = commentBody;

  if (ticketsInCommentBody.length > 0) {
    await github.issues.addLabels({
      labels: [label],
      owner,
      repo,
      issue_number: issueNumber
    });

    for (const ticket of ticketsInCommentBody) {
      // only add a note to the ticket if it has not been notified
      if (!ticket.url.includes('notified=true')) {
        await addNoteToTicket({
          body: `Dieses Ticket wurde in einem Issuekommentar referenziert: <a href="${commentUrl}" norefer target="_blank">#${issueNumber} ${issueTitle}</a>`,
          subject: 'Notiz',
          ticketId: ticket.id
        });

        const ticketInfo: OtrsTicket = await getTicketInformation(ticket.id);

        newCommentBody = prettifyUrlInText(newCommentBody, ticketInfo, ticket);

        await github.issues.updateComment({
          body: newCommentBody,
          comment_id: commentId,
          owner,
          repo
        });
      } else {
        // prettier-ignore
        core.debug(`Skipped: Ticket ${ticket.id} in comment because there should already be a note.`);
      }
    }
  }
}
