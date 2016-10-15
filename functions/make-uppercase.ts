import * as functions from 'firebase-functions';

export const makeUpperCase = functions.database().path('/uppercase/{childId}')
    .onWrite((event: any) => {
  // For an explanation of this code, see "Handle Database Events"
  var written = event.data.val();
  console.log("Uppercasing", event.params.childId, written);
  var uppercase = written.toUpperCase()
  // Don't do anything if val() was already upper cased.
  if (written == uppercase) {
    return null;
  }
  return event.data.ref.set(uppercase);
});