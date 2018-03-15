
import React = require('react');
import PropTypes = require('prop-types');
const uuid = require('uuid');

import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalInputContainerProps from '../interfaces/IntervalInputContainerProps';
import IntervalInput from './IntervalInput';
import * as util from '../util/util';

interface State {
  unitSize?: number;
  stepInPixels?: number;
}

export default class IntervalInputContainer extends React.Component<IntervalInputContainerProps, State> {
  private root: HTMLElement;

  constructor(props: IntervalInputContainerProps) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    this.initialize();
  }

  private initialize = () => {
    let { unitSize, stepInPixels } = this.state;
    if (unitSize && stepInPixels) {
      return;
    }
    const width = this.root.offsetWidth;
    const { min, max, step } = this.props;
    unitSize = width / (max - min);
    stepInPixels = util.unitsToPixels(step, unitSize);
    this.setState({ unitSize, stepInPixels });
  }

  private removeEmptyItems(data: IntervalInputData) {
    return {
      intervals: data.intervals.filter(item => !util.isEmpty(item))
    };
  }

  private collapseSameType = (data: IntervalInputData) => {
    const intervals = data.intervals;
    const newIntervals: Array<IntervalInputDataItem> = [];
    let prevItem: any = {};
    intervals.forEach((item: IntervalInputDataItem) => {
      if (item.type === prevItem.type && item.start === prevItem.end) {
        prevItem.end = item.end;
      } else {
        prevItem = item;
        newIntervals.push(item);
      }
    });
    return {
      intervals: newIntervals
    };
  }

  render() {
    const { data, max, onChange, ...rest } = this.props;
    const { unitSize, stepInPixels } = this.state;
    return (
      <div ref={(root) => { this.root = root; }}>
        <IntervalInput
          { ...rest }
          data={ data }
          max={ max }
          unitSize={ unitSize }
          stepInPixels={ stepInPixels }
          onChange={(data: any) => {
            onChange(this.collapseSameType(data));
          }}
        />
        {false && <pre>{ JSON.stringify(data, null, 2 ) }</pre>}
      </div>
    );
  }
}
