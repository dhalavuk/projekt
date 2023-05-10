<template>
   <div class="q-pa-md row items-start q-gutter-md">

<q-card v-for="post in recepti" :key="post.id" class="my-card" flat bordered>



  <q-img :src="post.slika" />

  <q-card-section>

    <q-btn fab color="primary" icon="comment" class="absolute"
      style="top: 0; right: 12px; transform: translateY(-50%)" :to="'/recept/' + post.id" />

    <div class="row no-wrap items-center">
      <div class="col text-h6 ellipsis">{{ post.naslov }}</div>
    </div>


  </q-card-section>

  <q-card-section class="q-pt-none">
    <div class="text-subtitle2">by {{ post.objavio }}</div>
    <q-rating v-model=post.stars :max="5" size="24px" />
    <div class="text-caption text-grey">
      {{ post.kratkiOpis }}
    </div>
    <div>


    </div>
  </q-card-section>

  <q-separator />

</q-card>
</div>
</template>

<script setup>
import { collection, getDocs } from "firebase/firestore";
import { db } from 'src/js/firebase'
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const recepti = ref([])


const getRecepti = async () => {
  var lokalniRec = []
  const querySnapshot = await getDocs(collection(db, "recept"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    //recepti.value = doc.data()
    let row = doc.data()
    row.id = doc.id
    console.log("Row", row)
    lokalniRec.push(row);
    // recepti = doc.data()
    // console.log("Recept:", doc.data())
    // return recepti[{
    //   naslov: doc.data().naslov
    // }]
    // console.log("Recepti:::", doc.data())
  });
  console.log("Recept:", lokalniRec)
  recepti.value = lokalniRec
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
