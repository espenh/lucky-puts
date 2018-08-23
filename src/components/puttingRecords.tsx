import * as _ from 'lodash';
import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IScoreAggregation, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import ScoreBulletList from "./scoreBulletList";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import WidgetHeader from "./widgetHeader";

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
        return <div className="widget records">
            <WidgetHeader title="Records" icon={faTrophy} />
            <table className="records-table">
                <tbody>
                    {this.props.mostPuts && <tr>
                        <td>Most puts</td>
                        <td>{this.props.mostPuts.count}</td>
                        <td>{this.props.mostPuts.putter.name}</td>
                        <td>{}</td>
                        <td>{}</td>
                    </tr>}
                    {this.props.longestStreak && <tr>
                        <td>Longest streak</td>
                        <td>{this.props.longestStreak.streak.length}</td>
                        <td>{this.props.longestStreak.putter.name}</td>
                        <td>{this.props.longestStreak.streak.start.format("DD MMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.longestStreak.streak.scores} /></td>
                    </tr>}
                    {this.props.bestWeek && <tr>
                        <td>Best week</td>
                        <td>{this.props.bestWeek.score.scoreSum}</td>
                        <td>{this.props.bestWeek.score.putter.name}</td>
                        <td>From: {this.props.bestWeek.week.format("DD MMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.bestWeek.score.scores} /></td>
                    </tr>}
                    {this.props.bestMonth && <tr>
                        <td>Best month</td>
                        <td>{this.props.bestMonth.score.scoreSum}</td>
                        <td>{this.props.bestMonth.score.putter.name}</td>
                        <td>{this.props.bestMonth.month.format("MMMM YY")}</td>
                        <td><ScoreBulletList scores={this.props.bestMonth.score.scores} /></td>
                    </tr>}
                    {this.props.bestQuarter && <tr>
                        <td>Best quarter</td>
                        <td>{this.props.bestQuarter.score.scoreSum}</td>
                        <td>{this.props.bestQuarter.score.putter.name}</td>
                        <td>Q{this.props.bestQuarter.quarter.quarter() + " " + this.props.bestQuarter.quarter.format("YY")}</td>
                        <td>{}</td>
                    </tr>}
                    {this.props.bestYear && <tr>
                        <td>Best year</td>
                        <td>{this.props.bestYear.score.scoreSum}</td>
                        <td>{this.props.bestYear.score.putter.name}</td>
                        <td>{this.props.bestYear.year.format("YYYY")}</td>
                        <td>{}</td>
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
