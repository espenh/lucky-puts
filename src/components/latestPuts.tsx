import * as React from 'react';
import { connect } from 'react-redux';
import * as moment from "moment";
import { IApplicationState, IRoundScore } from '../contracts/common';
import * as _ from 'lodash';
import { ScoreSelectors } from '../selectors/scoreSelectors';
import Widget from "./widget";
import ScoreBullet from "./scoreBullet";
import { DateUtils } from "../utils/dateUtils";

interface ILatestPutsPropFields {
    last: IRoundScore[];
}

class LatestPutsView extends React.Component<ILatestPutsPropFields, {}> {

    private relativeDate(date: moment.Moment) {
        const now = moment();
        if (now.isSame(date, "day")) {
            return "Today";
        }

        if (now.subtract(1, "day").isSame(date)) {
            return "Yesterday";
        }

        return date.format("dddd MMM Do");
    }

    public render() {
        // TODO - Format nicely with dates. Use friendly dates (today, yesterday) for dates near in time.
        return <Widget
            containerClass="latestPuts"
            title={{ text: "Latest puts" }}
        >
            <div className="latest-put-list">
                {this.props.last.map(p => {
                    return <div className="latest-put-item" key={p.score.id}>
                        <div className="putter">
                            <span>{p.putter.name}</span>
                        </div>
                        <div className="date">
                            <span>{this.relativeDate(DateUtils.getDate(p.score.roundDate))}</span>
                        </div>
                        <div className="score">
                            <ScoreBullet score={p.score.score} size="large" />
                        </div>
                    </div>;
                })}
            </div>
        </Widget>;
    }
}

const mapStateToProps = (state: IApplicationState): ILatestPutsPropFields => {
    const stuff = ScoreSelectors.getScoresMapped(state).filter(put => put.score.score > 0);
    const sorted = _.orderBy(stuff, s => [s.score.roundDate, s.score.registerDateInUnixMs], "desc");
    const last = _.take(sorted, 5);

    return {
        last
    };
};

const TotalPuts = connect(mapStateToProps)(LatestPutsView);
export default TotalPuts;
