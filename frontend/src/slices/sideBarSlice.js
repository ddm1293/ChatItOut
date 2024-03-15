import { createSlice } from '@reduxjs/toolkit'

const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState: {
    currentPage: 'welcome'
  },
  reducers: {
    setCurrPage: (state, action) => {
      state.currentPage = action.payload
    }
  }
});

export const selectCurrentPage = (state) => state.sideBar.currentPage
export const { setCurrPage } = sideBarSlice.actions
export default sideBarSlice.reducer