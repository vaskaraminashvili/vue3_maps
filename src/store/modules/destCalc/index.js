import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";
export default {
  namespaced: true,
  state() {
    return {
      gRoutes: null,
      kargi: 0,
    };
  },
  mutations: mutations,
  actions: actions,
  getters, // same as getters:getters its is simply shorthand
};
