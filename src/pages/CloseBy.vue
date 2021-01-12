<template>
  <div class="ui grid onTop">
    <div class="six wide column">
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
                ref="address_field"
              />
              <i class="dot circle link icon" @click="locatorButtonPressed"></i>
            </div>
          </div>
          <div class="field ">
            <div class="two fields">
              <div class="field">
                <select v-model="type">
                  <option value="restaurant"> restaurant</option>
                </select>
              </div>
              <div class="field">
                <select v-model="radius">
                  <option value="5"> 5km</option>
                  <option value="10"> 10km</option>
                  <option value="15"> 15km</option>
                </select>
              </div>
            </div>
          </div>
          <button class="ui button" @click.prevent="findCloseBuyButton">
            FInd close by Places!
          </button>
        </div>
      </form>
      <near-by-places
        :places="places"
        :markers="markers"
        v-if="places.length"
      ></near-by-places>
    </div>
    <div class="ten wide column ">
      <section id="map" ref="map"></section>
    </div>
  </div>
</template>

<script>
// http://localhost:8010/proxy/maps/api/geocode/json?latlng
import axios from "axios";
import NearByPlaces from "../components/NearByPlaces.vue";
export default {
  components: { NearByPlaces },
  data() {
    return {
      address: null,
      error: "",
      loading: false,
      apiKey: "AIzaSyBX-LZa9b_mCzcSNROg2yPsi70-ibRNFHU",
      lat: 0,
      lng: 0,
      type: "",
      radius: "",
      places: [],
      markers: [],
    };
  },
  mounted() {
    window.checkAndAttachMapScript(this.initLocationSearch);
  },
  methods: {
    findCloseBuyButton() {
      const URL = `http://localhost:8010/proxy/maps/api/place/nearbysearch/json?location=${
        this.lat
      },${this.lng}&type=${this.type}&radius=${this.radius * 1000}&key=${
        this.apiKey
      }`;
      axios
        .get(URL)
        .then((result) => {
          this.places = result.data.results;
          this.showPlacesOnMap();
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    showPlacesOnMap() {
      const mapContainer = this.$refs.map;
      const options = {
        zoom: 15,
        center: new window.google.maps.LatLng(this.lat, this.lng),
      };
      const map = new window.google.maps.Map(mapContainer, options);
      const infoWindow = new window.google.maps.InfoWindow();

      for (let i = 0; i < this.places.length; i++) {
        const lat = this.places[i].geometry.location.lat;
        const lng = this.places[i].geometry.location.lng;
        const place_id = this.places[i].place_id;
        const markerOptions = {
          position: new window.google.maps.LatLng(lat, lng),
          map: map,
        };

        // makrer
        const marker = new window.google.maps.Marker(markerOptions);
        this.markers.push(marker);
        new window.google.maps.event.addListener(marker, "click", () => {
          const URL = `http://localhost:8010/proxy/maps/api/place/details/json?key=${this.apiKey}&place_id=${place_id}`;
          axios
            .get(URL)
            .then((result) => {
              console.log(result.data.result);
              if (result.data.error_message) {
                this.error = result.data.error_message;
              } else {
                const place = result.data.result;
                infoWindow.setContent(
                  `<div class="ui header">${place.name}</div>
            ${place.formatted_address} </>
            ${place.formatted_phone_number} </br>
            <a href="${place.website}" traget="_blank">${place.website}</a>

            `
                );
              }
            })
            .catch((err) => {
              this.error = err.message;
            });

          infoWindow.open(map, marker);
          console.log("wordl");
        });
      }
    },
    initLocationSearch() {
      // Constructs a rectangle from the points at its south-west and north-east corners.
      var defaultBounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(41.606778, 44.6156),
        new window.google.maps.LatLng(41.850844, 44.902216)
      );

      const input = this.$refs.address_field;
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
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();

          // this.showUserLocationOnTheMap(this.lat, this.lng);
        }
      });
    },
    locatorButtonPressed() {
      this.loading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.getAddresFrom(this.lat, this.lng);
            // this.showUserLocationOnTheMap(this.lat, this.lng);
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
    // showUserLocationOnTheMap(lat, lng) {
    //   const element = this.$refs.map;
    //   const position = new window.google.maps.LatLng(lat, lng);
    //   const options = {
    //     zoom: 15,
    //     center: position,
    //     types: ["roadmap"],
    //   };
    //   const map = new window.google.maps.Map(element, options);
    //   const markerOptions = {
    //     position: position,
    //     map: map,
    //   };
    //   new window.google.maps.Marker(markerOptions);
    // },
    getAddresFrom(lat, long) {
      axios
        .get(
          "http://localhost:8010/proxy/maps/api/geocode/json?latlng=" +
            lat +
            "," +
            long +
            "&key=" +
            this.apiKey
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
}
</style>
