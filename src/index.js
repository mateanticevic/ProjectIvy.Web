import React from 'react';
import { render } from 'react-dom';
import moment from 'moment';

import Root from './Root';

import 'url:./favicon.ico';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import './styles/overrides.scss';

// Move this somewhere
moment.locale('hr', {
    week: {
        dow: 1,
        doy: 1,
    },
});

render(
    <Root />,
    document.getElementById('app')
);