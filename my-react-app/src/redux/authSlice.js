// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../api/axiosInstance";

// // NOTE: keeping the access token in Redux state means it lives in memory
// // only — it disappears on a full page refresh (that's fine: on app load we
// // call checkAuth() below, which uses the httpOnly refresh cookie to silently
// // get a new one). This avoids ever putting the token in localStorage, which
// // is readable by any injected/XSS script.

// export const signupUser = createAsyncThunk(
//   "auth/signup",
//   async ({ name, email, password }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/auth/signup", { name, email, password });
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Signup failed");
//     }
//   }
// );

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/auth/login", { email, password });
//       return data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Invalid email or password");
//     }
//   }
// );

// // Called once when the app first loads, to restore a session from the
// // httpOnly refresh cookie without the user re-entering credentials.
// // export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
// //   try {
// //     const { data } = await api.post("/auth/refresh");
// //     return data.accessToken;
// //   } catch (err) {
// //     return rejectWithValue(null);
// //   }
// // });
// export const checkAuth = createAsyncThunk(
//   "auth/checkAuth",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await api.post("/auth/refresh");

//       return data;
//     } catch (err) {
//       return rejectWithValue(null);
//     }
//   }
// );
// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   await api.post("/auth/logout");
// });

// const initialState = {
//   user: null,
//   accessToken: null,
//   status: "idle", // idle | loading | succeeded | failed
//   error: null,
//   initialized:false
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAccessToken: (state, action) => {
//       state.accessToken = action.payload;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.accessToken = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signupUser.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(signupUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//       })
//       .addCase(signupUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(loginUser.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.accessToken = action.payload;
//       })
//       .addCase(checkAuth.rejected, (state) => {
//         state.user = null;
//         state.accessToken = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.user = null;
//         state.accessToken = null;
//       });
//   },
// });

// export const { setAccessToken, logout } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Invalid email or password"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/refresh");

      return data;
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await api.post("/auth/logout");
  }
);

const initialState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.initialized = true;
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.initialized = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
        state.initialized = false;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.initialized = true;

        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.status = "failed";
        state.initialized = true;

        state.user = null;
        state.accessToken = null;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.initialized = true;
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;