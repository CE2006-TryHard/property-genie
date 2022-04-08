import {configureStore} from '@reduxjs/toolkit'
import loadingStateReducer from './features/loadingStateSlice'
import filterOptionsReducer from './features/filterSlice'
import selectionReducer from './features/selectionSlice'
import bookmarksReducer from './features/bookmarkSlice' 
import pageStateReducer from './features/pageStateSlice'
import triggerResetReducer from './features/triggerResetSlice'

export default configureStore({
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [
                'selection/selectProperty',
                'selection/selectConstituency'
            ],
            ignoredPaths: [
                'selection.constituency',
                'selection.property',
                'bookmarks'
            ]
        }
    }),
    reducer: {
        loadingState: loadingStateReducer,
        filterOptions: filterOptionsReducer,
        selection: selectionReducer,
        bookmarks: bookmarksReducer,
        pageState: pageStateReducer,
        triggerReset: triggerResetReducer
    }
})
