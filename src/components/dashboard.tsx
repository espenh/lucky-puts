import * as React from "react";

import TotalPuts from './totalPuts';
import LatestPuts from './latestPuts';
import MonthlyWinner from './monthlyWinner';
import PuttingRecords from './puttingRecords';
import TrendChart from './trendChart';

export default class Dashboard extends React.Component<{}, {}> {
    public render() {
        return <section className="stats-container">
            <TotalPuts />
            <LatestPuts />
            <MonthlyWinner />
            <PuttingRecords />
            <TrendChart />
        </section>;
    }
}
