import { combineReducers } from "redux";
import exampleSlice from "../slices/ExampleSlice";
import AuthSlice from "../slices/AuthSlice";

const rootReducer = combineReducers({
  example: exampleSlice,
  AuthSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
