import * as _ from "lodash";
import * as React from "react";
import { IRoundScore } from "../contracts/common";
import ScoreBullet from "./scoreBullet";

export default class ScoreSumBullets extends React.Component<{ scores: IRoundScore[] }, {}> {
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
