import * as React from 'react';
import * as chroma from "chroma-js";
import ScoreBullet from './scoreBullet';

interface IScoreBulletWithTextPropFields {
    score: number;
}

export default class ScoreBulletWithText extends React.Component<IScoreBulletWithTextPropFields, {}> {

    constructor(props: IScoreBulletWithTextPropFields) {
        super(props);
    }

    public render() {
        return <div className="score-bullet-with-text">
            <span style={{ pointerEvents: "none" }}>{this.props.score}</span>
            <ScoreBullet score={this.props.score} />
        </div>;
    }
}
