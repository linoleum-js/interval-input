
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
  currentOpenMenu?: string;
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
    document.addEventListener('click', this.onDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = () => {
    this.setState({
      currentOpenMenu: null,
      currentActiveId: null
    });
  }

  onMenuOpen = (id: string) => {
    this.setState({ currentOpenMenu: id });
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

  private asLeastMinWidth(item: IntervalInputDataItem): boolean {
    const { minWidth } = this.props;
    return item.end - item.start >= minWidth;
  }

  private keepItemInBounds(item: IntervalInputDataItem): void {
    const { max } = this.props;
    if (item.end > max) {
      item.end = max;
    }
    if (item.start < 0) {
      item.start = 0;
    }
  }

  private mustBeRemoved(item: IntervalInputDataItem):boolean {
    return !this.asLeastMinWidth(item) && !util.isEmpty(item);
  }

  private numberOfItemsRemoved(item: any):number {
    if (item && this.mustBeRemoved(item)) {
      return 1;
    }
    return 0;
  }

  private collapsePrevItem(item: IntervalInputDataItem, index: number) {
    const { intervals } = this.props.data;
    this.collapse(item, intervals[index - 1], intervals[index - 2], 'left');
  }

  private collapseNextItem(item: IntervalInputDataItem, index: number) {
    const { intervals } = this.props.data;
    this.collapse(item, intervals[index + 1], intervals[index + 2], 'right');
  }

  private collapse(item: any, next: any, nextNext: any, dir: string) {
    if (next) {
      const removingNeeded = this.mustBeRemoved(next);
      if (removingNeeded) {
        if (dir === 'right') {
          item.end = nextNext ? nextNext.start : this.props.max;
        } else {
          item.start = nextNext ? nextNext.start : 0;
        }
      }
    }
  }


  private onItemChanging = (item: IntervalInputDataItem, index: number) => {
    // some geometry and collision detection
    // round to the unitSize
    const { step, data, onChange, max } = this.props;
    const { intervals } = data;
    const prevItem = intervals[index - 1];
    const nextItem = intervals[index + 1];
    let prevRemoved = this.numberOfItemsRemoved(prevItem);
    let nextRemoved = this.numberOfItemsRemoved(nextItem);

    // check bounds
    this.keepItemInBounds(item);

    // while resizing, we should keep item at least at the min size
    // No removing of the resizing item is allowed
    if (!this.asLeastMinWidth(item)  ) {
      return;
    }
    // When we move or resize item, we have to move and resize
    // next and prev items
    this.collapsePrevItem(item, index);
    this.collapseNextItem(item, index);

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
    const { unitSize, stepInPixels, currentOpenMenu } = this.state;
    const length = data.intervals.length;

    return (
      <div
        className={ styles.intervalInput }
        ref={(root) => { this.root = root; }}
      >
        {data.intervals.map((item: IntervalInputDataItem, index: number): any => {
          return <IntervalItem
            {...item}
            showMemu={ currentOpenMenu === item.id }
            onMenuOpen={ this.onMenuOpen }
            step={ step }
            key={ item.id }
            onActive={ this.onItemActive }
            isActive={ this.isItemActive(item) }
            unitSize={ unitSize }
            stepInPixels={ stepInPixels }
            preventResize={{ left: index === 0, right: index === length - 1 }}
            draggable={ index !== 0 && index !== length - 1 || true }
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
