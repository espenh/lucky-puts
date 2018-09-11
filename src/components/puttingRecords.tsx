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
    records: IPuttingRecordsRow[];
}

export interface IPuttingRecordsRow {
    what: string;
    value: number;
    who: IPutter;
    when?: string;
    how?: IRoundScore[];
}

class PuttingRecordsView extends React.Component<IPuttingRecordsPropFields, {}> {

    public render() {
        return <Widget
            containerClass="records"
            title={{ text: "Records", icon: faTrophy }}
        >
            <div className="records-list">
                {this.props.records.map((record, index) => {
                    return <div className="records-item" key={index}>
                        <div className="what">{record.what}</div>
                        <div className="value">{record.value}</div>
                        <div className="who">{record.who.name}</div>
                        <div className="when">{record.when}</div>
                        <div className="how">{record.how && <ScoreBulletList scores={record.how} />}</div>
                    </div>;
                })}
            </div>
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

    const records: IPuttingRecordsRow[] = [];

    const addAggregation = (what: string, thing: { partitionTick: number, score: IScoreAggregation } | undefined, dateFormatter: (date: moment.Moment) => string) => {
        if (thing) {
            records.push({
                what: what,
                value: thing.score.scoreSum,
                who: thing.score.putter,
                how: thing.score.scores,
                when: dateFormatter(moment(thing.partitionTick))
            });
        }
    };

    const mostPuts = _.first(_.orderBy(countForPlayer, [s => s.count, s => s.latestScore], "desc"));
    if (mostPuts) {
        records.push({
            what: "Most puts",
            value: mostPuts.count,
            who: mostPuts.putter
        });
    }

    const longestStreak = _.maxBy(ScoreSelectors.getStreaks(state), p => p.streak.length);
    if (longestStreak) {
        records.push({
            what: "Longest streak",
            value: longestStreak.streak.length,
            who: longestStreak.putter,
            how: longestStreak.streak.scores,
            when: longestStreak.streak.start.format("DD MMM YY")
        });
    }

    addAggregation("Best week", ScoreSelectors.getBestPartition(state, "isoWeek"), date => `From: ${date.format("DD MMM YY")}`);
    addAggregation("Best month", ScoreSelectors.getBestPartition(state, "month"), date => date.format("MMMM YY"));
    addAggregation("Best quarter", ScoreSelectors.getBestPartition(state, "quarter"), date => `Q${date.quarter()} ${date.format("YY")}`);
    addAggregation("Best year", ScoreSelectors.getBestPartition(state, "year"), date => date.format("YYYY"));

    return {
        records
    };
};

const PuttingRecords = connect(mapStateToProps)(PuttingRecordsView);
export default PuttingRecords;
