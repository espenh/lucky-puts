import * as React from 'react';
import { Provider, Store } from 'react-redux';
import { Route, Switch } from 'react-router';

import { ConfigureStore } from './configureStore';
import createHistory from 'history/createBrowserHistory';
import { History } from 'history';

import { ConnectedRouter } from 'react-router-redux';

import * as firebase from "firebase";
import "firebase/firestore";

import './App.css';

import ScoreTable from './components/scoreTable';
import ScoreChart from './components/scoreChart';
import TopPutters from './components/topPutters';
import FirebaseProvider from './firebaseProvider';
import { StoreSyncer } from './storeSyncer';
import { Tabs, Tab, Paper } from 'material-ui';
import MonthlyPutter from './components/monthlyPutter';
import TotalPuts from './components/totalPuts';
// import { Spinner, Intent } from "@blueprintjs/core";

export default class AppContainer extends React.Component {

  public app: firebase.app.App;
  public syncer: StoreSyncer;

  private store: Store<any>;
  private history: History;

  constructor(props: {}) {
    super(props);

    this.history = createHistory();
    this.store = ConfigureStore(this.history);

    this.app = FirebaseProvider.getAppInstance();

    this.syncer = new StoreSyncer(this.store, FirebaseProvider.getFirestoreInstance());
  }

  public render() {
    return (
      <Provider store={this.store}>
        <ConnectedRouter history={this.history}>
          <AppMain />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export class AppMain extends React.Component {
  public render() {
    return <Switch>
      <Route>
        <OverviewAreaDeux />
      </Route>
    </Switch>;
  }
}

interface IOverviewState {
  currentTab: "trend" | "top-putters" | "monthly-putters";
}

export class OverviewAreaDeux extends React.Component<{}, IOverviewState> {
  public render() {
    return <div>
      <TotalPuts />
    </div>;
  }
}

export class OverviewArea extends React.Component<{}, IOverviewState> {

  public state: IOverviewState = {
    currentTab: "trend"
  };

  private handleTabSelection = (event: React.ChangeEvent<{}>, tab: "trend" | "top-putters" | "monthly-putters") => {
    this.setState({
      currentTab: tab
    });

    event.preventDefault();
    return false;
  }

  public render() {
    const currentTab = this.state.currentTab;
    return <div className="app container-fluid">
      <ScoreTable />
      <Paper className="chart-picker" style={{ height: "500px", display: "flex", flexDirection: "column" }}>
        <Tabs
          value={currentTab}
          onChange={this.handleTabSelection}
          indicatorColor="primary"
          textColor="primary"
          centered={true}
        >
          <Tab label="Trend" value={"trend"} />
          <Tab label="Top putters" value={"top-putters"} />
          <Tab label="Monthly" value={"monthly-putters"} />
        </Tabs>
        {currentTab === "trend" && <ScoreChart />}
        {currentTab === "top-putters" && <TopPutters />}
        {currentTab === "monthly-putters" && <MonthlyPutter />}
      </Paper>
    </div>;
  }
}
