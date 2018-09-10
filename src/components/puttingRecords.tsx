import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import * as _ from 'lodash';
import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IRoundScore, IScoreAggregation } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import ScoreBulletList from "./scoreBulletList";
import Widget from './widget';

interface IPuttingRecordsPropFields {
    mostPuts?: { count: number, putter: IPutter };
    longestStreak?: { putter: IPutter, streak: { length: number, start: moment.Moment, scores: IRoundScore[] } };
    bestWeek?: { week: moment.Moment, score: IScoreAggregation };
    bestMonth?: { month: moment.Moment, score: IScoreAggregation };
    bestQuarter?: { quarter: moment.Moment, score: IScoreAggregation };
    bestYear?: { year: moment.Moment, score: IScoreAggregation };
}

class PuttingRecordsView extends React.Component<IPuttingRecordsPropFields, {}> {

    public render() {
        return <Widget
            containerClass="records"
            title={{ text: "Records", icon: faTrophy }}
        >
            <table className="records-table">
                <tbody>
                    {this.props.mostPuts && <tr>
                        <th scope="row">Most puts</th>
                        <td className="value">{this.props.mostPuts.count}</td>
                        <td>{this.props.mostPuts.putter.name}</td>
                        <td>{}</td>
                        <td>{}</td>
                    </tr>}
                    {this.props.longestStreak && <tr>
                        <th scope="row">Longest streak</th>
                        <td className="value">{this.props.longestStreak.streak.length}</td>
                        <td>{this.props.longestStreak.putter.name}</td>
                        <td className="when">{this.props.longestStreak.streak.start.format("DD MMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.longestStreak.streak.scores} /></td>
                    </tr>}
                    {this.props.bestWeek && <tr>
                        <th scope="row">Best week</th>
                        <td className="value">{this.props.bestWeek.score.scoreSum}</td>
                        <td>{this.props.bestWeek.score.putter.name}</td>
                        <td className="when">From: {this.props.bestWeek.week.format("DD MMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.bestWeek.score.scores} /></td>
                    </tr>}
                    {this.props.bestMonth && <tr>
                        <th scope="row">Best month</th>
                        <td className="value">{this.props.bestMonth.score.scoreSum}</td>
                        <td>{this.props.bestMonth.score.putter.name}</td>
                        <td className="when">{this.props.bestMonth.month.format("MMMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.bestMonth.score.scores} /></td>
                    </tr>}
                    {this.props.bestQuarter && <tr>
                        <th scope="row">Best quarter</th>
                        <td className="value">{this.props.bestQuarter.score.scoreSum}</td>
                        <td>{this.props.bestQuarter.score.putter.name}</td>
                        <td className="when">Q{this.props.bestQuarter.quarter.quarter() + " " + this.props.bestQuarter.quarter.format("YY")}</td>
                        <td>{}</td>
                    </tr>}
                    {this.props.bestYear && <tr>
                        <th scope="row">Best year</th>
                        <td className="value">{this.props.bestYear.score.scoreSum}</td>
                        <td>{this.props.bestYear.score.putter.name}</td>
                        <td className="when">{this.props.bestYear.year.format("YYYY")}</td>
                        <td>{}</td>
                    </tr>}
                </tbody>
            </table>
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): IPuttingRecordsPropFields => {
    const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);

    const scoreByPutter = _.groupBy(allNonZeroScores, s => s.putter.id);
    const countForPlayer = _.map(scoreByPutter, (scores, putterId) => {
        return {
            putter: state.putters.puttersById[putterId],
            count: scores.length,
            latestScore: _.maxBy(scores, s => s.score.roundDate)
        };
    });

    // Best week and month.
    const bestWeek = ScoreSelectors.getBestPartition(state, "isoWeek");
    const bestMonth = ScoreSelectors.getBestPartition(state, "month");
    const bestQuarter = ScoreSelectors.getBestPartition(state, "quarter");
    const bestYear = ScoreSelectors.getBestPartition(state, "year");

    return {
        // Prefer the last putter, if equal.
        mostPuts: _.first(_.orderBy(countForPlayer, [s => s.count, s => s.latestScore], "desc")),
        longestStreak: _.maxBy(ScoreSelectors.getStreaks(state), p => p.streak.length),
        bestWeek: bestWeek && {
            week: moment(bestWeek.partitionTick),
            score: bestWeek.score
        },
        bestMonth: bestMonth && {
            month: moment(bestMonth.partitionTick),
            score: bestMonth.score
        },
        bestQuarter: bestQuarter && {
            quarter: moment(bestQuarter.partitionTick),
            score: bestQuarter.score
        },
        bestYear: bestYear && {
            year: moment(bestYear.partitionTick),
            score: bestYear.score
        }
    };
};

const PuttingRecords = connect(mapStateToProps)(PuttingRecordsView);
export default PuttingRecords;
