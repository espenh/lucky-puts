import * as _ from 'lodash';
import * as React from 'react';
import { IRoundScore } from '../contracts/common';
import { DateUtils } from '../utils/dateUtils';
import ScoreBullet from "./scoreBullet";

interface IScoreBulletListPropFields {
    scores: IRoundScore[];
}

export default class ScoreBulletList extends React.Component<IScoreBulletListPropFields, {}> {

    public render() {
        const sortedScores = _.orderBy(this.props.scores, s => s.score.roundDate, "asc");
        return <div className="score-bullet-list">
            {sortedScores.map((s, index) => {
                return <ScoreBullet
                    key={index}
                    score={s.score.score}
                    title={DateUtils.getFriendlyRelativeDate(DateUtils.getDate(s.score.roundDate))}
                />;
            })}
        </div>;
    }
}
