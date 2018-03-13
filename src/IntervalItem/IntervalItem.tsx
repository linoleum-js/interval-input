
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalItem.css');
import * as util from '../util/util';
import types from '../util/types';
import IntervalItemResizer from '../IntervalItemResizer/IntervalItemResizer';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import IntervalContextMenu from '../IntervalContextMenu/IntervalContextMenu';

interface Props {
  start: number;
  end: number;
  type: string;
  step: number;
  stepInPixels: number;
  isActive?: boolean;
  onActive: Function;
  id: string;
  unitSize: number;
  onItemChanging: Function;
  onItemChangingFinish: Function;
  canCreate: boolean;
  onMenuOpen: Function;
  showMemu: boolean;
}

interface State {
}


// TODO split
export default class IntervalItem extends React.Component<Props, State> {
  private root: HTMLElement;
  private lastXPosition: number;
  private isInFocus: boolean;

  constructor(props: Props) {
    super(props);
    const noop = () => {};
    if (util.isEmpty(props.type)) {
      this.onClick = noop;
      this.onMoveFinish = noop;
      this.onDrag = noop;
      this.onDragCommit = noop;
      this.focus = noop;
    }
  }

  private onContextMenu = (event: any) => {
    event.preventDefault();
    const { onMenuOpen, id } = this.props;
    onMenuOpen(id);
  }

  private onClick = (event: any) => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation();
  }

  private focus = (event: any) => {
    // only left button, to prevent dragging on context menu opening
    if (event.button !== 0) {
      return;
    }
    event.nativeEvent.stopImmediatePropagation();
    this.isInFocus = true;
    this.lastXPosition = event.clientX;
    const { isActive, onActive, id } = this.props;
    if (!isActive) {
      onActive(id);
    }
  }

  private blur = () => {
    this.isInFocus = false;
  }

  private onLeftMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize, step } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start: util.roundTo(start + diffInUnits, step), end, type, id };
    onItemChanging(newItem);
  }

  private onRightMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize, step } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start, end: util.roundTo(end + diffInUnits, step), type, id };
    onItemChanging(newItem);
  }

  private onMoveFinish = () => {
    const { onItemChangingFinish, start, end, type, id } = this.props;
    onItemChangingFinish({ start, end, type, id });
  }

  private onDragCommit = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize, step } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = {
      start: util.roundTo(start + diffInUnits, step),
      end: util.roundTo(end + diffInUnits, step),
      type, id
    };
    onItemChanging(newItem);
  }

  private onDrag = (event: any) => {
    if (!this.isInFocus) {
      return;
    }
    const { onItemChanging, stepInPixels, step } = this.props;
    const xPosition = event.clientX;
    const diff = xPosition - this.lastXPosition;

    if (Math.abs(diff) >= stepInPixels) {
      this.lastXPosition = xPosition;
      this.onDragCommit(diff);
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.blur, false);
    document.addEventListener('mousemove', this.onDrag, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.blur);
    document.removeEventListener('mousemove', this.onDrag);
  }

  private getStyle() {
    const { unitSize } = this.props;
    const { start, end, type } = util.itemToPixels(this.props, unitSize);
    const typeConfig = types[type];

    return {
      left: start || 0,
      width: (end - start) || 0,
      backgroundColor: typeConfig.color
    };
  }

  private getClasses() {
    const { isActive } = this.props;
    return classNames(styles.intervalItem, {
      [styles.intervalItemActive]: isActive
    });
  }

  render() {
    const { start, end, type, isActive, stepInPixels, canCreate,
            showMemu } = this.props;
    const isEmpty = util.isEmpty(type);

    return (
      <div
        className={ this.getClasses() }
        ref={(root) => { this.root = root; }}
        onContextMenu={ this.onContextMenu }
        onClick={ this.onClick }
        onMouseDown={ this.focus }
        style={ this.getStyle() }
      >
        {!isEmpty && isActive && <IntervalItemResizer
          direction="left"
          stepInPixels={ stepInPixels }
          onMove={ this.onLeftMove }
          onMoveFinish={ this.onMoveFinish }
          value={ start }
        />}

        {!isEmpty && isActive && <IntervalItemResizer
          direction="right"
          stepInPixels={ stepInPixels }
          onMove={ this.onRightMove }
          onMoveFinish={ this.onMoveFinish }
          value={ end }
        />}
        {showMemu && <IntervalContextMenu
          canCreate={ canCreate }
          isEmpty={ isEmpty }
          onCreate={() => {}}
          onRemove={() => {}}
          onChange={() => {}}
        />}
      </div>
    );
  }
}
