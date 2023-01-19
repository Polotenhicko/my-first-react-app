export const LOCALNAME_TASKS = '__taskArray';
export const LOCALNAME_OPTIONS = '__taskOptions';
export const DATA_MODELS = {
  tasks: {
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
  },
  options: {
    isCompletedInEnd: 'boolean',
  },
};
export const optionsDefaultModel = {
  isCompletedInEnd: false,
};

// STATELIST = {
//   0: 'active',
//   1: 'completed',
// };
