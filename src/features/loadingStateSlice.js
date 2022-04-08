import {createSlice} from '@reduxjs/toolkit'

export const loadingStateSlice = createSlice({
    name: 'loadingState',
    initialState: {
        value: 0
    },
    reducers: {
        setLoadingState: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {setLoadingState} = loadingStateSlice.actions

export default loadingStateSlice.reducer
