import * as _ from "lodash";
import * as React from 'react';
import * as highcharts from "highcharts";
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';

import "./scoreChartStyle.css";

interface IScoreTablePropFields {
    seriesData: [number,number];
}

export default class CompactLineChart extends React.Component<IScoreTablePropFields, {}> {
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
                    type: "spline"
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
                    enabled: false
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
                series: [
                    {
                        data:[]
                    }
                ]
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

const series = chartElement.series[0];

        

            series.setData(putterAndScore.scores, false);

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div
            className="compact-line-chart"
            ref={(element) => this.container = element || undefined}
        />;
    }
}
