import {
  DATA_MODELS,
  LOCALNAME_TASKS,
  LOCALNAME_OPTIONS,
  LOCALNAME_THEME,
  optionsDefaultModel,
} from '../constant';
import { ThemeStyle } from '../theme-context';

export const isObject = (obj) => typeof obj === 'object' && obj && !Array.isArray(obj);

export function getTheme() {
  let theme;
  try {
    theme = localStorage[LOCALNAME_THEME];
    if (!ThemeStyle[theme]) throw new Error('Неверная тема');
  } catch (e) {
    console.error(e);
    theme = Object.keys(ThemeStyle)[0];
    localStorage.setItem(LOCALNAME_THEME, theme);
  }
  return theme;
}
// нет проверок с моделью данных на массив/объект/null, т.к. используется просто typeof
export function getOptionsObject() {
  let options;
  try {
    options = JSON.parse(localStorage[LOCALNAME_OPTIONS]);
    if (!isObject(options)) throw new Error('Это не объект');
    if (Object.keys(options).length !== Object.keys(DATA_MODELS.options).length)
      throw new Error('Настройки не совпадают');
    for (const [key, type] of Object.entries(DATA_MODELS.options)) {
      if (!options.hasOwnProperty(key) || typeof options[key] !== type)
        throw new Error('Не совпадает с моделью');
    }
  } catch (e) {
    options = { ...optionsDefaultModel };
    localStorage.setItem(LOCALNAME_OPTIONS, JSON.stringify(options));
  }

  return options;
}

export function getTaskArray() {
  let taskArray;
  let isOld = false;
  try {
    const taskArrayParsed = JSON.parse(localStorage[LOCALNAME_TASKS]);
    if (!Array.isArray(taskArrayParsed)) throw new Error('Не массив');
    // получить валидный массив на основе нынешней модели
    taskArray = getValidTasks(taskArrayParsed, DATA_MODELS.tasks.taskObject);
    // если пустой, то след модель, мб какой-то обработчик со списком сделать
    if (!taskArray.length) {
      taskArray = getValidTasks(taskArrayParsed, DATA_MODELS.tasks.oldTaskObject);
      isOld = true;
    }
  } catch (e) {
    taskArray = [];
    localStorage.setItem(LOCALNAME_TASKS, JSON.stringify([]));
  }
  if (isOld) localStorage.setItem(LOCALNAME_TASKS, JSON.stringify(taskArray));
  return taskArray;
}

function getValidTasks(array, dataModel) {
  const taskArray = [];
  for (const taskObject of array) {
    // Проверка на объект
    if (!isObject(taskObject)) continue;
    // то что это валидный объект, иначе некст объект
    const obj = getValidObjectTask(taskObject, dataModel);
    if (obj) taskArray.push(obj);
  }
  return taskArray;
}

function getValidObjectTask(object, dataModel) {
  let taskObject;
  for (const [key, type] of Object.entries(dataModel)) {
    if (!object.hasOwnProperty(key) || typeof object[key] !== type) return undefined;
  }
  // новый объект будет таким, если старая модель такая-то
  switch (dataModel) {
    case DATA_MODELS.tasks.oldTaskObject:
      taskObject = {
        id: object.id,
        value: object.value,
        isCompleted: !!object.state,
        dateStart: Date.now(),
        dateEnd: object.state ? Date.now() : 0,
      };
      break;
    case DATA_MODELS.tasks.taskObject:
      taskObject = object;
      break;
  }
  // валидный объект, либо undefined
  return taskObject;
}
