import {createSlice} from '@reduxjs/toolkit'

const triggerResetSlice = createSlice({
    name: 'triggerReset',
    initialState: false,
    reducers: {
        setTriggerReset: (state, actions) => {
            return !state
        }
    }
})


export const {setTriggerReset} = triggerResetSlice.actions

export default triggerResetSlice.reducer
