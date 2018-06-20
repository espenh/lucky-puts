import * as React from 'react';
import * as chroma from "chroma-js";
import { possiblePutPoints } from '../utils/globals';

interface IScoreBulletPropFields {
    score: number;
}

const colors = chroma.scale(["#fafa6e", "dodgerblue", "purple", "red"]).mode("lch").colors(possiblePutPoints.length);

export default class ScoreBullet extends React.Component<IScoreBulletPropFields, {}> {

    constructor(props: IScoreBulletPropFields) {
        super(props);
    }

    private getClassForScore(score: number) {
        const scoreIndex = possiblePutPoints.indexOf(score);
        if (scoreIndex < 0) {
            return "gray";
        }

        return colors[scoreIndex];
    }

    public render() {
        return <div className={"scoreBullet"} style={{ backgroundColor: this.getClassForScore(this.props.score) }} title={this.props.score.toString()} />;
    }
}
