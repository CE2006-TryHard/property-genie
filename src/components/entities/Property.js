import {ENBLOC} from './../CONFIG'
import {gService} from './../boundaries/MapUI/MapUI'
import {dbMgr} from './../controls/Mgr'

const dummyPropertyImg = require('./../../images/dummy-property.jpg')

/**
 * An entity class representing a Property
 */
class Property {
    constructor (props) {
        const {id, name, mrts, schools, lat, lng, enblocID, avgMrtDist, avgSchoolDist, constituency} = props
        /** @public */
        this.id = id
        /** @public */
        this.placeID = null
        /** @public */
        this.name = name
        /** @public */
        this.img = null
        /** @public */
        this.address = null
        /** @public */
        this.lat = lat
        /** @public */
        this.lng = lng
        /** @public */
        this.mrts = mrts
        /** @public */
        this.schools = schools
        /** @public */
        this.enblocStr = ENBLOC[enblocID].label
        /** @public */
        this.avgMrtDist = avgMrtDist
        /** @public */
        this.avgSchoolDist = avgSchoolDist
        /** @public */
        this.constituency = constituency
        /** @public */
        this.reviews = null
        /** @public */
        this.valueProps = {
            enbloc: ENBLOC[enblocID+""].val,
            distToMrt: this.getDistValue(avgMrtDist),
            distToSchool: this.getDistValue(avgSchoolDist)
        }
        /** @public */
        this.score = 0
    }
    /**
     * @param {Object[]} val update review object related to a property
     */
    setReviews(val) {
        this.reviews = val
    }
    /**
     * 
     * @param {number} val 
     * @returns {number}
     */
    getDistValue (val) {
        // distance beyond 1km => 1
        // distance below => use it as it is
        if (val >= 0 && val < 0.25) return 1
        if (val >= 0.25 && val < 0.5) return 0.75
        if (val >= 0.5 && val < 0.75) return 0.5
        if (val >= 0.75 && val <= 1) return 0.25
        // if (val >= 0.8 && val <= 1) return 0
        return 0
    }

    updatePropertyScore (filterOpts) {
        this.score = this.getPropertyValue(filterOpts)
    }

    getScore () {
        return this.score
    }
     /**
     * @param  {Object} filterOpts
     * @returns {number}
     */
    getPropertyValue (filterOpts) {
        const {enbloc: enblocVal, distToMrt: distToMrtVal, distToSchool: distToSchoolVal} = this.valueProps
        const {
                enbloc: {checked: enblocChecked},
                distToMrt: {checked: distToMrtChecked},
                distToSchool: {checked: distToSchoolChecked}
            } = filterOpts
        // all three are checked
        if (enblocChecked && distToMrtChecked && distToSchoolChecked) {
            return enblocVal * 0.4 + distToMrtVal * 0.35 + distToSchoolVal * 0.25
        }
        // only enbloc and distToMrt are checked
        if (enblocChecked && distToMrtChecked && !distToSchoolChecked) {
            return enblocVal * 0.55 + distToMrtVal * 0.45
        }
        // only enbloc and distToSchool are checked
        if (enblocChecked && !distToMrtChecked && distToSchoolChecked) {
            return enblocVal * 0.6 + distToSchoolVal * 0.4
        }
        // only distToMrt and distToSchool are checked
        if (!enblocChecked && distToMrtChecked && distToSchoolChecked) {
            return distToMrtVal * 0.6 + distToSchoolVal * 0.4
        }

        // only one of them are checked or all are unchecked
        const checkedOption = Object.keys(filterOpts)
        .filter(key => key !== 'score' && filterOpts[key].checked)
        .map(key => this.valueProps[key])[0]
        return checkedOption || 0
    }

    /**
     * fetch proerty's address, placeID and reviews(if exists) from database
     * @param {function} onFetchEnd callback function
     */
    fetchGeneralInfo(onFetchEnd) {
        if (this.address && this.img && this.placeID) {
            if (onFetchEnd) onFetchEnd(this.address, this.img)
        } else {
            dbMgr.fetchDataDB(`properties/${this.id}`, propertyData => {
                const {addr, img, pID, reviewObj} = propertyData
                this.address = addr
                this.img = this.getImage(img)
                if (onFetchEnd) onFetchEnd(this.address, this.img)
                this.placeID = pID
                this.reviews = reviewObj && reviewObj.reviews
            })
        }
    }

    getImage (img) {
        if (img === 'nan') return dummyPropertyImg
        if (img.indexOf('.JPG') >= 0) {
            return `https://www.singaporeexpats.com/singapore-property-pictures/properties/${img}`
        }
        return `https://www.singaporeexpats.com/singapore-property-pictures/properties/${img}.jpg`
        
        
    }

    /**
     * fetch cached reviews from firebase
     * if firebase has no review record, invokes Google Place API to fetch reviews
     * TODO: clear cached review once cached timestamp exceed 29 days
     * @param {function} onFetchEnd callback function
     * 
     */
    fetchReview (onFetchEnd) {
        // review found from local browser cached
        if (this.reviews) {
            onFetchEnd(this.reviews)
            console.log('review fetched from browser cache')
            return
        }
    
        dbMgr.fetchDataDB(`properties/${this.id}/reviewObj`, reviewObj => {
            // review found from database cache record
            if (reviewObj) {
                const {reviews} = reviewObj
                this.reviews = reviews || []
                onFetchEnd(this.reviews)
                console.log('review fetched from database')
                return
            }
            
            // fetch review data from Google Place API
            gService.getDetails({
                placeId: this.placeID,
                fields: ['review']
            }, (place, status) => {
                this.reviews = place.reviews || [] // cache reviews to current browser session
                this.reviews = this.reviews.map(({author_name, profile_photo_url, rating, text}) => ({
                    author_name, profile_photo_url, rating, text
                }))
                onFetchEnd(this.reviews)
                console.log('review fetched from Google Place API')
                const newReviewObj = {
                    length: this.reviews.length,
                    reviews: this.reviews
                }
                dbMgr.updateDataDB(`properties/${this.id}/reviewObj`, newReviewObj)
                console.log('save reviews to firebase')

            })
            
        })
    }
}

export default Property
