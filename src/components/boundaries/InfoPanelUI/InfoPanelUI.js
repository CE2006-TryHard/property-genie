import "./InfoPanelUI.scss"
import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'

import LightboxWrapper from "../MiscUI/LightboxWrapper/LightboxWrapper"
import {Scrollbars} from 'react-custom-scrollbars-2'
import { TabButton } from "../MiscUI/MiscUI"
import { addBookmark, removeBookmark, setPageState, selectProperty } from "../../../features"

import { LINES } from "../../CONFIG"
import { MARKER_COLOR_SCHEME } from "../MapUI/MAP_CONFIG"

const dummyProfileImg = require('./../../../images/dummy-profile.png')

const views = ["General", "Evaluation"]

/**
 * @namespace InfoPanelUI
 * @description boundary module
 * @property {String} currentView
 * @property {Object[]} localReviews
 */
const InfoPanelUI = props => {
    const dispatch = useDispatch()
    const selectedProperty = useSelector(state => state.selection.property)
    const filterOptions = useSelector(state => state.filterOptions)
    const bookmarks = useSelector(state => state.bookmarks)
    const isBookmarked = bookmarks.filter(b => b === selectedProperty).length > 0
    const {activeUser} = props

    const [openPanel, setOpenPanel] = useState(true)
    const [currentView, setCurrentView] = useState('General')
    const [localReview, setLocalReviews] = useState(null)
    const [localAddress, setLocalAddress] = useState(null)
    const [localImg, setLocalImg] = useState(null)

  /**
   * @memberof InfoPanelUI
  * @typedef {function} onBookmarkClick called when user click on bookmark star icon
  */
  const onBookmarkClick = () => {
    if (isBookmarked) {
      dispatch(removeBookmark({activeUser, property: selectedProperty}))
    } else {
      dispatch(addBookmark({activeUser, property: selectedProperty}))
    }
  }

  /**
   * @memberof InfoPanelUI
  * @typedef {function} useEffect called when info panel's view or selected property is changed
  * @param {function} callback
  * @param {watchlist} watchList [currentView, selectedProperty]
  */
  useEffect(() => {
    if (!selectedProperty) return
    if (currentView === 'Evaluation') {
      selectedProperty.fetchReview(reviews => {
        setLocalReviews(reviews)
      })
    }
}, [currentView, selectedProperty])

  /**
   * @memberof InfoPanelUI
  * @typedef {function} useEffect called when current selected property changed
  * @param {function} callback
  * @param {watchlist} watchList [selectedProperty]
  */
useEffect(() => {
  if (selectedProperty) {
    setOpenPanel(true)
    dispatch(setPageState(7))
    selectedProperty.fetchGeneralInfo((address, img) => {
      setLocalAddress(address)
      setLocalImg(img)
    })
    setCurrentView('General')
  }
}, [selectedProperty])
  
  /**
   * @memberof InfoPanelUI
  * @typedef {function} generalView Functional Component rendering "General" view
  */
  const generalView = () => {
    const score = selectedProperty.getScore()
    const {id, name, mrts, schools} = selectedProperty
      return (
        
      <div className="info-panel-detail-content general">
          <div className="profile-image-container">
          <h3>{name}</h3>
          <div className="profile-image-content">
          {activeUser && currentView === 'General' ? 
            <svg className="bookmark-button" width="40" height="40" viewBox="0 0 51 48" onClick={onBookmarkClick}>
              <title>{isBookmarked ? 'Unbookmark the property' : 'Bookmark the property'}</title>
              <path fill={isBookmarked ? 'gold' : '#FFFFFF'} stroke="#000" d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
            </svg>
              : ''}
              <img src={localImg} alt={id}/>
          </div>
          <p className="address">{localAddress}</p>
          <div className="view-on-map-button">
          <div onClick={() => setOpenPanel(false)}>View on map</div>
          </div>
          </div>
          <div className="right">
          <p className="score">Score: <b style={{color: MARKER_COLOR_SCHEME[Math.floor(score*10)]}}>{(score*100).toFixed(0)}%</b></p>
          <div className="school">
              <b>Nearby schools:</b>
              <ul>
                {schools.map((s, i) => <li key={i}>{s.name}</li>)}
              </ul>
              
          </div>
          <div className="mrt">
              <b>Nearby MRTs:</b>
              {mrts.map((m, i) => <div className="mrt-item" key={i}>
              {m.code.map((c, j) => {
                  const CC = c.slice(0,2)
                  const{bgColor, textColor, name} = LINES[CC]
                  const style = {
                  backgroundColor: bgColor,
                  color: textColor
                  }
                  return <span className="mrt-line-logo" style={style} title={name + " Line"} key={j}>{c}</span>
              })}
              <span>{m.name}</span>
              </div>)}
              
          </div>
          </div>
      </div>
      )
  }

  
  /**
   * @memberof InfoPanelUI
  * @typedef {function} valueView Functional Component rendering "Evaluation" view
  */
  const valueView = () => {
    const score = selectedProperty.getScore()
    const {avgMrtDist, avgSchoolDist, enblocStr, valueProps: {enbloc, distToMrt, distToSchool}} = selectedProperty
    return (
      <div className="info-panel-detail-content value">
        <div className="score-summary-container">
        <p className="score-header">*Score <b style={{color: MARKER_COLOR_SCHEME[Math.floor(score*10)]}}>{(score*100).toFixed(0)}%</b> is calculated by:</p>
          <ul>
            <li style={{opacity: filterOptions['enbloc'].checked ? 1 : 0.3}} className="score-item">
              <p>*En Bloc probability:</p>
              <span className="score-box" style={{backgroundColor: MARKER_COLOR_SCHEME[Math.floor(enbloc * 10)]}}><b>{enblocStr}</b></span>
            </li>
            <li style={{opacity: filterOptions['distToMrt'].checked ? 1 : 0.3}}className="score-item">
              <p>Distance to the <span>nearest MRT:</span></p>
              <span className="score-box" style={{backgroundColor: MARKER_COLOR_SCHEME[Math.floor(distToMrt * 10)]}}><b>{avgMrtDist}km</b></span>
            </li>
            <li style={{opacity: filterOptions['distToSchool'].checked ? 1 : 0.3}}className="score-item">
              <p>Distance to the <span>nearest School:</span></p>
              <span className="score-box" style={{backgroundColor: MARKER_COLOR_SCHEME[Math.floor(distToSchool * 10)]}}><b>{avgSchoolDist}km</b></span>
            </li>
          </ul>
          <span className="score-remark"><b>Score:</b> A special formula is applied to evaluate the score of the property based on the filters selected.</span>
          <span className="enbloc-remark"><b>En Bloc:</b> Potential to make money by a collect sale of the whole condo at prices higher than the resale value.</span>
        </div>
        <div className="google-review-container">
          <h3>Google Reviews</h3>
          {localReview ? 
            (localReview.length ? localReview.map((r, i) => {
              const {profile_photo_url, author_name, rating, text} = r
              return <div className="review-item" key={i}>
                <div className='profile'>
                  <img className="profile-pic" src={profile_photo_url} width="40" height="40" onError={e => e.target.src= dummyProfileImg}/>
                  <div className="rating">
                    <h5>{author_name}</h5>
                    <div className="rating-stars">
                      {[0,0,0,0,0].map((dummy, i) => <span key={i} className={i + 1 <= rating ? 'checked' : ''}></span>)}
                    </div>
                  </div>
                  
                </div>
               
                <p>{text}</p>
              </div>
            }) : 'No review found.')
          
          : 'Loading reviews...'}
        </div>
      </div>
    )
  }

  if (!selectedProperty) return ''
  
    return (
      <LightboxWrapper isOpen={selectedProperty && openPanel} onClose={() => dispatch(selectProperty(null))}>
        <div className="info-panel-container">
          <div className="info-panel-content">
            <TabButton options={views} current={currentView} onChange={setCurrentView}></TabButton>
              <Scrollbars className="info-panel-detail-container">
                {currentView === 'General' ? generalView() : valueView()}
            </Scrollbars>
          </div>
        </div>
      </LightboxWrapper>
    )
}

export default InfoPanelUI
