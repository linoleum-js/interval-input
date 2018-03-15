
import React = require('react');
import classNames = require('classnames');

import IntervalInputContainer from '../IntervalInput/IntervalInputContainer';
import IntervalInputData from '../interfaces/IntervalInputData';


interface IntervalsListProps {
  data: Array<IntervalInputData>
  onChange: Function;
}

interface State {

}

export default class IntervalsList extends React.Component<IntervalsListProps, State> {
  constructor(props: any) {
    super(props);
  }

  private onItemChange = (index: number, intervalData: any) => {
    const { data, onChange } = this.props;
    onChange([
      ...data.slice(0, index),
      {...data[index], ...intervalData},
      ...data.slice(index + 1)
    ]);
  }

  render() {
    const { data } = this.props;
    
    return (
      <div>
        {data.map((item: IntervalInputData, index: number) => {
          return <IntervalInputContainer
            key={item.id}
            min={0}
            max={86400}
            data={item}
            step={60 * 5} // 5 minute step
            onChange={this.onItemChange.bind(this, index)}
            minWidth={60 * 20}
          />
        })}
      </div>
    );
  }
}
