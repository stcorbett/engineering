import { Controller } from "../node_modules/@hotwired/stimulus/dist/stimulus.js"
import Content from "./content.js"

export default class extends Controller {
  static targets = ["itemTemplate", "versionPicker", "versionItemTemplate"]

  connect () {
    this.key = window.location.search.split("?")[1]
    this.pathname = window.location.pathname

    this.render()
  }

  filter() {
    if(this.key == 'all') {
      return this.key
    }

    return Content.versions.find(version => version.urlParam == this.key)
  }

  content() {
    if((this.key || '') == '') {
      return []
    }
    if(this.filter() == 'all') {
      return Content.experiences
    }

    return Content.experiences.filter(content => this.filter().content.includes(content.name))
  }

  render() {
    if(this.content().length) this.renderExperiences()
    else this.renderExperiencesPicker()
  }

  renderExperiences() {
    this.content().forEach(experience => {
      let item = document.createElement("div")
      item.innerHTML = this.itemTemplateTarget.innerHTML

      item.querySelector('[data-content="title"]').innerHTML = experience.title
      item.querySelector('[data-content="role"]').innerHTML = experience.role
      item = this.renderExperienceDetail(item, experience)

      this.itemTemplateTarget.before(item)
    });
  }

  renderExperienceDetail(item, experience) {
    let itemLi = item.querySelector('[data-content="content-li"]')
    let detailLi

    experience.content.forEach(detail => {
      detailLi = itemLi.cloneNode(true)
      detailLi.innerHTML = detail
      itemLi.before(detailLi)
    })

    itemLi.remove()
    return item
  }

  renderExperiencesPicker() {
    this.versionPickerTarget.classList.remove('d-none')

    Content.versions.forEach(version => {
      let item = this.versionItemTemplateTarget.content.cloneNode(true)
      let anchor = item.querySelector("a")

      anchor.href = this.pathname +  `?${version.urlParam}`
      anchor.textContent = version.title

      this.versionItemTemplateTarget.before(item)
    })
  }
}
