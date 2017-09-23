
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
}

/**
 *
 */
export default class IntervalInput extends React.Component<Props, State> {
  private root: HTMLElement;
  private numberOfSteps: number;
  private stepSizeInPixels: number;

  constructor(props: Props) {
    super(props);
    const { min, max, step } = props;
    this.state = { unitSize: 1 };
  }

  componentDidMount() {
    this.initialize();
  }

  private initialize = () => {
    const width = this.root.offsetWidth;
    const { min, max } = this.props;
    this.setState({
      unitSize: width / (max - min)
    });
  }

  private onItemActive = (itemId: string) => {
    this.setState({ currentActiveId: itemId });
  }

  private isItemActive(item: IntervalInputDataItem) {
    return this.state.currentActiveId === item.id;
  }

  private onItemChange = (item: IntervalInputDataItem, index: number) => {
    // some geometry and collision detection
    // round to the unitSize
    const { step, data, onChange } = this.props;
    const { intervals } = data;
    // item.start = util.roundTo(item.start, step);
    // item.end = util.roundTo(item.end, step);
    const newData = {
      intervals: [
        ...intervals.slice(0, index),
        item,
        ...intervals.slice(index + 1)
      ]
    };
    onChange(newData);
  }

  render() {
    const { data, step } = this.props;
    const { unitSize } = this.state;

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
            onChange={
              (item: IntervalInputDataItem) => {
                this.onItemChange(item, index);
              }
            }
          />;
        })}
      </div>
    );
  }
}
