import { Score, IPutterScore } from "../contracts/common";
import FirebaseProvider from "../firebaseProvider";

export enum ScoreActionsType {
    setScoreForRound = "set-score-for-round"
}

export interface ISetScoreForRound {
    type: ScoreActionsType.setScoreForRound;
    scores: IPutterScore[];
}

export type ScoreAction = ISetScoreForRound;

export const setScoreForRound = (roundId: string, putterId: string, score: Score) => {
    const newScore: IPutterScore = {
        roundId: roundId,
        putterId: putterId,
        score: score
    };

    const id = [newScore.putterId, newScore.roundId].join("|");
    return FirebaseProvider.getFirestoreInstance().collection("scores").doc(id).set(newScore);
};
