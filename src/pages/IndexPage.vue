<template>
  <div class="q-pa-md row items-start q-gutter-md">



    <q-card v-for="post in recepti" :key="post.id" class="my-card" flat bordered>

      <q-img src="~assets/pastasuta.jpg" />

      <q-card-section>
        <q-btn fab color="primary" icon="comment" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)" to="/recept" />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ post.naslov }}</div>
        </div>


      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">by {{ post.objavio }}</div>
        <q-rating v-model=post.stars :max="5" size="24px" />
        <div class="text-caption text-grey">
          {{ post.kratkiOpis }}
        </div>
      </q-card-section>

      <q-separator />

    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";


//Popis recepata
const recepti = ref([
  {
    id: 'id1',
    naslov: 'Paštašuta',
    objavio: 'Goli kuhar',
    kratkiOpis: 'Alexa vrati se doma',
    stars: '3'
  },
  {
    id: 'id2',
    naslov: 'Jota',
    objavio: 'Gordon Ramsay',
    kratkiOpis: 'Jota je zakon!!!',
    stars: '5'
  },
  {
    id: 'id3',
    naslov: 'Panceta',
    objavio: 'Lokanin mesar',
    kratkiOpis: 'Ne treba ti više...',
    stars: '4'
  },
])


</script>

<style>
.bg-blue {
  background-color: #1e90ff;
  color: white;
}
</style>
