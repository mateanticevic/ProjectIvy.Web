import React from 'react';
import _ from 'lodash';

export const ExpenseTableLoader = () =>
<React.Fragment>
    {_.times(10, () =>
        <tr>
            <td>
                <div className="loader-bar-20-50"></div>
            </td>
            <td>
                <div className="loader-bar-20-40"></div>
            </td>
            <td>
                <div className="loader-bar-20-40"></div>
            </td>
            <td>
                <div className="loader-bar-20-30"></div>
            </td>
            <td>
                <div className="loader-bar-20-20"></div>
            </td>
            <td>
                <div className="loader-bar-20-20"></div>
            </td>
            <td>
                <div className="loader-bar-30-30"></div>
            </td>
        </tr>
    )}
</React.Fragment>