import React from 'react';
import { SvgTrashCan } from '../assets/icons/SvgTrashCan';

export class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      isCompleted: this.props.taskObj.isCompleted,
    };
    // мс
    this.transitionTime = 300;
  }

  componentWillUnmount() {
    clearTimeout(this.timerIdDelete);
    clearTimeout(this.timerIdComplete);
  }

  handleTaskComplete = (e) => {
    // throw new Error();
    this.setState((state) => ({ isCompleted: !state.isCompleted }));
    this.timerIdComplete = setTimeout(
      () => this.props.onCompleteTask(this.props.taskObj.id),
      this.transitionTime
    );
  };

  handleTaskDelete = (e) => {
    this.setState({ deleted: true });
    this.timerIdDelete = setTimeout(
      () => this.props.onDeleteTask(this.props.taskObj.id),
      this.transitionTime
    );
  };

  render() {
    if (this.props.taskObj.value === 'error') {
      throw new Error(this.props.taskObj.id);
    }
    return (
      <li
        className={`task-item ${this.state.isCompleted ? 'completed' : 'active'} ${
          this.state.deleted ? 'deleted' : ''
        }`}
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
