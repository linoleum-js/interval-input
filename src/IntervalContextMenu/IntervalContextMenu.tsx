
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalContextMenu.css');
import * as util from '../util/util';
import types from '../util/types';

interface Props {
  canCreate: boolean;
  isEmpty: boolean;
  onCreate: any;
  onRemove: any;
  onChange: any;
  position: any;
}

interface State {
  isTypeChanging: boolean;
}

export default class IntervalContextMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isTypeChanging: false
    };
  }

  private typeChanging = () => {
    this.setState({ isTypeChanging: true });
  }

  private onTypeChange = (typeName: string) => {

  }

  private supressEvent = (event: any) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  private getStyle() {
    return this.props.position
  }

  render() {
    const { isTypeChanging } = this.state;

    return (
      <div
        onClick={this.supressEvent}
        onMouseDown={this.supressEvent}
        className={ styles.contextMenu }
        style={ this.getStyle() }
      >
        {!isTypeChanging && <div>
          <span onClick={this.props.onRemove}>Remove</span>
          <span onClick={this.props.onCreate}>Create</span>
          <span onClick={this.typeChanging}>Change type</span>
        </div>}

        {isTypeChanging && <div>
          {Object.keys(types).map((typeName: string) => {
            const type = types[typeName];
            if (typeName === 'empty') { return ''; }
            return <span
              key={typeName}
              onClick={() => { this.onTypeChange(typeName) }}
            >{type.viewName}</span>;
          })}
        </div>}
      </div>
    );
  }
}
