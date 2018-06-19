import * as _ from "lodash";
import { IScoreState, IPutterScore, IPutterScoreV2 } from "../contracts/common";
import { Reducer } from "redux";
import { ScoreAction, ScoreActionsType } from "../actions/scoreActions";

const initialPutterState: IScoreState = {
    scores: [],
    scoresv2: []
};

export const scoreReducer: Reducer<IScoreState> = (state: IScoreState = initialPutterState, actionAsAny: ScoreAction | any) => {
    const key = (score: IPutterScore) => [score.putterId, score.roundId].join("|");
    const keyv2 = (score: IPutterScoreV2) => [score.putterId, score.registerDateInUnixMs].join("|");

    const action = actionAsAny as ScoreAction;
    switch (action.type) {
        case ScoreActionsType.setScoreForRound:

            const newScores = new Set(action.scores.map(score => key(score)));
            const scoreToRemove = _.find(state.scores, (score) => newScores.has(key(score)));
            const scoresWithoutOld = _.without(state.scores, scoreToRemove) as IPutterScore[];

            return {
                ...state,
                scores: scoresWithoutOld.concat(action.scores)
            };

        case ScoreActionsType.setScoreForRoundV2:

            const newv2Scores = new Set(action.scores.map(score => keyv2(score)));
            const scorev2ToRemove = _.find(state.scoresv2, (score) => newv2Scores.has(keyv2(score)));
            const scoresv2WithoutOld = _.without(state.scoresv2, scorev2ToRemove) as IPutterScoreV2[];

            return {
                ...state,
                scoresv2: scoresv2WithoutOld.concat(action.scores)
            };
        default:
            return state;
    }
};
