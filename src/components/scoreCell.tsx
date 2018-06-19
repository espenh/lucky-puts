import * as React from 'react';
import { TableCell } from '@material-ui/core';
import { Score } from '../contracts/common';

interface IScoreCellProps {
    className?: string;
    onClick(event: React.MouseEvent<any>): void;
    score: Score | undefined;
}

export default class ScoreCell extends React.Component<IScoreCellProps, {}> {
    public static getClassForScore(score: Score | undefined): string {
        if (score === undefined) {
            return "";
        }

        if (score >= 24) {
            return "score-extreme";
        }

        if (score >= 12) {
            return "score-high";
        }

        if (score >= 3) {
            return "score-medium";
        }

        if (score >= 1) {
            return "score-low";
        }

        if (score === 0) {
            return "score-donut";
        }

        return "";
    }

    public render() {
        return <td onClick={this.props.onClick} className={this.props.className + " score-cell " + ScoreCell.getClassForScore(this.props.score)}>
            {this.props.score}
        </td>;
    }
}
