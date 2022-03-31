import "./InfoPanelUI.scss"
import { TabButton } from "../MiscUI"
import React, { useEffect, useState } from 'react'
import { LINES } from "../../CONFIG"
import {gService } from "../MapUI/MapUI"

const views = ["General", "Evaluation"]

/**
 * @namespace InfoPanelUI
 * @description boundary module
 * @property {String} currentView
 * @property {Object[]} localReviews
 */
const InfoPanelUI = props => {
    const {isBookmarked, enableBookmark, filterOptions, property, onBookmark, onLocateProperty} = props
    const [currentView, setCurrentView] = useState('General')
    const [localReview, setLocalReviews] = useState(null)

  /**
   * @memberof InfoPanelUI
  * @typedef {function} onViewChange called when user toggle between General/Evaluation view
  * @param {String} newView new info panel view option
  */
  const onViewChange = newView => {
      setCurrentView(newView)
  }

  /**
   * @memberof InfoPanelUI
  * @typedef {function} onBookmarkClick called when user click on bookmark star icon
  */
  const onBookmarkClick = () => {
    onBookmark(property, !isBookmarked)
  }

  /**
   * @memberof InfoPanelUI
  * @typedef {function} useEffect called when InfoPanelUI first mounted
  * @param {function} callback
  * @param {watchlist} watchList []
  */
  useEffect(() => {
    if (currentView === 'Evaluation') {
      const {reviews, placeID} = property
      if (!reviews) {
          gService.getDetails({
              placeId: placeID,
              fields: ['review']
          }, (place, status) => {
              property.setReviews(place.reviews || []) // cache page review
              if (place.reviews) setLocalReviews(place.reviews)
              else setLocalReviews([])
              console.log('place detail called')
          })
      } else {
          setLocalReviews(reviews)
      }
    }
}, [currentView])

useEffect(() => {
  if (property) {
    setCurrentView('General')
  }
}, [property])

  const {name, address, mrts, schools, avgMrtDist, avgSchoolDist, enblocStr} = property
  
  /**
   * @memberof InfoPanelUI
  * @typedef {function} generalView Functional Component rendering "General" view
  */
  const generalView = () => {
      return (
      <div className="info-panel-detail-content general">
          <div className="profile-image-container">
          <button onClick={onLocateProperty}>Locate the property on map</button>
          <h3>{name}</h3>
          <p className="address">{address}</p>
          <div className="profile-image-content">
          {enableBookmark && currentView === 'General' ? 
              <div title={isBookmarked ? "Unbookmark the property" : "Bookmark the property"} className="bookmark-button-wrapper" onClick={onBookmarkClick}>
              <div className={`bookmark-button ${isBookmarked ? 'checked' : ''}`}></div>
              </div>
              : ''}
              <img src=""/>
          </div>
          </div>
          <div className="right">
          
          <p className="score"><b>Score:</b> {(property.getPropertyValue(filterOptions)*100).toFixed(0)}%</p>
          <div className="school">
              <b>School(s) nearby:</b>
              {schools.map((s, i) => <p key={i}>{s.name}</p>)}
          </div>
          <div className="mrt">
              <b>Nearest MRTs:</b>
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
    return (
      <div className="info-panel-detail-content value">
        <div className="score-summary-container">
          <p>En Bloc: <span>{enblocStr}</span></p>
          <p>Shortest distance to MRT: <span>{avgMrtDist}km</span></p>
          <p>Shortest distance to School: <span>{avgSchoolDist}km</span></p>
        </div>
        <div className="google-review-container">
          <h3>Google Reviews</h3>
          {localReview ? 
            (localReview.length ? localReview.map((r, i) => {
              // console.log(r)
              const {profile_photo_url, author_name, rating, text, time} = r
              return <div className="review-item" key={i}>
                <div className='profile'>
                  <img className="profile-pic" src={profile_photo_url} />
                  <div className="rating">
                    <h5>{author_name}</h5>
                    <div className="rating-stars">
                      {[0,0,0,0,0].map((dummpy, i) => <span key={i} className={i + 1 <= rating ? 'checked' : ''}></span>)}
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
  
    return (<div className="info-panel-container">
      <div className="info-panel-content">
        <TabButton options={views} current={currentView} onChange={onViewChange}></TabButton>
        <div className="info-panel-detail-container">
          {currentView === 'General' ? generalView() : valueView()}
        </div>
      </div>
    </div>)
}

export default InfoPanelUI
