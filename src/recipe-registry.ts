import { Recipe } from "../types/recipe"

export class RecipeRegistry {
  public recipes: Recipe[]

  public recipesByIngredients: Map<string, Recipe[]> = new Map()
  public recipesByAppliances: Map<string, Recipe[]> = new Map()
  public recipesByUstensils: Map<string, Recipe[]> = new Map()

  public ingredientTags: string[] = []
  public applianceTags: string[] = []
  public ustensilTags: string[] = []

  constructor(recipes: Recipe[]) {
    this.recipes = recipes
    this._register()
  }

  private _register() {
    for (const recipe of this.recipes) {
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
