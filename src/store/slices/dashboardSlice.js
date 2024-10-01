import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "api/API";
import Axios from "api/Axios";
import { SET_DATE_RANGES } from "store/actions";

export const updateUser = createAsyncThunk("updateUser", async (data) => {
  // console.log(data, "updateUser");
  try {
    const response = await Axios.Filepost(
      `${API.Update_Profile}/${data.id}`,
      data.formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
});

export const dashboardSlice = createSlice({
  name: "dashboardSlice",

  // initialization of all states
  initialState: {
    loading: false,
    error: null,
    dateRanges: {},
    users: [],
  },

  // reducer calling for dynamic states
  reducers: {
    setDateRanges: (state, action) => {
      state.dateRanges = action.payload;
    },
    ProfileUser: (state, action) => {
      state.users = action.payload;
    },
  },

  // extraReducers calling for API in reducer one time instead of every page
  extraReducers: (builder) => {
    builder
      .addCase(SET_DATE_RANGES, (state, action) => {
        state.dateRanges = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setDateRanges, ProfileUser } = dashboardSlice.actions;
export default dashboardSlice.reducer;
