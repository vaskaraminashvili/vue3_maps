<template>
  <div class="ui segment max-height">
    <div class="ui divder items">
      <div class="item" v-for="place in places" :key="place.id">
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
  props: ["places"],
};
</script>

<style scoped>
.max-height {
  max-height: 300px;
  overflow-y: auto;
}
</style>
