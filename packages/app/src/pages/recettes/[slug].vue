<script setup lang="ts">
const {findOne} = useStrapi4();
const route = useRoute();

const {data: recette,pending} = useAsyncData('recette',() => findOne(`recettes/${route.params.slug}`)
)


</script>

<template>
    <div class="container">
        <p v-if="pending">Loading...</p>
        <p v-else>{{ recette.data.title }}</p>
    </div>

</template>