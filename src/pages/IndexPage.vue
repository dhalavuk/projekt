<template>
  <template>
    <div v-if="recepti.length">
      <ul>
        <li v-for="post in recepti" :key="post.id">
          {{ post.naslov }}
        </li>
      </ul>
    </div>
  </template>
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
  const querySnapshot = await getDocs(collection(db, "recept"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
    //this.recepti.push();
    console.log("Recept:", doc.data())
    return recepti[{
      naslov: doc.data().naslov
    }]
    console.log("Recepti:::", doc.data())
  });
}

// const goToReceptDetalji = (id) => {
//   router.push({
//     name: 'detaljiRecepta',
//     params: {
//       id: id
//     }
//   })
//   console.log("ReceptDetalji")
// }


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
