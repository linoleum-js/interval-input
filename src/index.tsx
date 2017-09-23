import React = require('react');
import ReactDOM = require('react-dom');

import IntervalInput from './IntervalInput/IntervalInput';
import IntervalInputData from './interfaces/IntervalInputData';

class App extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      data: {
        intervals: [{
          start: 0,
          end: 60 * 5 * 10,
          type: 'type-1',
          id: '1'
        }, {
          start: 60 * 5 * 15,
          end: 60 * 5 * 35,
          type: 'type-2',
          id: '2'
        }]
      }
    };
  }

  private onChange = (data: any) => {
    this.setState({ data });
  }

  render() {
    return (<IntervalInput
      min={0}
      max={86400}
      data={this.state.data}
      step={60 * 5} // 5 minute step
      onChange={this.onChange}
    />);
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
