import { capitalize } from "../../lib/helpers"

export class TagSelectComponent {
  type: "ingredients" | "appliance" | "ustensils"
  tags: string[] = []
  customSelectElement!: HTMLDivElement
  selectHeadElement!: HTMLDivElement
  searchInputElement!: HTMLInputElement

  constructor(type: "ingredients" | "appliance" | "ustensils", tags: string[]) {
    this.type = type
    this.tags = tags
    this._renderSelect()
    this._bindDOMElements()
    this._bindSelectToggle()
    this._bindTagSearchInput()
    this._bindTagsEvents()
  }

  private _bindDOMElements() {
    this.customSelectElement = document.querySelector(
      `#filter-${this.type}`
    ) as HTMLDivElement
    this.selectHeadElement = this.customSelectElement.querySelector(
      `#filter-${this.type}-head`
    ) as HTMLDivElement
  }

  private _bindSelectToggle() {
    this.selectHeadElement.addEventListener("click", () => this._toggleSelect())
  }

  private _bindTagSearchInput() {
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

  private _bindTagSelection() {
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

  private _bindTagsEvents(): void {
    document.addEventListener("tag:removed", (event: any) => {
      if (event.detail.type !== this.type) return
      this.tags.push(event.detail.tag)
      this._renderTagList(this.tags)
    })
  }

  private _toggleSelect() {
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
    this.tags = this.tags.filter((t) => t !== tag)
    this._renderTagList(this.tags)
    this.searchInputElement.value = ""
    this.emitTagSelectedEvent(tag)
  }

  private _getTagListTemplate(tags: string[]): string {
    return tags
      .map(
        (tag) =>
          `<li class="py-2 px-4 hover:bg-brand" id=${tag
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

  emitTagSelectedEvent(tag: string): void {
    const event = new CustomEvent("tag:added", {
      detail: {
        tag,
        type: this.type,
      },
    })

    document.dispatchEvent(event)
  }
}
