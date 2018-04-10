import * as _ from 'lodash';
import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';

interface IPuttingRecordsPropFields {
    mostPuts?: { count: number, putter: IPutter };
    longestStreak?: { putter: IPutter, streak: { length: number, start: moment.Moment } };
    bestWeek?: { week: string, putter: IPutter }
}

class PuttingRecordsView extends React.Component<IPuttingRecordsPropFields, {}> {

    public render() {
        return <div className="widget records">
            <table>
                <tbody>
                    {this.props.mostPuts && <tr>
                        <td>Most puts</td>
                        <td>{this.props.mostPuts.count}</td>
                        <td>{this.props.mostPuts.putter.name}</td>
                        <td>{}</td>
                    </tr>}
                    {this.props.longestStreak && <tr>
                        <td>Longest streak</td>
                        <td>{this.props.longestStreak.streak.length}</td>
                        <td>{this.props.longestStreak.putter.name}</td>
                        <td>{this.props.longestStreak.streak.start.format("DD MMM YY")}</td>
                    </tr>}
                </tbody>
            </table>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): IPuttingRecordsPropFields => {
    const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);

    const scoreByPutter = _.groupBy(allNonZeroScores, s => s.putter.id);
    const countForPlayer = _.map(scoreByPutter, (scores, putterId) => {
        return {
            putter: state.putters.puttersById[putterId],
            count: scores.length,
            latestScore: _.maxBy(scores, s => s.round.dateInUnixMsTicks)
        };
    });

    // Best week.
    const bestWeeks = ScoreSelectors.getBest(state, "isoWeek");
    

    return {
        // Prefer the last putter, if equal
        mostPuts: _.first(_.orderBy(countForPlayer, [s => s.count, s => s.latestScore], "desc")),
        longestStreak: _.maxBy(ScoreSelectors.getStreaks(state), p => p.streak.length),
        bestWeek: bestWeeks && bestWeeks.scoresAndPutters
    };
};

const PuttingRecords = connect(mapStateToProps)(PuttingRecordsView);
export default PuttingRecords;
