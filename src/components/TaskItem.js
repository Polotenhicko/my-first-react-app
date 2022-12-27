import React from 'react';
import { SvgTrashCan } from '../assets/icons/SvgTrashCan';
import { STATELIST } from '../constant';

export class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleted: false,
      state: this.props.taskObj.state,
    };
    // мс
    this.transitionTime = 300;
  }

  componentWillUnmount() {
    clearTimeout(this.timerIdDelete);
    clearTimeout(this.timerIdComplete);
  }

  handleTaskComplete = (e) => {
    this.setState((state) => ({ state: +!state.state }));
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
    return (
      <li className={`task-item ${STATELIST[this.state.state]} ${this.state.deleted ? 'deleted' : ''}`}>
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
