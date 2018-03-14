
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalItem.css');
import * as util from '../util/util';
const documentStyles = require('../util/global.css');
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
  onMenuClose: Function;
  showMemu: boolean;
  onRemove: Function;
  onCreate: Function;
  index: number;
}

interface State {
}


// TODO split
export default class IntervalItem extends React.Component<Props, State> {
  private root: HTMLElement;
  private lastXPosition: number;
  private isInFocus: boolean;
  private menuPosition: object;

  constructor(props: Props) {
    super(props);
  }

  private isEmpty(): boolean {
    return util.isEmpty(this.props.type);
  }

  private onContextMenu = (event: any) => {
    event.preventDefault();
    const { onMenuOpen, id } = this.props;
    this.menuPosition = util.keepOnScreen({ left: event.clientX + 5, top: event.clientY + 5 }, 150);
    onMenuOpen(id);
  }

  private onClick = (event: any) => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation();
  }

  private focus = (event: any) => {
    if (this.isEmpty()) {
      return;
    }
    // only left button, to prevent dragging on context menu opening
    event.nativeEvent.stopImmediatePropagation();
    if (event.button !== 0) {
      return;
    }
    this.props.onMenuClose();
    this.isInFocus = true;
    this.lastXPosition = event.clientX;
    const { isActive, onActive, id } = this.props;
    if (!isActive) {
      onActive(id);
    }
    util.addDocumentClass(documentStyles.cursorGrabbing);
  }

  private blur = () => {
    this.isInFocus = false;
    util.removeDocumentClass(documentStyles.cursorGrabbing);
  }

  private onLeftMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize, step, index } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start: util.roundTo(start + diffInUnits, step), end, type, id };
    onItemChanging(newItem, index);
  }

  private onRightMove = (diff: number) => {
    const { onItemChanging, start, end, type, id, unitSize, step, index } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = { start, end: util.roundTo(end + diffInUnits, step), type, id };
    onItemChanging(newItem, index);
  }

  private onMoveFinish = () => {
    if(this.isEmpty()) {
      return;
    }
    const { onItemChangingFinish, start, end, type, id, index } = this.props;
    onItemChangingFinish({ start, end, type, id }, index);
  }

  private onDragCommit = (diff: number) => {
    if(this.isEmpty()) {
      return;
    }
    const { onItemChanging, start, end, type, id, unitSize, step, index } = this.props;
    const diffInUnits = util.pixelsToUnits(diff, unitSize);
    const newItem = {
      start: util.roundTo(start + diffInUnits, step),
      end: util.roundTo(end + diffInUnits, step),
      type, id
    };
    onItemChanging(newItem, index);
  }

  private onDrag = (event: any) => {
    if (!this.isInFocus || this.isEmpty()) {
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
    const { isActive, type } = this.props;
    const isEmpty = util.isEmpty(type);
    return classNames(styles.intervalItem, {
      [styles.intervalItemActive]: isActive,
      [styles.intervalItemEmpty]: isEmpty
    });
  }

  private onTypeChange = (newType: string) => {
    const { start, end, type, id, index, onItemChangingFinish } = this.props;
    onItemChangingFinish({ start, end, id, type: newType }, index);
  }

  render() {
    const { start, end, type, isActive, stepInPixels, canCreate,
            showMemu, onRemove, onCreate, id, index } = this.props;
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
          type={ type }
          onCreate={() => onCreate(index)}
          onRemove={() => onRemove(id)}
          onTypeChange={ this.onTypeChange }
          position={ this.menuPosition }
        />}
      </div>
    );
  }
}
