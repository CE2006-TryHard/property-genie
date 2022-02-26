import FilterMgr from './FilterMgr'
import SidePanelOptMgr from './SidePanelOptMgr'
import DatabaseMgr from './DatabaseMgr'
import UserInfoMgr from './UserInfoMgr'

const filterMgr = new FilterMgr()
const sidePanelOptMgr = new SidePanelOptMgr()
const dbMgr = new DatabaseMgr()
const userInfoMgr = new UserInfoMgr()

export {filterMgr, sidePanelOptMgr, dbMgr, userInfoMgr}