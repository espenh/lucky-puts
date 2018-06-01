import thunk from 'redux-thunk';
import { createStore, applyMiddleware, Store } from 'redux';
import { RootReducer } from './rootReducer';
import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { IApplicationState } from './contracts/common';

export const ConfigureStore = (history: History): Store<IApplicationState> => {
    /*const storeEnhancer = applyMiddleware(thunk, routerMiddleware(history));
    return storeEnhancer(createStore)(RootReducer);*/

    const middleware = routerMiddleware(history);
    // We'll create our store with the combined reducers and the initial Redux state that
    // we'll be passing from our entry point.
    return createStore(
        RootReducer,
        applyMiddleware(middleware, thunk)
    );
};
