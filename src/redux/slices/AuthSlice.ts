import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

const initialState: any = {
  userDetails: null,
};
const AuthSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setAuthSlice(state, action: PayloadAction<any>) {
      const { userDetails } = action.payload;
      return produce(state, (draftState: any) => {
        if (userDetails !== undefined) {
          draftState.userDetails = userDetails;
        }
      });
    },
    //@ts-ignore
    resetAuthSlice(state) {
      return initialState;
    },
  },
});

export const { setAuthSlice, resetAuthSlice } = AuthSlice.actions;

export default AuthSlice.reducer;
