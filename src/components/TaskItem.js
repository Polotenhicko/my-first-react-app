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

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  handleTaskComplete = (e) => {
    this.props.onCompleteTask(this.props.taskObj.id);
  };

  handleTaskDelete = (e) => {
    this.setState({ deleted: true });
    this.timerId = setTimeout(() => this.props.onDeleteTask(this.props.taskObj.id), this.transitionTime);
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
      >
        <div className="task-item-value" onClick={this.handleTaskComplete}>
          {this.props.taskObj.value}
        </div>
        <button className="btn-task btn" onClick={this.handleTaskDelete}>
          <SvgTrashCan />
        </button>
      </li>
    );
  }
}
