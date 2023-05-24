<template>
  <h4 v-if="!userMail">Niste prijavljeni korisnik</h4>
  <div v-else style="max-width: 800px" class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-pa-md ">

      <q-input ref="naslovRef" filled v-model="recept.naslov" label="Naziv jela" lazy-rules
        :rules="[val => val && val.length > 0 || 'Naziv jela je obavezan!']" />

      <q-input filled v-model="recept.kratkiOpis" label="Kratki opis jela" lazy-rules
        :rules="[val => val && val.length > 0 || 'Kratki opis jela je obavezan!']" />


      <q-input ref="ocjenaRef" label="Ocjena od 1 do 5" filled type="number" v-model='recept.ocjena' min="1" max="5"
        hint="Ocjena" lazy-rules :rules="[val => val && val.length > 0 && val.length < 6 || 'Ocjena je obavezan!']" />

      <q-input v-model="recept.opis" filled type="textarea" label="Opis jela" />

      <q-select v-model="recept.javno" :options="opcijaJavno" :option-value="vrijednost" :option-label="'cat'"
        label="Želite da recept bude javno objavljen" />

      <q-file v-model="slikaLocal" accept="image/*" label="Odaberi sliku" :counter-label="counterLabelFunction" counter
        @submit="onSubmit" @rejected="onRejected" lazy-rules :rules="[val => val || 'Slika jela je obavezan!']" />

      <q-btn label="Spremi" type="submit" color="primary" />
      <q-btn @click="goHome" label="Povratak" color="primary" flat class="q-ml-sm" />
    </q-form>


    <q-dialog v-model="showDialog" persistent class="q-pa-md">
      <q-spinner color="primary" size="3em" />
    </q-dialog>


  </div>
</template>

<script setup>

import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref as refFire, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth } from 'src/js/firebase'


import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { v4 as uuidv4 } from 'uuid';

import ProgressBar from 'src/components/ProgressBar.vue'


const showDialog = ref(false)
const storageImagePath = ref('')

const route = useRoute()
const router = useRouter()
const trenutniID = route.params.id
const recept = ref([])
const slikaLocal = ref(null)


const $q = useQuasar()
const name = ref(null)
const naslovRef = ref(null)
const ocjenaRef = ref(null)
const accept = ref(false)
const userLogiran = ref()
const userMail = ref()


const uploadTask = ref(null)
const paused = ref(false)
const progress = ref(0)
import { onAuthStateChanged } from "firebase/auth";

const opcijaJavno = [{ vrijednost: true, cat: 'Da' }, { vrijednost: false, cat: 'Ne' }]

function counterLabelFunction({ totalSize }) {
  return `veličina slike: ${totalSize}`
}

function onRejected(odbijeniFiles) {
  odbijeniFiles.forEach(odbijeniFile => {
    if (odbijeniFile.failedPropValidation) {
      slikaLocal.value = null
      $q.notify({
        message: "Samo slike!",
        type: "negative"

      })
    }
  })
}


function pause() {
  paused.value = !paused.value
}


const insertRecept = async (urlSlike) => {
  console.log("Url slike: ", urlSlike)
  console.log("Javno: ", recept.value.javno.vrijednost)
  const docRef = await addDoc(collection(db, "recept"), {
    naslov: recept.value.naslov,
    opis: recept.value.opis,
    kratkiOpis: recept.value.kratkiOpis,
    objavio: userMail.value,
    ocjena: recept.value.ocjena,
    slika: urlSlike,
    javno: recept.value.javno.vrijednost
  });
  console.log("JAVNO: ", docRef.javno)
  console.log("Document written with ID: ", docRef.id)
  showDialog.value = false
}

//ovo ne radi baš dobro!
const obrisiPolja = () => {
  recept.value.naslov = "",
    recept.value.opis = "",
    recept.value.kratkiOpis = "",
    recept.value.objavio = "",
    recept.value.ocjena = ""
}

//Upload slike
const spremiSliku = () => {

  const downloadURL = null
  const storage = getStorage()
  const storageRef = refFire(storage, 'slike_hrane/' + recept.value.naslov + '_' + uuidv4())
  uploadTask.value = uploadBytesResumable(storageRef, slikaLocal.value);
  console.log("Ref: ", storageRef.value)


  uploadTask.value.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
      console.log("Error kod uploada slike: ", error.message)
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.value.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        insertRecept(downloadURL)
      });
    }
  );



}



const goHome = () => {
  router.back()
  // router.push({
  //   name: 'home'
  // })
}


onMounted(() => {
  init()
})

//Provjera dali je usera prijavljen u Firebase
const init = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {

      console.log("User je logiran: ", user)
      userLogiran.value = true
      userMail.value = user.email
      console.log("User e-mail: ", userMail.value)
      return userLogiran
      // ...
    } else {

      // User is signed outnotifyq
      console.log("User NIJE logiran: ", user)
      userLogiran.value = false
      return userLogiran
    }
  });
}

function onSubmit() {
  naslovRef.value.validate()
  ocjenaRef.value.validate()

  if (naslovRef.value.hasError || ocjenaRef.value.hasError) {
    // form has error
  }
  else {
    showDialog.value = true
    spremiSliku()

    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Izmjena Spremljena'
    })
  }
}

</script>




