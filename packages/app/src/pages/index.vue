<script lang="ts" setup>
import type { ITag, IIngredient } from '~/models/search.model'
const { find } = useStrapi()
const search = useSearchStore()


function addTag(tag: string) {
  if (!search.queryTags.includes(tag)){
    search.queryTags.push(tag)
  }
  else search.queryTags = search.queryTags.filter(t => t !== tag)
}

function addIngredients(ingredients: string) {
  if (!search.queryIngredients.includes(ingredients)){
    search.queryIngredients.push(ingredients)
  }
  else search.queryIngredients = search.queryIngredients.filter(i => i !== ingredients)
}

const { data:recipes, pending, error, refresh } = useAsyncData(
 'recipes',
 () => find('recipes',{
    populate:'*',
 })
)
const { data:tags} = useAsyncData(
 'tags',
 () => find<{ data: ITag[] }>('tags')
)
const { data:ingredients} = useAsyncData(
 'ingredients',
 () => find<{ data: IIngredient[] }>('ingredients')
)
</script>

<template>
  <div class="container">

      <h1 class="w-fit p-12 mx-auto">Les recettes de chez vous</h1>
      <h2>Filtres de recherche :</h2>
          <div class="form-group flex flex-col gap-2" role="search">
            <label for="search">Chercher une recette :</label>
            <input id="search" v-model="search.query" class="px-4 py-2" type="search">
          </div>
          <div class="form-group flex flex-col items-start">
            <p>Filtrer par tag :</p>
            <div class="flex flex-wrap items-start gap-2" role="group">
              <button
                v-for="tag in tags?.data" :key="tag.id"
                :class="{ 'bg-gray-900 text-white': search.queryTags.includes(tag.slug) }"
                :title="tag.name"
                class="py-1 px-2 bg-gray-200 text-gray-900 border-none cursor-pointer"
                @click="addTag(tag.slug)"
              >
                {{ tag.name }}
              </button>
            </div>
            <button
              class="mt-4 appearance-none border-none bg-transparent p-0 underline cursor-pointer"
              @click="search.resetTags"
            >
              Réinitialiser les tags sélectionnés
            </button>
            <p>Filtrer par ingrédients :</p>
            <div class="flex flex-wrap items-start gap-2" role="group">
              <button
                v-for="ingredient in ingredients?.data" :key="ingredient.id"
                :class="{ 'bg-gray-900 text-white': search.queryIngredients.includes(ingredient.slug) }"
                :title="ingredient.name"
                class="py-1 px-2 bg-gray-200 text-gray-900 border-none cursor-pointer"
                @click="addIngredients(ingredient.slug)"
              >
                {{ ingredient.name }}
              </button>
            </div>
            <button
              class="mt-4 appearance-none border-none bg-transparent p-0 underline cursor-pointer"
              @click="search.resetTags"
            >
              Réinitialiser les ingrédients sélectionnés
            </button>
      </div>
      <p v-if=pending>Loading...</p>
      <p v-if=error>{{ error }}</p>
      
      <div v-if="recipes">
        <ul class="pl-0 mx-auto flex justify-around	gap-16 flex-wrap	">
          
          <li class="list-none" v-for="recipe in search.sortedResults" :key="recipe.id">
            <div class="shadow-lg ease-in duration-150 hover:shadow-2xl rounded p-4 gap-4 flex-col flex">
              <NuxtImg class="w-80 h-60" :src="recipe.image.url"/>
              <h2 class="text-2xl	my-0">{{ recipe.title }}</h2>
              <div class="pl-0 flex flex-col">
                <p class="text-lg	">Tags:</p>
                <ul class="pl-0 flex gap-2">
                  <li class="bg-sky-200		list-none rounded px-2 py-1" v-for="tags in recipe.tags">{{ tags.name }}</li>
                </ul>
              </div>
              <NuxtLink class="text-lg bg-sky-300 ease-in duration-150 hover:bg-sky-400 hover:shadow-lg no-underline color-black rounded-lg	 my-4 px-5 py-2 ml-auto" :to="`/recipes/${recipe.id}`">Voir la recette</NuxtLink>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>
