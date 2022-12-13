import React from 'react';
import { SvgTrashCan } from '../assets/icons/SvgTrashCan';
import { STATELIST } from '../constant';

export class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
    };
    // мс
    this.transitionTime = 300;
  }

  handleTaskComplete = (e) => {
    this.props.onCompleteTask(this.props.taskObj);
  };

  handleTaskDelete = (e) => {
    e.stopPropagation();
    this.setState({ deleted: true });
    setTimeout(() => this.props.onDeleteTask(this.props.taskObj.id), this.transitionTime);
  };

  render() {
    return (
      <li
        className={`task-item ${STATELIST[this.props.taskObj.state]} ${
          this.state.deleted ? 'deleted' : ''
        }`}
        style={{
          transition: this.state.deleted ? `opacity ${this.transitionTime}ms` : 'inherit',
        }}
        onClick={this.handleTaskComplete}
      >
        <div className="task-item-value">{this.props.taskObj.value}</div>
        <div className="btn-task" onClick={this.handleTaskDelete}>
          <SvgTrashCan />
        </div>
      </li>
    );
  }
}
