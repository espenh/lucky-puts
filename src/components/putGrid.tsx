import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { IApplicationState, IRoundScore, IPutterState, IPutterScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import { DateUtils } from "../utils/dateUtils";
import { Dictionary } from "lodash";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

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

    public render() {
        const title = this.state.partition.currentDate.format(this.state.partition.titleFormat);

        const putters = _.values(this.props.putters.puttersById);
        const puttersSorted = _.orderBy(putters, p => p.name, "asc");
        const fromDate = this.state.partition.currentDate;
        const toDate = fromDate.clone().add(1, this.state.partition.partition);
        const dates = DateUtils.getDatesBetween(fromDate, toDate);
        const tickToHighlight = this.state.mouseOver.date;

        const scoresBy: Dictionary<IPutterScore> = _.fromPairs(_.map(this.props.scores, score => {
            const partitionedDate = moment(score.round.dateInUnixMsTicks).startOf("day");
            const key = [score.putter.id, partitionedDate.valueOf()].join("|");
            return [key, score.score];
        }));

        const getScoreForPlayer = (putterId: string, roundTick: number) => {
            const key = [putterId, roundTick].join("|");
            if (!scoresBy.hasOwnProperty(key)) {
                return undefined;
            }

            return scoresBy[key].score;
        };

        const rows = puttersSorted.map((putter, index) => {
            return {
                key: index.toString(),
                putterName: putter.name,
                putterId: putter.id,
                scores: dates.map(date => {
                    return getScoreForPlayer(putter.id, date.valueOf());
                })
            };
        });

        const columns = [
            {
                title: "Name",
                dataIndex: "putterName",
                key: "putterName"
            }
        ];

        let Tablex: any;

        return < div className="grid-container" >
            <h3>{title}</h3>
            <Button onClick={this.prevous}>Previous</Button>
            <button onClick={this.next}>Next</button>
            <br />
            <Table className="put-grid" onMouseOver={this.handleMouseOver}>
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {/* Putter name */}
                        </TableCell>
                        {dates.map(d => {
                            return <TableCell key={d.valueOf()}>{d.format("DD  ")}</TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {puttersSorted.map(putter => {
                        return <TableRow key={putter.id}>
                            <TableCell component="th" scope="row">{putter.name}</TableCell>
                            {dates.map(date => {
                                const dateTick = date.valueOf();
                                const highlight = tickToHighlight === dateTick;
                                return <TableCell {...{tick: dateTick}} className={highlight ? "crosshair": ""} key={date.valueOf()}>{getScoreForPlayer(putter.id, date.valueOf())}</TableCell>;
                            })}
                        </TableRow>;
                    })}

                </TableBody>
            </Table>
        </div >;
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
