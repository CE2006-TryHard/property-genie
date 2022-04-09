import './LoadingUI.scss'
import LightboxWrapper from "../MiscUI/LightboxWrapper/LightboxWrapper"
import {useSelector} from 'react-redux'


const LoadingUI = props => {
    const loadingState = useSelector(state => state.loadingState.value)
    return (
        <LightboxWrapper className="signout-lightbox" isOpen={loadingState > 0} hideCloseButton={true} disableClose={true}>
          <div className="loader"></div>
          {loadingState === 1 ? <div className="loader-text"></div> : ''}
          {loadingState === 2 ? <div className="loader-text">Sign out...</div> : ''}
          {loadingState === 3 ? <div className="loader-text"></div> : ''}
        </LightboxWrapper>
    )
}

export default LoadingUI
