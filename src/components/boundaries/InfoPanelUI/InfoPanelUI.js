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
    const {isBookmarked, enableBookmark, filterOptions, property, onBookmark} = props
    const [currentView, setCurrentView] = useState('General')
    const [localReview, setLocalReviews] = useState([])

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
}, [])

  const {name, address, mrts, schools, avgMrtDist, avgSchoolDist, enblocStr} = property
  
  /**
   * @memberof InfoPanelUI
  * @typedef {function} generalView Functional Component rendering "General" view
  */
  const generalView = () => {
      return (
      <div className="info-panel-detail-content general">
          <div className="profile-image-container">
          <h3>{name}</h3>
          <p className="address">{address}</p>
          <div className="profile-image-content">
          {enableBookmark && currentView === 'General' ? 
              <div title="Bookmark the property" className="bookmark-button-wrapper" onClick={onBookmarkClick}>
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
                  // console.log(CC)
                  const{bgColor, textColor, name} = LINES[CC]
                  const style = {
                  backgroundColor: bgColor,
                  color: textColor
                  }
                  return <span className="mrt-line-logo" style={style} title={name} key={j}>{c}</span>
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
        <p>En Bloc: {enblocStr}</p>
        <p>Shortest distance to MRT: {avgMrtDist}km</p>
        <p>Shortest distance to School: {avgSchoolDist}km</p>
        <div className="review-container">
          <h3>Google Reviews</h3>
          {localReview.map((r, i) => {
            const {author_name, text} = r
            return <div className="review-item" key={i}>
              <h5>{author_name}</h5>
              <p>{text}</p>
            </div>
          })}
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
