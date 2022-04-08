import {createSlice} from '@reduxjs/toolkit'
import { dbMgr } from '../components/controls/Mgr'

export const INIT_FILTER_OPTIONS = {
    score: {label: 'Score', checked: true, threshold: 0},
    enbloc: {label: 'Enbloc', checked: true, threshold: 1},
    distToMrt: {label: 'Distance to MRT', checked: true, threshold: 4},
    distToSchool: {label: 'Distance to School', checked: true, threshold: 4}
}
const filterSlice = createSlice({
    name: 'filterOptions',
    initialState: INIT_FILTER_OPTIONS,
    reducers: {
        setFilterCheckBox: (state, action) => {
            const {key, value} = action.payload

            state[key].checked = value
            if (!value) {
                state[key].threshold = INIT_FILTER_OPTIONS[key].threshold
            }
            
            if (Object.keys(state).filter(fKey => fKey !== 'score' && state[fKey].checked).length === 0) {
                state['score'].checked = false
                state['score'].threshold = 0
            } else {
                state['score'].checked = true
            }
            dbMgr.updateFilterDependVals(state)
        },
        setFilterSlider: (state, action) => {
            const {key, value} = action.payload
            state[key].threshold = value
            dbMgr.updateFilterDependVals(state)
        },
        resetFilters: () => {
            dbMgr.updateFilterDependVals(INIT_FILTER_OPTIONS)
            return INIT_FILTER_OPTIONS
        }
    }
})

export const {setFilterCheckBox, setFilterSlider, resetFilters} = filterSlice.actions

export default filterSlice.reducer
