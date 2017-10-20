import { IPutterState } from "../contracts/common";
import { Reducer } from "redux";
import { PutterAction, PutterActionsType } from "../actions/putterActions";

const initialPutterState: IPutterState = {
    puttersById: {}
};

export const putterReducer: Reducer<IPutterState> = (state: IPutterState = initialPutterState, action: PutterAction) => {
    switch (action.type) {
        case PutterActionsType.addNewPutter:
            return {
                ...state,
                puttersById: { ...state.puttersById, [action.putter.id]: action.putter }
            };
        default:
            return state;
    }
};
