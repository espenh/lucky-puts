import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Highcharts from 'highcharts';

import { unregister } from './registerServiceWorker';

import './index.css';
import AppContainer from './App';

unregister();

Highcharts.setOptions({
  time: {
    useUTC: false
  }
});


ReactDOM.render(
  <AppContainer />,
  document.getElementById('root') as HTMLElement
);
