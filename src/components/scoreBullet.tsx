import * as React from 'react';
import { getPointColorOrDefault } from "../utils/globals";
import { Tooltip } from "@material-ui/core";

interface IScoreBulletPropFields {
    score: number;
    size?: "small" | "large";
    title?: string;
}

export default class ScoreBullet extends React.Component<IScoreBulletPropFields, {}> {

    public render() {
        const contents = <div
            className={"scoreBullet " + (this.props.size || "")}
            style={{ backgroundColor: getPointColorOrDefault(this.props.score) }}
        >
            {this.props.size === "large" && <span>{this.props.score}</span>}
        </div>;

        if (this.props.title) {
            return <Tooltip title={this.props.score.toString() + (this.props.title ? (" - " + this.props.title) : "")}>
                {contents}
            </Tooltip >;
        } else {
            return contents;
        }
    }
}
