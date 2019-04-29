import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from "redux";
import { Route, Switch } from 'react-router';
import { NavLink, BrowserRouter } from 'react-router-dom';
import { faGolfBall } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigureStore } from './configureStore';

import "firebase/firestore";
import './App.scss';

import FirebaseProvider from './firebaseProvider';
import { StoreSyncer } from './storeSyncer';
import { CssBaseline } from '@material-ui/core';
import PutGrid from './components/putGrid';
import Dashboard from './components/dashboard';
import { IApplicationState } from './contracts/common';
import AdminScreen from './components/adminScreen';

export default class AppContainer extends React.Component {

    public syncer: StoreSyncer;
    private store: Store<IApplicationState>;

    constructor(props: {}) {
        super(props);

        this.store = ConfigureStore();
        this.syncer = new StoreSyncer(this.store, FirebaseProvider.getFirestoreInstance());
    }

    public render() {
        return (
            <Provider store={this.store}>
                <BrowserRouter>
                    <React.Fragment>
                        <CssBaseline />
                        <AppMain />
                    </React.Fragment>
                </BrowserRouter>
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
                        <h3>
                            <NavLink exact={true} to="/" activeClassName="active"><span className="app-icon"><FontAwesomeIcon icon={faGolfBall} /></span>Lucky puts</NavLink>
                        </h3>
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
