import * as moment from "moment";
import * as _ from "lodash";
import { IApplicationState, IRoundScore } from "../contracts/common";
import { DateUtils, Continuous } from "../utils/dateUtils";

export class ScoreSelectors {

    public static getScoresMapped(state: IApplicationState): IRoundScore[] {
        const rounds = _.keyBy(state.round.rounds, round => round.id);
        const playerById = state.putters.puttersById;

        return state.score.scores.map(score => {
            return {
                score: score,
                putter: playerById[score.putterId],
                round: rounds[score.roundId]
            };
        });
    }

    public static getStreaks(state: IApplicationState) {
        const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);

        const isContinuous = (previousScore: IRoundScore, currentScore: IRoundScore) => {
            // Ignore weekends
            // Ignore red days

            const previousDay = moment(previousScore.round.dateInUnixMsTicks);
            const currentDay = moment(currentScore.round.dateInUnixMsTicks);

            const dayRange = DateUtils.getDatesBetween(previousDay, currentDay);

            const candidateDays = dayRange.filter(day => {
                const isoWeekDay = day.isoWeekday();
                if (isoWeekDay === 6 /* saturday */ || isoWeekDay === 7 /* sunday */) {
                    return false;
                }

                // TODO - Quick 17th of may example. Move red days to a separate module. Note .month is 0-based.
                if (day.month() === 4 && day.date() === 17) {
                    return false;
                }

                return true;
            });

            // After removing all red days, if this is a continuous period - we should be left with only the startDay of the range.
            return candidateDays.length === 1;
        };

        const cont: { [id: string]: Continuous<IRoundScore> } = {};

        const allNonZeroScoresSorted = _.sortBy(allNonZeroScores, s => s.round.dateInUnixMsTicks, "asc");
        allNonZeroScoresSorted.forEach(s => {
            if (!cont.hasOwnProperty(s.putter.id)) {
                cont[s.putter.id] = new Continuous(isContinuous);
            }

            cont[s.putter.id].addOrdered(s);
        });

        const playersAndStreaks = Object.keys(cont).map(putterId => {
            const longestChain = cont[putterId].longest;
            return {
                putter: state.putters.puttersById[putterId],
                streak: longestChain && {
                    length: longestChain.length,
                    start: moment(longestChain[0].round.dateInUnixMsTicks)
                }
            };
        });

        return playersAndStreaks;
    }

    public static getBest(state: IApplicationState, partition: "isoWeek" | "month" | "quarter" | "year") {
        const roundsSorted = _.orderBy(state.round.rounds, r => r.dateInUnixMsTicks, "asc");
        const firstRound = _.first(roundsSorted);
        const lastRound = _.last(roundsSorted);

        if (!firstRound || !lastRound) {
            return undefined;
        }

        const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);

        const scoresByPartition = _.groupBy(allNonZeroScores, s => moment(s.round.dateInUnixMsTicks).startOf(partition).valueOf());

        const bestByPartition = _.map(scoresByPartition, (scoresForParition, partitionTickAsString) => {
            const scoresAndPutters = ScoreSelectors.getBestByPlayer(scoresForParition);
            return {
                partitionTick: parseInt(partitionTickAsString, 10),
                scoresAndPutters: scoresAndPutters
            };
        });

        const bestPartition = _.maxBy(bestByPartition, p => _.maxBy(p.scoresAndPutters, s => s.scoreSum));

        return bestPartition && {
            partitionTick: bestPartition.partitionTick,
            score: _.maxBy(bestPartition.scoresAndPutters, p => p.scoreSum)
        };
    }

    public static getBestByPlayer(monthlyScores: IRoundScore[]) {
        // Find the best x putters for the month.
        const monthScoresByPutter = _.groupBy(monthlyScores, score => score.putter.id);
        const scoresAndPutters = _.map(monthScoresByPutter, (scoresForPutter, putterId) => {
            return {
                scoreSum: _.sumBy(scoresForPutter, s => s.score.score),
                scores: scoresForPutter,
                highestScore: _.maxBy(scoresForPutter, s => s.score.score),
                putter: scoresForPutter[0].putter
            };
        });

        return scoresAndPutters;
    }

}
