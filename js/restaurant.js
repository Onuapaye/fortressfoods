class Restaurant {
  constructor() {
    this.name = "";
    this.address = "";
    this.lat = 0;
    this.lng = 0;
    this.stars = 0;
    this.comment = "";
  }

  /**
   * Adds a review to a restaurant
   * @param {*} _yourName
   * @param {*} _yourComment
   * @param {*} _yourRatings
   */
  addComment(_yourName, _yourComment, _yourRatings) {}

  /**
   * Adds a comment to a restaurant
   * @param {*} _name
   * @param {*} _address
   */
  addRestaurant(_name, _address) {}

  /**
   * Shows or display the comments and ratings associated with each restaurant
   * @param {*} _ratingsRecord 
   * @param {*} _recordCounter 
   * @param {*} _restaurantName 
   * @param {*} _restaurantAddress 
   */
  displayReviews(_ratingsRecord, _recordCounter, _restaurantName, _restaurantAddress, _lat, _lng) {
    let ratingsDIV = $(".ratings-accordion");

    ratingsDIV.append(
    `<div class="card">
        <div class="card-header" id="heading${_recordCounter}">
          <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${_recordCounter}" aria-expanded="true" aria-controls="collapse${_recordCounter}">
              ${_restaurantName}
            </button>
          </h5>
        </div>
    
        <div id="collapse${_recordCounter}" class="collapse" aria-labelledby="heading${_recordCounter}" data-parent="#accordion">
          <div class="card-body" style="padding: 0px;">
            
            <div class="card" style="width: inherit; border: none;">
              <img class="card-img-top" src="${this.getStreetViewURL(_restaurantAddress, _lat, _lng)}" alt="${_restaurantName} image" style="border-radius: 0px;" />
              <div class="card-body">
                <address>${_restaurantAddress}</address>
                ${Object.keys(_ratingsRecord).map(function(key){
                    return `<h6 class="card-title">${_ratingsRecord[key]['rater']}
                           <br/><small>${_ratingsRecord[key]['stars']}</small></h6>
                           <p class="card-text">${_ratingsRecord[key]['comment']}</p>`
                })}
                <a href="#" class="btn btn-primary btn-sm">Add Comment</a>
              </div>
            </div>
          
          </div>
        </div>
    </div>`
    );
  }

//   
/**
 * Returns a string of an `https` to address to `Google Street View` when passed with parameters of
 * either a location address or it's latitude and longitude values
 * @param {*} _address 
 * @param {*} _lat 
 * @param {*} _lng 
 */
getStreetViewURL(_address, _lat, _lng){
    if (_address == null || '') {
        return `https://maps.googleapis.com/maps/api/streetview?size=286x180&location=${_lat},${_lng}&fov=80&heading=70&pitch=0&key=${apiKEY}`
    } else {
        return `https://maps.googleapis.com/maps/api/streetview?size=286x180&location=${_address}&fov=80&heading=70&pitch=0&key=${apiKEY}` 
    }
}

  /**
   * Returns a json file for fake restaurants, used for testing purposes
   */
  getRestaurantsJSON() {
    var json = [
      {
        restaurantName: "Bronco",
        address: "39 Rue des Petites Écuries, 75010 Paris",
        lat: 48.8737815,
        long: 2.3501649,
        ratings: [
          {
            rater: "Lawrencia",  
            stars: 4,
            comment: "Great! But not many veggie options."
          },
          {
            rater: "Diana",  
            stars: 5,
            comment: "My favorite restaurant!"
          },
        ],
      },
      {
        restaurantName: "Babalou",
        address: "4 Rue Lamarck, 75018 Paris",
        lat: 48.8865035,
        long: 2.3442197,
        ratings: [
          {
            rater: "Margaret",  
            stars: 5,
            comment: "Tiny pizzeria next to Sacre Coeur!"
          },
          {
            rater: "Nana Kwass",  
            stars: 3,
            comment: "Meh, it was fine."
          },
        ],
      },
      {
        restaurantName: "Bismark Foods",
        address: "3 Rue du Lion d'Or, 94400 Paris",
        lat: 48.79623,
        long: 2.37058,
        ratings: [
          {
            rater: "Mr Kasapa",  
            stars: 5,
            comment: "A cool joint for the friends and family!"
          },
          {
            rater: "Rahul Abhishek",  
            stars: 3,
            comment: "I will always be here to chill small."
          },
        ],
      },
    ];

    return json;
  }
}
