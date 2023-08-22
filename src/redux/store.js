import { createStore } from "redux";
import taskReducer from "./taskReducer/taskReducer.js";

const store = createStore(taskReducer);

export default store;
