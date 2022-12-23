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
    let taskArray;
    try {
      taskArray = Joi.attempt(JSON.parse(localStorage[LOCALNAME]), taskSchema);
    } catch (e) {
      taskArray = [];
      localStorage.setItem(LOCALNAME, JSON.stringify([]));
    }
    this.state = {
      taskArray,
      isSearch: false,
      searchValue: '',
    };
    const idList = taskArray.map((taskObj) => taskObj.id);
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

  handleSwitchCompleteTask = (taskId) => {
    this.setState((state) => {
      const taskArray = state.taskArray.map((taskObj) => {
        if (taskObj.id != taskId) return taskObj;
        // Поменять с 1 на 0 и наоборот
        taskObj.state = +!taskObj.state;
        return taskObj;
      });
      localStorage.setItem(LOCALNAME, JSON.stringify(taskArray));
      return { taskArray };
    });
  };

  handleDeleteTask = (taskId) => {
    this.setState((state) => {
      const taskArray = state.taskArray.filter((taskObj) => taskObj.id !== taskId);
      localStorage.setItem(LOCALNAME, JSON.stringify(taskArray));
      return {
        taskArray,
      };
    });
  };

  handleSearchTask = (searchValue) => {
    this.setState({
      searchValue,
    });
  };

  handleSwitchSearchButton = () => {
    this.setState((state) => ({ isSearch: !state.isSearch }));
  };

  render() {
    const taskArray = this.state.isSearch
      ? this.state.taskArray.filter((taskObj) => taskObj.value.includes(this.state.searchValue))
      : this.state.taskArray;
    return (
      <div className="App">
        <HeaderControl
          onSetNewTask={this.handleSetNewTask}
          onSearchTask={this.handleSearchTask}
          onClickSearchButton={this.handleSwitchSearchButton}
          isSearch={this.state.isSearch}
        />
        <TaskList
          taskArray={taskArray}
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
