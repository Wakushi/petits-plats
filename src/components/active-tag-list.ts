import { capitalize } from "../../lib/helpers"
import { StateChangeType } from "../../types/state"
import { ActiveTag } from "../../types/tag"
import { RecipeRegistry } from "../recipe-registry"

export class ActiveTagsListComponent {
  registry: RecipeRegistry
  activeTagsListElement!: HTMLDivElement

  constructor(registry: RecipeRegistry) {
    this.registry = registry
    this._bindDOMElements()
    this._bindTagsEvents()
  }

  private _bindDOMElements(): void {
    this.activeTagsListElement = document.querySelector(
      "#activeTags"
    ) as HTMLDivElement
  }

  private _bindTagsEvents(): void {
    document.addEventListener("stateChange", (event: any) => {
      if (event.detail.includes(StateChangeType.TAGS)) {
        this._render()
      }
    })
  }

  private _render(): void {
    this.activeTagsListElement.innerHTML = ""

    this.registry.activeTags.forEach((tag) => {
      this.activeTagsListElement.insertAdjacentHTML(
        "beforeend",
        `
        <div data-tag="${
          tag.label
        }" class="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm cursor-pointer text-black bg-brand w-fit gap-4">
          <span>${capitalize(tag.label)}</span>
          <i class="fas fa-times text-black ml-2 text-sm"></i>
        </div>
      `
      )
      this._bindRemoveTagEvent(tag)
    })
  }

  private _bindRemoveTagEvent(tag: ActiveTag): void {
    const removeTagButton = this.activeTagsListElement.querySelector(
      `div[data-tag="${tag.label}"]`
    ) as HTMLButtonElement
    removeTagButton.addEventListener("click", () => this._onRemoveTag(tag))
  }

  private _onRemoveTag(tag: ActiveTag): void {
    this.registry.activeTags = this.registry.activeTags.filter(
      (activeTag) => activeTag.label !== tag.label
    )
    switch (tag.type) {
      case "ingredients":
        this.registry.ingredientTags.push(tag.label)
        break
      case "appliance":
        this.registry.applianceTags.push(tag.label)
        break
      case "ustensils":
        this.registry.ustensilTags.push(tag.label)
        break
    }
    this._render()
  }
}
