import { IApplicationState } from "../contracts/common";
import { Dispatch } from "react-redux";

export enum SyncActionType {
    setIsSyncing = "set-is-syncing"
}

export interface ISetIsSyncing {
    type: SyncActionType.setIsSyncing;
    isSyncing: boolean;
}

export type SyncAction = ISetIsSyncing;

export const setIsSyncing = (isSyncing: boolean) => {
    return (dispatch: Dispatch<IApplicationState>, getState: () => IApplicationState) => {
        return dispatch<ISetIsSyncing>({
            type: SyncActionType.setIsSyncing,
            isSyncing: isSyncing
        });
    };
};
