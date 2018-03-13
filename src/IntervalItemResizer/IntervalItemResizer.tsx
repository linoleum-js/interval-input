
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
  isInFocus: boolean;
}

export default class IntervalItemResizer extends React.Component<Props, State> {
  private root: HTMLElement;
  private isMoving: boolean;
  private lastXPosition: number; // for tracking the mouse movement

  constructor(props: Props) {
    super(props);
    this.onMouseMove = throttle(30, this.onMouseMove);
    this.state = {
      isInFocus: false
    };
  }

  private focus = (event: any) => {
    this.lastXPosition = event.clientX;
    // click on the interval item means dragging
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    this.setState({ isInFocus: true });
  }

  private blur = () => {
    if (!this.state.isInFocus) {
      return;
    }
    if (this.isMoving) {
      const { onMoveFinish } = this.props;
      onMoveFinish();
      this.isMoving = false;
    }
    if (this.state.isInFocus) {
      this.setState({ isInFocus: false });
    }
  }

  private onMouseMove = (event: any) => {
    if (!this.state.isInFocus) {
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
    const { isInFocus } = this.state;
    return classNames(styles.resizerMark, {
      [styles.resizerMarkGrabbing]: isInFocus
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
