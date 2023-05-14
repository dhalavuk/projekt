<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row">
      <div class="col-5">
        <q-img :src="recept.slika">
          <div class="absolute-bottom text-subtitle1 text-center">
            {{ recept.naslov }}
          </div>
        </q-img>
      </div>
    </div>
  </div>

  <div style="max-width: 800px" class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-pa-md ">

      <q-input ref="naslovRef" filled v-model="recept.naslov" hint="Naziv jela" lazy-rules
        :rules="[val => val && val.length > 0 || 'Naziv jela je obavezan!']" />

      <q-input filled v-model="recept.objavio" hint="Autor teksta" lazy-rules
        :rules="[val => val && val.length > 0 || 'Autor je obavezan!']" />

      <q-input ref="ocjenaRef" filled type="number" v-model='recept.ocjena' min="1" max="5" hint="Ocjena" lazy-rules
        :rules="[val => val && val.length > 0 && val.length < 6 || 'Ocjena je obavezan!']" />

      <q-input v-model="recept.opis" filled type="textarea" />




      <q-toggle v-model="accept" label="Omogući izmjenu" />

      <div>
        <q-btn label="Spremi" type="submit" color="primary" />
        <q-btn @click="goHome" label="Povratak" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

  </div>
</template>



<script setup>
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

const showRecept = async () => {
  const docRef = doc(db, "recept", trenutniID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    recept.value = {
      id: docSnap.id,
      naslov: docSnap.data().naslov,
      opis: docSnap.data().kratkiOpis,
      objavio: docSnap.data().objavio,
      ocjena: docSnap.data().ocjena,
      slika: docSnap.data().slika
    }
    console.log("Recept: ", recept)
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}
const updateRecept = async () => {
  const docRef = doc(db, "recept", trenutniID);
  await updateDoc(docRef, {
    naslov: recept.value.naslov,
    kratkiOpis: recept.value.opis,
    objavio: recept.value.objavio,
    ocjena: recept.value.ocjena
  });
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
  showRecept()
})

function onSubmit() {
  console.log("Submitano")
  naslovRef.value.validate()
  ocjenaRef.value.validate()
  if (naslovRef.value.hasError || ocjenaRef.value.hasError) {
    // form has error
  }
  else if (accept.value !== true) {
    $q.notify({
      color: 'negative',
      message: 'Omogući izmjenu!'
    })
  }
  else {
    updateRecept()
    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Izmjena Spremljena'
    })
  }
}


</script>


