<template>
  <section class="origin-destination-form">
    <div class="ui form">
      <div class="ui message red small" v-show="error">
        {{ error }}
      </div>
      <div class="two fields">
        <div class="field">
          <div class="ui left icon input">
            <i class="marker  alternate icon"></i>
            <input type="text" name="" placeholder="Origin" ref="origin" />
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="flag checkered icon"></i>
            <input
              type="text"
              name=""
              placeholder="Destination"
              ref="destination"
            />
          </div>
        </div>
        <button
          class="ui button small green"
          :class="{ loading: spinner }"
          @click="calculateButtonPressed"
        >
          Calculate
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import firebase from "firebase";
export default {
  mounted() {
    for (let ref in this.$refs) {
      this.initLocationSearch(ref);
    }

    // window.checkAndAttachMapScript(this.initLocationSearch);
    // new window.google.maps.places.AutoComplete(input, options);
    // const originAutoComplete = new window.google.maps.places.AutoComplete()
  },
  data() {
    return {
      apiKey: "AIzaSyBX-LZa9b_mCzcSNROg2yPsi70-ibRNFHU",
      error: null,
      spinner: false,
      mapRoute: {
        origin: {
          address: "",
          lat: 0,
          lng: 0,
        },
        destination: {
          address: "",
          lat: 0,
          lng: 0,
        },
        distance: {},
      },
    };
  },
  methods: {
    initLocationSearch(ref) {
      // Constructs a rectangle from the points at its south-west and north-east corners.
      var defaultBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(41.606778, 44.6156),
        new window.google.maps.LatLng(41.850844, 44.902216)
      );

      const input = this.$refs[ref];
      const options = {
        bounds: defaultBounds,
        // types: ["roadmap"],
        strictBounds: true,
      };
      const autocomplete = new window.google.maps.places.Autocomplete(
        input,
        options
      );
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();
        if (place && place.address_components) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          this.mapRoute[ref].address = `${place.name} , ${place.vicinity}`;
          this.mapRoute[ref].lat = lat;
          this.mapRoute[ref].lng = lng;

          // this.showUserLocationOnTheMap(lat, lng);
        }
      });
    },
    calculateButtonPressed() {
      this.spinner = true;
      const URL = `http://localhost:8010/proxy/maps/api/distancematrix/json?origins=${this.mapRoute.origin.lat},${this.mapRoute.origin.lng}&destinations=${this.mapRoute.destination.lat},${this.mapRoute.destination.lng}&key=${this.apiKey}`;
      axios
        .get(URL)
        .then((result) => {
          if (result.data.error_message) {
            this.error = result.data.error_message;
          } else {
            const elements = result.data.rows[0].elements;
            if (elements[0].status === "ZERO_RESULTS") {
              this.error = "No results Found";
            } else {
              this.mapRoute.distance = elements[0].distance;
              this.mapRoute.duration = elements[0].duration;
              this.saveRoute();
            }
            this.spinner = false;
          }
        })
        .catch((err) => {
          this.error = err.message;
          this.spinner = false;
        });
    },
    saveRoute() {
      const db = firebase.firestore();
      db.collection("routes")
        .doc()
        .set(this.mapRoute);
    },
  },
};
</script>

<style scoped>
.origin-destination-form {
  position: relative;
  z-index: 1;
  max-width: 610px;
  margin: 10px;
  /* background-color: #fff; */
}
</style>
