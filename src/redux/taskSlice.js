import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    taskList: JSON.parse(localStorage.getItem("taskList")) || [],
    // Nếu trong localStorage tồn tại item có key "taskList" thì sẽ lấy ra gán vào state khởi tạo, không thì sẽ lấy mảng trống.
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.taskList.push(action.payload); // đẩy phần tử mới vào taskList
            localStorage.setItem("taskList", JSON.stringify(state.taskList)); // cập nhật lại vào localStorage
        },
        deleteTask: (state, action) => {
            const newTaskList = state.taskList.filter(
                (task) => task.taskID !== action.payload // Lấy ra mảng mới không có phần tử muốn xoá
            );
            state.taskList = newTaskList; // cập nhất lại state với mảng mới
            localStorage.setItem("taskList", JSON.stringify(state.taskList)); // cập nhật lại localStorage
        },
        editTask: (state, action) => {
            state.taskList.some((task, index) => {
                if (task.taskID === action.payload.taskID) {
                    state.taskList[index] = action.payload;
                    return true;
                }
                return false;
            });
            localStorage.setItem("taskList", JSON.stringify(state.taskList)); // cập nhật lại localStorage
        },
    },
});

export const { addTask, deleteTask, editTask } = taskSlice.actions;
export default taskSlice;
