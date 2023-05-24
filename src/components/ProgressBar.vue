<template>
  <div class="bg-gray-300 w-full rounded-full h-2">
    <div class="bg-sky-400 transition-all ease-in-out duration-200" :style="`width:${props.progress}%`">
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  progress: Number
})
</script>
