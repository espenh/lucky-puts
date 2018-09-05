import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';

import { IApplicationState } from '../contracts/common';
import { DateUtils } from "../utils/dateUtils";
import CompactLineChart, { ICompactChartISeries } from './compactLineChart';
import Widget from './widget';

interface ITotalPutsPropFields {
    totalPuts: number;
    series: ICompactChartISeries[];
}

class TotalPutsView extends React.Component<ITotalPutsPropFields, {}> {

    public render() {
        return <Widget
            containerClass="totalPuts"
            title={{ text: "Total puts" }}
        >
            {this.props.series.map((y, i) => {
                return <span key={y.name} style={{ color: y.color }}>{y.name}</span>;
            })}
            <CompactLineChart series={this.props.series} />
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): ITotalPutsPropFields => {
    const nonZeroPuts = state.score.scoresv2.filter(s => s.score > 0);
    const putsByWeek = _.groupBy(nonZeroPuts, put => {
        const putDate = DateUtils.getDate(put.roundDate);
        return putDate.startOf("month").valueOf();
    });

    const numberOfScoresPerDay = _.sortBy(_.map(putsByWeek, (puts, key) => {
        return {
            monthTick: parseInt(key, 10),
            puts: puts.length,
            scoreSum: _.sumBy(puts, put => put.score)
        };
    }), score => score.monthTick);

    const countSeries: ICompactChartISeries = {
        name: "Puts",
        color: "#f00",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.puts] as [number, number];
        })
    };

    const scoreSeries: ICompactChartISeries = {
        name: "Sum score",
        color: "#0f0",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.scoreSum] as [number, number];
        })
    };

    const averageSeries: ICompactChartISeries = {
        name: "Average score",
        color: "#00f",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, _.round(scores.scoreSum / scores.puts, 1)] as [number, number];
        })
    };

    return {
        totalPuts: nonZeroPuts.length,
        series: [/*scoreSeries,*/ countSeries, averageSeries]
    };
};

const TotalPuts = connect(mapStateToProps)(TotalPutsView);
export default TotalPuts;
