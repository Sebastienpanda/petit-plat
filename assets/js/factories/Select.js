import { recipes } from "../../../data/recipes.js";

export class Select {
  #select = null;
  #selectBtn = null;
  #optionsIngredients = null;
  #selectIngredient = null;
  #selectBtnIngredients = null;

  constructor() {
    this.#select = document.querySelectorAll(".select");
    this.#selectIngredient = document.querySelector("#selectIngredients");
    this.#selectBtnIngredients = document.querySelector(
      "#selectBtnIngredients"
    );
    this.#selectBtn = document.querySelectorAll(".select-btn");
    this.#optionsIngredients = document.querySelector("#optionsIngredients");
    this.searchInput = document.querySelector("#ingredients");

    this.init();
  }

  init() {
    this.createSelect();
    this.addIngredient();
  }

  createSelect() {
    this.#select.forEach((select, index) => {
      const selectBtn = this.#selectBtn[index];
      selectBtn.addEventListener("click", () => {
        select.classList.toggle("active");
      });
    });
  }

  addIngredient(selectIngredient) {
    this.#optionsIngredients.innerHTML = "";
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        let isSelected =
          ingredient.ingredient === selectIngredient ? "selected" : "";
        let li = document.createElement("li");
        li.textContent = ingredient.ingredient;
        li.className = isSelected;
        li.addEventListener("click", () => {
          this.updateIngredient(li);
        });
        this.#optionsIngredients.appendChild(li);
      }
    }
  }

  updateIngredient(selectedLi) {
    this.searchInput.value = "";
    this.addIngredient(selectedLi.innerText);
    this.#selectIngredient.classList.remove("active");
    this.#selectBtnIngredients.firstElementChild.innerText =
      selectedLi.innerText;
  }

  searchIngredients() {
    let searchedValue = this.searchInput.value.toLowerCase().trim();
    let filteredIngredients = recipes
      .flatMap((recipe) => recipe.ingredients)
      .filter((ingredient) => {
        ingredient.ingredient.toLowerCase().includes(searchedValue);
      })
      .map((ingredient) => ingredient.ingredient);

    this.#optionsIngredients.innerHTML = "";
  }
}
