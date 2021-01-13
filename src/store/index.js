import { createStore } from "vuex";

import destCalc from "./modules/destCalc/index.js";

const store = createStore({
  modules: {
    destCalc: destCalc,
  },
});

export default store;
