import React from 'react';
import Joi from 'joi';
import { HeaderControl } from './components/HeaderControl';
import { TaskList } from './components/TaskList';
import { LOCALNAME } from './constant';

const taskSchema = Joi.array().items(
  Joi.object({
    id: Joi.number(),
    value: Joi.string(),
    state: Joi.number().integer().min(0).max(1),
  })
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    try {
      this.state = { taskArray: Joi.attempt(JSON.parse(localStorage[LOCALNAME]), taskSchema) };
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

  handleSearchTask = (taskValue) => {
    // this.setState((state) => ({
    //   taskArrayFilter: taskValue
    //     ? state.taskArray.filter((taskObj) => taskObj.value.includes(taskValue))
    //     : state.taskArray,
    // }));
  };

  render() {
    return (
      <div className="App">
        <HeaderControl
          onSetNewTask={this.handleSetNewTask}
          onSearchTask={this.handleSearchTask}
        />
        <TaskList
          taskArray={this.state.taskArray}
          onCompleteTask={this.handleSwitchCompleteTask}
          onDeleteTask={this.handleDeleteTask}
        />
      </div>
    );
  }
}
/*

[
	{id: 0, value: 'aboba', state: 0}
]

*/
