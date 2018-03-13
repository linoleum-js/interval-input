
import IntervalInputData from '../interfaces/IntervalInputData';

interface IntervalInputProps {
  min: number;
  max: number;
  data: IntervalInputData;
  step: number;
  onChange?: Function;
  minWidth: number;
}

export default IntervalInputProps;
