import { Reducer } from "redux";
import { ISyncState } from "../contracts/common";
import { SyncAction, SyncActionType } from "../actions/syncActions";

const initialSyncState: ISyncState = {
    isSyncing: false
};

export const syncReducer: Reducer<ISyncState> = (state: ISyncState = initialSyncState, action: SyncAction) => {
    switch (action.type) {
        case SyncActionType.setIsSyncing:
        return {
            ...state,
            isSyncing: action.isSyncing
        };
        default:
            return state;
    }
};
