export default {
  addRouteToList(state, payload) {
    // console.log(payload.value);
    state.gRoutes = payload.value;
    state.kargi++;
    // console.log(state);
  },
};
