import React from 'react';
import moment from 'moment';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import './styles/overrides.scss';
import 'react-loading-skeleton/dist/skeleton.css'

import Root from './root';

// Move this somewhere
moment.locale('hr', {
    week: {
        dow: 1,
        doy: 1,
    },
});

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(<Root />);