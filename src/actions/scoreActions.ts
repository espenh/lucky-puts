import * as moment from "moment";
import { v4 } from "uuid";
import { Score, IPutterScore, IPutterScoreV2 } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export enum ScoreActionsType {
    setScoreForRound = "set-score-for-round",
    setScoreForRoundV2 = "set-scorev2-for-round",
    deleteScore = "delete-score"
}

export interface ISetScoreForRound {
    type: ScoreActionsType.setScoreForRound;
    scores: IPutterScore[];
}

export interface ISetScoreForRoundV2 {
    type: ScoreActionsType.setScoreForRoundV2;
    scores: IPutterScoreV2[];
}

export interface IDeleteScore {
    type: ScoreActionsType.deleteScore;
    scoresId: string[];
}

export type ScoreAction = ISetScoreForRound | ISetScoreForRoundV2 | IDeleteScore;

export const setScoreForRound = (roundId: string, putterId: string, score: Score) => {
    const newScore: IPutterScore = {
        roundId: roundId,
        putterId: putterId,
        score: score
    };

    const id = [newScore.putterId, newScore.roundId].join("|");
    return FirebaseProvider.getFirestoreInstance().collection("scores").doc(id).set(newScore);
};

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
