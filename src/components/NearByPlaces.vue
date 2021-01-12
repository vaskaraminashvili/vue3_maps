<template>
  <div class="ui segment max-height">
    <div class="ui divder items">
      <div
        class="item"
        :class="{ active: activeIndex === index }"
        v-for="(place, index) in places"
        :key="place.id"
        @click="showInfoWindow(index)"
      >
        <div class="content">
          <div class="header">{{ place.name }}</div>
          <div class="meta">{{ place.vicinity }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["places", "markers"],
  data() {
    return {
      activeIndex: -1,
    };
  },
  methods: {
    showInfoWindow(index) {
      const marker = this.markers[index];
      this.activeIndex = index;
      new window.google.maps.event.trigger(marker, "click");
    },
  },
};
</script>

<style scoped>
.max-height {
  max-height: 300px;
  overflow-y: auto;
}
.item {
  padding: 10px !important;
}
.active {
  background-color: tomato !important;
}
</style>
