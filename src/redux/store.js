import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import taskSlice from "./taskSlice";

const store = configureStore({
    reducer: {
        task: taskSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
