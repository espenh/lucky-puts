import { History } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { IApplicationState } from './contracts/common';
import { RootReducer } from './rootReducer';

export const ConfigureStore = (history: History): Store<IApplicationState> => {
    const middleware = routerMiddleware(history);
    return createStore(
        RootReducer,
        applyMiddleware(middleware, thunk)
    );
};
