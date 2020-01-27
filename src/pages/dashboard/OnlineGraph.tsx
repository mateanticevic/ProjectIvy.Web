import _ from 'lodash';
import moment from 'moment';
import React from 'react';

import SimpleLineChart from '../../components/SimpleLineChart';

const OnlineGraph = (props) => {

    let data = _.map(props.data, (x) => {
        return { hours: _.round(x.seconds / 3600, 1), day: moment(x.day).format('dddd Do') };
    });
    data = _.reverse(data);

    return (
        <SimpleLineChart
            data={data}
            name="day"
            unit=" h"
            value="hours"
        />
    );
};

export default OnlineGraph;
