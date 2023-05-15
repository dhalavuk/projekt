<template>
    <div style="max-width: 800px" class="q-pa-md">
      <q-form @submit="onSubmit" @reset="onReset" class="q-pa-md ">
  
        <q-input ref="naslovRef" filled v-model="recept.naslov" hint="Naziv jela" lazy-rules
          :rules="[val => val && val.length > 0 || 'Naziv jela je obavezan!']" />
  
        <q-input filled v-model="recept.kratkiOpis" hint="Kratki opis jela" lazy-rules
          :rules="[val => val && val.length > 0 || 'Kratki opis jela je obavezan!']" />
  
        <q-input filled v-model="recept.objavio" hint="Autor teksta" lazy-rules
          :rules="[val => val && val.length > 0 || 'Autor je obavezan!']" />
  
        <q-input ref="ocjenaRef" filled type="number" v-model='recept.ocjena' min="1" max="5" hint="Ocjena" lazy-rules
          :rules="[val => val && val.length > 0 && val.length < 6 || 'Ocjena je obavezan!']" />
  
        <q-input v-model="recept.opis" filled type="textarea" />
  
  
  
  
        <div>
          <q-btn label="Spremi" type="submit" color="primary" />
          <q-btn @click="goHome" label="Povratak" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>
    </div>
  </template>
  
  <script setup>
  import { collection, addDoc } from "firebase/firestore";
  import { db } from 'src/js/firebase'
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar'
  const route = useRoute()
  const router = useRouter()
  const trenutniID = route.params.id
  const recept = ref([])
  const $q = useQuasar()
  const name = ref(null)
  const naslovRef = ref(null)
  const ocjenaRef = ref(null)
  const accept = ref(false)
  const insertRecept = async () => {
    const docRef = await addDoc(collection(db, "recept"), {
      naslov: recept.value.naslov,
      opis: recept.value.opis,
      kratkiOpis: recept.value.kratkiOpis,
      objavio: recept.value.objavio,
      ocjena: recept.value.ocjena
    });
    console.log("Document written with ID: ", docRef.id)
  }
  //ovo ne radi baš dobro!
  const obrisiPolja = () => {
    recept.value.naslov = "",
      recept.value.opis = "",
      recept.value.kratkiOpis = "",
      recept.value.objavio = "",
      recept.value.ocjena = ""
  }
  const goHome = () => {
    router.push({
      name: 'home'
    })
  }
  onMounted(() => {
    //showRecept()
  })
  function onSubmit() {
    console.log("Submitano")
    naslovRef.value.validate()
    ocjenaRef.value.validate()
    if (naslovRef.value.hasError || ocjenaRef.value.hasError) {
      // form has error
    }
    else {
      insertRecept()
      goHome()
      $q.notify({
        icon: 'done',
        color: 'positive',
        message: 'Izmjena Spremljena'
      })
    }
  }
  </script>