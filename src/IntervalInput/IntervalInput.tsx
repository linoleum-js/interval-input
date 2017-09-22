
import React = require('react');
import PropTypes = require('prop-types');

import IntervalItem from '../IntervalItem/IntervalItem';
import IntervalInputData from '../interfaces/IntervalInputData';
import IntervalInputDataItem from '../interfaces/IntervalInputDataItem';
const styles = require('./IntervalInput.css');

interface Props {
  min: number;
  max: number;
  data: IntervalInputData;
  step: number;
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

  private onItemFocus = (itemId: string) => {
    this.setState({ currentActiveId: itemId });
  }

  private isItemActive(item: IntervalInputDataItem) {
    return this.state.currentActiveId === item.id;
  }

  render() {
    const { data, step } = this.props;
    const { unitSize } = this.state;

    return (
      <div
        className={ styles.intervalInput }
        ref={(root) => { this.root = root; }}
      >
        {data.intervals.map((item: IntervalInputDataItem): any => {
          return <IntervalItem
            {...item}
            step={ step }
            key={ item.id }
            onFocus={ this.onItemFocus }
            isActive={ this.isItemActive(item) }
            unitSize={unitSize}
          />;
        })}
      </div>
    );
  }
}
