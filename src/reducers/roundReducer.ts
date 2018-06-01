import { IRoundState } from "../contracts/common";
import { Reducer } from "redux";
import { RoundActionsType, RoundAction } from "../actions/roundActions";

const initialPutterState: IRoundState = {
    rounds: []
};

export const roundReducer: Reducer<IRoundState> = (state: IRoundState = initialPutterState, actionAsAny: RoundAction | any) => {
    const action = actionAsAny as RoundAction;
    switch (action.type) {
        case RoundActionsType.addNewRound:
            return {
                ...state,
                rounds: state.rounds.concat(action.rounds)
            };
        default:
            return state;
    }
};
