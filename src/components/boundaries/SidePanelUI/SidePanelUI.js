import './SidePanelUI.scss'
import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {AccountUI, BookmarkUI, FilterPanelUI, ForgotPWUI, SignUpUI, SignInUI} from './..'
import { GreetUserMsg } from '../MiscUI/MiscUI'
import SidePanelWrapper from './SidePanelWrapper'
import { userAuthMgr } from '../../controls/Mgr'
import { setLoadingState, setPageState } from '../../../features'

const SIDE_PANEL_OPTIONS = {
    signinsignup: {  label: 'Sign In / Sign Up', hide: false, state: 2},
    accountinfo: {label: 'Account', hide: false, state: 4},
    bookmark: {label: 'Bookmarks', hide: false, enable: false, state: 5},
    filter: {label: 'Filters', hide: false, enable: true, state: 6},
    signout: {label: 'Sign out', hide: false, enable: false, state: 9}
}

/**
 * @namespace SidePanelUI
 * @description boundary module
 * @property {sidePanelIn} sidePanelIn value to show/hide side panel
 */
const SidePanelUI = props => {
    const dispatch = useDispatch()
    const pageState = useSelector(state => state.pageState)
    const triggerReset = useSelector(state => state.triggerReset)

    const [sidePanelIn, setSidePanelIn] = useState(false)
    const [subSidePanelIn, setSubSidePanelIn] = useState(false)
    const [sidePanelContent, setSidePanelContent] = useState(0)

    const {activeUser} = props

    useEffect(() => {
      if (sidePanelIn && pageState !== 8) setSidePanelIn(false)
      else if (subSidePanelIn) {
        if ([2, 3, 4, 5, 6, 10].indexOf(pageState) < 0) {
          setSubSidePanelIn(false)
        }
      }
    }, [pageState])

    useEffect(() => {
      setSidePanelIn(false)
      setSubSidePanelIn(false)
    }, [triggerReset])

    useEffect(() => {
      if (sidePanelIn) {
        dispatch(setPageState(8))
      }
    }, [sidePanelIn])

    const getOptionItems = () => {
        SIDE_PANEL_OPTIONS['signinsignup'].hide = !!activeUser
        SIDE_PANEL_OPTIONS['signout'].hide = !activeUser
        SIDE_PANEL_OPTIONS['accountinfo'].hide = !activeUser
        SIDE_PANEL_OPTIONS['bookmark'].hide = !activeUser

        return Object.keys(SIDE_PANEL_OPTIONS)
            .filter(optKey => !SIDE_PANEL_OPTIONS[optKey].hide)
            .map(optKey => SIDE_PANEL_OPTIONS[optKey])
    }

    /**
     * @memberof SidePanelUI
     * @typedef {function} onSidePanelOptSelect called when user click on one of the option on the side panel menu. Update page state.
     * @param {integer} newPageState new page state index.
     */
    const onSidePanelOptSelect = (newPageState) => {
        switch (newPageState) {
        case 2: // sign in
        case 4: // account info
        case 5: // bookmark
        case 6: // filter
            setSidePanelIn(false)
            setSidePanelContent(newPageState)
            setSubSidePanelIn(true)
            break
        case 9:
            onLogOut()
        break
        }
        dispatch(setPageState(newPageState))
    }

     /**
     * @memberof SidePanelUI
     * @typedef {function} onLogOut called when user clicks on log out button.
     */
    const onLogOut = () => {
        dispatch(setLoadingState(2))
        userAuthMgr.generalSignOut((success, err) => {
        if (success) {
            setTimeout(() => { // add a deplay during sign out
            setSidePanelIn(false)
            dispatch(setPageState(0))
            dispatch(setLoadingState(0))
            // localStorage.removeItem('activeUser')
            }, 1000)
        }
        })
        
    }

    /**
     * @memberof SidePanelUI
     * @typedef {FunctionalComponent} SubSidePanelContent a functional component rendering lightbox content based on current page state.
     */
  const SubSidePanelContent = () => {
    switch (sidePanelContent) {
      case 2:
        return (
          <SignInUI 
            activeUser={activeUser}>
              <div className="forgot-password-info-container">
                Forgot password? <span className="text-button" onClick={() => setSidePanelContent(10)}>Reset password</span>
              </div>
              <div className="register-info-container">
                Does not have an account? <span className="register-ui-entry-button text-button" onClick={() => setSidePanelContent(3)}>Sign up</span>
              </div>
            </SignInUI>
            )
        case 3:
          return <SignUpUI onBack={() => {setSidePanelContent(2)}}></SignUpUI>
      case 4:
        return activeUser ? <AccountUI user={activeUser}></AccountUI> : ''
      case 5:
        return (<BookmarkUI activeUser={activeUser}></BookmarkUI>)
      case 6:
        return (<FilterPanelUI></FilterPanelUI>)
      case 10:
        return (<ForgotPWUI onBack={() => {
          setSidePanelContent(2)
        }}></ForgotPWUI>)
      }
    return ''
  }

    return (
        <div className="side-panel-group">
            <GreetUserMsg alwaysShow={sidePanelIn} activeUser={activeUser}></GreetUserMsg>
            
            <SidePanelWrapper
                className="sub-side-panel-content"
                isOpen={subSidePanelIn}
                hideCloseButton={true}
                onClose={() => setSubSidePanelIn(false)}>
                <SubSidePanelContent></SubSidePanelContent>
            </SidePanelWrapper>

            <SidePanelWrapper
                isOpen={sidePanelIn}
                onClose={() => {setSidePanelIn(false)}}
                onToggle={() => setSidePanelIn(!sidePanelIn)}>
                {getOptionItems().map((opt, i) => 
                    <div className="side-panel-option noselect" key={i}
                    onClick={() => onSidePanelOptSelect(opt.state)}>{opt.label}</div>)
                }
            </SidePanelWrapper>
        </div>
    )
}

export default SidePanelUI
