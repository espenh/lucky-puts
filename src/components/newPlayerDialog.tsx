import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from 'material-ui';


import 'react-dates/lib/css/_datepicker.css';

interface INewPlayerDialog {
    isOpen: boolean;
    handleNewPlayer: (newPlayerName: string) => void;
    handleCancel: () => void;
}

export default class NewPlayerDialog extends React.Component<INewPlayerDialog, {}> {
    private inputElement: HTMLInputElement;

    private handleTextFieldKeyDown = (event: any) => {
        if (event.key === "Enter") {
            this.handleAddClick();
        }
    }

    private handleAddClick = () => {
        const name = this.inputElement.value.trim();
        if (name.length > 0) {
            this.props.handleNewPlayer(this.inputElement.value);
        }
    }

    public render() {
        return <Dialog open={this.props.isOpen} onRequestClose={this.props.handleCancel} >
            <DialogTitle>Add new putter</DialogTitle>
            <DialogContent>
                <TextField
                    inputRef={element => this.inputElement = element}
                    autoFocus={true}
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth={false}
                    onKeyDown={this.handleTextFieldKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.props.handleCancel} color="primary" >
                    Cancel
                </Button>
                <Button onClick={this.handleAddClick} color="primary" >
                    Add
                </Button>
            </DialogActions>
        </Dialog>;
    }
}
