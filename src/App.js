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
  handleTaskComplete = (e) => {
    this.props.onCompleteTask(this.props.taskObj);
  };

  handleTaskDelete = (e) => {
    this.props.onDeleteTask(this.props.taskObj.id);
  };

  render() {
    return (
      <li className={`task-item ${STATELIST[this.props.taskObj.state]}`}>
        <span className="task-item-value" onClick={this.handleTaskComplete}>
          {this.props.taskObj.value}
        </span>
        <div className="btn-task" onClick={this.handleTaskDelete}>
          Удалить
        </div>
      </li>
    );
  }
}

export default App;

/*

[
	{id: 0, value: 'aboba', state: 0}
]

*/
