<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <div class="text-h6"><b>Kuharica</b></div>
        </q-toolbar-title>

        <div>Bad Developers</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<!-- <span class="material-symbols-rounded">
  supervisor_account
  </span> -->


<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Prijava",
    icon: "login",
    link: "/login",
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
  // {
  //   title: "",
  //   caption: "forum.quasar.dev",
  //   icon: "record_voice_over",
  //   link: "https://forum.quasar.dev",
  // },
  // {
  //   title: "",
  //   caption: "@quasarframework",
  //   icon: "rss_feed",
  //   link: "https://twitter.quasar.dev",
  // },
  // {
  //   title: "",
  //   caption: "@QuasarFramework",
  //   icon: "public",
  //   link: "https://facebook.quasar.dev",
  // },
  // {
  //   title: "",
  //   caption: "Community Quasar projects",
  //   icon: "favorite",
  //   link: "https://awesome.quasar.dev",
  // },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
