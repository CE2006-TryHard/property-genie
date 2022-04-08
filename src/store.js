import {configureStore} from '@reduxjs/toolkit'
import loadingStateReducer from './features/loadingStateSlice'

export default configureStore({
    reducer: {
        loadingState: loadingStateReducer
    }
})