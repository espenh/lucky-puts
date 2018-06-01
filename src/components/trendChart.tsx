import * as highcharts from "highcharts";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';
import { ScoreSelectors } from "../selectors/scoreSelectors";
import * as _ from "lodash";

interface ITrendChartPropFields {
    scoresPerPartition: {
        partitionTick: number,
        scoreDistributionInPartition: {
            score: number,
            sum: number
        }[]
    }[];
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
            data: [1,2,3]
        });

        chartElement.addSeries({
            title: "s2",
            data: [3,2,1]
        });

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div className="widget trend-chart" ref={(element) => this.container = element || undefined} />;
    }
}

const mapStateToProps = (state: IApplicationState): ITrendChartPropFields => {
    const partitions = ScoreSelectors.getPartitioned(state, "isoWeek");
    const scoresPerPartition = partitions.map(p => {
        const scoresByScore = _.groupBy(p.scoresForPartition, s => s.score.score);
        const scoreDistributionInPartition = _.map(scoresByScore, (scores, scoreAsString) => {
            const score = parseInt(scoreAsString, 10);
            return {
                score: score,
                sum: _.sum(scores)
            };
        });

        return {
            partitionTick: p.partitionTick,
            scoreDistributionInPartition: scoreDistributionInPartition
        };
    });

    return {
        scoresPerPartition
    };
};

const TrendChart = connect(mapStateToProps)(TrendChartView);
export default TrendChart;
