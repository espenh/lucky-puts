import * as React from 'react';
import { connect } from "react-redux";

import { IApplicationState } from "../contracts/common";

interface ISyncIndicatorProps {
    isSyncing: boolean;
}

class SyncIndicatorView extends React.Component<ISyncIndicatorProps, {}> {
    public render() {
        return <span>{this.props.isSyncing ? "yes" : "no"}</span>;
    }
}

const mapStateToProps = (state: IApplicationState): ISyncIndicatorProps => {
    return {
        isSyncing: state.sync.isSyncing
    };
};

const SyncIndicator = connect(mapStateToProps)(SyncIndicatorView);
export default SyncIndicator;
