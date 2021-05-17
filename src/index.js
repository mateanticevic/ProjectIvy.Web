import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
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
    <AppContainer>
        <Root />
    </AppContainer>,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept('./Root', () => {
        const NewRoot = require('./Root').default;
        render(
            <AppContainer>
                <NewRoot />
            </AppContainer>,
            document.getElementById('app')
        );
    });
}
