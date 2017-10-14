
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalItem.css');
import * as util from '../util/util';
import types from '../util/types';
import IntervalItemResizer from '../IntervalItemResizer/IntervalItemResizer';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';

interface Props {
  start: number;
  end: number;
  type: string;
  step?: number;
  stepInPixels: number;
  isActive?: boolean;
  onActive: Function;
  id: string;
  unitSize: number;
  onItemChanging: Function;
  onItemChangingFinish: Function;
  draggable: boolean;
}

interface State {
}

export default class IntervalItem extends React.Component<Props, State> {
  private root: HTMLElement;
  private lastXPosition: number;
  private isInFocus: boolean;

  constructor(props: Props) {
    super(props);
    const noop = () => {};
    if (props.type === 'empty') {
      this.onClick = noop;
      this.onMoveFinish = noop;
      this.onDrag = noop;
      this.onMove = noop;
    }
    if (!props.draggable) {
      this.onDrag = noop;
    }
  }

  private onContextMenu = () => {
    console.log('menu');
  }

  private onClick = () => {
    const { isActive, onActive, id } = this.props;
    if (!isActive) {
      onActive(id);
    }
  }

  private focus = (event: any) => {
    this.isInFocus = true;
    this.lastXPosition = event.clientX;
  }

  private blur = () => {
    this.isInFocus = false;
  }

  private onLeftMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start: start + diffInUnits, end, type, id };
    onItemChanging(newItem);
  }

  private onRightMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start, end: end + diffInUnits, type, id };
    onItemChanging(newItem);
  }

  private onMoveFinish = () => {
    const { onItemChangingFinish, start, end, type, id } = this.props;
    onItemChangingFinish({ start, end, type, id });
  }

  private onMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = {
      start: start + diffInUnits,
      end: end + diffInUnits,
      type, id
    };
    onItemChanging(newItem);
  }

  private onDrag = (event: any) => {
    if (!this.isInFocus) {
      return;
    }
    const { onItemChanging, stepInPixels } = this.props;
    const xPosition = event.clientX;
    const diff = xPosition - this.lastXPosition;

    if (Math.abs(diff) >= stepInPixels) {
      this.lastXPosition = xPosition;
      this.onMove(diff);
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
    const { start, end, type, isActive, stepInPixels } = this.props;

    return (
      <div
        className={ this.getClasses() }
        ref={(root) => { this.root = root; }}
        onContextMenu={ this.onContextMenu }
        onClick={ this.onClick }
        onMouseDown={ this.focus }
        style={ this.getStyle() }
      >
        {type !== 'empty' && <IntervalItemResizer
          direction="left"
          stepInPixels={ stepInPixels }
          onMove={ this.onLeftMove }
          onMoveFinish={ this.onMoveFinish }
        />}

        {type !== 'empty' && <IntervalItemResizer
          direction="right"
          stepInPixels={ stepInPixels }
          onMove={ this.onRightMove }
          onMoveFinish={ this.onMoveFinish }
        />}
      </div>
    );
  }
}
