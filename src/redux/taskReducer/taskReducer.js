import { ADD_TASK, CLEAR_TASK, EDIT_TASK } from "./taskTypes";

const initialState = {
  tasks: [],
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case CLEAR_TASK:
      const updatedTasks = [...state.tasks];
      updatedTasks.splice(action.payload, 1);
      return {
        ...state,
        tasks: updatedTasks,
      };
    case EDIT_TASK:
      const newTasks = state.tasks.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: newTasks,
      };
    default:
      return state;
  }
};

export default taskReducer;
