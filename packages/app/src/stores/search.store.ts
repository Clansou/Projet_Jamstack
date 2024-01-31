// import Fuse from 'fuse.js'
// import { recipesMock } from '~/mocks/recipes.mock'

// export const useSearchStore = defineStore('search', () => {
//   const search = ref('')
//   // TODO: Replace any with your Recipe type and change elements
//   const elements = reactive<Array<any>>(recipesMock)
//   const keys = ['title', 'ingredients', 'tags']

//   const setElements = (newElements: any) => {
//     elements.push(...newElements)
//   }

//   const fuse = computed(() => new Fuse(Array.from(elements), {
//     keys,
//     threshold: 0.2,
//   }))

//   const results = computed(() => {
//     if (!search.value)
//       return Array.from(elements)
//     return [...fuse.value.search(search.value).map(r => r.item)]
//   })

//   return { search, results, setElements }
// })


import Fuse from 'fuse.js'
import type { IIngredient, IRecipe, ITag, RecipesData } from '~/models/search.model'

export const useSearchStore = defineStore('search', () => {
  const { find } = useStrapi4()

  const { data: recipes, pending } = useAsyncData('recipes', () => find<RecipesData>('recipes', { populate: '*' }))
  const query = ref('')
  const queryTags = ref<string[]>([])
  const queryIngredients = ref<string[]>([])
  const elements = reactive<IRecipe[]>(recipes.value?.data || [])
  const keys = ['title', 'description', 'ingredients.name']

  const fuse = computed(() => new Fuse(Array.from(elements), {
    keys,
    threshold: 0.3,
  }))

  const sortedElements = computed(() => {
    return elements.sort((a, b) => {
      return a.publishedAt > b.publishedAt ? -1 : 1
    })
  })

  const results = computed(() => {
    if (!query.value)
      return Array.from(sortedElements.value)
    return [...fuse.value.search(query.value).map(r => r.item)]
  })

  const sortedByTags = computed(() => {
    if (!queryTags.value.length)
      return results.value
    return results.value.filter((recipes) => {
      return queryTags.value.every((tagSlug) => 
      recipes.tags.some((tag: ITag) => tag.slug === tagSlug))
    })
  })
  const sortedByIngredients = computed(() => {
    if (!queryIngredients.value.length)
      return results.value
    return results.value.filter((recipes) => {
      return queryIngredients.value.every((ingredientSlug) => 
      recipes.ingredients.some((ingredient: IIngredient) => ingredient.slug === ingredientSlug))
    })
  })
  const sortedResults = computed(() => {
    return sortedByTags.value.filter(recipe => sortedByIngredients.value.includes(recipe));
   });



  const resetTags = () => queryTags.value = []

  return { query, results, elements, pending, sortedResults,sortedByTags,sortedByIngredients, queryTags, queryIngredients, resetTags }
})