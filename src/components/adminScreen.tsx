import * as moment from "moment";
import * as React from 'react';
import * as _ from "lodash";
import { connect } from 'react-redux';
import { IApplicationState, IPutterScoreV2 } from '../contracts/common';
import { setScoreForRoundV2 } from "../actions/scoreActions";

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

    private runV2Migration = () => {
        // We're removing the "rounds" concept.
        // Rounds provide nothing more than the date, so we put the date on the score.
        // The upshot is that we can then have multiple scores for a player for the same day.
        const roundsById = _.keyBy(this.props.state.round.rounds, round => round.id);
        const scoresv2: IPutterScoreV2[] = this.props.state.score.scores.map((score): IPutterScoreV2 => {

            const matchingRound = roundsById[score.roundId];
            const matchingRoundDate = moment(matchingRound.dateInUnixMsTicks);
            const roundDate = parseInt(matchingRoundDate.format("YYYYMMDD"), 10);
            return {
                putterId: score.putterId,
                registerDateInUnixMs: matchingRound.dateInUnixMsTicks,
                roundDate: roundDate,
                score: score.score
            };
        });

        scoresv2.forEach(score => {
            setScoreForRoundV2(score.roundDate, score.putterId, score.score, score.registerDateInUnixMs);
        });
    }

    public render() {
        return <div>
            <button onClick={this.runBackup}>Backup data</button>
            <button onClick={this.runV2Migration}>Migrate to v2</button>
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
