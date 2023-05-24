<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="text-h6"><b>Kuharica</b></div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>

        <div v-if="!userMail">
          <EssentialLink v-for=" link  in  linksListNElogiran " :key="link.title" v-bind="link" />
        </div>
        <div v-else>
          <EssentialLink v-for=" link  in  linksList " :key="link.title" v-bind="link" />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script setup>
import { ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from 'src/js/firebase'


const userLogiran = ref()
const userMail = ref()

const linksListNElogiran = [
  {
    title: "Home",
    icon: "home",
    link: "/",
    target: "_self",
  },
  {
    title: "Prijava",
    icon: "login",
    link: "/login",
    target: "_self",
  },
  {
    title: "O Nama",
    caption: "About Bad Developers",
    icon: "supervisor_account",
    link: "/us",
    target: "_self",
  },
];

const linksList = [
  {
    title: "Home",
    icon: "home",
    link: "/",
    target: "_self",
  },
  {
    title: "Prijava",
    icon: "login",
    link: "/login",
    target: "_self",
  },
  {
    title: "Odjava",
    icon: "logout",
    link: "/logout",
    target: "_self",
  },
  {
    title: "Novi recept",
    caption: "Unos novog recepta",
    icon: "chat",
    link: "/new",
    target: "_self",
  },
  {
    title: "Moji recepti",
    caption: "Svi moji recepti",
    icon: "favorite",
    link: "/myrecept",
    target: "_self",
  },
  {
    title: "O Nama",
    caption: "About Bad Developers",
    icon: "supervisor_account",
    link: "/us",
    target: "_self",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}


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

onMounted(() => {
  init()
})


</script>



<!-- <script>
//import { linksList, leftDrawerOpen, toggleLeftDrawer } from "./script";

export default {
  components: {
    EssentialLink,
  },
};
</script> -->
