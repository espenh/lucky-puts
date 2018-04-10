import * as _ from 'lodash';
import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import { Continuous, DateUtils } from '../utils/dateUtils';

interface IPuttingRecordsPropFields {
    mostPuts?: { count: number, putter: IPutter };
    longestStreak?: { putter: IPutter, streak: { length: number, start: moment.Moment } };
}

const weekDays = {
    saturday: 6,
    sunday: 7
};

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

    const isContinuous = (previousScore: IRoundScore, currentScore: IRoundScore) => {
        // Ignore weekends
        // Ignore red days
        // - except where a round has been played.

        const previousDay = moment(previousScore.round.dateInUnixMsTicks);
        const currentDay = moment(currentScore.round.dateInUnixMsTicks);

        const dayRange = DateUtils.getDatesBetween(previousDay, currentDay);

        const candidateDays = dayRange.filter(day => {
            const isoWeekDay = day.isoWeekday();
            if (isoWeekDay === weekDays.saturday || isoWeekDay === weekDays.sunday) {
                return false;
            }

            // TODO - Quick example. Move red days to a separate module.
            if (day.month() === 5 && day.daysInMonth() === 17) {
                return false;
            }

            return true;
        });

        // Removing all red days, we should be left with only the startDay of the range.
        return candidateDays.length === 1;
    };

    const cont: { [id: string]: Continuous<IRoundScore> } = {};
    
    const allNonZeroScoresSorted = _.sortBy(allNonZeroScores, s=>s.round.dateInUnixMsTicks, "asc");
    allNonZeroScoresSorted.forEach(s => {
        if (!cont.hasOwnProperty(s.putter.id)) {
            cont[s.putter.id] = new Continuous(isContinuous);
        }

        cont[s.putter.id].addOrdered(s);
    });

    const playersAndStreaks = Object.keys(cont).map(putterId => {
        const longestChain = cont[putterId].longest;
        return {
            putter: state.putters.puttersById[putterId],
            streak: longestChain && {
                length: longestChain.length,
                start: moment(longestChain[0].round.dateInUnixMsTicks)
            }
        };
    });

    const longestStreak = _.maxBy(playersAndStreaks, p => p.streak.length);

    return {
        mostPuts: _.first(_.orderBy(countForPlayer, [s => s.count, s => s.latestScore], "desc")),
        longestStreak: longestStreak
    };
};

const PuttingRecords = connect(mapStateToProps)(PuttingRecordsView);
export default PuttingRecords;
