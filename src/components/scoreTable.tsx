import * as moment from "moment";
import * as _ from "lodash";
import * as React from 'react';

import { connect, Dispatch } from 'react-redux';
import { IApplicationState, Score } from '../contracts/common';
import { addNewPutter } from '../actions/putterActions';
import { addNewRound } from "../actions/roundActions";
import { setScoreForRound } from "../actions/scoreActions";
import NewPutterDialog from "./newPutterDialog";
import { ScorePopup } from "./scorePopup";
import NewRoundDialog from "./newRoundDialog";
import ScoreCell from "./scoreCell";
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Button } from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

interface IScoreTablePropFields {
    everything: IApplicationState;
}

interface IScoreTablePropActions {
    addPutter(newPutterName: string): void;
    addRound(utcDateInUnixMs: number): void;
    setScore(roundId: string, putterId: string, score: Score): void;
}

type ScoreTableProps = IScoreTablePropFields & IScoreTablePropActions;

interface IScoreTableState {
    scorePopover: {
        isOpen: boolean,
        anchor: HTMLElement | undefined,
        roundId?: string,
        putterId?: string
    };
    newPutterDialog: {
        isOpen: boolean
    };
}

class ScoreTableView extends React.Component<ScoreTableProps, IScoreTableState> {

    public state: IScoreTableState = {
        scorePopover: {
            isOpen: false,
            anchor: undefined,
            roundId: undefined,
            putterId: undefined
        },
        newPutterDialog: {
            isOpen: false
        }
    };

    public createClickHandler = (roundId: string, putterId: string) => {
        // Wrap the round and putter id in a closure used by the score click handler.
        return (event: React.MouseEvent<any>) => {
            this.setState({
                scorePopover: {
                    isOpen: true,
                    anchor: event.currentTarget,
                    roundId: roundId,
                    putterId: putterId
                }
            });
        };
    }

    public handleScorePopoverDeselect = () => {
        this.setState({
            scorePopover: {
                isOpen: false,
                anchor: undefined,
                roundId: undefined,
                putterId: undefined
            }
        });
    }

    public hideNewPutterDialog = () => {
        this.setState({
            newPutterDialog: {
                isOpen: false
            }
        });
    }

    public showNewPutterDialog = () => {
        this.setState({
            newPutterDialog: {
                isOpen: true
            }
        });
    }

    public handleSetScore = (roundId: string, putterId: string, score: Score) => {
        this.props.setScore(roundId, putterId, score);
        this.handleScorePopoverDeselect();
    }

    public handleNewPutter = (newPutterName: string) => {
        this.props.addPutter(newPutterName);
        this.hideNewPutterDialog();
    }

    public handleNewRound = (dateAsUnixMs: number) => {
        this.props.addRound(dateAsUnixMs);
    }

    public render() {
        const rounds = _.sortBy(_.values(this.props.everything.round.rounds), round => round.dateInUnixMsTicks);
        const putters = _.sortBy(_.values(this.props.everything.putters.puttersById), putter => putter.name.toLowerCase());
        const days = this.props.everything.round.rounds.map(r => moment(r.dateInUnixMsTicks).startOf('day'));

        return <Paper className="score-table" style={{ overflow: "auto" }}>
            <Button onClick={this.showNewPutterDialog} color="primary" aria-label="add">
                <Person />
                Add player
            </Button>
            <NewRoundDialog handleNewRound={this.handleNewRound} illegalDates={days} />
            <div style={{ display: "flex" }}>
                <Table style={{ width: "250px" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Putter</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map(putters, putter => {
                            return (
                                <TableRow key={putter.id} className="score-row">
                                    <TableCell>{putter.name}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <div style={{ width: "calc(100% - 250px)", overflowX: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {_.map(rounds, round => {
                                    return <TableCell key={round.id} className="score-header">{moment(round.dateInUnixMsTicks).format("MMM Do")}</TableCell>;
                                })}
                                <TableCell numeric={true}>Sum</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {_.map(putters, putter => {
                                const scoresForPutter = this.props.everything.score.scores.filter(s => s.putterId === putter.id);
                                const sum = _.sumBy(scoresForPutter, score => score.score || 0);
                                return (
                                    <TableRow key={putter.id} className="score-row">
                                        {_.map(rounds, round => {
                                            const score = scoresForPutter.find(s => s.roundId === round.id);
                                            return <ScoreCell
                                                key={round.id}
                                                onClick={this.createClickHandler(round.id, putter.id)}
                                                score={score ? score.score : undefined}
                                            />;
                                        })}
                                        <TableCell className="score-sum" numeric={true}>{sum}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <div />
                </div>
            </div>
            <ScorePopup
                isOpen={this.state.scorePopover.isOpen}
                handleCancel={this.handleScorePopoverDeselect}
                handleSetScore={(score: Score) => {
                    if (this.state.scorePopover.roundId && this.state.scorePopover.putterId) {
                        this.handleSetScore(this.state.scorePopover.roundId, this.state.scorePopover.putterId, score);
                    }
                }}
                anchorElement={this.state.scorePopover.anchor}
            />
            <NewPutterDialog
                isOpen={this.state.newPutterDialog.isOpen}
                handleCancel={this.hideNewPutterDialog}
                handleNewPutter={this.handleNewPutter}
            />
        </Paper >;
    }
}

const mapStateToProps = (state: IApplicationState): IScoreTablePropFields => {
    return {
        everything: state
    };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<IApplicationState, {}, AnyAction>): IScoreTablePropActions => {
    return {
        addPutter: (newPutterName: string) => {
            addNewPutter(newPutterName);
        },
        addRound: (utcDateInUnixMs: number) => {
            addNewRound(utcDateInUnixMs);
        },
        setScore: (roundId: string, putterId: string, score: Score) => {
            setScoreForRound(roundId, putterId, score);
        }
    };
};

const ScoreTable = connect(mapStateToProps, mapDispatchToProps)(ScoreTableView);
export default ScoreTable;
