import 'react-dates/initialize';
import * as moment from "moment";
import * as React from 'react';
import { Button, Popover } from 'material-ui';
import { DayPickerSingleDateController } from 'react-dates';
import GolfIcon from 'material-ui-icons/GolfCourse';

import 'react-dates/lib/css/_datepicker.css';

interface INewPlayerDialog {
    handleNewRound: (dateAsUnixMs: number) => void;
    illegalDates: moment.Moment[];
}

interface INewPlayerState {
    popover: {
        isOpen: boolean;
    };
}

export default class NewRoundDialog extends React.Component<INewPlayerDialog, INewPlayerState> {

    private button: HTMLDivElement | null;

    public state: INewPlayerState = {
        popover: {
            isOpen: false
        }
    };

    private handleNewRound = () => {
        this.setState({
            popover: {
                isOpen: true
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

    private handleNewDate = (date: moment.Moment) => {
        this.props.handleNewRound(date.valueOf());
        this.handlePopoverClose();
    }

    private isDayBlocked = (date: moment.Moment) => {
        return this.props.illegalDates.some(d => d.isSame(date.clone().startOf("day")));
    }

    public render() {
        return <div ref={(element) => this.button = element} style={{ display: "inline-flex" }}><Button
            onClick={this.handleNewRound}
            color="accent"
            aria-label="add"
        >
            <GolfIcon />
            Add round
        </Button>
            {
                <Popover
                    open={this.state.popover.isOpen}
                    onRequestClose={this.handlePopoverClose}
                    anchorEl={this.button || undefined}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                >
                    <DayPickerSingleDateController
                        id={"roundpicker"}
                        date={moment()}
                        onDateChange={this.handleNewDate}
                        focused={this.state.popover.isOpen}
                        onFocusChange={this.handlePopoverClose}
                        isDayBlocked={this.isDayBlocked}
                    />
                </Popover>
            }
        </div>;
    }
}

// Missing types for DayPickerSingleDateController. Fake it here.
declare module 'react-dates' {
    type DayPickerSingleDateControllerx = React.ClassicComponentClass<SingleDatePickerShape>;
    export let DayPickerSingleDateController: React.ClassicComponentClass<SingleDatePickerShape>;
}
