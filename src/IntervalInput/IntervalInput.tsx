
import React = require('react');
import PropTypes = require('prop-types');

import IntervalItem from '../IntervalItem/IntervalItem';
import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalInputProps from './IntervalInputProps';
import * as util from '../util/util';
const styles = require('./IntervalInput.css');

interface State {
  unitSize: number;
  currentActiveId?: string;
  stepInPixels: number;
}

/**
 *
 */
export default class IntervalInput extends React.Component<IntervalInputProps, State> {
  private root: HTMLElement;
  private numberOfSteps: number;

  constructor(props: IntervalInputProps) {
    super(props);
    const { min, max, step } = props;
    this.state = { unitSize: 0, stepInPixels: 0 };
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

  private onItemActive = (itemId: string) => {
    this.setState({ currentActiveId: itemId });
  }

  private isItemActive(item: IntervalInputDataItem): boolean {
    return this.state.currentActiveId === item.id;
  }

  private checkItemMinWidth(item: IntervalInputDataItem): boolean {
    const { minWidth } = this.props;
    return item.end - item.start >= minWidth;
  }

  // TODO: split
  private onItemChanging = (item: IntervalInputDataItem, index: number) => {
    // some geometry and collision detection
    // round to the unitSize
    const { step, data, onChange, max } = this.props;
    const { intervals } = data;
    const prevItem = intervals[index - 1];
    const nextItem = intervals[index + 1];
    let prevRemoved = 0;
    let nextRemoved = 0;

    // When we move or resize item, we have to move and resize
    // next and prev items
    if (!this.checkItemMinWidth(item)) {
      return;
    }
    // collapse prev item
    if (prevItem) {
      const keepPrev = this.checkItemMinWidth(prevItem);
      if (!keepPrev) {
        const prevPrevItem = intervals[index - 2];
        if (prevPrevItem) {
          item.start = prevPrevItem.end;
          prevRemoved = 1;
        } else {
          item.start = 0;
        }
      }
    }
    if (nextItem) {
      const keepNext = this.checkItemMinWidth(nextItem);
      if (!keepNext) {
        const nextNextItem = intervals[index + 2];
        if (nextNextItem) {
          item.end = nextNextItem.start;
          nextRemoved = 1;
        } else {
          item.end = max;
        }
      }
    }

    if (prevItem) {
      prevItem.end = item.start;
    }
    if (nextItem) {
      nextItem.start = item.end;
    }

    const newData = {
      intervals: [
        ...intervals.slice(0, index - prevRemoved),
        item,
        ...intervals.slice(index + 1 + nextRemoved)
      ]
    };
    onChange(newData);
  }

  private onItemChangingFinish = (item: IntervalInputDataItem, index: number) => {
    const { step } = this.props;
    item.start = util.roundTo(item.start, step);
    item.end = util.roundTo(item.end, step);
    this.onItemChanging(item, index);
  }

  private canCreateInside(item: IntervalInputDataItem) {
    const { start, end } = item;
    const { minWidth } = this.props;
    const width = end - start;
    return width / 3 > minWidth;
  }

  render() {
    const { data, step } = this.props;
    const { unitSize, stepInPixels } = this.state;
    const length = data.intervals.length;

    return (
      <div
        className={ styles.intervalInput }
        ref={(root) => { this.root = root; }}
      >
        {data.intervals.map((item: IntervalInputDataItem, index: number): any => {
          return <IntervalItem
            {...item}
            step={ step }
            key={ item.id }
            onActive={ this.onItemActive }
            isActive={ this.isItemActive(item) }
            unitSize={ unitSize }
            stepInPixels={ stepInPixels }
            preventResize={{ left: index === 0, right: index === length - 1 }}
            draggable={ index !== 0 && index !== length - 1 }
            canCreate={ this.canCreateInside(item) }
            onItemChanging={
              (item: IntervalInputDataItem) => {
                this.onItemChanging(item, index);
              }
            }
            onItemChangingFinish={
              (item: IntervalInputDataItem) => {
                this.onItemChangingFinish(item, index);
              }
            }
          />;
        })}
      </div>
    );
  }
}
