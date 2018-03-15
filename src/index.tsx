import React = require('react');
import ReactDOM = require('react-dom');

import IntervalInputContainer from './IntervalInput/IntervalInputContainer';
import IntervalInputData from './interfaces/IntervalInputData';
import IntervalsList from './IntervalsList/IntervalsList';
import initialData from './util/initial-data';

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: initialData
    };
  }

  private onChange = (data: any) => {
    console.log(data);
    this.setState({ data }, () => {
      console.log(this.state);
    });
  }

  render() {
    return <IntervalsList
      data={ this.state.data }
      onChange={ this.onChange }
    />
  }
}

ReactDOM.render(
  <App /> as any,
  document.getElementById('container')
);
