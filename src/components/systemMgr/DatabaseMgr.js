export default class DatabaseMgr {
  constructor () {
    this.properties = this.fetchAllData()
  }


  fetchAllData () {
    //TODO: establish connection with database
    // fetch all property data at once

    // DUMMY data for now
    return [
        {
          name: "ABC",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          address: "636866",
          distToMRT: 1,
          distToSchool: 2,
          enbloc: 20,
          location: [1.352244, 103.683653]
        }, {
          name: "124 QWE",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          address: "310124",
          distToMRT: 3,
          distToSchool: 10,
          enbloc: 80,
          location: [1.345748, 103.727375]
        }
    ]
  }

  getProperties () {
    return this.properties
  }

}