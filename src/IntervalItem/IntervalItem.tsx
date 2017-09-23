
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalItem.css');
import * as util from '../util/util';
import types from '../util/types';
import IntervalItemResizer from '../IntervalItemResizer/IntervalItemResizer';

interface Props {
  start: number;
  end: number;
  type: string;
  step?: number;
  isActive?: boolean;
  onActive: Function;
  id: string;
  unitSize: number;
  onChange: Function;
}

interface State {
}

export default class IntervalItem extends React.Component<Props, State> {
  private root: HTMLElement;
  private lastXPosition: number;
  private isInFocus: boolean;

  constructor(props: Props) {
    super(props);
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
    const { onChange, start, end, type, id, unitSize } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    onChange({ start: start + diffInUnits, end, type, id });
  }

  private onRightMove = (diff: number) => {
    const { onChange, start, end, type, id, unitSize } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    onChange({ start, end: end + diffInUnits, type, id });
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.blur, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.blur);
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
    const { start, end, type, isActive } = this.props;

    return (
      <div
        className={ this.getClasses() }
        ref={(root) => { this.root = root; }}
        onContextMenu={ this.onContextMenu }
        onClick={ this.onClick }
        onMouseDown={ this.focus }
        style={ this.getStyle() }
      >
        <IntervalItemResizer
          direction="left"
          onMove={ this.onLeftMove }
        />

        <IntervalItemResizer
          direction="right"
          onMove={ this.onRightMove }
        />
      </div>
    );
  }
}
