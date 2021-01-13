import { createRouter, createWebHistory } from "vue-router";

import DistanceCalc from "./pages/DistanceCalc.vue";
import UserLocation from "./pages/UserLocation.vue";
import CloseBy from "./pages/CloseBy.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: DistanceCalc, component: DistanceCalc },
    { path: "/userLocation", name: UserLocation, component: UserLocation },
    { path: "/closeby", name: CloseBy, component: CloseBy },
  ],
});

export default router;
