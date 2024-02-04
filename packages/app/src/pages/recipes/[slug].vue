<script setup lang="ts">
const {findOne} = useStrapi4();
const route = useRoute();

const {data: recipe,pending} = useAsyncData('recipe',() => findOne(`recipes/${route.params.slug}?populate=*`)
)


</script>

<template>
    <div v-if="pending" class="container mx-auto text-center">
      Loading...
    </div>
    <div v-else class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-32 text-center">{{ recipe.data.title }}</h1>
    <div class="flex flex-wrap md:flex-nowrap">
      <div class="flex-1">
        <img :src="recipe.data.image.url" :alt="recipe.data.image.alternativeText || recipe.data.title" class="w-3/4  mx-auto mb-4" />
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">Description</h2>
          <p>{{ recipe.data.description }}</p>
        </div>
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">Tags</h2>
          <ul class="flex flex-wrap gap-2">
            <li v-for="tag in recipe.data.tags" :key="tag.id" class="list-none bg-blue-200 rounded-full px-4 py-1">
              {{ tag.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="flex-1 ml-4">
        <div class="mb-4">
          <h2 class="text-2xl font-semibold">Ingredients</h2>
          <ul>
            <li v-for="ingredient in recipe.data.ingredients" :key="ingredient.id" class="list-none">
              {{ ingredient.name }} <span v-if="ingredient.quantity">- {{ ingredient.quantity }} g</span>
            </li>
          </ul>
        </div>
        <div class="mb-4">
        <!-- probleme mes steps reinitialise de temps en temps  -->
          <h2 class="text-2xl font-semibold">Steps</h2>
          <ol>
            <li v-for="step in recipe.data.Steps" :key="step.id" class="list-none">
              <div class="flex flex-col">

                <h3 class="my-2">Etape {{ step.Step_title }}</h3>
                <p class="ml-4">{{ step.Step_description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  </template>