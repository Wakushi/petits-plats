import { Recipe } from "../types/recipe"
import { ActiveTag } from "../types/tag"

export class RecipeRegistry {
  private _recipes: Recipe[]
  private _filteredRecipes: Recipe[] = []

  public recipesByIngredients: Map<string, Recipe[]> = new Map()
  public recipesByAppliances: Map<string, Recipe[]> = new Map()
  public recipesByUstensils: Map<string, Recipe[]> = new Map()

  public ingredientTags: string[] = []
  public applianceTags: string[] = []
  public ustensilTags: string[] = []

  public activeTags: ActiveTag[] = []

  constructor(recipes: Recipe[]) {
    this._recipes = this._getOptimizedRecipes(recipes)
    this._filteredRecipes = this._recipes
    this._setTagsFromRecipes(this.filteredRecipes)
  }

  set filteredRecipes(filteredRecipes: Recipe[]) {
    this._filteredRecipes = filteredRecipes
    this._setTagsFromRecipes(filteredRecipes)
  }

  get filteredRecipes(): Recipe[] {
    return this._filteredRecipes
  }

  get recipes(): Recipe[] {
    return this._recipes
  }

  private _getOptimizedRecipes(recipe: Recipe[]): Recipe[] {
    const optimizedRecipes = recipe.map((recipe) => {
      const { ingredients } = recipe
      const stringifiedfIngredients = ingredients
        .map(({ ingredient }) => ingredient.toLowerCase())
        .join(" ")
      return { ...recipe, ingredientsText: stringifiedfIngredients }
    })
    return optimizedRecipes
  }

  private _setTagsFromRecipes(recipes: Recipe[]) {
    this.recipesByIngredients = new Map()
    this.recipesByAppliances = new Map()
    this.recipesByUstensils = new Map()

    for (const recipe of recipes) {
      const { ingredients, appliance, ustensils } = recipe

      for (const { ingredient } of ingredients) {
        const formattedIngredient = ingredient.toLowerCase()
        if (!this.recipesByIngredients.has(formattedIngredient)) {
          this.recipesByIngredients.set(formattedIngredient, [recipe])
        } else {
          const recipes = this.recipesByIngredients.get(formattedIngredient)
          if (recipes) {
            recipes.push(recipe)
            this.recipesByIngredients.set(formattedIngredient, recipes)
          }
        }
      }

      const formattedAppliance = appliance.toLowerCase()
      if (!this.recipesByAppliances.has(formattedAppliance)) {
        this.recipesByAppliances.set(formattedAppliance, [recipe])
      } else {
        const recipes = this.recipesByAppliances.get(formattedAppliance)
        if (recipes) {
          recipes.push(recipe)
          this.recipesByAppliances.set(formattedAppliance, recipes)
        }
      }

      for (const ustensil of ustensils) {
        const formattedUstensil = ustensil.toLowerCase()
        if (!this.recipesByUstensils.has(formattedUstensil)) {
          this.recipesByUstensils.set(formattedUstensil, [recipe])
        } else {
          const recipes = this.recipesByUstensils.get(formattedUstensil)
          if (recipes) {
            recipes.push(recipe)
            this.recipesByUstensils.set(formattedUstensil, recipes)
          }
        }
      }
    }

    this.ingredientTags = Array.from(this.recipesByIngredients.keys())
    this.applianceTags = Array.from(this.recipesByAppliances.keys())
    this.ustensilTags = Array.from(this.recipesByUstensils.keys())
  }
}
