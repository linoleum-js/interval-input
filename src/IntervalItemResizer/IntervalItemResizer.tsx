
import React = require('react');
import classNames = require('classnames');
const throttle = require('throttle-debounce/throttle');

import * as util from '../util/util';
const styles = require('./IntervalItemResizer.css');

interface Props {
  direction: string;
  onMove?: Function;
}

interface State {
}

export default class IntervalItemResizer extends React.Component<Props, State> {
  private root: HTMLElement;
  private isInFocus: boolean;
  private lastXPosition: number; // for tracking the mouse movement

  constructor() {
    super();
    this.state = { isInFocus: false };
    this.onMouseMove = throttle(30, this.onMouseMove);
  }

  private focus = (event: any) => {
    this.isInFocus = true;
    this.lastXPosition = event.clientX;
  }

  private blur = () => {
    this.isInFocus = false;
  }

  private onMouseMove = (event: any) => {
    if (!this.isInFocus) {
      return;
    }
    const { onMove } = this.props;
    const xPosition = event.clientX;
    const diff = xPosition - this.lastXPosition;
    this.lastXPosition = xPosition;
    onMove(diff);
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.blur, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.blur);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  private getClasses() {
    const { direction } = this.props
    return classNames(styles.intervalInputResizer,{
      [styles.intervalInputResizerLeft]: direction === 'left',
      [styles.intervalInputResizerRight]: direction === 'right'
    });
  }

  render() {
    return (
      <div
        ref={(root) => { this.root = root }}
        className={ this.getClasses() }
        onMouseDown={ this.focus }
      >
      </div>
    );
  }
}
