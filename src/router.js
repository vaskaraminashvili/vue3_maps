import { createRouter, createWebHistory } from "vue-router";

import UserLocation from "./pages/UserLocation.vue";
import CloseBy from "./pages/CloseBy.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: UserLocation, component: UserLocation },
    { path: "/closeby", name: CloseBy, component: CloseBy },
  ],
});

export default router;
