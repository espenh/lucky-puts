import * as _ from "lodash";
import { IScoreState, IPutterScore } from "../contracts/common";
import { Reducer } from "redux";
import { ScoreAction, ScoreActionsType } from "../actions/scoreActions";

const initialPutterState: IScoreState = {
    scores: []
};

export const scoreReducer: Reducer<IScoreState> = (state: IScoreState = initialPutterState, action: ScoreAction | any) => {
    switch (action.type) {
        case ScoreActionsType.setScoreForRound:
            const scoreToRemove = _.find(state.scores, (score) => score.putterId === action.score.putterId && score.roundId === action.score.roundId);
            const scoresWithoutOld = _.without(state.scores, scoreToRemove) as IPutterScore[];

            return {
                ...state,
                scores: scoresWithoutOld.concat([action.score])
            };
        default:
            return state;
    }
};
