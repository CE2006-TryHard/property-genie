import {createSlice} from '@reduxjs/toolkit'
import { dbMgr } from '../components/controls/Mgr'

const getBookmarkIndex = (bookmarks, property) => {
    let targetIndex = -1
    bookmarks.every((b, i) => {
        if (b.name === property.name) {
        targetIndex = i
        return false
        }
        return true
    })

    return targetIndex
}

const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState: [],
    reducers: {
        addBookmark: (state, actions) => {
            const {activeUser, property} = actions.payload
            const index = getBookmarkIndex(state, property)
            if (index < 0) {
                state.unshift(property)
                if (activeUser) dbMgr.updateUserDataDB(activeUser, 'bookmarks', state.map(b => b.id))
            }
            
            return state
        },
        removeBookmark: (state, actions) => {
            const {activeUser, property} = actions.payload
            const index = getBookmarkIndex(state, property)
            if (index >= 0) {
                state = [...state.slice(0, index), ...state.slice(index + 1, state.length)]
                if (activeUser) dbMgr.updateUserDataDB(activeUser, 'bookmarks', state.map(b => b.id))
            }
            
            return state
        },
        addBookmarks: (state, actions) => {
            const {properties} = actions.payload
            // console.log('add multi bookmarks', properties)
            return properties
        },
        removeAllBookmarks: (state, actions) => {
            const {activeUser} = actions.payload
            if (activeUser) dbMgr.updateUserDataDB(activeUser, 'bookmarks', [])
            return []
        }
    }
})

export const {addBookmark, addBookmarks, removeBookmark, removeAllBookmarks} = bookmarkSlice.actions

export default bookmarkSlice.reducer
