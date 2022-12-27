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
      options: {
        isCompletedInEnd: true,
      },
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
        if (taskObj.id !== taskId) return taskObj;
        // Поменять с 1 на 0 и наоборот
        taskObj.state = +!taskObj.state;
        return taskObj;
      });
      if (state.options.isCompletedInEnd) {
        const indexTask = taskArray.findIndex(({ id }) => id === taskId);
        const objTask = taskArray[indexTask];
        taskArray.splice(indexTask, 1);
        taskArray.push(objTask);
      }
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

  handleClickSearchButton = () => {
    this.setState((state) => ({ isSearch: !state.isSearch }));
  };

  handleOptionsTaskArray(taskArray, { isCompletedInEnd = false } = {}) {
    let copyTaskArray = [...taskArray];
    if (isCompletedInEnd) {
      copyTaskArray.sort(({ state: stateA }, { state: stateB }) => stateA - stateB);
    }
    return copyTaskArray;
  }

  render() {
    const taskArray = this.state.isSearch
      ? this.state.taskArray.filter((taskObj) => taskObj.value.includes(this.state.searchValue))
      : this.state.taskArray;
    const placeholderText = this.state.isSearch ? 'Поиск' : 'Добавить таску';
    return (
      <div className="App">
        <HeaderControl
          onSetNewTask={this.handleSetNewTask}
          onSearchTask={this.handleSearchTask}
          onClickSearchButton={this.handleClickSearchButton}
          isSearch={this.state.isSearch}
          placeholderText={placeholderText}
        />
        <TaskList
          taskArray={this.handleOptionsTaskArray(taskArray, this.state.options)}
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
