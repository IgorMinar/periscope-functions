"use strict";
var functions = require('firebase-functions');
var FIREBASE_ADMIN_ERASE_PATH = '/admin/eraseGithubData';
exports.eraseGithubData = functions.database().path(FIREBASE_ADMIN_ERASE_PATH)
    .onWrite(function (event) {
    var value = event.data.val();
    switch (value) {
        case true:
            console.log("Reseting all GitHub data", event.app);
            event.data.ref.set(false);
            return event.data.ref.root.child('github').set({});
        case false:
    }
});
//# sourceMappingURL=erase-github-data.js.map