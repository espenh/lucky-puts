import * as _ from "lodash";
import { IApplicationState, IRoundScore, IScoreAggregation } from "../contracts/common";
import { Continuous, DateUtils } from "../utils/dateUtils";

export class ScoreSelectors {

    public static getScoresMapped(state: IApplicationState): IRoundScore[] {
        const playerById = state.putters.puttersById;

        return state.score.scoresv2.map(score => {
            return {
                score: score,
                putter: playerById[score.putterId]
            };
        });
    }

    public static getStreaks(state: IApplicationState) {
        const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);

        const isContinuous = (previousScore: IRoundScore, currentScore: IRoundScore) => {
            // Ignore weekends
            // Ignore red days

            const previousDay = DateUtils.getDate(previousScore.score.roundDate);
            const currentDay = DateUtils.getDate(currentScore.score.roundDate);

            // We support multiple scores per day.
            if (previousScore.score.roundDate === currentScore.score.roundDate) {
                return true;
            }

            const dayRange = DateUtils.getDatesBetween(previousDay, currentDay);

            const candidateDays = dayRange.filter(day => {

                if (DateUtils.isRedDay(day)) {
                    return false;
                }

                return true;
            });

            // After removing all red days, if this is a continuous period - we should be left with only the startDay of the range.
            return candidateDays.length === 1;
        };

        const cont: { [id: string]: Continuous<IRoundScore> } = {};

        const allNonZeroScoresSorted = _.sortBy(allNonZeroScores, s => s.score.roundDate, "asc");
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
                    start: DateUtils.getDate(longestChain[0].score.roundDate),
                    scores: longestChain
                }
            };
        });

        return playersAndStreaks;
    }

    public static getPartitioned(state: IApplicationState, partition: "isoWeek" | "month" | "quarter" | "year") {
        const allNonZeroScores = ScoreSelectors.getScoresMapped(state).filter(score => score.score.score > 0);
        const scoresByPartition = _.groupBy(allNonZeroScores, s => DateUtils.getDate(s.score.roundDate).startOf(partition).valueOf());

        const allPartitions = _.map(scoresByPartition, (scoresForPartition, partitionTickAsString) => {
            const scoresAndPutters = ScoreSelectors.getBestByPlayer(scoresForPartition);
            return {
                partitionTick: parseInt(partitionTickAsString, 10),
                scoresAndPutters: scoresAndPutters,
                scoresForPartition: scoresForPartition,
                bestPutter: _.maxBy(scoresAndPutters, s => s.scoreSum) as IScoreAggregation
            };
        });

        return allPartitions;
    }

    public static getBestPartition(state: IApplicationState, partition: "isoWeek" | "month" | "quarter" | "year") {

        const allPartitions = ScoreSelectors.getPartitioned(state, partition);
        const bestPartition = _.maxBy(allPartitions, p => p.bestPutter.scoreSum);

        return bestPartition && {
            partitionTick: bestPartition.partitionTick,
            score: _.maxBy(bestPartition.scoresAndPutters, p => p.scoreSum) as IScoreAggregation
        };
    }

    public static getBestByPlayer(monthlyScores: IRoundScore[]) {
        const monthScoresByPutter = _.groupBy(monthlyScores, score => score.putter.id);
        const scoresAndPutters = _.map(monthScoresByPutter, (scoresForPutter): IScoreAggregation => {
            return {
                scoreSum: _.sumBy(scoresForPutter, s => s.score.score),
                scores: scoresForPutter,
                highestScore: _.maxBy(scoresForPutter, s => s.score.score) as IRoundScore,
                putter: scoresForPutter[0].putter
            };
        });

        return scoresAndPutters;
    }
}
