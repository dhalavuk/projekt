<template>
  <div>
    <h2>Recept</h2>
    <h3>{{ $route.params.id }}</h3>
    <!-- <p>Detalji recepta sa ID-jem: {{ $route.params.id }} </p>
  </div>
  <div>
    <button @click="showReceptId">Prikaži ID od Recepta</button>
  </div> -->
    <div @click="goHome" class="q-pa-md q-gutter-sm">
      <q-btn color="primary" label="Natrag na početnu" />
    </div>
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card v-for="post in recepti" :key="post.id" class="my-card" flat bordered>
        <q-img :src="post.slika" />

      </q-card>
    </div>
  </div>
</template>



<script setup>

import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

const route = useRoute()
const router = useRouter()
const trenutniID = route.params.id

const getPosts = async () => {
  try {
    const response = await api.get('recepti')
    console.log(response.data)
    recepti.value = response.data

  } catch (error) {
    console.log(error)
  }
}



const showReceptId = () => {
  alert("ID od ovog recepta je: " + trenutniID)
}

const goHome = () => {
  router.push({
    name: 'home'
  })
}

onMounted(() => {
  getPosts()
})


</script>


