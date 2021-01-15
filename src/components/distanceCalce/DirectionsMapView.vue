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
      distance: "",
      duration: "",
      gMap: "",
    };
  },
  created() {
    // this.mapRoute = this.$store.getters["destCalc/gRoutes"];
  },
  mounted() {
    const directionService = new window.google.maps.DirectionsService();
    // const directionsRenderer = new window.google.maps.DirectionsRenderer();
    // window.mitt.on("route-data", (data) => {
    //   console.log(data.route);
    //   // const waypts = [];
    //   // waypts.push({
    //   //   location: "Connawarra,SA",
    //   //   stopover: true,
    //   // });
    //   directionService.route(
    //     {
    //       origin: data.route.origin.address,
    //       destination: data.route.destination.address,
    //       travelMode: "DRIVING",

    //       // using way point stops
    //       // origin: "Adelaide,SA",
    //       // destination: "Clare,SA",
    //       // waypoints: waypts,
    //       // optimizeWaypoints: true,
    //       // travelMode: "DRIVING",
    //     },
    //     (response, status) => {
    //       if (status === "OK") {
    //         directionsRenderer.setDirections(response);
    //         directionsRenderer.setMap(map);
    //       }
    //       console.log(response, status);
    //     }
    //   );
    // });

    window.mitt.on("routes-all", (routes) => {
      const options = {
        center: new window.google.maps.LatLng(
          41.72645253832406,
          44.75086220285816
        ),
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      };
      const map = new window.google.maps.Map(this.$refs.mapContainer, options);
      this.gMap = map;
      routes.forEach(({ origin, destination, distance, duration }) => {
        directionService.route(
          {
            origin: origin.address,
            destination: destination.address,
            travelMode: "DRIVING",
          },
          (response, status) => {
            if (status === "OK") {
              this.distance = distance;
              this.duration = duration;
              const direction_mark = new window.google.maps.DirectionsRenderer({
                // suppressMarkers: true,
                directions: response,
                map,
                draggable: true,
              });
              window.google.maps.event.addListener(
                direction_mark,
                "directions_changed",
                () => {
                  this.computeTotalDistance(direction_mark.getDirections());
                }
              );

              // amis shetana shesadzlebeli pirdapir constructorshi
              // directionsRenderer.setDirections(response);
              // directionsRenderer.setMap(map);

              // create popup window for starting point and ending
              this.createInfoWindowWith(origin, "marker alternate", map);
              this.createInfoWindowWith(destination, "flag checkered", map);

              const overviewPath = response.routes[0].overview_path;
              const middleIndex = parseInt(overviewPath.length / 2);
              const middleLoc = overviewPath[middleIndex];

              // create popup window in the middle with distance end time text
              const distanceDuration = new window.google.maps.InfoWindow({
                content: `<i class="icon car"> </i> ${this.distance.text} - ${this.duration.text}`,
                position: new window.google.maps.LatLng(
                  middleLoc.lat(),
                  middleLoc.lng()
                ),
              });
              distanceDuration.open(map, null);

              // connect line from addres to path
              // new window.google.maps.Polyline({
              //   path: [
              //     {
              //       lat: origin.tal,
              //       lng: origin.lng,
              //     },
              //     {
              //       lat: overviewPath[0].lat(),
              //       lng: overviewPath[0].lng(),
              //     },
              //   ],
              //   storkeColor: "#000",
              //   storeOpacity: 1,
              //   storeWeight: 8,
              //   map,
              // });
            }
          }
        );
      });
    });

    // if (this.mapRoute != null) {
    //   console.log(this.mapRoute);
    //
    // }
  },
  methods: {
    createInfoWindowWith(location, icon, map) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<i class="${icon} icon"> </i> ${location.address}`,
        position: new window.google.maps.LatLng(location.lat, location.lng),
      });
      infoWindow.open(map, null);
    },
    computeTotalDistance(result) {
      let total = 0;
      const myroute = result.routes[0];
      const overviewPath = myroute.overview_path;
      const middleIndex = parseInt(overviewPath.length / 2);
      const middleLoc = overviewPath[middleIndex];

      for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
      }
      total = total / 1000;
      this.distance = total + " km";
      // create popup window wiht update info
      const distanceDuration = new window.google.maps.InfoWindow({
        content: `<i class="icon car"> </i> ${myroute.legs[0].distance.text} - ${myroute.legs[0].duration.text}`,
        position: new window.google.maps.LatLng(
          middleLoc.lat(),
          middleLoc.lng()
        ),
      });
      distanceDuration.open(this.gMap, null);
    },
    // createPolyLine(start, end, map) {},
  },
};
</script>

<style>
.map {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: tomato;
}
.gm-style-iw .gm-ui-hover-effect {
  display: none !important;
}
.gm-style .gm-style-iw-c {
  padding: 5px !important;
}
.gm-style-iw-d {
  overflow: hidden !important;
}
</style>
