import * as moment from "moment";
import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';
import CompactLineChart, { ICompactChartISeries } from './compactLineChart';
import { DateUtils } from "../utils/dateUtils";
import WidgetHeader from "./widgetHeader";

interface ITotalPutsPropFields {
    totalPuts: number;
    series: ICompactChartISeries[];
}

class TotalPutsView extends React.Component<ITotalPutsPropFields, {}> {

    public render() {
        return <div className="widget totalPuts">
            <div className="label">
                <WidgetHeader title="Total puts" />
                <span className="value">{this.props.totalPuts}</span>
            </div>
            <div className="content"><CompactLineChart series={this.props.series} /></div>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): ITotalPutsPropFields => {
    const nonZeroPuts = state.score.scoresv2.filter(s => s.score > 0);
    const putsByWeek = _.groupBy(nonZeroPuts, put => {
        const putDate = DateUtils.getDate(put.roundDate);
        return putDate.startOf("month").valueOf();
    });

    const numberOfScoresPerDay = _.sortBy(_.map(putsByWeek, (puts, key) => {
        const x: [number, number] = [parseInt(key, 10), puts.length];
        return {
            monthTick: parseInt(key, 10),
            puts: puts.length,
            scoreSum: _.sumBy(puts, put => put.score)
        };
    }), score => score.monthTick);

    const countSeries: ICompactChartISeries = {
        name: "Puts",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.puts] as [number, number];
        })
    };

    const scoreSeries: ICompactChartISeries = {
        name: "Sum score",
        data: numberOfScoresPerDay.map(scores => {
            return [scores.monthTick, scores.scoreSum] as [number, number];
        })
    };

    return {
        totalPuts: nonZeroPuts.length,
        series: [scoreSeries, countSeries]
    };
};

const TotalPuts = connect(mapStateToProps)(TotalPutsView);
export default TotalPuts;
