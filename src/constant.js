export const LOCALNAME = '__taskArray';
export const STATELIST = {
  0: 'active',
  1: 'completed',
};
export const dataModels = {
  taskObject: {
    id: 'number',
    value: 'string',
    isCompleted: 'boolean',
    dateStart: 'number',
    dateEnd: 'number',
  },
  oldTaskObject: {
    id: 'number',
    value: 'string',
    state: 'number',
  },
};
export function getTasksArray(json) {
  let taskArray;
  try {
    const taskArrayParsed = JSON.parse(json);
    if (!Array.isArray(taskArrayParsed)) throw new Error('Не массив');
    // получить валидный массив на основе старой модели
    taskArray = getValidTasks(taskArrayParsed, dataModels.taskObject);
    // если пустой, то след модель, мб какой-то обработчик со списком сделать
    if (!taskArray.length) taskArray = getValidTasks(taskArrayParsed, dataModels.oldTaskObject);
  } catch (e) {
    taskArray = [];
  }
  return taskArray;
}
function getValidTasks(array, dataModel) {
  const taskArray = [];
  for (const taskObject of array) {
    // Проверка на объект
    if (typeof taskObject !== 'object' || !taskObject || Array.isArray(taskObject)) continue;
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
    case dataModels.oldTaskObject:
      taskObject = {
        id: object.id,
        value: object.value,
        isCompleted: !!object.state,
        dateStart: Date.now(),
        dateEnd: object.state ? Date.now() : 0,
      };
      break;
    case dataModels.taskObject:
      taskObject = object;
      break;
  }
  // валидный объект, либо undefined
  return taskObject;
}
