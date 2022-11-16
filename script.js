"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords, distance, duration){
        this.coords = coords; // [lat, lng]
        this.distance = distance; //  in km 
        this.duration = duration; // in min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence
        this.calcPace();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance
        return this.pace
    }
}

class Cycling extends Workout  {
    constructor(coords, distance, duration, elevation) {
        super(coords, distance, duration);
        this.elevation = elevation;
        this.calcSpeed()
    }

    calcSpeed() {
        // km/h
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }
}



//////////////////////////////////////////////////////////////////
///////////  APPLCATGION DATA

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleElevationField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your posiiton");
        }
      );
    }
  }

  _loadMap(pos) {
    const { latitude, longitude } = pos.coords;
    console.log(latitude);
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    let coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    console.log(`You clicked on the map ${mapE.latlng}`);
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {

    const validInput = (...inputs) => inputs.every(inp => Number.isFinite(inp));

    e.preventDefault();


    // get data from form

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // check data is valid

    // if activitiy running, create running obj
    if (type === "running") {
      const cadence = +inputCadence.value;

      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(cadence)
      )
        return alert("Inputs have to be positive numbers!");
    }

    // if activitiy cycling, create cycling obj
    if(type === 'cycling') {
        const elevation = +inputElevation.value
    }

    // add new obj to woekout arr

    // render workout on map as marker

    // render wrokout on list

    // hide form and clear input fields






    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    // display marker
    console.log(this.#mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Workout")
      .openPopup();
  }
}

const app = new App();
