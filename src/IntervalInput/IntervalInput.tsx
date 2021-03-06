
import React = require('react');
import PropTypes = require('prop-types');

import IntervalItem from '../IntervalItem/IntervalItem';
import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalInputProps from '../interfaces/IntervalInputProps';
import * as util from '../util/util';
import types from '../util/types';
const styles = require('./IntervalInput.css');

interface State {
  currentActiveId?: string;
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
    this.state = {};
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onDocumentClick);
  }

  private onDocumentClick = () => {
    this.setState({
      currentOpenMenu: null,
      currentActiveId: null
    });
  }

  private onMenuOpen = (id: string) => {
    this.setState({ currentOpenMenu: id });
  }

  private onMenuClose = () => {
    this.setState({ currentOpenMenu: null });
  }

  private onItemActive = (itemId: string) => {
    this.setState({ currentActiveId: itemId });
  }

  private isItemActive(item: IntervalInputDataItem): boolean {
    return this.state.currentActiveId === item.id;
  }

  private atLeastMinWidth(item: IntervalInputDataItem): boolean {
    const { minWidth } = this.props;
    return item.end - item.start >= minWidth;
  }

  private atLeastStepWidth(item: IntervalInputDataItem): boolean {
    const { step } = this.props;
    return item.end - item.start >= step;
  }

  private isGoingOutOfBounds(item: IntervalInputDataItem):boolean {
    const { max } = this.props;
    return item.end > max || item.start < 0;
  }

  private mustBeRemoved(item: IntervalInputDataItem):boolean {
    if (util.isEmpty(item)) {
      return !this.atLeastStepWidth(item);
    }
    return !this.atLeastMinWidth(item);
  }

  private numberOfItemsRemoved(item: any):number {
    return item && this.mustBeRemoved(item) ? 1 : 0;
  }

  private collapsePrevItem(item: IntervalInputDataItem, index: number) {
    const { intervals } = this.props.data;
    this.collapse(item, intervals[index - 1], intervals[index - 2], 'left');
  }

  private collapseNextItem(item: IntervalInputDataItem, index: number) {
    const { intervals } = this.props.data;
    this.collapse(item, intervals[index + 1], intervals[index + 2], 'right');
  }

  /**
   * Collapse (if it's needed) an adjacent items
   * @param {IntervalInputDataItem} item Current item
   * @param {IntervalInputDataItem} next Adjacent item
   * @param {IntervalInputDataItem} nextNext Next adjacent item
   * @param {string} dir direction of the movement
   */
  private collapse(item: any, next: any, nextNext: any, dir: string) {
    if (next) {
      const removingNeeded = this.mustBeRemoved(next);
      if (removingNeeded) {
        if (dir === 'right') {
          item.end = nextNext ? nextNext.start : this.props.max;
        } else {
          item.start = nextNext ? nextNext.end : 0;
        }
      }
    }
  }

  private onItemChanging = (item: IntervalInputDataItem, index: number) => {
    // some geometry and collision detection
    const { step, data, onChange, max } = this.props;
    const { intervals } = data;
    const prevItem = intervals[index - 1];
    const nextItem = intervals[index + 1];
    let prevRemoved = this.numberOfItemsRemoved(prevItem);
    let nextRemoved = this.numberOfItemsRemoved(nextItem);

    // while resizing, we should keep item at least at the min size
    // No removing of the resizing item is allowed
    if (!this.atLeastMinWidth(item)  ) {
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
    if (this.isGoingOutOfBounds(item)) {
      return;
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
    this.setState({ currentOpenMenu: null });
    this.onItemChanging(item, index);
  }

  private canCreateInside(item: IntervalInputDataItem) {
    const { start, end } = item;
    const { minWidth } = this.props;
    const width = end - start;
    return width / 3 > minWidth;
  }

  private onRemove = (id: string) => {
    const { data, onChange } = this.props;
    const { intervals } = data;
    onChange({
      intervals: intervals.filter(item => item.id !== id)
    });
  }

  private onCreate = (index: number) => {
    const { data, onChange, step } = this.props;
    const { intervals } = data;
    const item = intervals[index];
    const itemSize = item.end - item.start;
    const thirdOfSize = itemSize / 3;
    const leftItem = util.createItem(
      item.type,
      item.start,
      util.roundTo(item.start + thirdOfSize, step)
    );
    const middleItem = util.createItem(
      util.getTypeForNew(item.type),
      leftItem.end,
      util.roundTo(item.start + thirdOfSize * 2, step)
    );
    const rightItem = util.createItem(
      item.type,
      middleItem.end,
      item.end
    );
    onChange({
      intervals: [
        ...intervals.slice(0, index),
        leftItem,
        middleItem,
        rightItem,
        ...intervals.slice(index + 1)
      ]
    });
  };

  render() {
    const { data, step, unitSize, stepInPixels } = this.props;
    const { currentOpenMenu } = this.state;

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
            onMenuClose={ this.onMenuClose }
            step={ step }
            key={ item.id }
            index={ index }
            onActive={ this.onItemActive }
            isActive={ this.isItemActive(item) }
            unitSize={ unitSize }
            stepInPixels={ stepInPixels }
            canCreate={ this.canCreateInside(item) }
            onRemove={ this.onRemove }
            onCreate={ this.onCreate }
            onItemChanging={ this.onItemChanging }
            onItemChangingFinish={ this.onItemChangingFinish }
          />;
        })}
      </div>
    );
  }
}
