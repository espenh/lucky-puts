import * as _ from "lodash";
import { Reducer } from "redux";

import { IScoreState, IPutterScore } from "../contracts/common";
import { ScoreAction, ScoreActionsType } from "../actions/scoreActions";

const initialPutterState: IScoreState = {
    scores: []
};

export const scoreReducer: Reducer<IScoreState> = (state: IScoreState = initialPutterState, actionAsAny: ScoreAction | any) => {
    const keyv2 = (score: IPutterScore) => [score.putterId, score.registerDateInUnixMs].join("|");

    const action = actionAsAny as ScoreAction;
    switch (action.type) {
        case ScoreActionsType.setScoreForRound:

            const newScores = new Set(action.scores.map(score => keyv2(score)));
            const scoresNowInvalid = _.find(state.scores, (score) => newScores.has(keyv2(score)));
            const scoresWithoutInvalid = _.without(state.scores, scoresNowInvalid) as IPutterScore[];

            return {
                ...state,
                scores: scoresWithoutInvalid.concat(action.scores)
            };

        case ScoreActionsType.deleteScore:
            const scoresToRemove = new Set(action.scoresId);
            return {
                ...state,
                scores: state.scores.filter(s => !scoresToRemove.has(s.id))
            };
        default:
            return state;
    }
};
