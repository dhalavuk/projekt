<template>
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
        <q-rating v-model='redak.ocjena' :max="5" size="24px" />
        <div class="text-caption text-grey">
          {{ redak.kratkiOpis }}
        </div>

      </q-card-section>

      <q-separator />

    </q-card>
  </div>
</template>

<script setup>
import { collection, onSnapshot } from "firebase/firestore";
import { db } from 'src/js/firebase'
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const recepti = ref([])

var lokalniRec = [];


const getRecepti = async () => {
  const querySnapshot = onSnapshot(collection(db, "recept"), (querySnapshot) => {
    recepti.value = [] // bez ovoga kod izmjene podataka u Firebaseu reaktivno se kreira novi q-card
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      let row = doc.data();
      row.id = doc.id;
      recepti.value.push(row);
      lokalniRec.push(row);
    });
  });
  console.log("Lokalni Recept:", lokalniRec)
}



onMounted(() => {
  getRecepti()
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
