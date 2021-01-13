<template>
  <section class="map" ref="mapContainer"></section>
</template>

<script>
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
    console.log("mounted");
    const box = this.$refs.mapContainer;
    const options = {
      center: new window.google.maps.LatLng(
        41.72645253832406,
        44.75086220285816
      ),
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
    };
    new window.google.maps.Map(box, options);
    const directionService = new window.google.maps.DirectionsService();
    if (this.mapRoute != null) {
      console.log(this.mapRoute);
      directionService.route(
        {
          origin: this.mapRoute.origin.address,
          destination: this.mapRoute.destination.address,
          travelMode: "DRIVING",
        },
        (response, status) => {
          console.log(response, status);
        }
      );
    }
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
