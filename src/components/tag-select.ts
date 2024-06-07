import { capitalize } from "../../lib/helpers"
import { RecipeRegistry } from "../recipe-registry"

export class TagSelectComponent {
  type: "ingredients" | "appliance" | "ustensils"
  registry: RecipeRegistry
  customSelectElement!: HTMLDivElement
  selectHeadElement!: HTMLDivElement
  searchInputElement!: HTMLInputElement

  constructor(
    type: "ingredients" | "appliance" | "ustensils",
    registry: RecipeRegistry
  ) {
    this.type = type
    this.registry = registry
    this._renderSelect()
    this._bindDOMElements()
    this._bindSelectToggle()
    this._bindTagSearchInput()
    this._bindEvents()
  }

  get tags(): string[] {
    switch (this.type) {
      case "ingredients":
        return this.registry.ingredientTags
      case "appliance":
        return this.registry.applianceTags
      case "ustensils":
        return this.registry.ustensilTags
      default:
        return []
    }
  }

  set tags(tags: string[]) {
    switch (this.type) {
      case "ingredients":
        this.registry.ingredientTags = tags
        break
      case "appliance":
        this.registry.applianceTags = tags
        break
      case "ustensils":
        this.registry.ustensilTags = tags
        break
    }
  }

  private _bindDOMElements(): void {
    this.customSelectElement = document.querySelector(
      `#filter-${this.type}`
    ) as HTMLDivElement
    this.selectHeadElement = this.customSelectElement.querySelector(
      `#filter-${this.type}-head`
    ) as HTMLDivElement
  }

  private _bindSelectToggle(): void {
    this.selectHeadElement.addEventListener("click", () => this._toggleSelect())
  }

  private _bindTagSearchInput(): void {
    this.searchInputElement = this.customSelectElement.querySelector(
      `#filter-${this.type}-input`
    ) as HTMLInputElement
    this.searchInputElement.addEventListener("input", () => {
      const keyword = this.searchInputElement.value.trim().toLowerCase()
      const tags = this.tags.filter((tag) =>
        tag.toLowerCase().includes(keyword)
      )
      this._renderTagList(tags)
    })
  }

  private _bindTagSelection(): void {
    const tags = this.customSelectElement.querySelectorAll("li")
    tags.forEach((tag) => {
      tag.addEventListener("click", (event) => {
        const selectedTag = (event.target as HTMLLIElement).id
          .split("-")
          .join(" ")
        this._onSelectTag(selectedTag)
      })
    })
  }

  private _bindEvents(): void {
    document.addEventListener("tag:removed", (event: any) => {
      if (event.detail.type !== this.type) return
      this._renderTagList(this.tags)
    })

    document.addEventListener("filter", () => {
      this._renderTagList(this.tags)
    })
  }

  private _toggleSelect(): void {
    this.customSelectElement.classList.toggle("open")
    const chevron = this.customSelectElement.querySelector(".fas")
    if (!chevron) return
    chevron.classList.toggle("fa-chevron-down")
    chevron.classList.toggle("fa-chevron-up")
  }

  private _renderSelect(): void {
    const filterList = document.querySelector("#filterList") as HTMLDivElement
    filterList.insertAdjacentHTML(
      "beforeend",
      `
    <div
      id="filter-${this.type}"
      class="custom-select overflow-hidden h-[56px] min-w-[300px] transition-all ease-in duration-500 rounded-lg bg-white gap-4 text-black w-fit flex flex-col cursor-pointer"
    >
      <!-- FILTER HEAD -->
      <div
        id="filter-${this.type}-head"
        class="flex items-center justify-between p-4"
      >
        <span class="block">${this._getFilterWording()}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <!-- FILTER CONTENT -->
      <!-- TEXT INPUT -->
      <div class="px-4">
        <div
          class="flex items-center bg-white border border-gray-300 rounded-lg p-2 mb-4"
        >
          <input
            type="text"
            id="filter-${this.type}-input"
            class="w-full h-full border-0 focus:outline-none text-black"
          />
          <div>
            <img src="/images/icons/search.svg" alt="Search icon" />
          </div>
        </div>
      </div>
      <!-- TAG LIST -->
      <ul id="tag-list-${this.type}" class="overflow-auto max-h-[200px]"></ul>
    </div>
    `
    )
    if (!this.customSelectElement) {
      this._bindDOMElements()
    }
    this._renderTagList(this.tags)
  }

  private _renderTagList(tags: string[]): void {
    const tagList = this.customSelectElement.querySelector(
      `#tag-list-${this.type}`
    ) as HTMLUListElement
    tags.sort((a, b) => a.localeCompare(b))
    tagList.innerHTML = this._getTagListTemplate(tags)
    this._bindTagSelection()
  }

  private _onSelectTag(tag: string): void {
    this.registry.activeTags.push({
      label: tag,
      type: this.type,
    })
    this.tags = this.tags.filter((t) => t !== tag)
    this._renderTagList(this.tags)
    this.searchInputElement.value = ""
    this._emitTagSelectedEvent()
  }

  private _getTagListTemplate(tags: string[]): string {
    return tags
      .map(
        (tag) =>
          `<li class="py-3 px-4 hover:bg-brand" id=${tag
            .split(" ")
            .join("-")}>${capitalize(tag)}</li>`
      )
      .join("")
  }

  private _getFilterWording(): string {
    switch (this.type) {
      case "ingredients":
        return "Ingrédients"
      case "appliance":
        return "Appareils"
      case "ustensils":
        return "Ustensiles"
    }
  }

  private _emitTagSelectedEvent(): void {
    // Could be moved to Registry as a state change event
    document.dispatchEvent(new CustomEvent("tag:added"))
  }
}
