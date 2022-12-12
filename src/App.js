import React from 'react';
import Joi from 'joi';

const taskSchema = Joi.array().items(
  Joi.object({
    id: Joi.number(),
    value: Joi.string(),
    state: Joi.number().integer().min(0).max(1),
  })
);

const LOCALNAME = '__taskArray';
const STATELIST = {
  0: 'active',
  1: 'completed',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      this.state = {
        taskArray: Joi.attempt(JSON.parse(localStorage[LOCALNAME]), taskSchema),
      };
    } catch (e) {
      this.state = { taskArray: [] };
      localStorage.setItem(LOCALNAME, JSON.stringify([]));
    }

    const idList = this.state.taskArray.map((taskObj) => taskObj.id);
    this.maxId = idList.length ? Math.max(...idList) : -1;
  }

  handleSetNewTask = (taskValue) => {
    const taskObj = {
      id: ++this.maxId,
      value: taskValue,
      state: 0,
    };
    this.setState((state) => {
      const taskArray = [...state.taskArray, taskObj];
      localStorage.setItem(LOCALNAME, JSON.stringify(taskArray));
      return { taskArray };
    });
  };

  handleSwitchCompleteTask = (taskObj) => {
    this.setState((state) => {
      const indexTaskObj = state.taskArray.indexOf(taskObj);
      state.taskArray[indexTaskObj].state = state.taskArray[indexTaskObj].state ? 0 : 1;
      localStorage.setItem(LOCALNAME, JSON.stringify(state.taskArray));
      return state;
    });
  };

  handleDeleteTask = (taskId) => {
    this.setState((state) => {
      const taskArray = state.taskArray.filter((taskObj) => taskObj.id !== taskId);
      localStorage.setItem(LOCALNAME, JSON.stringify(taskArray));
      return { taskArray };
    });
  };

  render() {
    return (
      <div className="App">
        <HeaderControl onSetNewTask={this.handleSetNewTask} />
        <TaskList
          taskArray={this.state.taskArray}
          onCompleteTask={this.handleSwitchCompleteTask}
          onDeleteTask={this.handleDeleteTask}
        />
      </div>
    );
  }
}

class HeaderControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleInput = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleForm = (e) => {
    e.preventDefault();
    if (this.state.value) this.props.onSetNewTask(this.state.value);
  };

  render() {
    return (
      <form className="todo-header" onSubmit={this.handleForm}>
        <input
          className="todo-input"
          type="text"
          onChange={this.handleInput}
          value={this.state.value}
        />
        <button className="todo-submit" type="submit">
          Добавить
        </button>
      </form>
    );
  }
}

function TaskList(props) {
  const taskArray = props.taskArray.map((taskObj) => (
    <TaskItem
      key={taskObj.id}
      taskObj={taskObj}
      onCompleteTask={props.onCompleteTask}
      onDeleteTask={props.onDeleteTask}
    />
  ));
  return <ul className="task-list">{taskArray}</ul>;
}

class TaskItem extends React.Component {
  state = {
    deleted: false,
  };

  // мс
  #TRANSTIME = 300;

  handleTaskComplete = (e) => {
    this.props.onCompleteTask(this.props.taskObj);
  };

  handleTaskDelete = (e) => {
    e.stopPropagation();
    this.setState({ deleted: true });
    setTimeout(() => this.props.onDeleteTask(this.props.taskObj.id), this.#TRANSTIME);
  };

  render() {
    return (
      <li
        className={`task-item ${STATELIST[this.props.taskObj.state]} ${
          this.state.deleted ? 'deleted' : ''
        }`}
        style={{ transition: `opacity ${this.#TRANSTIME}ms` }}
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

function SvgTrashCan(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="489.74px"
      height="489.74px"
      viewBox="0 0 489.74 489.74"
    >
      <path d="M361.051,199.929H102.01V489.74h259.041V199.929L361.051,199.929z M170.818,450.163h-13.492V239.505h13.492V450.163z     M238.276,450.163h-13.492V239.505h13.492V450.163z M305.734,450.163h-13.492V239.505h13.492V450.163z" />
      <path d="M387.73,145.959l-52.74-30.672l28.129-48.365L248.047,0l-28.127,48.362l-56.113-32.634l-26.678,45.875l223.922,130.231    L387.73,145.959z M257.808,36.891l68.421,39.792l-14.564,25.038L243.241,61.93L257.808,36.891z" />
    </svg>
  );
}

export default App;

/*

[
	{id: 0, value: 'aboba', state: 0}
]

*/
