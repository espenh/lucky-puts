import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { IApplicationState, IRoundScore, IPutterState, IPutterScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import { DateUtils } from "../utils/dateUtils";
import { Dictionary } from "lodash";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import ScoreCell from './scoreCell';
import { ScorePopup } from './scorePopup';
import ScoreBullet from './scoreBullet';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { setScoreForRoundV2, deleteScore } from '../actions/scoreActions';
import { addNewPutter } from '../actions/putterActions';

interface IPutGridPropFields {
    putters: IPutterState;
    scores: IRoundScore[];
}

interface IPutGridPropActions {
    addPutter(newPutterName: string): void;
    setScore(roundDate: number, putterId: string, score: number): void;
}

interface IPutGridState {
    partition: {
        titleFormat: string,
        partition: moment.unitOfTime.DurationAs;
        currentDate: moment.Moment
    };
    mouseOver: {
        date: number | undefined;
    };
    scorePopover: {
        isOpen: boolean,
        anchor: HTMLElement | undefined,
        roundDate?: number,
        putterId?: string
    };
}

type PutGridProps = IPutGridPropFields & IPutGridPropActions;

class PutGridView extends React.Component<PutGridProps, IPutGridState> {
    public state: IPutGridState;

    constructor(props: PutGridProps) {
        super(props);

        this.state = {
            partition: {
                titleFormat: "MMM",
                partition: "month",
                currentDate: moment()
            },
            mouseOver: {
                date: undefined
            },
            scorePopover: {
                isOpen: false,
                anchor: undefined,
                roundDate: undefined,
                putterId: undefined
            }
        };
    }

    private next = () => {
        const nextDate = this.state.partition.currentDate.clone()
            .add(1, this.state.partition.partition)
            .startOf(this.state.partition.partition);

        this.setState({
            partition: {
                currentDate: nextDate,
                partition: this.state.partition.partition,
                titleFormat: this.state.partition.titleFormat
            }
        });
    }

    private prevous = () => {
        const previousDate = this.state.partition.currentDate.clone()
            .subtract(1, this.state.partition.partition)
            .startOf(this.state.partition.partition);

        this.setState({
            partition: {
                currentDate: previousDate,
                partition: this.state.partition.partition,
                titleFormat: this.state.partition.titleFormat
            }
        });
    }

    private handleMouseOver = (event: React.MouseEvent<HTMLTableElement>) => {
        const target = event.target as HTMLTableCellElement;
        if (!target.parentNode) {
            // Some sort of typeguard.
            return;
        }

        const attribute = target.attributes.getNamedItem("tick");
        if (attribute === null) {
            // Clear
        } else {
            const tick = parseInt(attribute.value, 10);
            this.setState({
                mouseOver: {
                    date: tick
                }
            });
        }
    }

    public createClickHandler = (roundDate: number, putterId: string) => {
        // Wrap the round and putter id in a closure used by the score click handler.
        return (event: React.MouseEvent<any>) => {
            this.setState({
                scorePopover: {
                    isOpen: true,
                    anchor: event.currentTarget,
                    roundDate: roundDate,
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
                roundDate: undefined,
                putterId: undefined
            }
        });
    }

    public handleSetScore = (roundDate: number, putterId: string, score: number | undefined) => {
        this.props.setScore(roundDate, putterId, score || 0);
        this.handleScorePopoverDeselect();
    }

    public render() {
        const title = this.state.partition.currentDate.format(this.state.partition.titleFormat);

        const putters = _.values(this.props.putters.puttersById);
        const puttersSorted = _.orderBy(putters, p => p.name, "asc");
        const fromDate = this.state.partition.currentDate;
        const toDate = fromDate.clone().add(1, this.state.partition.partition);
        const dates = DateUtils.getDatesBetween(fromDate, toDate);
        const tickToHighlight = this.state.mouseOver.date;

        const scoresBy = _.groupBy(this.props.scores, score => {
            const key = [score.putter.id, score.score.roundDate].join("|");
            return key;
        });

        const getScoreForPlayer = (putterId: string, roundTick: number) => {
            const key = [putterId, roundTick].join("|");
            if (!scoresBy.hasOwnProperty(key)) {
                return undefined;
            }

            return scoresBy[key];
        };

        return < div className="grid-container" >
            <h3>{title}</h3>
            <Button onClick={this.prevous}>Previous</Button>
            <button onClick={this.next}>Next</button>
            <br />
            <table className="put-grid" onMouseOver={this.handleMouseOver}>
                <thead>
                    <tr>
                        <th>
                            {/* Putter name */}
                        </th>
                        {dates.map(date => {
                            const dateTick = date.valueOf();
                            const highlight = tickToHighlight === dateTick;
                            const roundDate = parseInt(date.format("YYYYMMDD"), 10);
                            return <th {...{ tick: roundDate }} className={"head-day-cell" + (highlight ? " crosshair" : "")} key={roundDate}>{date.format("DD")}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {puttersSorted.map(putter => {
                        return <tr key={putter.id}>
                            <th scope="row">{putter.name}</th>
                            {dates.map(date => {
                                const roundDate = parseInt(date.format("YYYYMMDD"), 10);
                                const highlight = tickToHighlight === roundDate;
                                const scores = getScoreForPlayer(putter.id, roundDate);
                                const crosshairClass = highlight ? "crosshair" : "";
                                //return <td {...{ tick: dateTick }} className={} key={date.valueOf()}>{getScoreForPlayer(putter.id, date.valueOf())}</td>;
                                return <td onClick={this.createClickHandler(roundDate, putter.id)} key={date.valueOf()} {...{ tick: roundDate }} className={crosshairClass}>
                                    <div className={"score-cell"}>
                                        {scores !== undefined ? <ScoreSum scores={scores} /> : <></>}
                                    </div>
                                </td>;

                                /*return <ScoreCell
                                            className={highlight ? "crosshair" : ""}
                                            key={dateTick}
                                            onClick={this.createClickHandler(roundDate, putter.id)}
                                            score={score}
                                        />;*/
                            })}
                        </tr>;
                    })}
                </tbody>
            </table>
            <ScorePopup
                isOpen={this.state.scorePopover.isOpen}
                handleCancel={this.handleScorePopoverDeselect}
                handleSetScore={(score: number | undefined) => {
                    if (this.state.scorePopover.roundDate && this.state.scorePopover.putterId) {
                        this.handleSetScore(this.state.scorePopover.roundDate, this.state.scorePopover.putterId, score);
                    }
                }}
                anchorElement={this.state.scorePopover.anchor}
            />
        </div >;
    }
}

class ScoreSum extends React.Component<{ scores: IRoundScore[] }, {}> {


    public render() {
        const sum = _.sumBy(this.props.scores, score => score.score.score);
        return <div>
            <span>{sum}</span>
            <div className="score-bullet-flow">
                {this.props.scores.map((score, index) => <ScoreBullet key={index} score={score.score.score} />)}
            </div>
        </div>;
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<IApplicationState, {}, AnyAction>): IPutGridPropActions => {
    // TODO - Use dispatch...
    return {
        addPutter: (newPutterName: string) => {
            addNewPutter(newPutterName);
        },
        setScore: (roundDate: number, putterId: string, score: number) => {
            setScoreForRoundV2(roundDate, putterId, score, moment().valueOf());
        },
        deleteScore: (scoreId: string) => {
            deleteScore(scoreId);
        }
    };
};

const mapStateToProps = (state: IApplicationState): IPutGridPropFields => {
    return {
        putters: state.putters,
        scores: ScoreSelectors.getScoresMapped(state)
    };
};

const PutGrid = connect(mapStateToProps, mapDispatchToProps)(PutGridView);
export default PutGrid;
