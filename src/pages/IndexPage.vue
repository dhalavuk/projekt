<template>
  <div class="q-pa-md row items-start q-gutter-md">



    <q-card v-for="n in 3" :key="n" class="my-card" flat bordered>
      <q-img src="~assets/pastasuta.jpg" />

      <q-card-section>
        <q-btn fab color="primary" icon="comment" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)" to="/recept" />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">Pastasuta</div>
        </div>


      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">by Naked Chef</div>
        <q-rating v-model="stars" :max="5" size="24px" />
        <div class="text-caption text-grey">
          Vrati se skuhala sa ti paštašutu
        </div>
      </q-card-section>

      <q-separator />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const stars = ref(5);
</script>

<style>
.bg-blue {
  background-color: #1e90ff;
  color: white;
}
</style>
