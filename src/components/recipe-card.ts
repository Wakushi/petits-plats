import { Recipe } from "../../types/recipe"

export default class RecipeCardComponent {
  recipe!: Recipe

  constructor(recipe: Recipe) {
    this.recipe = recipe
  }

  get template() {
    const { name, time, image, description, ingredients } = this.recipe
    return `
    <article class="w-[380px] rounded-md flex flex-col overflow-hidden text-black">
        <div class="relative overflow-hidden flex-1">
            <div class="rounded-xl py-2 px-4 absolute top-4 right-4 bg-yellow-300">
                ${time}min
            </div>
            <img
                src="/images/recipes/${image}"
                alt="Image of ${name}
                class="w-full h-[250px] object-cover"
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
                ${ingredients.map(({ ingredient, quantity, unit }) => {
                  return `
                    <div class="flex flex-col text-sm w-[45%]">
                        <p>${ingredient}</p>
                        <p class="text-gray-600">${quantity}${unit}</p>
                    </div>`
                })}
            </div>
        </div>
    </article>
    `
  }
}