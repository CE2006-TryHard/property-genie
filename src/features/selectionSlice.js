import {createSlice} from '@reduxjs/toolkit'

const selectionSlice = createSlice({
    name: 'selection',
    initialState: {
        property: null,
        constituency: null
    },
    reducers: {
        selectProperty: (state, actions) => {
            const property = actions.payload

            if (property) state.constituency = property.constituency
            state.property = property
        },
        selectConstituency: (state, actions) => {
            const constituency = actions.payload
            state.property = null
            state.constituency = constituency
        }
    }
})

export const {selectProperty, selectConstituency} = selectionSlice.actions

export default selectionSlice.reducer
