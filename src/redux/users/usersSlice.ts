import { User } from "../../models/users.model"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { FETCH_USERS_URL } from "../../api/endpoints";

type initialStateT = {
  isLoading: boolean
  users: User[]
  error: string | null
}

const initialState: initialStateT = {
  isLoading: false,
  users: [],
  error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (arg, {}) => {
  const response = await axios.get(FETCH_USERS_URL);
  return response.data;
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },

    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },

    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },

    editUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      state.users.splice(index, 1, action.payload)
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.isLoading = false
      state.users = action.payload
      state.error = null
    })
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false
      state.users = []
      state.error = action.error.message || 'Something went wrong'
    })
  }
})

export const {setUsers, removeUser, addUser, editUser} = usersSlice.actions
export default usersSlice.reducer;