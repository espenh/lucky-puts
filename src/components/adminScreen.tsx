import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';

interface IAdminScreenPropFields {
    state: IApplicationState;
}

class AdminScreenView extends React.Component<IAdminScreenPropFields, {}> {

    private downloadObjectAsJson(exportObj: any, exportName: string) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    private runBackup = () => {
        const stateToBackup = {
            putters: this.props.state.putters,
            round: this.props.state.round,
            score: this.props.state.score
        };

        this.downloadObjectAsJson(stateToBackup, moment().format("YYYYMMDD_HHmmss" + "_luckyputs"));
    }

    public render() {
        return <div>
            <button onClick={this.runBackup}>Backup data</button>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): IAdminScreenPropFields => {
    return {
        state
    };
};

const AdminScreen = connect(mapStateToProps)(AdminScreenView);
export default AdminScreen;
