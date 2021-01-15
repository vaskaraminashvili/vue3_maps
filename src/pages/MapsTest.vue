<template>
  <section>
    <div class="buttons_box">
      <ul>
        <li>
          some staff
          <br />
          <button @click="addMarker()">Add Marker in center</button>
        </li>
      </ul>
    </div>
    <div class="container" ref="map"></div>
  </section>
</template>

<script>
export default {
  mounted() {
    const map_container = this.$refs.map;
    const latLng = new window.google.maps.LatLng(
      41.72413616833032,
      44.77476445589886
    );

    this.defalultLatLng = latLng;
    const map_options = {
      zoom: 15,
      center: latLng,
    };
    this.map = new window.google.maps.Map(map_container, map_options);
    // Place a draggable marker on the map
    const marker = new window.google.maps.Marker({
      position: latLng,
      map: this.map,
      draggable: true,
      title: "Drag me!",
    });
    this.first_marker = marker;

    this.map.addListener("click", (event) => {
      this.addMarker(event.latLng);
    });

    this.markerDragged(marker);
    if (this.markerAdded == true) {
      this.markerDragged(this.last_marker);
    }

    // if last marker is added buld a route
  },
  data() {
    return {
      defalultLatLng: "",
      map: "",
      markers: [],
      markerAdded: false,
      first_marker: "",
      last_marker: "",
      waypts: [],
      route: "",
    };
  },
  methods: {
    addMarker(location = null) {
      if (location == null) {
        location = this.defalultLatLng;
      }
      // Adds a marker to the map and push to the array.
      if (this.markerAdded == false) {
        this.last_marker = new window.google.maps.Marker({
          position: location,
          map: this.map,
          draggable: true,
          title: "Drag me!",
        });
        this.markers.push(this.last_marker);
        this.markerAdded = true;
      }
      // console.log(this.last_marker);
    },
    markerDragged(marker) {
      window.google.maps.event.addListener(marker, "dragend", () => {
        // var lat = marker.getPosition().lat();
        // var lng = marker.getPosition().lng();
        // console.log(lat, lng);
      });
    },
    createRoute(first_marker, last_marker) {
      console.log(first_marker.getPosition().lat());
      console.log(last_marker.getPosition().lat());
      const directionService = new window.google.maps.DirectionsService();
      const options = {
        center: new window.google.maps.LatLng(
          41.72645253832406,
          44.75086220285816
        ),
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      };
      new window.google.maps.Map(this.map, options);
      directionService.route(
        {
          origin: `${first_marker
            .getPosition()
            .lat()} , ${first_marker.getPosition().lng()} `,
          destination: `${last_marker
            .getPosition()
            .lat()} , ${last_marker.getPosition().lng()} `,

          travelMode: "DRIVING",
        },
        (response, status) => {
          console.log(response, status);
        }
      );
    },
  },
  watch: {
    markerAdded() {
      if (this.markerAdded === true) {
        this.createRoute(this.first_marker, this.last_marker);
      }
    },
  },
};
</script>

<style scoped>
section {
  display: flex;
}
.buttons_box {
  width: 40%;
  height: 760px;
  background-color: rgba(0, 0, 0, 0.05);
}
.container {
  width: 60%;
  height: 760px;
  background-color: #ccc;
  /* margin: auto; */
}
</style>
