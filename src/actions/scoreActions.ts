import { v4 } from "uuid";
import { IPutterScoreV2 } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export enum ScoreActionsType {
    setScoreForRoundV2 = "set-scorev2-for-round",
    deleteScore = "delete-score"
}

export interface ISetScoreForRoundV2 {
    type: ScoreActionsType.setScoreForRoundV2;
    scores: IPutterScoreV2[];
}

export interface IDeleteScore {
    type: ScoreActionsType.deleteScore;
    scoresId: string[];
}

export type ScoreAction = ISetScoreForRoundV2 | IDeleteScore;

export const deleteScore = (scoreId: string) => {
    return FirebaseProvider.getFirestoreInstance().collection("scores_v2").doc(scoreId).delete();
};

export const setScoreForRoundV2 = (roundDate: number, putterId: string, score: number, registerDateInUnixMs: number) => {
    const newScore: IPutterScoreV2 = {
        id: v4(),
        registerDateInUnixMs: registerDateInUnixMs,
        roundDate: roundDate,
        putterId: putterId,
        score: score
    };

    return FirebaseProvider.getFirestoreInstance().collection("scores_v2").doc(newScore.id).set(newScore);
};
