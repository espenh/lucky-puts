import { IPutterState } from "../contracts/common";
import { Reducer } from "redux";
import { PutterAction, PutterActionsType } from "../actions/putterActions";
import * as _ from "lodash";

const initialPutterState: IPutterState = {
    puttersById: {}
};

export const putterReducer: Reducer<IPutterState> = (state: IPutterState = initialPutterState, actionAsAny: PutterAction | any) => {
    const action = actionAsAny as PutterAction;
    switch (action.type) {
        case PutterActionsType.addNewPutter:
            const puttersById = _.fromPairs(_.map(action.putters, putter => [putter.id, putter]));
            return {
                ...state,
                puttersById: { ...state.puttersById, ...puttersById }
            };
        default:
            return state;
    }
};
