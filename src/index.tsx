import React = require('react');
import ReactDOM = require('react-dom');

import IntervalInputContainer from './IntervalInput/IntervalInputContainer';
import IntervalInputData from './interfaces/IntervalInputData';
import IntervalsList from './IntervalsList/IntervalsList';
import initialData from './util/initial-data';
import * as util from './util/util';

const max = 86400;

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: initialData.map((item: IntervalInputData) => {
        return util.fillWithEmptyItems(item, max);
      })
    };
  }

  private onChange = (data: any) => {
    this.setState({ data });
  }

  render() {
    return <IntervalsList
      data={ this.state.data }
      onChange={ this.onChange }
      max={ max }
    />
  }
}

ReactDOM.render(
  <App /> as any,
  document.getElementById('container')
);
