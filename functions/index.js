'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.disableUnauthorizedUser = functions.auth.user().onCreate((user) => {
  admin.firestore().collection('users').doc(user.email).get().then(doc => {
    if (!doc.exists) {
      admin.auth().updateUser(user.uid, {
        disabled: true
      });
    }
  });
  return null;
});
