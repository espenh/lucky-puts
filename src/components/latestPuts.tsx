import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IRoundScore } from '../contracts/common';
import * as _ from 'lodash';
import { ScoreSelectors } from '../selectors/scoreSelectors';

interface ILatestPutsPropFields {
    last: IRoundScore[];
}

class LatestPutsView extends React.Component<ILatestPutsPropFields, {}> {
    public render() {
        // TODO - Format nicely with dates. Use friendly dates (today, yesterday) for dates near in time.
        return <div className="widget latestPuts">
            <span>Latest puts: <span>{this.props.last.map(p => p.putter.name)}</span></span>
        </div>;
    }
}

const mapStateToProps = (state: IApplicationState): ILatestPutsPropFields => {
    const stuff = ScoreSelectors.getScoresMapped(state);
    const sorted = _.orderBy(stuff, s => s.round.dateInUnixMsTicks, "desc");
    const last = _.take(sorted, 5);

    return {
        last
    };
};

const TotalPuts = connect(mapStateToProps)(LatestPutsView);
export default TotalPuts;
