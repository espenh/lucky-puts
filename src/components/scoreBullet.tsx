import * as React from 'react';
import { getPointColorOrDefault } from "../utils/globals";

interface IScoreBulletPropFields {
    score: number;
}

export default class ScoreBullet extends React.Component<IScoreBulletPropFields, {}> {

    constructor(props: IScoreBulletPropFields) {
        super(props);
    }

    public render() {
        return <div className={"scoreBullet"} style={{ backgroundColor: getPointColorOrDefault(this.props.score) }} title={this.props.score.toString()} />;
    }
}
