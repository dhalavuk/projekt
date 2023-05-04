<template>
  <div>
    <h2>Recept</h2>
    <h3>{{ $route.params.id }}</h3>
    <p>Detalji recepta sa ID-jem: {{ $route.params.id }} </p>
  </div>
  <div>
    <button @click="showReceptId">Prikaži ID od Recepta</button>
  </div>
  <div @click="goHome" class="q-pa-md q-gutter-sm">
    <q-btn color="primary" label="Natrag na početnu" />
    
  </div>
</template>



<script setup>

import { api } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from "vue";

const route = useRoute()
const router = useRouter()
const trenutniID = route.params.id



const showReceptId = () => {
  alert("ID od ovog recepta je: " + trenutniID)
}

const goHome = () => {
  router.push({
    name: 'home'
  })
}




</script>


