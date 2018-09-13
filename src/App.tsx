import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from "redux";
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { faGolfBall } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigureStore } from './configureStore';
import createHistory from 'history/createBrowserHistory';
import { History } from 'history';

import { ConnectedRouter } from 'react-router-redux';

import * as firebase from "firebase";
import "firebase/firestore";

import './App.css';

import FirebaseProvider from './firebaseProvider';
import { StoreSyncer } from './storeSyncer';
import { CssBaseline } from '@material-ui/core';
import TotalPuts from './components/totalPuts';
import LatestPuts from './components/latestPuts';
import MonthlyWinner from './components/monthlyWinner';
import PuttingRecords from './components/puttingRecords';
import PutGrid from './components/putGrid';
import TrendChart from './components/trendChart';
import { IApplicationState } from './contracts/common';
import AdminScreen from './components/adminScreen';

export default class AppContainer extends React.Component {

    public app: firebase.app.App;
    public syncer: StoreSyncer;

    private store: Store<IApplicationState>;
    private history: History;
    private timeoutHandle: number;

    constructor(props: {}) {
        super(props);

        this.history = createHistory();
        this.store = ConfigureStore(this.history);

        this.app = FirebaseProvider.getAppInstance();

        this.syncer = new StoreSyncer(this.store, FirebaseProvider.getFirestoreInstance());
    }

    public componentDidMount() {
        // There's stuff on the dashboard that's date sensitive (like a put was made "Today").
        // Forcing an update isn't super smooth, but it'll do for now.
        // We could have some context state (like current day in local tz) in the redux store, for example.
        this.timeoutHandle = window.setTimeout(() => {
            this.forceUpdate();
        }, 1000 * 60 * 5 /* 5 minutes */);
    }

    public componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    public render() {
        return (
            <Provider store={this.store}>
                <ConnectedRouter history={this.history}>
                    <React.Fragment>
                        <CssBaseline />
                        <AppMain />
                    </React.Fragment>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export class AppMain extends React.Component {
    public render() {
        return <div className="app">
            <nav>
                <div className="header-and-links">
                    <div className="header">
                        <h3><span className="app-icon"><FontAwesomeIcon icon={faGolfBall} /></span>Lucky puts</h3>
                    </div>
                    <div className="nav-links">
                        <NavLink exact={true} to="/" activeClassName="active"><span>Dash</span></NavLink>
                        <NavLink to="/grid" activeClassName="active"><span>Grid</span></NavLink>
                        <NavLink to="/admin" activeClassName="active"><span>Admin</span></NavLink>
                    </div>
                </div>
            </nav>
            <main>
                <Switch>
                    <Route path="/admin">
                        <AdminScreen />
                    </Route>
                    <Route path="/grid">
                        <PutGrid />
                    </Route>
                    <Route>
                        <Dashboard />
                    </Route>
                </Switch>
            </main>
        </div>;
    }
}

export class Dashboard extends React.Component<{}, {}> {
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
