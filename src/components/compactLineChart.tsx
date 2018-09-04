import * as _ from "lodash";
import * as React from 'react';
import * as highcharts from "highcharts";

import "./scoreChartStyle.css";

export interface ICompactChartISeries {
    name: string;
    data: [number, number][];
    color?: string;
}

interface IScoreTablePropFields {
    series: ICompactChartISeries[];
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
                    type: "areaspline"
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.1
                    },
                    series: {
                        lineWidth: 1.5,
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
                    visible: false
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: undefined

                    },
                    visible: false
                },
                tooltip: {
                    shared: true,
                    xDateFormat: "%b \'%y"
                },
                series: this.props.series.map(series => {
                    return {
                        id: series.name,
                        data: series.data,
                        name: series.name
                    };
                })
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

        this.props.series.forEach(series => {
            const chartSeries = chartElement.get(series.name) as highcharts.SeriesObject;
            chartSeries.setData(series.data, false);

            // Show marker for the last point.
            chartSeries.data.forEach((p, i) => {
                p.update({ marker: { enabled: i === chartSeries.data.length - 1 } }, false);
            });
        });

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
