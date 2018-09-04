import * as highcharts from "highcharts";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter } from '../contracts/common';
import { ScoreSelectors } from "../selectors/scoreSelectors";
import * as _ from "lodash";

interface IScoreDistributionForPutter {
    putter: IPutter;
    countByPutScore: { [score: number]: number };
    scoreSum: number;
}

interface ITrendChartPropFields {
    putterScores: IScoreDistributionForPutter[];
}

class TrendChartView extends React.Component<ITrendChartPropFields, {}> {

    private container?: HTMLDivElement;
    private chart?: highcharts.ChartObject;

    public componentDidMount() {
        if (this.container) {
            this.chart = highcharts.chart(this.container, {
                credits: {
                    enabled: false
                },
                title: {
                    text: "test"
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                chart: {
                    type: "column",
                    zoomType: "x"
                },
                series: []
            });
        }

        this.syncChartWithProps();
    }

    public componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    public componentDidUpdate() {
        this.syncChartWithProps();
    }

    private syncChartWithProps() {
        if (!this.chart) {
            return;
        }

        const chartElement = this.chart;
        chartElement.update({
            xAxis: {
                categories: ["t1", "t2", "t3"]
            }
        });

        chartElement.addSeries({
            title: "s1",
            data: [1, 2, 3]
        });

        chartElement.addSeries({
            title: "s2",
            data: [3, 2, 1]
        });

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div className="widget trend-chart" ref={(element) => this.container = element || undefined} />;
    }
}

const mapStateToProps = (state: IApplicationState): ITrendChartPropFields => {
    const allPuts = ScoreSelectors.getScoresMapped(state);
    const putsByPutter = _.groupBy(allPuts, score => score.putter.id);
    const scoreDistributionForPutters = _.map(putsByPutter, (puts): IScoreDistributionForPutter => {
        const putsByScore = _.groupBy(puts, put => put.score.score);

        const what = _.reduce(putsByScore, (result, value, key) => {
            const scoreSum = _.sumBy(value, put => put.score.score);
            result[key] = scoreSum;
            return result;
        }, {} as { [score: number]: number });

        return {
            putter: puts[0].putter,
            countByPutScore: what,
            scoreSum: _.sumBy(puts, put => put.score.score)
        };
    });

    return {
        putterScores: scoreDistributionForPutters
    };
};

const TrendChart = connect(mapStateToProps)(TrendChartView);
export default TrendChart;
