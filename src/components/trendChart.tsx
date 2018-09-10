import * as highcharts from "highcharts";
import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';
import { Select, MenuItem, FormControl } from "@material-ui/core";

import { IApplicationState, IPutter, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from "../selectors/scoreSelectors";
import { getPointColorOrDefault } from "../utils/globals";
import Widget from './widget';
import { DateUtils } from "../utils/dateUtils";

interface IScoreDistributionForPutter {
    putter: IPutter;
    countByPutScore: { [score: number]: number };
    scoreSum: number;
}

interface IScoresForRound {
    roundDate: number;
    puts: IRoundScore[];
}


interface ITrendChartPropFields {
    //putterScores: IScoreDistributionForPutter[];
    roundScores: IScoresForRound[];
}

class TrendChartView extends React.Component<ITrendChartPropFields, {}> {

    private container?: HTMLDivElement;
    private chart?: highcharts.ChartObject;
    private widgetRef: HTMLFormElement | null;

    public componentDidMount() {
        if (this.container) {
            this.chart = highcharts.chart(this.container, {
                credits: {
                    enabled: false
                },
                title: {
                    text: undefined
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false
                        },
                        borderWidth: 0.1,
                        groupPadding: 0.1
                    }
                },
                chart: {
                    type: "column",
                    zoomType: "xy"
                },
                series: [],
                xAxis: {
                    type: "category"
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: undefined
                    },
                    labels: {
                        enabled: false
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            opacity: 0.4,
                            fontSize: "0.6em"
                        }
                    },
                    visible: true,
                    reversedStacks: false
                }
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

        // TODO - Ideally this should incrementally change the chart, adding/removing/updating series as the data change.
        // That would give Highcharts the chance to smoothly update the chart instead of resetting the layout completely.
        const chartElement = this.chart;
        while (chartElement.series.length > 0) {
            chartElement.series[0].remove(false);
        }

        const roundsSorted = _.sortBy(this.props.roundScores, round => round.roundDate);
        roundsSorted.forEach((round, index) => {
            const sortedPuts = _.sortBy(round.puts, put => put.score.roundDate);
            const data = sortedPuts.map((put): Highcharts.DataPoint => {
                return {
                    id: put.score.id,
                    name: put.putter.name,
                    y: put.score.score,
                    color: getPointColorOrDefault(put.score.score)
                };
            });

            chartElement.addSeries({
                name: DateUtils.getDate(round.roundDate).format("LL"),
                data: data as any,
                index: index
            }, false);
        });

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    private validate = () => {
        if (this.chart) {
            const series = this.chart.series;
            console.log("party");
        }
    }

    private handleFilterChange = () => {

    }

    public render() {
        return <Widget
            containerClass="trend-chart"
            title={{ text: "Score distribution" }}
            toolbar={<>
                <form ref={(w => this.widgetRef = w)}>
                    <FormControl>
                        <Select
                            value={"allTime"}
                            onChange={this.handleFilterChange}
                            inputProps={{
                                name: 'age',
                                id: 'age-simple',
                            }}
                            MenuProps={{
                                getContentAnchorEl: (element) => this.widgetRef || element,
                                anchorOrigin: {
                                    vertical: "top",
                                    horizontal: "right",
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"latestMonth"}>Month</MenuItem>
                            <MenuItem value={"latestYear"}>Year</MenuItem>
                            <MenuItem value={"allTime"}>All time</MenuItem>
                        </Select>
                    </FormControl>
                </form>
            </>}
        >
            <div style={{ width: "100%", height: "100%" }} ref={(element) => this.container = element || undefined} />
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): ITrendChartPropFields => {
    const allPuts = ScoreSelectors.getScoresMapped(state).filter(put => put.score.score > 0);

    // TODO - Filter for range. const putsToInclude = 
    const putsByDate = _.groupBy(allPuts, put => put.score.roundDate);
    const roundStats = _.map(putsByDate, (puts, dateAsString): IScoresForRound => {
        const roundDate = parseInt(dateAsString, 10);
        return {
            roundDate,
            puts
        };
    });

    return {
        roundScores: roundStats
    };
};

const TrendChart = connect(mapStateToProps)(TrendChartView);
export default TrendChart;
