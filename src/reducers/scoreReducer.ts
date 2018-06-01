import * as _ from "lodash";
import { IScoreState, IPutterScore } from "../contracts/common";
import { Reducer } from "redux";
import { ScoreAction, ScoreActionsType } from "../actions/scoreActions";

const initialPutterState: IScoreState = {
    scores: []
};

export const scoreReducer: Reducer<IScoreState> = (state: IScoreState = initialPutterState, actionAsAny: ScoreAction | any) => {
    const action = actionAsAny as ScoreAction;
    switch (action.type) {
        case ScoreActionsType.setScoreForRound:
            const key = (score: IPutterScore) => [score.putterId, score.roundId].join("|");
            const newScores = new Set(action.scores.map(score => key(score)));
            const scoreToRemove = _.find(state.scores, (score) => newScores.has(key(score)));
            const scoresWithoutOld = _.without(state.scores, scoreToRemove) as IPutterScore[];

            return {
                ...state,
                scores: scoresWithoutOld.concat(action.scores)
            };
        default:
            return state;
    }
};
