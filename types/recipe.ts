export type Recipe = {
  id: number
  image: string
  name: string
  servings: number
  ingredients: Ingredient[]
  time: number
  description: string
  appliance: string
  ustensils: string[]
  ingredientsText?: string
}

export type Ingredient = {
  ingredient: string
  quantity?: number
  unit?: string
}
