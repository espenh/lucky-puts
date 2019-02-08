import * as _ from "lodash";
import * as React from 'react';
import * as highcharts from "highcharts";

export interface ICompactChartISeries {
    name: string;
    data: [number, number][];
    color: string;
    type?: "line" | "column";
}

interface IScoreTablePropFields {
    series: ICompactChartISeries[];
}

export default class CompactLineChart extends React.Component<IScoreTablePropFields, {}> {
    private container?: HTMLDivElement;
    private chart?: highcharts.Chart;

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
                    enabled: true,
                    floating: true,
                    verticalAlign: "top",
                    align: "right",
                    itemStyle: {
                        fontWeight: "normal",
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "0.9em"
                    }
                },
                xAxis: {
                    type: 'datetime',
                    visible: true
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: undefined

                    },
                    visible: true
                },
                tooltip: {
                    shared: true,
                    xDateFormat: "%b \'%y"
                },
                // Cheating with "any" here as it was tricky to make the types flow nicely when
                // supporting different type of charts (with possibly different data structures)
                series: this.props.series.map((series): any => {
                    return {
                        id: series.name,
                        data: series.data,
                        name: series.name,
                        type: series.type,
                        color: series.color
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
            const chartSeries = chartElement.get(series.name) as highcharts.Series;
            chartSeries.setData(series.data, false);

            // Show marker for the last point.
            if (chartSeries.type !== "column") {
                chartSeries.data.forEach((p, i) => {
                    p.update({ marker: { enabled: i === chartSeries.data.length - 1 } }, false);
                });
            }
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
