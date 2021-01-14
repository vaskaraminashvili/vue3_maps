<template>
  <section class="route-list-view">
    <div class="route-list-view-header">
      <h3 class="ui header">
        Route list
      </h3>
      <select @change="sortRoute">
        <option selected disabled>Sort</option>
        <optgroup label="distance">
          <option value="distance-asc">short</option>
          <option value="distance-desc">long</option>
        </optgroup>
        <optgroup label="duration">
          <option value="duration-asc">Fast </option>
          <option value="duration-desc">Slow</option>
        </optgroup>
      </select>
    </div>
    <div
      class="item"
      v-for="route in routesList"
      :key="route.id"
      @click="routeItemPressed(route)"
    >
      <div class="">
        <i class="marker alternate icon"></i>
        {{ route.origin.address }}
      </div>
      <div>
        <i class="flag checkered icon"></i>
        {{ route.destination.address }}
      </div>
      <div class="ui label small">
        {{ route.distance.text }}
      </div>
      <div class="ui label small">
        {{ route.duration.text }}
      </div>
    </div>
  </section>
</template>

<script>
import firebase from "firebase";
import mitt from "mitt";
window.mitt = window.mitt || new mitt();
export default {
  data() {
    return {
      routesList: [],
      lastRoute: "",
      test: "asdsasd",
    };
  },
  created() {
    const db = firebase.firestore();
    db.collection("routes").onSnapshot((snap) => {
      this.routesList = [];
      snap.forEach((doc) => {
        let route = doc.data();
        route.id = doc.id;
        this.routesList.push(route);
      });
    });
  },
  mounted() {
    // this.$store.dispatch("destCalc/addRouteToList", {
    //   value: this.routesList[0],
    // });
    // console.log(this.$store.getters["destCalc/coaches"]);
    // this.$store.dispatch("destCalc/addRouteToList", {
    //   value: 10,
    // });
    // console.log(this.$store.getters["destCalc/coaches"]);
  },
  methods: {
    sortRoute(event) {
      const sortName = event.target.value.split("-")[0];
      const sortOrder = event.target.value.split("-")[1];

      const db = firebase.firestore();
      db.collection("routes")
        .orderBy(sortName + ".value", sortOrder)
        .get()
        .then((snap) => {
          this.routesList = [];
          snap.forEach((doc) => {
            const route = doc.data();
            route.id = doc.id;
            this.routesList.push(route);
          });
        });
    },
    routeItemPressed(route) {
      window.mitt.emit("route-data", { route: route });
    },
  },
};
</script>

<style scoped>
.route-list-view {
  position: relative;
  z-index: 1;
  max-width: 250px;
  margin: 10px;
  background-color: #fff;
}
.route-list-view-header {
  padding: 10px;
}
.item {
  padding: 10px;
  cursor: pointer;
}
.item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
