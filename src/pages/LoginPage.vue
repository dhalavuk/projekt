<template>
  <!-- <q-header elevated class="bg-deep-purple text-white"> -->
  <div v-if="userMail">
    <h4>{{ userMail }} već ste prijavljeni!</h4>
    <q-btn @click="goHome" color="primary">Povratak</q-btn>
  </div>
  <div v-else>
    <q-tabs v-model="tab" class="bg-primary text-white ">
      <q-tab name="Prijava" label="Prijava" @click.prevent="register = false" />
      <q-tab name="Registracija" label="Registracija" @click.prevent="register = true" />
    </q-tabs>
    <!-- </q-header> -->

    <q-card class="my-card">
      <q-card-section>
        <form @submit.prevent="onSubmit">
          <div class="q-gutter-y-md">
            <div class="loginText" style="text-align: center">{{ tab }}</div>

            <q-input v-model="kredencijali.email" class="input" outlined label="Email" />
            <div> </div>
            <q-input v-model="kredencijali.password" class="input" outlined type="password" label="Password" />


            <div class="row justify-between">
              <q-btn class="bg-primary text-white" to="/">Odustani</q-btn>
              <q-btn class="bg-primary text-white" type="submit">{{ tab }}</q-btn>
            </div>
          </div>

        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { auth } from 'src/js/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

const router = useRouter()
const register = ref(false)
const tab = ref('')
const $q = useQuasar()

const userLogiran = ref()
const userMail = ref()

if (!register.value) {
  tab.value = "Prijava"
}
else {
  tab.value = "Registracija"
}

/*
kredencijali
*/

const kredencijali = reactive({
  email: '',
  password: ''
})



const userName = (user) => {
  email: user.email
  // name: user.email.substring(0, user.email.indexOf('@'))
}




/*
Registracija usera
*/

const registerUser = (kredencijali) => {
  console.log("akcija Registriraj", kredencijali);

  createUserWithEmailAndPassword(auth, kredencijali.email, kredencijali.password).then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("user: ", user)
    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Uspješno ste se registrirali'
    })
    goHome()


  }).catch((error) => {
    console.log("Greška kod registracije:", error.message)

  });
}

/*
Login (prijava) usera
*/

const loginUser = (kredencijali) => {
  console.log("User se prijavljuje", kredencijali)

  signInWithEmailAndPassword(auth, kredencijali.email, kredencijali.password).then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("user: ", user)
    $q.notify({
      icon: 'done',
      color: 'positive',
      message: 'Uspješno ste se prijavili'
    })
    goHome()
    // ...
  }).catch((error) => {
    console.log("Greška kod logina:", error.message)
  });

}


//Provjera dali je usera prijavljen u Firebase

const init = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User je logiran: ", user)
      userLogiran.value = true
      userMail.value = user.email
      // ...
    } else {
      // User is signed out
      console.log("User se odlogirao: ", user)
    }
  });
}

const goHome = () => {
  router.back()
  // router.push({
  //   name: 'home'
  // })
}


/*
  submit
*/





const onSubmit = () => {
  console.log("forma potvrđana")

  if (!kredencijali.email || !kredencijali.password) {
    alert('Unesite email i lozinku')
  }
  else {
    if (register.value) {
      registerUser(kredencijali)
      console.log('Registriraj korisnika sa:', kredencijali)
    }
    else {
      loginUser(kredencijali)
      console.log('Prijavi korisnika sa:', kredencijali)
    }
  }
}


onMounted(() => {
  init()
})


</script>

<style lang="sass" scoped>
.my-card
    width: 100%
    max-width: 400px
    margin: 0 auto
    margin-top: 40px
    font-size: 36px
    width: 100%


</style>




