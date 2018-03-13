
import React = require('react');
import classNames = require('classnames');

const styles = require('./IntervalContextMenu.css');
import * as util from '../util/util';
import types from '../util/types';

interface Props {
  canCreate: boolean;
  onCreate: any;
  onRemove: any;
  onTypeChange: any;
  position: any;
  type: string;
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

  private onTypeChange = (typeName: string, event: any) => {
    const { type, onTypeChange } = this.props;
    if (type === typeName) {
      event.preventDefault();
      return;
    }
    onTypeChange(typeName);
  }

  private getStyle() {
    return this.props.position
  }

  private getItemClass(typeName: string) {
    const { type } = this.props;
    return classNames({
      [styles.contextMenuItemActive]: typeName === type
    });
  }

  render() {
    const { isTypeChanging } = this.state;
    const { type, canCreate } = this.props;

    return (
      <div
        onClick={ util.supressEvent }
        onMouseDown={ util.supressEvent }
        onContextMenu={ util.supressEvent }
        className={ styles.contextMenu }
        style={ this.getStyle() }
      >
        {!isTypeChanging && <div>
          {!util.isEmpty(type) && <span onClick={this.props.onRemove}>Remove</span>}
          {canCreate && <span onClick={this.props.onCreate}>Create</span>}
          <span onClick={this.typeChanging}>Change type</span>
        </div>}

        {isTypeChanging && <div>
          {Object.keys(types).map((typeName: string) => {
            const type = types[typeName];
            return <span
              key={typeName}
              onClick={(event) => { this.onTypeChange(typeName, event) }}
              className={ this.getItemClass(typeName) }
            >{type.viewName}</span>;
          })}
        </div>}
      </div>
    );
  }
}
