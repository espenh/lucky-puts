import thunk from 'redux-thunk';
import { createStore, applyMiddleware, Store } from 'redux';
import { RootReducer } from './rootReducer';
import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { IApplicationState } from './contracts/common';

export const ConfigureStore = (history: History): Store<IApplicationState> => {
    const middleware = routerMiddleware(history);
    return createStore(
        RootReducer,
        applyMiddleware(middleware, thunk)
    );
};
