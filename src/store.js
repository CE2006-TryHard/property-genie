import {configureStore} from '@reduxjs/toolkit'
import loadingStateReducer from './features/loadingStateSlice'
// import authInfoReducer from './features/authInfoSlice'
import filterOptionsReducer from './features/filterSlice'
export default configureStore({
    reducer: {
        loadingState: loadingStateReducer,
        // authInfo: authInfoReducer
        filterOptions: filterOptionsReducer
    }
})