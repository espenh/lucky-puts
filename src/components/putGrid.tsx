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

interface IPutGridPropFields {
    putters: IPutterState;
    scores: IRoundScore[];
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

class PutGridView extends React.Component<IPutGridPropFields, IPutGridState> {
    public state: IPutGridState;

    constructor(props: IPutGridPropFields) {
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

    public handleSetScore = (roundId: string, putterId: string, score: number | undefined) => {
        //this.props.setScore(roundId, putterId, score);
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
            const partitionedDate = ScoreSelectors.getDate(score.score.roundDate).startOf("day");
            const key = [score.putter.id, partitionedDate.valueOf()].join("|");
            return [key, score.score];
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
                            return <th {...{ tick: dateTick }} className={"head-day-cell" + (highlight ? " crosshair" : "")} key={date.valueOf()}>{date.format("DD")}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {puttersSorted.map(putter => {
                        return <tr key={putter.id}>
                            <th scope="row">{putter.name}</th>
                            {dates.map(date => {
                                const dateTick = date.valueOf();
                                const highlight = tickToHighlight === dateTick;
                                const scores = getScoreForPlayer(putter.id, date.valueOf());
                                const roundDate = parseInt(date.format("YYYYMMDD"), 10);
                                const crosshairClass = highlight ? "crosshair" : "";
                                //return <td {...{ tick: dateTick }} className={} key={date.valueOf()}>{getScoreForPlayer(putter.id, date.valueOf())}</td>;
                                return <td key={date.valueOf()} {...{ tick: dateTick }} className={crosshairClass}>
                                    <div onClick={this.createClickHandler(roundDate, putter.id)} className={"score-cell"}>
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
                    /*if (this.state.scorePopover.roundId && this.state.scorePopover.putterId) {
                        this.handleSetScore(this.state.scorePopover.roundId, this.state.scorePopover.putterId, score);
                    }*/
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
            {this.props.scores.map((score, index) => <ScoreBullet key={index} score={score.score.score} />)}
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): IPutGridPropFields => {
    return {
        putters: state.putters,
        scores: ScoreSelectors.getScoresMapped(state)
    };
};

const PutGrid = connect(mapStateToProps)(PutGridView);
export default PutGrid;
