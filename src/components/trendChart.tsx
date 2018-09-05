import * as highcharts from "highcharts";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from "../selectors/scoreSelectors";
import * as _ from "lodash";
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
                series: [],
                xAxis: {
                    type: "categories"
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

        const chartElement = this.chart;
        const roundsSorted = _.sortBy(this.props.roundScores, round => round.roundDate);
        roundsSorted.forEach(round => {
            const data = round.puts.map(put => {
                return {
                    x: put.putter.name,
                    y: put.score.score
                };
            });

            chartElement.addSeries({
                name: round.roundDate.toString(),
                data: data as any
            }, false);
        });
        /*chartElement.update({
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
        });*/

        chartElement.redraw();
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div className="widget trend-chart" ref={(element) => this.container = element || undefined} />;
    }
}

const mapStateToProps = (state: IApplicationState): ITrendChartPropFields => {
    const allPuts = ScoreSelectors.getScoresMapped(state);
    /*const putsByPutter = _.groupBy(allPuts, score => score.putter.id);
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
    });*/

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
