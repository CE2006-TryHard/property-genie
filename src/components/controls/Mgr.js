import SidePanelOptMgr from './SidePanelOptMgr'
import DatabaseMgr from './DatabaseMgr'
import UserAuthMgr from './UserAuthMgr'

const sidePanelOptMgr = new SidePanelOptMgr()
const dbMgr = new DatabaseMgr()
const userAuthMgr = new UserAuthMgr()

export {sidePanelOptMgr, dbMgr, userAuthMgr}
