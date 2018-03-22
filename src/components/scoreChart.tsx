import * as _ from "lodash";
import * as React from 'react';
import * as highcharts from "highcharts";
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';

import "./scoreChartStyle.css";

interface IScoreTablePropFields {
    everything: IApplicationState;
}

class ScoreChartView extends React.Component<IScoreTablePropFields, {}> {
    private container?: HTMLDivElement;
    private chart?: highcharts.ChartObject;

    public componentDidMount() {
        if (this.container) {
            this.chart = highcharts.chart(this.container, {
                credits: {
                    enabled: false
                },
                title: {
                    text: undefined
                },
                chart: {
                    type: "spline",
                    zoomType: "x"
                },
                plotOptions: {
                    series: {
                        lineWidth: 3,
                        marker: {
                            enabled: false
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top'
                },
                xAxis: {
                    type: 'datetime',
                    minTickInterval: 24 * 3600 * 1000
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: undefined

                    }
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

        const putters = _.values(this.props.everything.putters.puttersById);
        const allRounds = _.sortBy(this.props.everything.round.rounds, round => round.dateInUnixMsTicks);

        const puttersAndScore = putters.map((putter) => {
            const playerRounds = this.props.everything.score.scores.filter(s => s.putterId === putter.id);
            const playerScoresByRound = _.groupBy(playerRounds, pr => pr.roundId);
            return {
                putter: putter,
                scores: allRounds.map(round => {
                    const roundsToInclude = allRounds.filter(r => r.dateInUnixMsTicks <= round.dateInUnixMsTicks);
                    const pointsToInclude = roundsToInclude.map(r => {
                        const scores = playerScoresByRound[r.id];
                        return (scores && scores.length) ? scores[0].score : 0;
                    });
                    const sum = _.sum(pointsToInclude);

                    return [round.dateInUnixMsTicks, sum] as [number, number];
                })
            };
        });

        const putterAndScoreAboveZero = puttersAndScore.filter(putterAndScore => _.sumBy(putterAndScore.scores, s => s[1]) > 0);

        // Add any missing putter-series.
        putterAndScoreAboveZero.forEach(putterAndScore => {
            const matchingSeries = chartElement.get(putterAndScore.putter.id) as Highcharts.SeriesObject;
            if (matchingSeries === undefined) {
                chartElement.addSeries({
                    id: putterAndScore.putter.id,
                    name: putterAndScore.putter.name
                } as Highcharts.SeriesOptions, false);
            } else if (matchingSeries.name !== putterAndScore.putter.name) {
                // Player changed named - update series.
                matchingSeries.update({
                    name: putterAndScore.putter.name
                }, false);
            }
        });

        // Remove series that shouldn't be there.
        _.without(puttersAndScore, ...putterAndScoreAboveZero).forEach(putterAndScore => {
            const matchingSeries = chartElement.get(putterAndScore.putter.id) as Highcharts.SeriesObject;
            if (matchingSeries !== undefined) {
                matchingSeries.remove();
            }
        });

        // Update score.
        _.sortBy(putterAndScoreAboveZero, p => p.putter.name.toLowerCase()).forEach((putterAndScore, index) => {
            const series = chartElement.get(putterAndScore.putter.id) as Highcharts.SeriesObject;

            if (series.options.index !== index) {
                // Note reordering disables the nice animated transitions.
                series.update({ index: index }, false);
            }

            series.setData(putterAndScore.scores, false);
        });

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div
            className="score-chart"
            ref={(element) => this.container = element || undefined}
        />;
    }
}

const mapStateToProps = (state: IApplicationState): IScoreTablePropFields => {
    return {
        everything: state
    };
};


const ScoreChart = connect(mapStateToProps)(ScoreChartView);
export default ScoreChart;
