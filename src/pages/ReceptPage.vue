<template>
  <div class="q-pa-md">
    <div class="q-col-gutter-md row">
      <div class="col-5">
        <q-img :src="recept.slika">
          <div class="absolute-bottom text-subtitle1 text-center">
            {{ recept.naslov }}
          </div>
        </q-img>
        <div :hidden="slikaSkriveno">
          <q-file v-model="slikaLocal" accept="image/*" label="Odaberi novu sliku..."
            :counter-label="counterLabelFunction" counter @rejected="onRejected" />
          <q-btn @click="spremiSliku">Spremi sliku</q-btn>
        </div>
      </div>
    </div>
  </div>


  <div style="max-width: 800px" class="q-pa-md">
    <q-form @submit="onSubmit" @reset="onReset" class="q-pa-md ">



      <div>
        <q-checkbox v-model="recept.javno" :disable="onemoguceno">{{ labela }}</q-checkbox>
      </div>



      <q-input ref="naslovRef" filled v-model="recept.naslov" hint="Naziv jela" lazy-rules
        :rules="[val => val && val.length > 0 || 'Naziv jela je obavezan!']" :disable="onemoguceno" />

      <q-input filled v-model="recept.kratkiOpis" hint="Kratki opis jela" lazy-rules
        :rules="[val => val && val.length > 0 || 'Kratki opis jela je obavezan!']" :disable="onemoguceno" />

      <q-input filled v-model="recept.objavio" hint="Autor teksta" lazy-rules
        :rules="[val => val && val.length > 0 || 'Autor je obavezan!']" :disable="onemoguceno" />

      <q-input ref="ocjenaRef" filled type="number" v-model='recept.ocjena' min="1" max="5" hint="Ocjena" lazy-rules
        :rules="[val => val && val.length > 0 && val.length < 6 || 'Ocjena je obavezan!']" :disable="onemoguceno" />

      <q-input v-model="recept.opis" filled type="textarea" :disable="onemoguceno" />



      <q-toggle @click="test" v-model="accept" label="Omogući izmjenu" />

      <div>
        <q-btn label="Spremi" type="submit" color="primary" />
        <q-btn @click="goHome" label="Povratak" color="primary" flat class="q-ml-sm" />
        <q-btn @click="showDialog = true" label="Brisanje" color="negative" class="q-ml-sm" />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="showDialog" persistent class="q-pa-md">
    <q-card style="width: 400px; max-width: 80vw;">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Upozorenje</q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pa-md">Ako potvrdite brišete recept: <h4>{{ recept.naslov }}</h4> </q-card-section>
      <div class="q-ml-sm">
        <q-btn v-close-popup label="Odustani" color="green" />
        <q-btn @click="deleteRecept" v-close-popup label="Briši" color="negative" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from 'src/js/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as refFire, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { ref, computed, onMounted } from "vue";
import { loadRouteLocation, useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar'
import { v4 as uuidv4 } from 'uuid';


const route = useRoute()
const router = useRouter()
const trenutniID = route.params.id
const recept = ref([])


const $q = useQuasar()
const naslovRef = ref(null)
const ocjenaRef = ref(null)
const accept = ref(false)
const onemoguceno = ref(true)
const slikaSkriveno = ref(true)

const userLogiran = ref()

const selected = ref()
const labela = ref('')

const slikaLocal = ref(null)
const uploadTask = ref(null)


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

//Upload slike
const spremiSliku = () => {

  const downloadURL = null
  const storage = getStorage()
  const storageRef = refFire(storage, 'slike_hrane/' + recept.value.naslov + '_' + uuidv4())
  uploadTask.value = uploadBytesResumable(storageRef, slikaLocal.value);
  console.log("Ref: ", storageRef.value)

  if (!slikaLocal.value) { console.log("Nema slike") }
  else {

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
          updateSlike(downloadURL)
          showRecept()
        });
      }
    );
  }
}

const updateSlike = async (urlSlike) => {

  const docRef = doc(db, "recept", trenutniID);

  await updateDoc(docRef, {
    slika: urlSlike
  });
}


const test = () => {
  if (userLogiran.value == false) {
    console.log("Test: ", userLogiran.value)
    alert('Da bi radili izmjene morate biti prijavljeni!');
    onemoguceno.value = true
    accept.value = false

  } else {
    if (accept.value == false) {
      slikaSkriveno.value = true
      onemoguceno.value = true
      return accept.value
    } else {
      slikaSkriveno.value = false
      onemoguceno.value = false
      return accept.value
    }
  }

}


//dialog
const showDialog = ref(false)
// dialog kraj

const showRecept = async () => {

  const docRef = doc(db, "recept", trenutniID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    recept.value = {
      id: docSnap.id,
      naslov: docSnap.data().naslov,
      opis: docSnap.data().opis,
      kratkiOpis: docSnap.data().kratkiOpis,
      objavio: docSnap.data().objavio,
      ocjena: docSnap.data().ocjena,
      slika: docSnap.data().slika,
      javno: docSnap.data().javno
    }

    if (recept.value.javno == true) {
      selected.value = true
      labela.value = "Recept je javno objavljen"
    }
    else {
      selected.value = false
      labela.value = "Recept nije je javno objavljen"
    }

  } else {
    // docSnap.data() will be undefined in this case
    console.log("Dokument ne postoji");
  }
}

const updateRecept = async () => {

  const docRef = doc(db, "recept", trenutniID);

  await updateDoc(docRef, {
    naslov: recept.value.naslov,
    kratkiOpis: recept.value.kratkiOpis,
    opis: recept.value.opis,
    objavio: recept.value.objavio,
    ocjena: recept.value.ocjena,
    javno: recept.value.javno
  });
}

const deleteRecept = async () => {

  if (userLogiran.value == false) {
    console.log("Test: ", userLogiran.value)
    alert('Niste prijavljeni i ne možete brisati recepte');
    onemoguceno.value = true
    accept.value = false

  } else {

    console.log("Briše recept sa ID: ", trenutniID)
    await deleteDoc(doc(db, "recept", trenutniID));
    goHome()
  }

}


const showReceptId = () => {
  alert("ID od ovog recepta je: " + trenutniID)
}

const goHome = () => {
  router.back()
  // router.push({
  //   name: 'home'
  // })
}


onMounted(() => {
  showRecept()
  init()
})

const brisanjeClick = () => {
  console.log("Obrisano")
}

//Provjera dali je usera prijavljen u Firebase
const init = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {

      console.log("User je logiran: ", user)
      userLogiran.value = true
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
    accept.value = false
    showRecept()
    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Izmjena Spremljena'
    })
  }
}




</script>




