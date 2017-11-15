import * as React from 'react';
import { Provider, Store } from 'react-redux';
import { Route, Switch } from 'react-router';

import { ConfigureStore } from './configureStore';
import createHistory from 'history/createBrowserHistory';
import { History } from 'history';

import { ConnectedRouter } from 'react-router-redux';

import * as firebase from "firebase";
import "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import ScoreTable from './components/scoreTable';
import ScoreChart from './components/scoreChart';
import TopPutters from './components/topPutters';
import FirebaseProvider from './firebaseProvider';
import { StoreSyncer } from './storeSyncer';
import { MuiThemeProvider, createMuiTheme, Tabs, Tab, Paper, Contrast } from 'material-ui';

export default class AppContainer extends React.Component {

  private app: firebase.app.App;

  private store: Store<any>;
  private history: History;
  private syncer: StoreSyncer;

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
          <MuiThemeProvider theme={theme}>
            <AppMain />
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export class AppMain extends React.Component {
  public render() {
    return <Switch>
      <Route>
        <OverviewArea />
      </Route>
    </Switch>;
  }
}

const paletteType: Contrast = "light";
const theme = createMuiTheme({
  palette: {
    type: paletteType
  }
});


interface IOverviewState {
  currentTab: "trend" | "top-putters";
}

export class OverviewArea extends React.Component<{}, IOverviewState> {

  public state: IOverviewState = {
    currentTab: "trend"
  };

  private handleTabSelection = (event: React.ChangeEvent<{}>, tab: "trend" | "top-putters") => {
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
        </Tabs>
        {currentTab === "trend" && <ScoreChart />}
        {currentTab === "top-putters" && <TopPutters />}
      </Paper>
    </div>;
  }
}
