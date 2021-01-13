export default {
  gRoutes(state) {
    return state.gRoutes;
  },
  hasCoaches(state) {
    return state.coaches && state.coaches.length > 0;
  },
};
