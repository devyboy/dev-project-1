'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.disableUnauthorizedUser = functions.auth.user().onCreate((user) => {
  return(disableUser(user.email, user.uid));
});

async function disableUser(email, uid) {
  admin.firestore().collection('users').doc(email).get().then(doc => {
    if (!doc.exists) {
      admin.auth().updateUser(uid, {
        disabled: true
      });
    }
  });
}
