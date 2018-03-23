import * as moment from "moment";
import * as _ from "lodash";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';
import { Table, TableBody, TableCell, TableRow } from "material-ui";

interface IMontlyPutterPropFields {
    everything: IApplicationState;
}

class MonthlyPutterView extends React.Component<IMontlyPutterPropFields, {}> {

    public syncChartWithProps() {

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

        return puttersAndScore;

        //const putterAndScoreAboveZero = puttersAndScore.filter(putterAndScore => _.sumBy(putterAndScore.scores, s => s[1]) > 0);

    }

    public render() {
        const rounds = _.orderBy(this.props.everything.round.rounds, round => round.dateInUnixMsTicks, "desc");
        const scoresByRound = _.groupBy(this.props.everything.score.scores, score => score.roundId);
        const puttersById = this.props.everything.putters.puttersById;
        const datesGrouped = _.groupBy(rounds, round => moment(round.dateInUnixMsTicks).startOf("month").valueOf());

        return <div className="monthly-putter">
            <Table>
                <TableBody>
                    {_.map(datesGrouped, (roundsForMonth, monthTick) => {
                        const month = moment(parseInt(monthTick, 10)).format("MMM");
                        const year = moment(parseInt(monthTick, 10)).format("YYYY");
                        const scores = _.filter(_.flatten(_.map(roundsForMonth, round => scoresByRound[round.id])));

                        const scoresByPlayer = _.groupBy(scores, score => score.putterId);
                        const sumScoreByPlayer = _.map(scoresByPlayer, (scoresForPlayer, putterId) => {
                            return { putter: putterId, score: _.sumBy(scoresForPlayer, score => score.score) };
                        });

                        const top3Players = _.take(_.orderBy(sumScoreByPlayer, score => score.score, "desc"), 3);

                        return <TableRow>
                            <TableCell>{month} <span style={{ opacity: 0.4, fontWeight: "bold" }}>{year}</span></TableCell>

                            {_.map(top3Players, topPlayer => {
                                const putter = puttersById[topPlayer.putter];
                                return (<TableCell className="podium-cell"><span className="name">{putter.name}</span><span className="score">{topPlayer.score}</span></TableCell>);
                            })}
                        </TableRow>;
                    })}
                </TableBody>
            </Table>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): IMontlyPutterPropFields => {
    return {
        everything: state
    };
};


const MonthlyPutter = connect(mapStateToProps)(MonthlyPutterView);
export default MonthlyPutter;
