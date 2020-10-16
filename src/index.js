import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import moment from 'moment';

import Root from './Root';

require('./favicon.ico');
import './styles/styles.scss';

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
