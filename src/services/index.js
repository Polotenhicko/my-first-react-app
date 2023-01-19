import { DATA_MODELS } from '../constant';

export const isObject = (obj) => typeof obj === 'object' && obj && !Array.isArray(obj);

export function getOptionsObject(optionsParsed) {
  if (!isObject(optionsParsed)) throw new Error('Это не объект');
  if (Object.keys(optionsParsed).length !== Object.keys(DATA_MODELS.options).length)
    throw new Error('Настройки не совпадают');
  for (const [key, type] of Object.entries(DATA_MODELS.options)) {
    if (!optionsParsed.hasOwnProperty(key) || typeof optionsParsed[key] !== type)
      throw new Error('Не совпадает с моделью');
  }
  return optionsParsed;
}

export function getTasksArray(taskArrayParsed) {
  let taskArray;
  let isOld = false;
  try {
    if (!Array.isArray(taskArrayParsed)) throw new Error('Не массив');
    // получить валидный массив на основе старой модели
    taskArray = getValidTasks(taskArrayParsed, DATA_MODELS.tasks.taskObject);
    // если пустой, то след модель, мб какой-то обработчик со списком сделать
    if (!taskArray.length) {
      taskArray = getValidTasks(taskArrayParsed, DATA_MODELS.tasks.oldTaskObject);
      isOld = true;
    }
  } catch (e) {
    taskArray = [];
  }
  return { taskArray, isOld };
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
