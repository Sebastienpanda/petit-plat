import { recipes } from "../../../data/recipes.js";

export class Select {
  #select = null;
  #selectBtn = null;
  #optionsIngredients = null;
  #items = null;
  #selectIngredient = null;
  #selectBtnIngredients = null;
  #selectedItem = "";

  #onSearchEvent = null;

  /**
   *
   * @type {{name:string, isSelected: boolean}[]}
   */
  #listItems = [];

  constructor(searchEventCallback = null) {
    this.#select = document.querySelectorAll(".select");
    this.#selectIngredient = document.querySelector("#selectIngredients");
    this.#selectBtnIngredients = document.querySelector(
      "#selectBtnIngredients"
    );
    this.#selectBtn = document.querySelectorAll(".select-btn");
    this.#optionsIngredients = document.querySelector("#optionsIngredients");
    this.searchInput = document.querySelector("#ingredients");

    this.#onSearchEvent = searchEventCallback; //onSearch(ingredientSelected);

    this.init();
  }

  init() {
    this.updateSelectListItems(recipes);
    this.setupEventListeners();
  }

  handleIngredientClick(selectedLi) {
    this.searchInput.value = "";

    for (let li of this.#items) {
      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      }
    }

    selectedLi.className = "selected";
    this.#selectIngredient.classList.remove("active");
    this.#selectBtnIngredients.firstElementChild.innerText =
      selectedLi.innerText;

    this.#listItems.forEach((item) => (item.isSelected = false));

    const idx = this.#listItems.findIndex((item) => {
      return item.name === selectedLi.innerText && !item.isSelected;
    });

    if (idx >= 0) {
      this.#listItems[idx].isSelected = true;
    }

    this.#selectedItem = selectedLi.innerText;

    if (this.#onSearchEvent) {
      this.#onSearchEvent(this.#selectedItem);
    }
  }

  get selectedItem() {
    return this.#selectedItem;
  }

  createSelectItem(ingredient) {
    let li = document.createElement("li");
    li.textContent = ingredient.name;
    li.className = ingredient.isSelected ? "selected" : "";
    li.addEventListener("click", () => {
      this.handleIngredientClick(li);
    });
    this.#optionsIngredients.appendChild(li);

    //let isSelected = ingredient.ingredient === selectIngredient
  }

  createSelectListItems(listOfIngredients) {
    this.#optionsIngredients.innerHTML = "";
    for (const ingredient of listOfIngredients) {
      this.createSelectItem(ingredient);
    }
    this.#items = this.#optionsIngredients.querySelectorAll("li");
  }

  loadIngredients(fromRecipes) {
    const ingredients = [];
    for (const recipe of fromRecipes) {
      for (const ingredient of recipe.ingredients) {
        ingredients.push({
          name: ingredient.ingredient,
          isSelected: false,
        });
      }
    }
    return ingredients;
  }

  updateSelectListItems(newListItems) {
    this.#listItems = this.loadIngredients(newListItems);
    this.createSelectListItems(this.#listItems);
  }

  /*  resultRecipes(resultRecipes) {
    this.#optionsIngredients.innerHTML = "";
    const filteredIngredients = [];
    for (const recipe of resultRecipes) {
      for (const ingredient of recipe.ingredients) {
        let isSelected =
          ingredient.ingredient === resultRecipes ? "selected" : "";
        let li = document.createElement("li");
        li.textContent = ingredient.ingredient;
        li.className = isSelected;
        li.addEventListener("click", () => {
          this.updateIngredient(li);
        });
        this.#optionsIngredients.appendChild(li);
        filteredIngredients.push(ingredient.ingredient);
      }
    }

    if (filteredIngredients.length > 0) {
      filteredIngredients.forEach((ingredientName) => {
        const li = document.createElement("li");
        li.textContent = ingredientName;
        li.addEventListener("click", () => {
          this.updateIngredient(li);
        });
        this.#optionsIngredients.appendChild(li);
      });
    } else {
      this.#optionsIngredients.innerHTML = "<p>Aucun ingrédient</p>";
    }
  } */

  searchIngredients() {
    let searchedValue = this.searchInput.value.toLowerCase().trim();
    const filteredIngredients = this.#listItems.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchedValue)
    );
    // let filteredIngredients = recipes
    //   .flatMap((recipe) => recipe.ingredients)
    //   .filter((ingredient) =>
    //     ingredient.ingredient.toLowerCase().includes(searchedValue)
    //   )
    //   .map((ingredient) => ingredient.ingredient);

    if (filteredIngredients.length > 0) {
      this.createSelectListItems(filteredIngredients);
    } else {
      this.#optionsIngredients.innerHTML = "<p> Aucun ingrédient </p>";
    }
  }

  setupEventListeners() {
    this.#select.forEach((select, index) => {
      const selectBtn = this.#selectBtn[index];
      selectBtn.addEventListener("click", () => {
        select.classList.toggle("active");
      });
    });
    this.searchInput.addEventListener("input", () => {
      this.searchIngredients();
    });
  }
}
