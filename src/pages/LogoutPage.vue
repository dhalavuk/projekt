<template>
  <h4 v-if="!userMail">Niste prijavljeni korisnik</h4>
  <div v-else>
    <h4>Želite se odlogirati?</h4>
    <q-btn @click="logout" color="primary" icon="logout" label="Odjava" />
  </div>
</template>

<script setup>

import { getAuth, signOut } from "firebase/auth";
import { ref, onMounted } from "vue";
import { auth } from 'src/js/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const userMail = ref()


const logout = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    console.log("User odlogiran")

    $q.notify({
      icon: 'done',
      color: 'negative',
      message: 'Odjava'
    })

    goHome()

    // Sign-out successful.
  }).catch((error) => {
    console.log("Logout error: ", error)
    // An error happened.
  });
}

//Provjera dali je usera prijavljen u Firebase
const init = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userMail.value = user.email
      console.log("User je logiran: ", user)
      // ...
    } else {

      // User is signed out
      console.log("User NIJE logiran: ", user)
    }
  });
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

</script>
