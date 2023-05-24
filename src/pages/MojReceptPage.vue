<template>
  <h4 v-if="!userMail">Niste prijavljeni korisnik</h4>
  <h4 v-else>Recepti od {{ userMail }}</h4>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card v-for="redak in recepti" :key="redak.id" class="my-card" flat bordered>
      <q-img :src="redak.slika" />

      <q-card-section>
        <q-btn fab color="primary" icon="comment" class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)" :to="'/recept/' + redak.id" />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ redak.naslov }}</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-subtitle2">by {{ redak.objavio }}</div>
        <q-rating v-model='redak.ocjena' :max="5" size="24px" :readonly="true" />
        <div class="text-caption text-grey">
          {{ redak.kratkiOpis }}
        </div>
        <q-chip v-if="redak.javno == true" icon="bookmark" color="green" size="XS" text-color="white" label="Javno"
          outline />
        <q-chip v-else icon="bookmark" color="red" size="XS" text-color="white" label="Privatno" outline />
      </q-card-section>
      <q-separator />
    </q-card>
  </div>
</template>


<script setup>
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from 'src/js/firebase'
import { onAuthStateChanged } from "firebase/auth";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()
const recepti = ref([])
var lokalniRec = [];
const userMail = ref()


const getReceptiSve = async () => {
  const querySnapshot = onSnapshot(collection(db, "recept"), (querySnapshot) => {
    recepti.value = [] // bez ovoga kod izmjene podataka u Firebaseu reaktivno se kreira novi q-card
    querySnapshot.forEach((doc) => {
      let row = doc.data();
      row.id = doc.id;
      recepti.value.push(row);
      lokalniRec.push(row);
    });
  });
}

const getReceptiPublic = async () => {
  const q = query(collection(db, "recept"), where("objavio", "==", userMail.value));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    recepti.value = []
    querySnapshot.forEach((doc) => {
      let row = doc.data();
      row.id = doc.id;
      recepti.value.push(row);
      lokalniRec.push(row);
    });
    console.log("Filtrirani recept: ", recepti);
  });

}

//Provjera dali je usera prijavljen u Firebase
const init = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {

      userMail.value = user.email
      console.log("User je logiran: ", userMail.value)
      getReceptiPublic()
      // ...
    } else {
      //getReceptiPublic()
      // User is signed out
      console.log("User NIJE logiran: ", user)
    }
  });
}


onMounted(() => {
  init()
})


</script>



<style scoped>
.bg-blue {
  background-color: #1e90ff;
  color: white;
}

.my-card {
  width: 100%;
  max-width: 300px;
}
</style>
