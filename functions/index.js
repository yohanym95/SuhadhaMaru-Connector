const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.helloWorld = functions.database.ref('Posts/{pushId}').onWrite((change,context) => {
    const post = change.after.val();

    const payload = {
        notification: {
            title: `New Mutual Job Post`,
            body: `${post.title}`,
            sound: "default"
        }
    }

    return admin.database().ref('fcm-token').once('value').then(allToken => {

        if (allToken.val()) {
            console.log('token available');
            const token = Object.keys(allToken.val());
            return admin.messaging().sendToDevice(token, payload)
                .then(function (response) {
                    console.log('Notification sent successfully:', response);
                })
                .catch(function (error) {
                    console.log('Notification sent failed:', error);
                });
        } else {
            console.log('token not available');
        }
    })
});


