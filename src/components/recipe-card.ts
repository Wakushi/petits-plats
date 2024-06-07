import { Recipe } from "../../types/recipe"
import { capitalize } from "../../lib/helpers"

export default class RecipeCardComponent {
  recipe: Recipe

  constructor(recipe: Recipe) {
    this.recipe = recipe
  }

  get template() {
    const { name, time, image, description, ingredients } = this.recipe
    return `
    <article class="w-[380px] rounded-lg flex flex-col overflow-hidden text-black h-max shadow-lg">
        <div class="relative overflow-hidden flex-1 max-h-[250px] gap-4 z-[-1]">
            <div class="rounded-xl py-2 px-4 absolute top-4 right-4 bg-brand">
                ${time}min
            </div>
            <img
                src="/images/recipes/${image}"
                alt="Image of ${name}"
            />
        </div>
        <div class="flex-2 bg-white flex flex-col py-[2rem] px-[1.5rem]">
            <h3 class="font-secondary font-bold text-lg mb-[1.875rem]">
                ${name}
            </h3>
            <h4 class="text-gray-600 font-semibold text-xs mb-[1rem]">
                RECETTE
            </h4>
            <p class="text-sm mb-[2rem]">
                ${description}
            </p>
            <h4 class="text-gray-600 font-semibold text-xs mb-[1rem]">
                INGRÉDIENTS
            </h4>
            <div class="flex flex-wrap justify-between gap-[1.25rem]">
                ${ingredients
                  .map(({ ingredient, quantity, unit }) => {
                    return `
                    <div class="flex flex-col text-sm w-[45%]">
                        <p>${capitalize(ingredient)}</p>
                        <p class="text-gray-600">${quantity ? quantity : ""} ${
                      unit ? unit : ""
                    }</p>
                    </div>
                  `
                  })
                  .join("")}
            </div>
        </div>
    </article>
    `
  }
}
