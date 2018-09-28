import { v4 } from "uuid";
import { IPutterScore } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export enum ScoreActionsType {
    setScoreForRound = "set-score-for-round",
    deleteScore = "delete-score"
}

export interface ISetScoreForRound {
    type: ScoreActionsType.setScoreForRound;
    scores: IPutterScore[];
}

export interface IDeleteScore {
    type: ScoreActionsType.deleteScore;
    scoresId: string[];
}

export type ScoreAction = ISetScoreForRound | IDeleteScore;

export const deleteScore = (scoreId: string) => {
    return FirebaseProvider.getFirestoreInstance().collection("scores_v2").doc(scoreId).delete();
};

export const setScoreForRound = (roundDate: number, putterId: string, score: number, registerDateInUnixMs: number) => {
    const newScore: IPutterScore = {
        id: v4(),
        registerDateInUnixMs: registerDateInUnixMs,
        roundDate: roundDate,
        putterId: putterId,
        score: score
    };

    return FirebaseProvider.getFirestoreInstance().collection("scores_v2").doc(newScore.id).set(newScore);
};
