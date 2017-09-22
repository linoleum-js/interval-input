
import React = require('react');
import classNames = require('classnames');

import * as util from '../util/util';
const styles = require('./IntervalItemResizer.css');

interface Props {
  direction: string;
}

interface State {
  isActive: boolean;
}

export default class IntervalItemResizer extends React.Component<Props, State> {
  private root: HTMLElement;

  constructor() {
    super();
    this.state = { isActive: false };
  }

  private focus() {
    if (!this.state.isActive) {
      this.setState({ isActive: true });
    }
  }

  private blur() {
    if (this.state.isActive) {
      this.setState({ isActive: false });
    }
  }

  private onDocumentClick = (event: any) => {
    if (util.hasParent(event.target, this.root)) {
      this.focus();
    } else {
      this.blur();
    }
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  private getClasses() {
    const { direction } = this.props
    return classNames(
      styles.intervalInputResizer,
      {
        [styles.intervalInputResizerLeft]: direction === 'left',
        [styles.intervalInputResizerRight]: direction === 'right'
      }
    );
  }

  render() {
    return (
      <div
        ref={(root) => { this.root = root }}
        className={this.getClasses()}
      >
        {this.state.isActive ? 'active' : ''}
      </div>
    );
  }
}
