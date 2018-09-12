import { routerReducer } from 'react-router-redux';
import { combineReducers, Reducer } from 'redux';
import { IApplicationState } from './contracts/common';
import { putterReducer } from './reducers/putterReducer';
import { roundReducer } from './reducers/roundReducer';
import { scoreReducer } from './reducers/scoreReducer';

export const RootReducer: Reducer<IApplicationState> = combineReducers<IApplicationState>({
    putters: putterReducer,
    round: roundReducer,
    score: scoreReducer,
    // This is the react-router-redux reducer.
    router: routerReducer
});
