import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { IApplicationState } from './contracts/common';
import { RootReducer } from './rootReducer';

export const ConfigureStore = (): Store<IApplicationState> => {
    return createStore(
        RootReducer,
        applyMiddleware(thunk)
    );
};
