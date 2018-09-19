import * as firebase from "firebase";

export default class FirebaseProvider {
    private static firebaseAppInstance: firebase.app.App;
    private static firestoreInstance: firebase.firestore.Firestore;

    public static getAppInstance() {
        if (FirebaseProvider.firebaseAppInstance === undefined) {
            // Having the api key here in plain sight looks scary, 
            // but it's only really used to identify the project on the Google servers.
            FirebaseProvider.firebaseAppInstance = firebase.initializeApp({
                apiKey: 'AIzaSyDd2RPT_HAghmgE8U-b4yxnwgHgaxMrLIo',
                authDomain: 'luckyputs-f03bf.firebaseapp.com',
                projectId: 'luckyputs-f03bf'
            });
        }

        return FirebaseProvider.firebaseAppInstance;
    }

    public static getFirestoreInstance() {
        const app = FirebaseProvider.getAppInstance();
        if (FirebaseProvider.firestoreInstance === undefined) {
            FirebaseProvider.firestoreInstance = firebase.firestore(app);
            FirebaseProvider.firestoreInstance.settings({ timestampsInSnapshots: true });
        }

        return FirebaseProvider.firestoreInstance;
    }
}
