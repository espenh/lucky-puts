import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

import AppContainer from './App';

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
