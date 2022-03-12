import SidePanelOptMgr from './SidePanelOptMgr'
import DatabaseMgr from './DatabaseMgr'
import FilterMgr from './FilterMgr'
import UserInfoMgr from './UserInfoMgr'

const sidePanelOptMgr = new SidePanelOptMgr()
const dbMgr = new DatabaseMgr()
const filterMgr = new FilterMgr() // must initialise after dbmanager
const userInfoMgr = new UserInfoMgr()

export {filterMgr, sidePanelOptMgr, dbMgr, userInfoMgr}