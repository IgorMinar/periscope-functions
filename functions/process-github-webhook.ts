import * as functions from 'firebase-functions';
import {GithubIssue} from './import-github-project';

const FIREBASE_EVENTQUEUE_ISSUES_PATH = '/github/eventQueue/issues/{eventId}';
const FIREBASE_EVENTQUEUE_PRS_PATH = '/github/eventQueue/prs/{eventId}';


export const processGithubIssueEvent = functions.database().path(FIREBASE_EVENTQUEUE_ISSUES_PATH)
    .onWrite((event: any) => {

      const issuesEvent = event.data.val() as IssuesEvent;
      const issue = issuesEvent.issue;

      return event.data.ref.root.child('github').child('issues').child(issue.number).set(issue).
              then(() => event.data.ref.remove());
});


export const processGithubPrEvent = functions.database().path(FIREBASE_EVENTQUEUE_PRS_PATH)
    .onWrite((event: any) => {

      const prEvent = event.data.val() as PullRequestEvent;
      const pr = prEvent.pull_request;

      return event.data.ref.root.child('github').child('prs').child(pr.number).set(pr).
              then(() => event.data.ref.remove());
    });


interface GitHubPullRequest extends GithubIssue {}

interface IssuesEvent {
  issue: GithubIssue
}

interface PullRequestEvent {
  number: number,
  pull_request: GitHubPullRequest
}