import * as _ from "lodash";
import { IApplicationState, IRoundScore } from "../contracts/common";

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
}
