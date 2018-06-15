import { Button, Popover } from '@material-ui/core';
import { GolfCourse } from '@material-ui/icons';
import * as moment from "moment";
import * as React from 'react';
import { DayPickerSingleDateController } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';


interface INewPlayerDialog {
    handleNewRound: (dateAsUnixMs: number) => void;
    illegalDates: moment.Moment[];
}

interface INewPlayerState {
    popover: {
        isOpen: boolean;
        anchor?: HTMLElement;
    };
}

export default class NewRoundDialog extends React.Component<INewPlayerDialog, INewPlayerState> {

    public state: INewPlayerState = {
        popover: {
            isOpen: false
        }
    };

    private handleNewRound = (event: React.MouseEvent<any>) => {
        event.preventDefault();

        this.setState({
            popover: {
                isOpen: true,
                anchor: event.currentTarget
            }
        });
    }

    private handlePopoverClose = () => {
        this.setState({
            popover: {
                isOpen: false
            }
        });
    }

    private handleNewDate = (date: moment.Moment | null) => {
        if (date === null) {
            return;
        }

        this.props.handleNewRound(date.valueOf());
        this.handlePopoverClose();
    }

    private isDayBlocked = (date: moment.Moment) => {
        return this.props.illegalDates.some(d => d.isSame(date.clone().startOf("day")));
    }

    public render() {
        return <><Button
            onClick={this.handleNewRound}
            color="secondary"
            aria-label="add"
        >
            <GolfCourse />
            Add round
        </Button>
            {
                <Popover
                    open={this.state.popover.isOpen}
                    onClose={this.handlePopoverClose}
                    anchorEl={this.state.popover.anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                >
                    <DayPickerSingleDateController
                        date={moment()}
                        onDateChange={this.handleNewDate}
                        focused={this.state.popover.isOpen}
                        onFocusChange={this.handlePopoverClose}
                        isDayBlocked={this.isDayBlocked}
                    />
                </Popover>
            }
        </>;
    }
}
