class Restaurant {
  constructor() {
    this.name = "";
    this.address = "";
    this.lat = 0;
    this.lng = 0;
    this.stars = 0;
    this.comment = "";
    this.raterName = "";
    this.raterStar = 0;
  }

  /**
   * Adds a review to a restaurant
   * @param {*} _yourName
   * @param {*} _yourComment
   * @param {*} _yourRatings
   */
  static addReview(_form) {
    let form = $(_form).serializeArray();

    form.preventDefault;

    $.ajax({
      url: '127.0.0.1:5500',
      type: "GET",
      data: form,
      dataType: "JSON",
      async: true,
      crossDomain: true,
      success: (data) => {
        
      },
      complete: function(data){
          $.each(data, (index, field) => {
            this.raterName = field.value
            this.ratingStar = field.value
            this.comment = field.value
        });
      }
    });
  }

  /**
   * Opens up the modal dialog to enter a new restaurant details
   * to be added to the list of restaurants on the map
   * @param {*} _name
   * @param {*} _address
   */
  addRestaurant(_event, _geometry) {
    // show the add restaurant form
    this.appendRestaurantFormToModal();

    // show the modal
    //   $('#restaurantModal').addClass('show').show(1000);
    $('.modal').modal('show')
  }

  createNewRestaurant(_form){
    
    //get the form and serialize it into array
    let form = $(_form).serializeArray();

    // get the location that was
    const clickedLocation = {
        lat: _event.latLng.lat(), lng: _event.latLng.lng()
    }
    
    this.geometry = clickedLocation;
  }

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
              <img class="card-img-top" src="${this.getStreetViewURL(
                _restaurantAddress,
                _lat,
                _lng
              )}" alt="${_restaurantName} image" style="border-radius: 0px;" />
              <div class="card-body">
                <address>${_restaurantAddress}</address>
                ${Object.keys(_ratingsRecord).map(function (key) {
                  return `<h6 class="card-title">${_ratingsRecord[key]["rater"]}
                           <br/><small>${_ratingsRecord[key]["stars"]}</small></h6>
                           <p class="card-text">${_ratingsRecord[key]["comment"]}</p>`;
                })}
                <a href="#" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#restaurantModal" onclick="MapFortress.appendReviewFormToModal();">Add a Review</a>
              </div>
            </div>
          
          </div>
        </div>
    </div>`
    );
  }

  /**
   * Returns a string of an `https` to address to `Google Street View` when passed with parameters of
   * either a location address or it's latitude and longitude values
   * @param {*} _address
   * @param {*} _lat
   * @param {*} _lng
   */
  getStreetViewURL(_address, _lat, _lng) {
    if (_address == null || "") {
      return `https://maps.googleapis.com/maps/api/streetview?size=286x180&location=${_lat},${_lng}&fov=80&heading=70&pitch=0&key=${apiKEY}`;
    } else {
      return `https://maps.googleapis.com/maps/api/streetview?size=286x180&location=${_address}&fov=80&heading=70&pitch=0&key=${apiKEY}`;
    }
  }

  /**
   * Checks to make sure all review `form input` elements are properly filled with
   * data before submitting the by calling the `submit()` of `jQuery`
   * @param {*} _buttonElement 
   */
  static validateReviewForm(_buttonElement) {
    let button = $(_buttonElement);

    button.preventDefault;

    const fullName = $("#fullName").val();
    const stars = $("#ratingStar").val();
    const comment = $("#comment").val();

    if (fullName == "" || fullName === null) {
      alert("Enter your full name");
      return;
    } else if (stars == "" || stars === null) {
      alert("Select your rating value");
      return;
    } else if (comment == "" || comment === null) {
      alert("Enter your review comment.");
      return;
    } else {
      $("#reviewForm").submit();
    }
  }

  /**
   * Display or loads `HTML` `form` element and its contents into a modal body
   * which has a `div` element as its container
   */
  static appendReviewFormToModal = ()=> {
      let formContainer = $('#formContainer');
      let modalTitle = $('#restaurantModalLabel');

      modalTitle.html('Adding Review');
      formContainer.empty();

      formContainer.append(
      `<form action="" onsubmit="MapFortress.addReview(this); return false;" id="reviewForm" name="reviewForm">
      <div class="modal-body">
          <div class="form-row">
            <div class="form-group col-md-8">
              <label for="fullName">Full Name</label>
              <input type="text" class="form-control" id="fullName" name="fullName" placeholder="Full name">
            </div>
            <div class="form-group col-md-4">
              <label for="ratingStar">Ratings</label>
              <select id="ratingStar" name="ratingStar" class="form-control">
                <option value="" selected>Choose...</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div class="form-group col-md-12">
              <label for="comment">Comments</label>
              <textarea class="form-control" id="comment" name="comment" placeholder="Write your comment here"></textarea>
            </div>
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" onclick="Restaurant.validateReviewForm(this);" class="btn btn-primary">Submit Review</button>
      </div>
    </form>`
    );
  }

  appendRestaurantFormToModal = ()=> {
    let formContainer = $('#formContainer');
    let modalTitle = $('#restaurantModalLabel');

    modalTitle.text('Adding New Restaurant');
    formContainer.empty();

    formContainer.append(
    `<form action="" onsubmit="MapFortress.addReview(this); return false;" id="reviewForm" name="reviewForm">
    <div class="modal-body">
        <div class="form-row">
          <div class="form-group col-md-12">
            <label for="restaurantName">Full Name</label>
            <input type="text" class="form-control" id="restaurantName" name="restaurantName" placeholder="Restaurant name">
          </div>
          <div class="form-group col-md-12">
            <label for="restaurantAddress">Full Name</label>
            <input type="text" class="form-control" id="restaurantAddress" name="restaurantAddress" placeholder="Address">
          </div>
          <div class="form-group col-md-12">
            <label for="ratingStar">Ratings</label>
            <select id="ratingStar" name="ratingStar" class="form-control">
              <option value="" selected>Choose...</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      <button type="button" onclick="Restaurant.validateRestaurantForm(this);" class="btn btn-primary">Add to Map</button>
    </div>
  </form>`
  );
}

  /**
   * Returns a json file for fake restaurants, used for testing purposes
   */
  getLocalRestaurantsFromJSON() {
    var json = [
      {
        restaurantName: "Bronco",
        address: "39 Rue des Petites Écuries, 75010 Paris",
        lat: 48.8737815,
        long: 2.3501649,
        ratings: [
          {
            rater: "Lawrencia",
            stars: 2,
            comment: "Great! But not many veggie options.",
          },
          {
            rater: "Diana",
            stars: 5,
            comment: "My favorite restaurant!",
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
            comment: "Tiny pizzeria next to Sacre Coeur!",
          },
          {
            rater: "Nana Kwass",
            stars: 3,
            comment: "Meh, it was fine.",
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
            stars: 4,
            comment: "A cool joint for the friends and family!",
          },
          {
            rater: "Rahul Abhishek",
            stars: 3,
            comment: "I will always be here to chill small.",
          },
        ],
      },
    ];

    return json;
  }
}
