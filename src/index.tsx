import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Highcharts from 'highcharts';

import { unregister } from './registerServiceWorker';

import './index.scss';
import AppContainer from './App';

// The service worker is currently just annoying (people running old versions etc.),
// so just disable it for now.
unregister();

// We want Highcharts to show stuff using the users locale.
Highcharts.setOptions({
  time: {
    useUTC: false
  }
});

ReactDOM.render(
  <AppContainer />,
  document.getElementById('root') as HTMLElement
);
