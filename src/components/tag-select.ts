export class TagSelectComponent {
  type: "ingredients" | "appliance" | "ustensils"
  customSelectElement: HTMLDivElement
  selectHeadElement: HTMLDivElement

  constructor(type: "ingredients" | "appliance" | "ustensils") {
    this.type = type
    this.customSelectElement = document.querySelector(
      `#filter-${type}`
    ) as HTMLDivElement
    this.selectHeadElement = this.customSelectElement.querySelector(
      `#filter-${this.type}-head`
    ) as HTMLDivElement

    this.bindSelectToggle()
  }

  bindSelectToggle() {
    this.selectHeadElement.addEventListener("click", () => this.toggleSelect())
  }

  toggleSelect() {
    this.customSelectElement.classList.toggle("open")
    const chevron = this.customSelectElement.querySelector(".fas")
    if (!chevron) return
    chevron.classList.toggle("fa-chevron-down")
    chevron.classList.toggle("fa-chevron-up")
  }
}
