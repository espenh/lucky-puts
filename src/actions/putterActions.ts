import { v4 } from "uuid";
import { IPutter } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export interface IAddPutterAction {
    type: PutterActionsType.addNewPutter;
    putter: IPutter;
}

export enum PutterActionsType {
    addNewPutter = "add-new-putter"
}

export type PutterAction = IAddPutterAction;

export const addNewPutter = (newPutterName: string) => {
    const newPutter: IPutter = {
        id: v4(),
        name: newPutterName,
        image: null
    };

    return FirebaseProvider.getFirestoreInstance().collection("putters").doc(newPutter.id).set(newPutter);
};
