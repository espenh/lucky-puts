import * as moment from "moment";
import { Score, IPutterScore, IPutterScoreV2 } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export enum ScoreActionsType {
    setScoreForRound = "set-score-for-round",
    setScoreForRoundV2 = "set-scorev2-for-round"
}

export interface ISetScoreForRound {
    type: ScoreActionsType.setScoreForRound;
    scores: IPutterScore[];
}

export interface ISetScoreForRoundV2 {
    type: ScoreActionsType.setScoreForRoundV2;
    scores: IPutterScoreV2[];
}

export type ScoreAction = ISetScoreForRound | ISetScoreForRoundV2;

export const setScoreForRound = (roundId: string, putterId: string, score: Score) => {
    const newScore: IPutterScore = {
        roundId: roundId,
        putterId: putterId,
        score: score
    };

    const id = [newScore.putterId, newScore.roundId].join("|");
    return FirebaseProvider.getFirestoreInstance().collection("scores").doc(id).set(newScore);
};

export const setScoreForRoundV2 = (roundDate: number, putterId: string, score: number, registerDateInUnixMs: number) => {
    const newScore: IPutterScoreV2 = {
        registerDateInUnixMs: registerDateInUnixMs,
        roundDate: roundDate,
        putterId: putterId,
        score: score
    };

    const id = [newScore.putterId, newScore.registerDateInUnixMs].join("|");
    return FirebaseProvider.getFirestoreInstance().collection("scores_v2").doc(id).set(newScore);
};
