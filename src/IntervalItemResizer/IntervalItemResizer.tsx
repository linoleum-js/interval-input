
import React = require('react');
import classNames = require('classnames');
const throttle = require('throttle-debounce/throttle');

import * as util from '../util/util';
const styles = require('./IntervalItemResizer.css');

interface Props {
  direction: string;
  onMove?: Function;
  onMoveFinish: Function;
  stepInPixels: number;
  value: number;
}

interface State {
}

export default class IntervalItemResizer extends React.Component<Props, State> {
  private root: HTMLElement;
  private isInFocus: boolean;
  private isMoving: boolean;
  private lastXPosition: number; // for tracking the mouse movement

  constructor(props: Props) {
    super(props);
    this.onMouseMove = throttle(30, this.onMouseMove);
  }

  private focus = (event: any) => {
    this.isInFocus = true;
    this.lastXPosition = event.clientX;
    // click on the interval item means dragging
    event.stopPropagation();
  }

  private blur = () => {
    if (!this.isInFocus) {
      return;
    }
    if (this.isMoving) {
      const { onMoveFinish } = this.props;
      this.isInFocus = false;
      onMoveFinish();
      this.isMoving = false;
    }
  }

  private onMouseMove = (event: any) => {
    if (!this.isInFocus) {
      return;
    }
    this.isMoving = true;
    const { onMove, stepInPixels } = this.props;
    const xPosition = event.clientX;
    const diff = xPosition - this.lastXPosition;

    if (Math.abs(diff) >= stepInPixels) {
      this.lastXPosition = xPosition;
      onMove(diff);
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.blur, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.blur);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  private getWrapClasses() {
    const { direction } = this.props
    return classNames(styles.resizer, {
      [styles.resizerLeft]: direction === 'left',
      [styles.resizerRight]: direction === 'right'
    });
  }

  private getMarkClasses() {
    return classNames(styles.resizerMark, {
      [styles.resizerMarkGrabbing]: this.isInFocus
    });
  }

  render() {
    const { value } = this.props;

    return (
      <div
        ref={(root) => { this.root = root }}
        className={ this.getWrapClasses() }
        onMouseDown={ this.focus }
      >
        <div
          className={ this.getMarkClasses() }
        >
          { util.secToHHMM(value) }
        </div>
      </div>
    );
  }
}
