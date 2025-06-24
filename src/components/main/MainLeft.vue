<template>
  <div class="mainbody-left">
    <div class="side-content-wrap">
      <ProfileSection
          @profile-info="$emit('profile-info')"
          @logout="$emit('logout')"
      />
      <ActivitySection
          @activity-click="$emit('activity-navigate', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import ProfileSection from './ProfileSection.vue'
import ActivitySection from './ActivitySection.vue'

// Emits
defineEmits(['profile-info', 'logout', 'activity-navigate'])
</script>

<style lang="scss" scoped>
.mainbody-left {
  width: 173px;
  height: 705px;
  position: relative;

  .side-content-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>