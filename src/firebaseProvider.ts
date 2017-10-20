import * as firebase from "firebase";

export default class FirebaseProvider {
    private static firebaseAppInstance: firebase.app.App;
    private static firestoreInstance: firebase.firestore.Firestore;

    public static getAppInstance() {
        if (FirebaseProvider.firebaseAppInstance === undefined) {
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
        }

        return FirebaseProvider.firestoreInstance;
    }
}
