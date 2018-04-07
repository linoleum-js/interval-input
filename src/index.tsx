import React = require('react');
import ReactDOM = require('react-dom');

import IntervalInputContainer from './IntervalInput/IntervalInputContainer';
import IntervalInputData from './interfaces/IntervalInputData';
import IntervalsList from './IntervalsList/IntervalsList';
import initialData from './util/initial-data.js';
import * as util from './util/util';

const max = 86400;

const fillWithEmptyItems = (data: any) => {
  return data.map((item: IntervalInputData) => {
    return util.fillWithEmptyItems(item, max);
  })
};

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: fillWithEmptyItems(initialData)
    };
  }

  private onChange = (data: any) => {
    this.setState({ data });
  }

  render() {
    return <IntervalsList
      data={ fillWithEmptyItems(this.state.data) }
      onChange={ this.onChange }
      max={ max }
    />
  }
}

ReactDOM.render(
  <App /> as any,
  document.getElementById('container')
);
