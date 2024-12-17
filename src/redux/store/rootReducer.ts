import { combineReducers } from "redux";
import exampleSlice from "../slices/ExampleSlice";

const rootReducer = combineReducers({
  example: exampleSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
