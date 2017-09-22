
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
  onFocus: Function;
  id: string;
  unitSize: number;
}

interface State {

}

export default class IntervalItem extends React.Component<Props, State> {
  private root: HTMLElement;

  constructor(props: Props) {
    super(props);
  }

  private onContextMenu = () => {
    console.log('menu');
  }

  private onFocus = () => {
    const { isActive, onFocus, id } = this.props;
    if (!isActive) {
      onFocus(id);
    }
  }

  componentDidMount() {
    this.root.addEventListener('contextmenu', this.onContextMenu, false);
    this.root.addEventListener('click', this.onFocus);
  }

  componentWillUnmount() {
    this.root.removeEventListener('contextmenu', this.onContextMenu);
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
    return classNames(styles.intervalItem, { 'js-interval-item-active': isActive });
  }

  render() {
    const { start, end, type, isActive } = this.props;

    return (
      <div
        className={ this.getClasses() }
        ref={(root) => { this.root = root; }}
        style={ this.getStyle() }
      >
        <IntervalItemResizer direction="left" />

        <IntervalItemResizer direction="right" />
      </div>
    );
  }
}
