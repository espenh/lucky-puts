import { v4 } from "uuid";
import FirebaseProvider from "../firebaseProvider";
import { IRound } from "../contracts/common";

export interface IAddRoundAction {
    type: RoundActionsType.addNewRound;
    rounds: IRound[];
}

export enum RoundActionsType {
    addNewRound = "add-new-round"
}

export type RoundAction = IAddRoundAction;

export const addNewRound = (dateInUnixMs: number) => {
    const round: IRound = {
        id: v4(),
        dateInUnixMsTicks: dateInUnixMs,
    };

    return FirebaseProvider.getFirestoreInstance().collection("rounds").doc(round.id).set(round);
};
