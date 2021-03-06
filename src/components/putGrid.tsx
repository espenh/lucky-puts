import * as _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { faChevronLeft, faChevronRight, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, FormControlLabel, IconButton, Popover } from '@material-ui/core';

import { addNewPutter } from '../actions/putterActions';
import { deleteScore, setScoreForRound } from '../actions/scoreActions';
import { IApplicationState, IPutterState, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import { DateUtils } from "../utils/dateUtils";
import { possiblePutPoints } from '../utils/globals';
import NewPutterDialog from "./newPutterDialog";
import ScoreSumBullets from './scoreSumBullets';
import ScoreBulletWithText from './scoreBulletWithText';

interface IPutGridPropFields {
    putters: IPutterState;
    scores: IRoundScore[];
}

interface IPutGridPropActions {
    addPutter(newPutterName: string): void;
    setScore(roundDate: number, putterId: string, score: number): void;
    deleteScore(scoreId: string): void;
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
        data?: {
            roundDate: number,
            putterId: string
        }
    };
    showRedDays: boolean;
    showNewPutterDialog: boolean;
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
                currentDate: moment().startOf("month")
            },
            mouseOver: {
                date: undefined
            },
            scorePopover: {
                isOpen: false,
                anchor: undefined,
                data: undefined
            },
            showRedDays: false,
            showNewPutterDialog: false
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

    private previous = () => {
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

    private handleMouseOver = (event: React.MouseEvent<HTMLTableCellElement>) => {
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
                    data: {
                        putterId,
                        roundDate
                    }
                }
            });
        };
    }

    public handleScorePopoverDeselect = () => {
        this.setState({
            scorePopover: {
                isOpen: false,
                anchor: undefined,
                data: undefined
            }
        });
    }

    public handleSetScore = (roundDate: number, putterId: string, score: number | undefined) => {
        this.props.setScore(roundDate, putterId, score || 0);
        this.handleScorePopoverDeselect();
    }

    public hideNewPutterDialog = () => {
        this.setState({
            showNewPutterDialog: false
        });
    }

    public showNewPutterDialog = () => {
        this.setState({
            showNewPutterDialog: true
        });
    }

    public handleNewPutter = (newPutterName: string) => {
        this.props.addPutter(newPutterName);
        this.hideNewPutterDialog();
    }

    public render() {
        const title = this.state.partition.currentDate.format(this.state.partition.titleFormat);

        const putters = _.values(this.props.putters.puttersById);
        const puttersSorted = _.orderBy(putters, p => p.name, "asc");
        const fromDate = this.state.partition.currentDate;
        const toDate = fromDate.clone().add(1, this.state.partition.partition);
        let dates = DateUtils.getDatesBetween(fromDate, toDate);
        const tickToHighlight = this.state.mouseOver.date;

        const scoresBy = _.groupBy(this.props.scores, score => {
            const key = [score.putter.id, score.score.roundDate].join("|");
            return key;
        });

        if (!this.state.showRedDays) {
            // Remove red days, except the ones with scores.
            const datesWithScores = new Set(_.uniq(this.props.scores.map(s => s.score.roundDate)));
            dates = _.filter(dates, date => {
                const dateAsNumber = DateUtils.getDateAsNumber(date);
                if (datesWithScores.has(dateAsNumber)) {
                    return true;
                }

                return !DateUtils.isRedDay(date);
            });
        }

        const getScoreForPlayer = (putterId: string, roundTick: number) => {
            const key = [putterId, roundTick].join("|");
            if (!scoresBy.hasOwnProperty(key)) {
                return undefined;
            }

            return scoresBy[key];
        };

        const popoverData = this.state.scorePopover.data;
        const existingScoresForPopup = (popoverData && getScoreForPlayer(popoverData.putterId, popoverData.roundDate)) || [];
        const popoverPutter = popoverData && this.props.putters.puttersById[popoverData.putterId];
        const hasExistingScores = existingScoresForPopup.length > 0;

        return < div className="grid-container" >

            <Button onClick={this.showNewPutterDialog} color="primary" aria-label="add">
                <FontAwesomeIcon className="fa-margin-right" icon={faUser} />
                Add player
            </Button>

            <table className="put-grid">
                <thead>
                    <tr>
                        <th className="month">
                            <IconButton onClick={this.previous}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </IconButton>

                            <span className="put-calendar-header">{title}</span>

                            <IconButton onClick={this.next}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </IconButton>
                        </th>
                        {dates.map(date => {
                            const roundDate = parseInt(date.format("YYYYMMDD"), 10);
                            const classes = ["head-day-cell"];

                            if (DateUtils.isRedDay(date)) {
                                classes.push("red-day");
                            }

                            if (date.isSame(moment(), "day")) {
                                classes.push("today");
                            }

                            if (tickToHighlight === roundDate) {
                                classes.push("crosshair");
                            }

                            return <th {...{ tick: roundDate }} className={classes.join(" ")} key={roundDate}>{date.format("DD")}</th>;
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

                                return <td onMouseEnter={this.handleMouseOver} onClick={this.createClickHandler(roundDate, putter.id)} key={date.valueOf()} {...{ tick: roundDate }} className={crosshairClass}>
                                    <div className={"score-cell"}>
                                        {scores !== undefined ? <ScoreSumBullets scores={scores} /> : <></>}
                                    </div>
                                </td>;
                            })}
                        </tr>;
                    })}
                </tbody>
            </table>
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={this.state.showRedDays}
                            onChange={() => this.setState({ showRedDays: !this.state.showRedDays })}
                            color="primary"
                        />
                    }
                    label="Show red days"
                />
            </div>
            <Popover
                open={this.state.scorePopover.isOpen}
                onClose={this.handleScorePopoverDeselect}
                anchorEl={this.state.scorePopover.anchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
            >
                {popoverData !== undefined ? <>
                    <div className="grid-score-popup">
                        <span><h3>{DateUtils.getFriendlyRelativeDate(DateUtils.getDate(popoverData.roundDate))}</h3>
                            <p>{popoverPutter && popoverPutter.name}</p></span>
                        {hasExistingScores && <h4>Existing puts</h4>}
                        <div style={{ display: "flex" }}>
                            {existingScoresForPopup.map(score => {
                                return <div key={score.score.id}>
                                    <ScoreBulletWithText score={score.score.score} />
                                    <IconButton aria-label="Delete" onClick={() => this.props.deleteScore(score.score.id)}>
                                        <FontAwesomeIcon className="fa-margin-right" icon={faTrash} />
                                    </IconButton>
                                </div>;
                            })}
                        </div>

                        {
                            /* Show score picker for registering new scores */
                            hasExistingScores && <h4>Add another put</h4>
                        }

                        <div className="put-point-buttons">
                            {
                                [0].concat(possiblePutPoints).map(score => {
                                    return <Button
                                        key={"score-" + score}
                                        onClick={() => {
                                            const { roundDate, putterId } = popoverData;
                                            if (roundDate && putterId) {
                                                this.handleSetScore(roundDate, putterId, score);
                                            }
                                        }}
                                        className={PutGridView.getClassForScore(score)}
                                    ><ScoreBulletWithText score={score} />
                                    </Button>;
                                })
                            }
                        </div>

                    </div></> : <span />}

            </Popover>
            <NewPutterDialog
                isOpen={this.state.showNewPutterDialog}
                handleCancel={this.hideNewPutterDialog}
                handleNewPutter={this.handleNewPutter}
            />
        </div >;
    }

    public static getClassForScore(score: number | undefined): string {
        if (score === undefined) {
            return "";
        }

        if (score >= 24) {
            return "score-extreme";
        }

        if (score >= 12) {
            return "score-high";
        }

        if (score >= 3) {
            return "score-medium";
        }

        if (score >= 1) {
            return "score-low";
        }

        if (score === 0) {
            return "score-donut";
        }

        return "";
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<IApplicationState, {}, AnyAction>): IPutGridPropActions => {
    // TODO - Use dispatch...
    return {
        addPutter: (newPutterName: string) => {
            addNewPutter(newPutterName);
        },
        setScore: (roundDate: number, putterId: string, score: number) => {
            setScoreForRound(roundDate, putterId, score, moment().valueOf());
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
