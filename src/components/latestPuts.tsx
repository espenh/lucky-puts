import * as React from 'react';
import { connect } from 'react-redux';
import { IApplicationState, IRoundScore } from '../contracts/common';
import * as _ from 'lodash';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import Widget from "./widget";
import ScoreBullet from "./scoreBullet";

interface ILatestPutsPropFields {
    last: IRoundScore[];
}

class LatestPutsView extends React.Component<ILatestPutsPropFields, {}> {
    public render() {
        // TODO - Format nicely with dates. Use friendly dates (today, yesterday) for dates near in time.
        return <Widget
            containerClass="latestPuts"
            title={{ text: "Latest puts" }}
        >
            {this.props.last.map(p => {
                return <div key={p.score.id}>
                    <span>{p.putter.name}</span>
                    <ScoreBullet score={p.score.score} />
                </div>;
            })}
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): ILatestPutsPropFields => {
    const stuff = ScoreSelectors.getScoresMapped(state);
    const sorted = _.orderBy(stuff, s => s.score.roundDate, "desc");
    const last = _.take(sorted, 5);

    return {
        last
    };
};

const TotalPuts = connect(mapStateToProps)(LatestPutsView);
export default TotalPuts;
