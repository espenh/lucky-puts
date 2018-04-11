import * as React from 'react';
import { IRoundScore } from '../contracts/common';
import ScoreBullet from "./scoreBullet";
import * as _ from 'lodash';

interface IScoreBulletListPropFields {
    scores: IRoundScore[];
}

export default class ScoreBulletList extends React.Component<IScoreBulletListPropFields, {}> {

    constructor(props: IScoreBulletListPropFields) {
        super(props);
    }

    public render() {
        const sortedScores = _.orderBy(this.props.scores, s => s.round.dateInUnixMsTicks, "asc");
        return <div className="score-bullet-list">
            {sortedScores.map((s, index) => {
                return <ScoreBullet key={index} score={s.score.score} />;
            })}
        </div>;
    }
}
