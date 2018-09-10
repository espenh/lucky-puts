import * as React from 'react';
import { getPointColorOrDefault } from "../utils/globals";

interface IScoreBulletPropFields {
    score: number;
    size?: "small" | "large";
}

export default class ScoreBullet extends React.Component<IScoreBulletPropFields, {}> {

    constructor(props: IScoreBulletPropFields) {
        super(props);
    }

    public render() {
        return <div className={"scoreBullet " + this.props.size || ""} style={{ backgroundColor: getPointColorOrDefault(this.props.score) }} title={this.props.score.toString()}>
            {this.props.size === "large" && <span>{this.props.score}</span>}
        </div>;
    }
}
