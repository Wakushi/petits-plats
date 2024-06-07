import { capitalize } from "../../lib/helpers"

export class TagSelectComponent {
  type: "ingredients" | "appliance" | "ustensils"
  tags: string[] = []
  customSelectElement!: HTMLDivElement
  selectHeadElement!: HTMLDivElement

  constructor(type: "ingredients" | "appliance" | "ustensils", tags: string[]) {
    this.type = type
    this.tags = tags
    this.renderSelect()
    this.bindDOMElements()
    this.bindSelectToggle()
    this.bindTagSearchInput()
  }

  bindDOMElements() {
    this.customSelectElement = document.querySelector(
      `#filter-${this.type}`
    ) as HTMLDivElement
    this.selectHeadElement = this.customSelectElement.querySelector(
      `#filter-${this.type}-head`
    ) as HTMLDivElement
  }

  bindSelectToggle() {
    this.selectHeadElement.addEventListener("click", () => this.toggleSelect())
  }

  bindTagSearchInput() {
    const input = this.customSelectElement.querySelector(
      `#filter-${this.type}-input`
    ) as HTMLInputElement
    input.addEventListener("input", () => {
      const keyword = input.value.trim().toLowerCase()
      const tags = this.tags.filter((tag) =>
        tag.toLowerCase().includes(keyword)
      )
      this.renderTagList(tags)
    })
  }

  toggleSelect() {
    this.customSelectElement.classList.toggle("open")
    const chevron = this.customSelectElement.querySelector(".fas")
    if (!chevron) return
    chevron.classList.toggle("fa-chevron-down")
    chevron.classList.toggle("fa-chevron-up")
  }

  renderSelect(): void {
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
        <span class="block">${this.getFilterWording()}</span>
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
      <ul id="tag-list-${this.type}" class="overflow-auto max-h-[200px]">
        ${this.getTagListTemplate(this.tags)}
      </ul>
    </div>
    `
    )
  }

  renderTagList(tags: string[]): void {
    const tagList = this.customSelectElement.querySelector(
      `#tag-list-${this.type}`
    ) as HTMLUListElement
    tagList.innerHTML = this.getTagListTemplate(tags)
  }

  getTagListTemplate(tags: string[]): string {
    return tags
      .map(
        (tag) =>
          `<li class="py-2 px-4 hover:bg-brand" id=${tag}>${capitalize(
            tag
          )}</li>`
      )
      .join("")
  }

  getFilterWording(): string {
    switch (this.type) {
      case "ingredients":
        return "Ingrédients"
      case "appliance":
        return "Appareils"
      case "ustensils":
        return "Ustensiles"
    }
  }
}
