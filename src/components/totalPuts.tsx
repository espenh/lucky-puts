import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState } from '../contracts/common';

interface ITotalPutsPropFields {
    totalPuts: number;
    everything: IApplicationState;
}

class TotalPutsView extends React.Component<ITotalPutsPropFields, {}> {

    public render() {
        return <div className="widget totalPuts">
            <span>Total puts: <span>{this.props.totalPuts}</span></span>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): ITotalPutsPropFields => {
    const nonZeroPuts = state.score.scores.filter(s => s.score > 0);
    return {
        totalPuts: nonZeroPuts.length,
        everything: state
    };
};

const TotalPuts = connect(mapStateToProps)(TotalPutsView);
export default TotalPuts;
