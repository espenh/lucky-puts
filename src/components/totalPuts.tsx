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
            title={{ text: "Trend" }}
        >
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
        color: "#1eb980",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.puts] as [number, number];
        }),
        type: "column"
    };

    const scoreSeries: ICompactChartISeries = {
        name: "Sum score",
        color: "#FEC400",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.scoreSum] as [number, number];
        })
    };

    const averageSeries: ICompactChartISeries = {
        name: "Average score",
        color: "#ff6858",
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
