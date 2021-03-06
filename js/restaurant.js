class Restaurant {
  constructor() {
    this.name = "";
    this.address = "";
    this.lat = 0;
    this.lng = 0;
    this.averageRating = 0;
    this.authorComment = "";
    this.authorName = "";
    this.authorRating = 0;
    this.placesService;
    this.placeId = '';
    this.placeReviews;
  }

  /**
   * Adds a review to a restaurant
   * @param {*} _form
   */
  static addReview(_form) {

    // serialize the form element so items can be accessed
    let form = $(_form).serializeArray();

    // prevent or stop the form from submitting in order
    // not to reload the page
    form.preventDefault;

    this.authorName = form[0].value
    switch (form[1].value) {
      case "0":
        this.authorRating = 1;
        break;
      case "1":
        this.authorRating = 2;
        break;
      case "2":
        this.authorRating = 3;
        break;
      case "3":
        this.authorRating = 4;
        break;
      default:
        this.authorRating = 5;
        break;
    }
    this.authorComment = form[2].value

    // append the comment to the designated restaurant
    globalThis.globalDivID.append(
      `<h6 class="card-title">${this.authorName}
      <br/><small>${this.authorRating}</small></h6>
      <p class="card-text">${this.authorComment}</p>`
    );

    // call the click method of the close button to close the
    // modal window
    $('#btn-close-add-review-modal').click();
  }

  /**
   * Opens up the modal dialog to enter a new restaurant details
   * to be added to the list of restaurants on the map
   * @param {*} _name
   * @param {*} _address
   */
  createRestaurant(_event, _geometry) {
    // show the add restaurant form
    this.appendRestaurantFormToModal();

    globalThis.globalClickedMapCenter = { lat: _event.latLng.lat(), lng: _event.latLng.lng() };

    // show the modal
    // $('#restaurantModal').addClass('show').show(1000);
    $('.modal').modal('show');
  }

  static addRestaurantPlace(_form){
    
    //get the form and serialize it into array
    let form = $(_form).serializeArray();
    let mf = new MapFortress();
    
    // get or retrieve form input values
    mf.name = form[0].value;
    mf.address = form[1].value;
    mf.averageRating = form[2].value;
    mf.placeId = `rand-${Math.floor((Math.random()) * 0x10000).toString(16)}`;

    // get the location that was
    mf.lat = globalClickedMapCenter.lat;
    mf.lng = globalClickedMapCenter.lng;

    // create the markers
    mf.marker = mf.createMarker(_mapGLOBAL, mf.lat, mf.lng);    

    // create an empty object for the review
    let obj = {reviews:[]};

    // fetch the location image and show the restaurant on the card with its reviews
    // mf.fetchPlaceReviews(true, obj);
    mf.showReviews(obj);

    // close the modal window
    $('#bnt-close-add-restaurant-modal').click();
  }


  /**
   * Shows or display the comments and ratings associated with each restaurant
   * @param {*} _authorsInfo 
  */
  showReviews(_authorsInfo) {

    let ratingsDIV = $(".ratings-accordion");

    ratingsDIV.append(
      `<div class="card">
        <div class="card-header" id="heading${this.placeId}">
          <h5 class="mb-0">
            <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${this.placeId}" aria-expanded="true" aria-controls="collapse${this.placeId}">
              ${this.name}
            </button>
          </h5>
        </div>
    
        <div id="collapse${this.placeId}" class="collapse" aria-labelledby="heading${this.placeId}" data-parent="#accordion">
          <div class="card-body" style="padding: 0px;">
            
            <div class="card" style="width: inherit; border: none;">
              <img class="card-img-top" src="${this.getStreetViewURL(this.address, this.lat, this.lng)}" alt="${this.name} image" style="border-radius: 0px;" />
              <div class="card-body">
                <address>${this.address}</address>
                <div class="fake-class" id="authors-${this.placeId}">${Object.keys(_authorsInfo.reviews).map(function (key) {
                    return `<h6 class="card-title">${_authorsInfo.reviews[key]["author_name"]}
                        <br/><small>${_authorsInfo.reviews[key]["rating"]}</small></h6>
                        <p class="card-text">${_authorsInfo.reviews[key]["text"]}</p>`
                })} </div>
              
                <a href="#" id="btn-${this.placeId}" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#restaurantModal" onclick="MapFortress.appendReviewFormToModal(this);">Add a Review</a>
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
  static validateReviewForm = function(_buttonElement) {
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

  static validateRestaurantForm = function(_buttonElement) {
    let button = $(_buttonElement);

    button.preventDefault;

    const _restName = $("#restaurantName").val();
    const _restAddress = $("#restaurantAddress").val();
    const _restRating = $("#authorRating").val();

    if (_restName == "" || _restName === null) {
      alert("Enter the restaurant's name");
      return;
    } else if (_restAddress == "" || _restAddress === null) {
      alert("Enter the restaurant's address");
      return;
    } else if (_restRating == "" || _restRating === null) {
      alert("Select the restaurant's rating value.");
      return;
    } else {
      $("#restaurantForm").submit();
    }
  };

  /**
   * Display or loads `HTML` `form` element and its contents into a modal body
   * which has a `div` element as its container
   */
  static appendReviewFormToModal = (button)=> {
      let formContainer = $('#formContainer');
      let modalTitle = $('#restaurantModalLabel');

      let _divID = $(button).prev('.fake-class').attr('id');
      globalThis.globalDivID = $(`#${_divID}`)

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
        <button id="btn-close-add-review-modal" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
      `<form action="" onsubmit="MapFortress.addRestaurantPlace(this); return false;" id="restaurantForm" name="reviewForm">
        <div class="modal-body">
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="restaurantName">Full Name</label>
                <input type="text" class="form-control" id="restaurantName" name="restaurantName" placeholder="Restaurant name">
              </div>
              <div class="form-group col-md-12">
                <label for="restaurantAddress">Address</label>
                <input type="text" class="form-control" id="restaurantAddress" name="restaurantAddress" placeholder="Address">
              </div>
              <div class="form-group col-md-12">
                <label for="authorRating">Ratings</label>
                <select id="authorRating" name="authorRating" class="form-control">
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
          <button id="bnt-close-add-restaurant-modal" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
        name: "Bronco",
        address: "39 Rue des Petites Écuries, 75010 Paris",
        lat: 48.8737815,
        long: 2.3501649,
        reviews: [
          {
            author_name: "Lawrencia",
            rating: 2,
            text: "Great! But not many veggie options.",
          },
          {
            author_name: "Diana",
            rating: 5,
            text: "My favorite restaurant!",
          },
        ],
      },
      {
        name: "Babalou",
        address: "4 Rue Lamarck, 75018 Paris",
        lat: 48.8865035,
        long: 2.3442197,
        reviews: [
          {
            author_name: "Margaret",
            rating: 5,
            text: "Tiny pizzeria next to Sacre Coeur!",
          },
          {
            author_name: "Nana Kwass",
            rating: 3,
            text: "Meh, it was fine.",
          },
        ],
      },
      {
        name: "Bismark Foods",
        address: "3 Rue du Lion d'Or, 94400 Paris",
        lat: 48.79623,
        long: 2.37058,
        reviews: [
          {
            author_name: "Mr Kasapa",
            rating: 4,
            text: "A cool joint for the friends and family!",
          },
          {
            author_name: "Rahul Abhishek",
            rating: 3,
            text: "I will always be here to chill small.",
          },
        ],
      },
    ];

    return json;
  }

}
