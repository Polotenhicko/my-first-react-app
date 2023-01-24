import React from 'react';
import { HeaderControl } from './components/HeaderControl';
import { TaskList } from './components/TaskList';
import { getTaskArray, getOptionsObject } from './services/index';
import { LOCALNAME_TASKS, LOCALNAME_OPTIONS } from './constant';
import { Modal } from './components/Modal/Modal';
import { ModalSettings } from './components/Modal/ModalSettings';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeContext } from './theme-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // Получение тасок
    const taskArray = getTaskArray();
    // Получение настроек
    const options = getOptionsObject();
    this.state = {
      taskArray,
      isSearch: false,
      isModal: false,
      searchValue: '',
      options,
      theme: 'dark',
    };
    const idList = taskArray.map((taskObj) => taskObj.id);
    this.maxId = idList.length ? Math.max(...idList) : -1;
  }

  handleSetNewTask = (taskValue) => {
    const taskObj = {
      id: ++this.maxId,
      value: taskValue,
      isCompleted: false,
      dateStart: Date.now(),
      dateEnd: 0,
    };
    this.setState((state) => {
      const taskArray = [...state.taskArray, taskObj];
      localStorage.setItem(LOCALNAME_TASKS, JSON.stringify(taskArray));
      return { taskArray };
    });
  };

  handleSwitchCompleteTask = (taskId) => {
    this.setState((state) => {
      const taskArray = state.taskArray.map((taskObj) => {
        if (taskObj.id !== taskId) return taskObj;
        taskObj.isCompleted = !taskObj.isCompleted;
        return taskObj;
      });
      if (state.options.isCompletedInEnd) {
        const indexTask = taskArray.findIndex(({ id }) => id === taskId);
        const objTask = taskArray[indexTask];
        taskArray.splice(indexTask, 1);
        taskArray.push(objTask);
      }
      localStorage.setItem(LOCALNAME_TASKS, JSON.stringify(taskArray));
      return { taskArray };
    });
  };

  handleDeleteTask = (taskId) => {
    this.setState((state) => {
      const taskArray = state.taskArray.filter((taskObj) => taskObj.id !== taskId);
      localStorage.setItem(LOCALNAME_TASKS, JSON.stringify(taskArray));
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

  handleOptionsTaskArray = (taskArray, { isCompletedInEnd = false } = {}) => {
    let copyTaskArray = [...taskArray];
    if (isCompletedInEnd) copyTaskArray = this.getCompletedInEnd(copyTaskArray);
    return copyTaskArray;
  };

  getCompletedInEnd = (taskArray) => {
    const copyTaskArray = [...taskArray];
    return copyTaskArray.sort((taskObjA, taskObjB) => taskObjA.isCompleted - taskObjB.isCompleted);
  };

  showModal = () => {
    this.setState({ isModal: true });
  };

  closeModal = () => {
    this.setState({ isModal: false });
  };

  changeOptions = (value, option) => {
    this.setState((state) => {
      const options = { ...state.options };
      options[option] = value;
      localStorage.setItem(LOCALNAME_OPTIONS, JSON.stringify(options));
      return { options };
    });
  };

  changeTheme = (theme) => {
    this.setState({ theme });
  };

  render() {
    const taskArray = this.state.isSearch
      ? this.state.taskArray.filter((taskObj) => taskObj.value.includes(this.state.searchValue))
      : this.state.taskArray;
    const placeholderText = this.state.isSearch ? 'Поиск' : 'Добавить таску';
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <div className="App">
          <HeaderControl
            onSetNewTask={this.handleSetNewTask}
            onSearchTask={this.handleSearchTask}
            onClickSearchButton={this.handleClickSearchButton}
            onShowModal={this.showModal}
            isSearch={this.state.isSearch}
            placeholderText={placeholderText}
          />
          <TaskList
            taskArray={this.handleOptionsTaskArray(taskArray, this.state.options)}
            onCompleteTask={this.handleSwitchCompleteTask}
            onDeleteTask={this.handleDeleteTask}
          />
          <ThemeToggle onChangeTheme={this.changeTheme} />
          {this.state.isModal && (
            <Modal>
              <ModalSettings
                options={this.state.options}
                onChangeOptions={this.changeOptions}
                onCloseModal={this.closeModal}
              />
            </Modal>
          )}
        </div>
      </ThemeContext.Provider>
    );
  }
}
/*

[
	{id: 0, value: 'aboba', state: 0}
]

*/

/* 
Новая модель данных
[
  {id: 0, value: 'aboba', isCompleted: false, dateStart: 123, dateEnd: 124}
]

Настройки
{

}
*/
