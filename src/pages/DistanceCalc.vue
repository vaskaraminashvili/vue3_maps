<template>
  <main>
    <origin-destination-from></origin-destination-from>
    <route-list></route-list>
    <directions-map-view></directions-map-view>
  </main>
</template>

<script>
import OriginDestinationFrom from "../components/distanceCalce/OriginDestinationForm.vue";
import RouteList from "../components/distanceCalce/RouteList.vue";
import DirectionsMapView from "../components/distanceCalce/DirectionsMapView.vue";
export default {
  components: {
    OriginDestinationFrom,
    RouteList,
    DirectionsMapView,
  },
};
</script>

<style></style>
