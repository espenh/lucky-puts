import * as highcharts from "highcharts";
import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from "../selectors/scoreSelectors";
import { getPointColorOrDefault } from "../utils/globals";
import Widget from './widget';

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
                        borderWidth: 1,
                        groupPadding: 0
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
                    //min: 0,
                    title: {
                        text: "Score"
                    }/*,
                    stackLabels: {
                        enabled: true
                    }*/
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

        console.log("syncChartWithProps");

        const chartElement = this.chart;
        chartElement.series = [];

        const roundsSorted = _.sortBy(this.props.roundScores, round => -round.roundDate);
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
                name: round.roundDate.toString(),
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

    public render() {
        return <Widget
            containerClass="trend-chart"
            title={{ text: "Score distribution" }}
            toolbar={<><button
                onClick={() => {
                    if (this.chart) {
                        this.chart.redraw();
                    }
                }}
            >RD
            </button>
            <button
                onClick={() => {
                    if (this.chart) {
                        this.chart.reflow();
                    }
                }}
            >RF
            </button>
            <button
                onClick={() => {
                    this.validate();
                }}
            >VAL
            </button>
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
