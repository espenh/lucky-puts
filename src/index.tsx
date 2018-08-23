import * as React from 'react';
import * as ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

/*import { library } from '@fortawesome/fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);*/

import AppContainer from './App';
import * as Highcharts from 'highcharts';

Highcharts.setOptions({
  time: {
    useUTC: false
  }
});


ReactDOM.render(
  <AppContainer />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
