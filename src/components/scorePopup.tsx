import * as React from 'react';
import { Popover, Button } from 'material-ui';
import { Score } from '../contracts/common';
import ScoreCell from './scoreCell';

interface IScorePopupProps {
    anchorElement: HTMLElement | undefined;
    isOpen: boolean;
    handleCancel(): void;
    handleSetScore(score: Score): void;
}

export class ScorePopup extends React.Component<IScorePopupProps, {}> {
    public render() {
        return <Popover
            open={this.props.isOpen}
            onClose={this.props.handleCancel}
            anchorEl={this.props.anchorElement}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center'
            }}
        >
            {
                [0, 1, 3, 6, 12, 24].map(score => {
                    return <Button
                        key={"score-" + score}
                        onClick={() => this.props.handleSetScore(score)}
                        className={ScoreCell.getClassForScore(score)}
                    >{score}
                    </Button>;
                })
            }

        </Popover>;
    }
}
