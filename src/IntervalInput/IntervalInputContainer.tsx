
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

  private fillWithEmptyItems(data: IntervalInputData, max: number): IntervalInputData {
    const result: Array<IntervalInputDataItem> = [];
    const list = data.intervals;
    let prevEnd = 0;
    list.forEach((item: IntervalInputDataItem, index: number) => {
      if (item.start > prevEnd) {
        result.push({ type: 'empty', start: prevEnd, end: item.start, id: uuid() });
      }
      prevEnd = item.end;
      result.push(item);
    });
    const lastItem = list[list.length - 1];
    if (lastItem.end < max) {
      result.push({ type: 'empty', start: lastItem.end, end: max, id: uuid() });
    }
    return {
      intervals: result
    };
  }

  private removeEmptyItems(data: IntervalInputData) {
    return {
      intervals: data.intervals.filter(item => !util.isEmpty(item))
    };
  }

  render() {
    const { data, max, onChange, ...rest } = this.props;
    const { unitSize, stepInPixels } = this.state;
    const dataFilledWithEmpty = this.fillWithEmptyItems(data, max);
    return (
      <div ref={(root) => { this.root = root; }}>
        <IntervalInput
          { ...rest }
          data={ dataFilledWithEmpty }
          max={ max }
          unitSize={ unitSize }
          stepInPixels={ stepInPixels }
          onChange={(data: IntervalInputData) => {
            onChange(this.removeEmptyItems(data))
          }}
        />
        <pre>{ JSON.stringify(dataFilledWithEmpty, null, 2 ) }</pre>
      </div>
    );
  }
}
