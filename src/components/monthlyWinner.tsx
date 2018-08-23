import * as _ from 'lodash';
import * as moment from "moment";
import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IPutter, IRoundScore } from '../contracts/common';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import ScoreBulletList from "./scoreBulletList";
import { DateUtils } from '../utils/dateUtils';
import { Button, IconButton } from "@material-ui/core";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from "@fortawesome/free-solid-svg-icons";
import Widget from './widget';

interface IMonthlyWinnerPropFields {
    bestPuttersMonthly: IScoreGrouping[];
}

interface IScoreGrouping {
    tick: number;
    bestPutters: {
        putter: IPutter,
        scoreSum: number,
        scores: IRoundScore[]
    }[];
}

interface IMonthlyWinnerState {
    showPodium: boolean;
}

class MonthlyWinnerView extends React.Component<IMonthlyWinnerPropFields, IMonthlyWinnerState> {
    public state: IMonthlyWinnerState = {
        showPodium: false
    };

    public togglePodium = () => {
        const currentState = this.state;
        this.setState({
            showPodium: !currentState.showPodium
        });
    }

    public render() {
        const sortedScores = _.orderBy(this.props.bestPuttersMonthly, s => s.tick, "desc");
        const currentMonthTick = moment().startOf("month").valueOf();

        return <Widget
            containerClass="monthlyWinners"
            title={{ text: "Monthly winners" }}
            toolbar={<IconButton onClick={this.togglePodium}>
                <FontAwesomeIcon icon={this.state.showPodium ? faCompress : faExpand} />
            </IconButton>}
        >
            {sortedScores.map(monthAndPutters => {
                const scoreMonth = moment(monthAndPutters.tick);
                const monthName = scoreMonth.format("MMM YY");
                const isCurrent = currentMonthTick === monthAndPutters.tick;
                const putterScores = this.state.showPodium ? monthAndPutters.bestPutters : _.take(monthAndPutters.bestPutters, 1);

                return <div className="monthly-winner-month-container" key={monthName}>
                    <div className="header"><span className={isCurrent ? "ongoing" : ""}>{monthName}</span></div>
                    {putterScores.map((putterAndScore, index) => {
                        const classes = {
                            0: "gold",
                            1: "silver",
                            2: "bronze"
                        };

                        return <div key={putterAndScore.putter.id} className={"podium " + classes[index]}>
                            <div className="name">{putterAndScore.putter.name}</div>
                            <div className="scoreSum">{putterAndScore.scoreSum}</div>
                            <div className="scores">
                                <ScoreBulletList scores={putterAndScore.scores} />
                            </div>
                        </div>;
                    })}
                </div>;
            })}
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): IMonthlyWinnerPropFields => {
    const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);
    const scoresByMonth = _.groupBy(allNonZeroScores, score => DateUtils.getDate(score.score.roundDate).startOf("month").valueOf());
    const bestPutterByMonth = _.map(scoresByMonth, (monthlyScores, tickAsString): IScoreGrouping => {
        const monthTick = parseInt(tickAsString, 10);

        // Find the best x putters for the month.
        const scoresAndPutters = ScoreSelectors.getBestByPlayer(monthlyScores);

        // Sort by score. If equal, take whoever has the longest put.
        // TODO - What if multiple putters have the longest put. Sort by count?
        const bestPutters = _.take(_.orderBy(scoresAndPutters, [s => s.scoreSum, s => s.highestScore], "desc"), 3);

        return {
            tick: monthTick,
            bestPutters
        };
    });

    return {
        bestPuttersMonthly: bestPutterByMonth
    };
};

const MonthlyWinner = connect(mapStateToProps)(MonthlyWinnerView);
export default MonthlyWinner;
