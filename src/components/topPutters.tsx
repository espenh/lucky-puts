import * as _ from "lodash";
import * as highcharts from "highcharts";
import * as React from "react";
import { connect } from "react-redux";
import { IApplicationState } from "../contracts/common";
import "./topPuttersStyle.css";
import { blueGrey } from "@material-ui/core/colors";

interface ITopPuttersProps {
    everything: IApplicationState;
}

export class TopPuttersView extends React.Component<ITopPuttersProps, {}> {
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
                    type: "column"
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    column: {
                        borderWidth: 0,
                        shadow: {
                            width: 2,
                            color: blueGrey.A200
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: undefined
                    },
                    type: 'category',
                    labels: {
                        rotation: -45
                    }
                },
                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: undefined
                    },
                    labels: {
                        enabled: false
                    }
                },
                series: [
                    {
                        name: "Total points",
                        color: blueGrey.A400
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
        const putters = _.sortBy(_.values(this.props.everything.putters.puttersById), putter => putter.name);
        const allRounds = _.sortBy(this.props.everything.round.rounds, round => round.dateInUnixMsTicks);

        // Calculate score.
        const puttersAndScore = putters.map(putter => {
            const playerRounds = this.props.everything.score.scores.filter(s => s.putterId === putter.id);
            const playerScoresByRound = _.groupBy(playerRounds, pr => pr.roundId);
            return {
                putter: putter,
                score: _.sumBy(allRounds, r => {
                    const scores = playerScoresByRound[r.id];
                    return (scores && scores.length) ? scores[0].score : 0;
                })
            };
        });

        // Update series.
        const putterAndScoreAboveZero = _.sortBy(puttersAndScore.filter(putterAndScore => putterAndScore.score > 0), p => -p.score);
        const seriesData = putterAndScoreAboveZero.map(p => {
            return [p.putter.name, p.score] as [string, number];
        });

        this.chart.series[0].setData(seriesData as Highcharts.DataPoint[]);
        window.dispatchEvent(new Event('resize'));
    }

    public render() {
        return <div className="top-putters" ref={(element) => this.container = element || undefined} />;
    }
}

const mapStateToProps = (state: IApplicationState): ITopPuttersProps => {
    return {
        everything: state
    };
};

const TopPutters = connect(mapStateToProps)(TopPuttersView);
export default TopPutters;
