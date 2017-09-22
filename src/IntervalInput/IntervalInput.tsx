
import React = require('react');
import PropTypes = require('prop-types');

declare const require: any;

import IntervalItem from '../IntervalItem/IntervalItem';
import IntervalInputData from '../interfaces/IntervalInputData';
const styles = require('./IntervalInput.css');

interface Props {
  min: number;
  max: number;
  data: IntervalInputData;
  step: number;
}

interface State {
  width: number;
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
    this.numberOfSteps = (max - min) / step;
  }

  private initialize = () => {
    const width = this.root.offsetWidth;
    const stepSizeInPixels = width / this.numberOfSteps;
  }

  componentDidMount() {
    this.initialize();
  }

  render() {
    return (
      <div
        className={ styles.intervalInput }
        ref={(root) => { this.root = root; }}
      >

      </div>
    );
  }
}
