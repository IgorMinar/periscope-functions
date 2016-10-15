import * as functions from 'firebase-functions';
import * as firebase from 'firebase';

const FIREBASE_ADMIN_ERASE_PATH = '/admin/eraseGithubData';

export const eraseGithubData = functions.database().path(FIREBASE_ADMIN_ERASE_PATH)
    .onWrite((event) => {

  var value = event.data.val();

  switch(value) {
    case true:
      console.log("Reseting all GitHub data", event.app);
      event.data.ref.set(false);
      return event.data.ref.root.child('github').set({});
    case false:
      // ignore
  }
});