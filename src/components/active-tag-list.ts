import { capitalize } from "../../lib/helpers"
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
    document.addEventListener("tag:added", () => {
      this._render()
    })
  }

  private _render(): void {
    this.activeTagsListElement.innerHTML = ""

    this.registry.activeTags.forEach((tag) => {
      this.activeTagsListElement.insertAdjacentHTML(
        "beforeend",
        `
        <div class="flex items-center justify-between px-4 py-2 rounded-lg shadow-sm text-black bg-brand w-fit gap-4">
          <span>${capitalize(tag.label)}</span>
          <button
            class="ml-2 text-sm text-gray-500"
            data-tag="${tag.label}"
          >
            <i class="fas fa-times text-black"></i>
          </button>
        </div>
      `
      )
      this._bindRemoveTagEvent(tag)
    })
  }

  private _bindRemoveTagEvent(tag: ActiveTag): void {
    const removeTagButton = this.activeTagsListElement.querySelector(
      `button[data-tag="${tag.label}"]`
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
    this._emitTagRemovedEvent(tag)
    this._render()
  }

  private _emitTagRemovedEvent(tag: ActiveTag): void {
    const event = new CustomEvent("tag:removed", {
      detail: {
        type: tag.type,
      },
    })
    document.dispatchEvent(event)
  }
}
