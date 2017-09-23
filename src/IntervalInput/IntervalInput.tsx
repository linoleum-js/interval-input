
import React = require('react');
import PropTypes = require('prop-types');

import IntervalItem from '../IntervalItem/IntervalItem';
import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
import * as util from '../util/util';
const styles = require('./IntervalInput.css');

interface Props {
  min: number;
  max: number;
  data: IntervalInputData;
  step: number;
  onChange?: Function;
}

interface State {
  unitSize: number;
  currentActiveId?: string;
  stepInPixels: number;
}

/**
 *
 */
export default class IntervalInput extends React.Component<Props, State> {
  private root: HTMLElement;
  private numberOfSteps: number;

  constructor(props: Props) {
    super(props);
    const { min, max, step } = props;
    this.state = { unitSize: 1, stepInPixels: 1 };
  }

  componentDidMount() {
    this.initialize();
  }

  private initialize = () => {
    const width = this.root.offsetWidth;
    const { min, max, step } = this.props;
    const unitSize = width / (max - min);
    const stepInPixels = util.unitsToPixels(step, unitSize);
    this.setState({ unitSize, stepInPixels });
  }

  private onItemActive = (itemId: string) => {
    this.setState({ currentActiveId: itemId });
  }

  private isItemActive(item: IntervalInputDataItem) {
    return this.state.currentActiveId === item.id;
  }

  private onItemChanging = (item: IntervalInputDataItem, index: number) => {
    // some geometry and collision detection
    // round to the unitSize
    const { step, data, onChange } = this.props;
    const { intervals } = data;
    const newData = {
      intervals: [
        ...intervals.slice(0, index),
        item,
        ...intervals.slice(index + 1)
      ]
    };
    onChange(newData);
  }

  private onItemChangingFinish = (item: IntervalInputDataItem, index: number) => {
    const { step } = this.props;
    item.start = util.roundTo(item.start, step);
    item.end = util.roundTo(item.end, step);
    this.onItemChanging(item, index);
  }

  render() {
    const { data, step } = this.props;
    const { unitSize, stepInPixels } = this.state;

    return (
      <div
        className={ styles.intervalInput }
        ref={(root) => { this.root = root; }}
      >
        {data.intervals.map((item: IntervalInputDataItem, index: number): any => {
          return <IntervalItem
            {...item}
            step={ step }
            key={ item.id }
            onActive={ this.onItemActive }
            isActive={ this.isItemActive(item) }
            unitSize={ unitSize }
            stepInPixels={ stepInPixels }
            onItemChanging={
              (item: IntervalInputDataItem) => {
                this.onItemChanging(item, index);
              }
            }
            onItemChangingFinish={
              (item: IntervalInputDataItem) => {
                this.onItemChangingFinish(item, index);
              }
            }
          />;
        })}
      </div>
    );
  }
}
