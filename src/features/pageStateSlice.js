import {createSlice} from '@reduxjs/toolkit'

const pageStateSlice = createSlice({
    name: 'pageState',
    initialState: 0,
    reducers: {
        setPageState: (state, actions) => {
            console.log('set page state', actions.payload)
            return actions.payload
        }
    }
})

export const {setPageState} = pageStateSlice.actions

export default pageStateSlice.reducer
