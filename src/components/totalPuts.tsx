import * as moment from "moment";
import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';
import CompactLineChart, { ICompactChartISeries } from './compactLineChart';
import { DateUtils } from "../utils/dateUtils";

import Widget from './widget';
import WidgetHeader from "./widgetHeader";
import * as Highcharts from "highcharts";

interface ITotalPutsPropFields {
    totalPuts: number;
    series: ICompactChartISeries[];
}

class TotalPutsView extends React.Component<ITotalPutsPropFields, {}> {

    public render() {
        const x = ["hei", "hå", "party"];
        return <Widget
            containerClass="totalPuts"
            title={{ text: "Total puts" }}
        >
            {this.props.series.map((y, i) => {
                return <span key={y.name} style={{ color: y.color }}>{y.name}</span>;
            })}
            <CompactLineChart series={this.props.series} />
        </Widget>;
        /*return <div className="widget ">
            <div className="label">
                <WidgetHeader title="Total puts" />
                <span className="value">{this.props.totalPuts}</span>
            </div>
            
        </div>;*/
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
