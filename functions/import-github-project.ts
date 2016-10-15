import * as functions from 'firebase-functions';
import * as firebase from 'firebase';
import {Observable} from 'rxjs/Rx';

const IN_PROGRESS = 'in progress';
const FIREBASE_ADMIN_IMPORT_PATH = '/admin/fullImport'


export const importGithubProject = functions.database().path(FIREBASE_ADMIN_IMPORT_PATH)
    .onWrite((event: any) => {

  var value = event.data.val();

  switch(value) {
    case true:
      console.log("Starting full GitHub import");
      event.data.ref.set(IN_PROGRESS);
      return performFullImport(event.data.ref.root.child('github')).then(() => {
        console.log("Finished full GitHub import");
        return event.data.ref.set(false);
      }, () => {
        console.log("Import failed...");
        return event.data.ref.set('ERROR!!!');
      });
    case false: //fallthrough
    case IN_PROGRESS:
      break;
    default:
      console.warn("Failed to trigger import - trigger value not recognized:", value);
  }
});


// https://mikedeboer.github.io/node-github/
// https://github.com/mikedeboer/node-github
const GitHubApi = require('github');

const github = new GitHubApi({
    // optional args
    debug: false
});

// https://github.com/settings/tokens
github.authenticate({
    type: "token",
    // token from IgorMinar with no extra privileges
    token: "c1f00a426a56cba7b6575603af1539579512d005",
});


export function performFullImport(githubRef: firebase.database.Reference) {
  let finishedImports = 1;
  let resolverDone: Function;
  let resolverError: Function;

  github.issues.getForRepo({
    owner: 'angular',
    repo: 'angular',
    //state: 'all',
    page: 0,
    per_page: 100
  }, pageImporter(githubRef.child('issues'), function done() {
    if (--finishedImports === 0) {
      console.log('all imports completed!');
      resolverDone();
    }
  }, function error() {
    finishedImports = 0;
    resolverError();
  }));

  return new Promise((resolve, reject) => {
    resolverDone = resolve;
    resolverError = reject;
  });
};

function pageImporter(destinationRef: firebase.database.Reference, doneCallback: () => void, errorCallback: (error: Error) => void) {
  let pageCount = 0;
  let pendingSaves: firebase.Promise<any>[] = [];

  return function importPage(error: Error, response: GithubIssue[]) {
    if (error) {
      console.error(`oh no! failed to import into ${destinationRef.key}\n`, error);
      errorCallback(error);
    } else {
      console.info(`importing ${destinationRef.key}, page ${pageCount}`);
      for (let issue of response) {
        pendingSaves.push(destinationRef.child(issue.number).set(issue));
      }
    }

    if (github.hasNextPage(response)) {
      pageCount++;
      github.getNextPage(response, importPage);
    } else {
      Promise.all(pendingSaves).then(doneCallback, errorCallback);
    }
  }
}



interface GithubIssue {
  id: string,
  number: string
}