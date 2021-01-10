<template>
  <section class="ui two column centered grid onTop">
    <div class="column">
      <form class="ui segment large form">
        <div class="ui message red" v-show="error">{{ error }}</div>
        <div class="ui segment">
          <div class="field">
            <div
              class="ui right icon input large "
              :class="{ loading: loading }"
            >
              <input
                type="text"
                placeholder="Enter your Address"
                v-model="address"
                ref="address"
              />
              <i class="dot circle link icon" @click="locatorButtonPressed"></i>
            </div>
            <button class="ui button">Go!</button>
          </div>
        </div>
      </form>
    </div>
    <!-- <div class="column blue"></div> -->
  </section>
  <section id="map" ref="map"></section>
</template>

<script>
// https://maps.googleapis.com/maps/api/geocode/json?latlng
import axios from "axios";
export default {
  data() {
    return {
      address: null,
      error: "",
      loading: false,
    };
  },
  mounted() {
    window.checkAndAttachMapScript(this.initLocationSearch);
  },
  methods: {
    initLocationSearch() {
      // Constructs a rectangle from the points at its south-west and north-east corners.
      var defaultBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(41.606778, 44.6156),
        new window.google.maps.LatLng(41.850844, 44.902216)
      );

      const input = this.$refs.address;
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

          this.showUserLocationOnTheMap(lat, lng);
        }
      });
    },
    locatorButtonPressed() {
      this.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.getAddresFrom(lat, lng);
            this.showUserLocationOnTheMap(lat, lng);
          },
          (error) => {
            this.error = error.message;
            this.loading = false;
            // console.log(error.message);
          },
          { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        this.loading = false;
        this.error = "broser not supported";
        // console.log("broser not supported");
      }
    },
    showUserLocationOnTheMap(lat, lng) {
      const element = this.$refs.map;
      const position = new window.google.maps.LatLng(lat, lng);
      const options = {
        zoom: 15,
        center: position,
        types: ["roadmap"],
      };
      const map = new window.google.maps.Map(element, options);
      const markerOptions = {
        position: position,
        map: map,
      };
      new window.google.maps.Marker(markerOptions);
    },
    getAddresFrom(lat, long) {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            "," +
            long +
            "&key=AIzaSyBX-LZa9b_mCzcSNROg2yPsi70-ibRNFHU"
        )
        .then((response) => {
          if (response.data.error_message) {
            this.loading = false;
            this.error = response.data.error_message;
          } else {
            this.loading = false;
            this.address = response.data.results[0].formatted_address;
            // console.log(response.data.results[0].formatted_address);
          }
        })
        .catch((error) => {
          this.loading = false;
          this.error = error.message;
        });
    },
  },
};
</script>

<style scoped>
.onTop {
  position: relative;
  z-index: 1;
}
.ui.button,
.dot.circle.icon {
  background-color: #ff5a5f;
  color: #fff;
}
.ui.button {
  margin-top: 10px;
}

.pac-icon {
  display: none;
}
.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
.pac-item:hover {
  background-color: rgba(255, 99, 71, 0.15);
}
.pac-item-query {
  font-size: 16px;
}
#map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: red;
}
</style>
