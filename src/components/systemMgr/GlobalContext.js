import SidePanelOptMgr from './SidePanelOptMgr'
import DatabaseMgr from './DatabaseMgr'
import FilterMgr from './FilterMgr'

const sidePanelOptMgr = new SidePanelOptMgr()
const dbMgr = new DatabaseMgr()
const filterMgr = new FilterMgr() // must initialise after dbmanager

export {filterMgr, sidePanelOptMgr, dbMgr}