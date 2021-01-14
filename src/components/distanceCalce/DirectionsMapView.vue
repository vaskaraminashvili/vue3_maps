<template>
  <section class="map" ref="mapContainer"></section>
</template>

<script>
import mitt from "mitt";
window.mitt = window.mitt || new mitt();
export default {
  data() {
    return {
      mapRoute: null,
    };
  },
  created() {
    // this.mapRoute = this.$store.getters["destCalc/gRoutes"];
  },
  mounted() {
    const box = this.$refs.mapContainer;
    const options = {
      center: new window.google.maps.LatLng(
        41.72645253832406,
        44.75086220285816
      ),
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };
    const map = new window.google.maps.Map(box, options);
    const directionService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    window.mitt.on("route-data", (data) => {
      directionService.route(
        {
          origin: data.route.origin.address,
          destination: data.route.destination.address,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(response);
            directionsRenderer.setMap(map);
          }
          console.log(response, status);
        }
      );
    });
    // if (this.mapRoute != null) {
    //   console.log(this.mapRoute);
    //
    // }
  },
};
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: tomato;
}
</style>
