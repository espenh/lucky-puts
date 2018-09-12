import * as _ from "lodash";
import { IScoreState, IPutterScoreV2 } from "../contracts/common";
import { Reducer } from "redux";
import { ScoreAction, ScoreActionsType } from "../actions/scoreActions";

const initialPutterState: IScoreState = {
    scoresv2: []
};

export const scoreReducer: Reducer<IScoreState> = (state: IScoreState = initialPutterState, actionAsAny: ScoreAction | any) => {
    const keyv2 = (score: IPutterScoreV2) => [score.putterId, score.registerDateInUnixMs].join("|");

    const action = actionAsAny as ScoreAction;
    switch (action.type) {
        case ScoreActionsType.setScoreForRoundV2:

            const newv2Scores = new Set(action.scores.map(score => keyv2(score)));
            const scorev2ToRemove = _.find(state.scoresv2, (score) => newv2Scores.has(keyv2(score)));
            const scoresv2WithoutOld = _.without(state.scoresv2, scorev2ToRemove) as IPutterScoreV2[];

            return {
                ...state,
                scoresv2: scoresv2WithoutOld.concat(action.scores)
            };

        case ScoreActionsType.deleteScore:
            const scoresToRemove = new Set(action.scoresId);
            return {
                ...state,
                scoresv2: state.scoresv2.filter(s => !scoresToRemove.has(s.id))
            };
        default:
            return state;
    }
};
