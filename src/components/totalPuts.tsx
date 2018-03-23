import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';

interface ITotalPutsPropFields {
    totalPuts: number;
}

class TotalPutsView extends React.Component<ITotalPutsPropFields, {}> {

    public render() {
        return <span>Total puts: <span>{this.props.totalPuts}</span></span>;
    }
}

const mapStateToProps = (state: IApplicationState): ITotalPutsPropFields => {
    return {
        totalPuts: state.score.scores.filter(s => s.score > 0).length
    };
};


const TotalPuts = connect(mapStateToProps)(TotalPutsView);
export default TotalPuts;
