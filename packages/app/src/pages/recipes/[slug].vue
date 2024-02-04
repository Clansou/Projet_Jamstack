<script setup lang="ts">
const {findOne} = useStrapi4();
const route = useRoute();

const {data: recipe,pending} = useAsyncData('recipe',() => findOne(`recipes/${route.params.slug}?populate=*`)
)


</script>

<template>
    <div class="container">
        <p v-if="pending">Loading...</p>
        
        <p v-else>{{ recipe.data }}</p>
    </div>

</template>