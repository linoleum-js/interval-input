
import React = require('react');
import PropTypes = require('prop-types');
const uuid = require('uuid');

import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalInputProps from './IntervalInputProps';
import IntervalInput from './IntervalInput';

interface State {}

export default class IntervalInputContainer extends React.Component<IntervalInputProps, State> {
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
      intervals: data.intervals.filter(item => item.type !== 'empty')
    };
  }

  render() {
    const { data, max, onChange, ...rest } = this.props;
    const dataFilledWithEmpty = this.fillWithEmptyItems(data, max);
    return (
      <div>
        <IntervalInput
          { ...rest }
          data={ dataFilledWithEmpty }
          max={ max }
          onChange={(data: IntervalInputData) => {
            onChange(this.removeEmptyItems(data))
          }}
        />
        <pre>{ JSON.stringify(dataFilledWithEmpty, null, 2 ) }</pre>
      </div>
    );
  }
}
