import React = require('react');
import ReactDOM = require('react-dom');

import IntervalInput from './IntervalInput/IntervalInput';
import IntervalInputData from './interfaces/IntervalInputData';

const data: IntervalInputData = {
  intervals: [{
    start: 0,
    end: 10,
    type: 'type-1'
  }]
};

ReactDOM.render(
  <IntervalInput
    min={0}
    max={86400}
    data={data}
    step={60 * 5} // 5 minute step
  />,
  document.getElementById('container')
);
