"use strict";
var functions = require('firebase-functions');
var IN_PROGRESS = 'in progress';
var FIREBASE_ADMIN_IMPORT_PATH = '/admin/fullImport';
exports.importGithubProject = functions.database().path(FIREBASE_ADMIN_IMPORT_PATH)
    .onWrite(function (event) {
    var value = event.data.val();
    switch (value) {
        case true:
            console.log("Starting full GitHub import");
            event.data.ref.set(IN_PROGRESS);
            return performFullImport(event.data.ref.root.child('github')).then(function () {
                console.log("Finished full GitHub import");
                return event.data.ref.set(false);
            }, function () {
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
var GitHubApi = require('github');
var github = new GitHubApi({
    // optional args
    debug: false
});
// https://github.com/settings/tokens
github.authenticate({
    type: "token",
    // token from IgorMinar with no extra privileges
    token: "c1f00a426a56cba7b6575603af1539579512d005",
});
function performFullImport(githubRef) {
    var finishedImports = 1;
    var resolverDone;
    var resolverError;
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
    return new Promise(function (resolve, reject) {
        resolverDone = resolve;
        resolverError = reject;
    });
}
exports.performFullImport = performFullImport;
;
function pageImporter(destinationRef, doneCallback, errorCallback) {
    var pageCount = 0;
    var pendingSaves = [];
    return function importPage(error, response) {
        if (error) {
            console.error("oh no! failed to import into " + destinationRef.key + "\n", error);
            errorCallback(error);
        }
        else {
            console.info("importing " + destinationRef.key + ", page " + pageCount);
            for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                var issue = response_1[_i];
                pendingSaves.push(destinationRef.child(issue.number).set(issue));
            }
        }
        if (github.hasNextPage(response)) {
            pageCount++;
            github.getNextPage(response, importPage);
        }
        else {
            Promise.all(pendingSaves).then(doneCallback, errorCallback);
        }
    };
}
//# sourceMappingURL=import-github-project.js.map