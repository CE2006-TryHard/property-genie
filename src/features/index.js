import { addBookmark, addBookmarks, removeBookmark, removeAllBookmarks } from "./bookmarkSlice"
import { setFilterCheckBox, setFilterSlider, resetFilters } from "./filterSlice"
import { setLoadingState } from "./loadingStateSlice"
import { setPageState } from "./pageStateSlice"
import { selectProperty, selectConstituency } from "./selectionSlice"
import { setTriggerReset } from "./triggerResetSlice"

export {
    addBookmark, addBookmarks, removeBookmark, removeAllBookmarks,
    setFilterCheckBox, setFilterSlider, resetFilters,
    setLoadingState,
    setPageState,
    selectProperty, selectConstituency,
    setTriggerReset
}
