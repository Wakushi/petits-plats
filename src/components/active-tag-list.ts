import { capitalize } from "../../lib/helpers"

export class ActiveTagsListComponent {
  activeTags: string[] = []
  activeTagsListElement!: HTMLDivElement

  constructor() {
    this._bindDOMElements()
    this._bindTagsEvents()
  }

  private _bindDOMElements(): void {
    this.activeTagsListElement = document.querySelector(
      "#activeTags"
    ) as HTMLDivElement
  }

  private _bindTagsEvents(): void {
    document.addEventListener("tag:added", (event: any) => {
      this.activeTags.push(event.detail.tag)
      this._render()
    })
  }

  private _render(): void {
    this.activeTagsListElement.innerHTML = ""

    this.activeTags.forEach((tag) => {
      this.activeTagsListElement.insertAdjacentHTML(
        "beforeend",
        `
        <div class="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm text-black bg-brand w-fit gap-4">
          <span>${capitalize(tag)}</span>
          <button
            class="ml-2 text-sm text-gray-500"
            data-tag="${tag}"
          >
            <i class="fas fa-times text-black"></i>
          </button>
        </div>
      `
      )
      this._bindRemoveTagEvent(tag)
    })
  }

  private _bindRemoveTagEvent(tag: string): void {
    const removeTagButton = this.activeTagsListElement.querySelector(
      `button[data-tag="${tag}"]`
    ) as HTMLButtonElement
    removeTagButton.addEventListener("click", () => this._onRemoveTag(tag))
  }

  private _onRemoveTag(tag: string): void {
    this.activeTags = this.activeTags.filter((activeTag) => activeTag !== tag)
    this._emitTagRemovedEvent(tag)
    this._render()
  }

  private _emitTagRemovedEvent(tag: string): void {
    const event = new CustomEvent("tag:removed", {
      detail: {
        tag,
      },
    })

    document.dispatchEvent(event)
  }
}
