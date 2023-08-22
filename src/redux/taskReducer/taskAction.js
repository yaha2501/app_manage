import { ADD_TASK, CLEAR_TASK, EDIT_TASK } from "./taskTypes";

export const addTaskAction = (task) => {
  return {
    type: ADD_TASK,
    payload: task,
  };
};

export const clearTaskAction = (index) => {
  return {
    type: CLEAR_TASK,
    payload: index,
  };
};
export const editTaskAction = (index) => {
  return {
    type: EDIT_TASK,
    payload: index,
  };
};
