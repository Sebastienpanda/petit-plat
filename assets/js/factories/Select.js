import { recipes } from "../../../data/recipes.js";

export class Select {
  #select = null;
  #selectBtn = null;
  #options = null;
  #optionsItems = null;
  #searchInput = null;
  #defaultLabel = "";
  #selectedItem = "";

  #onSearchEvent = null;

  #listItem = [];

  constructor({
    selectElement = null,
    initialListItem,
    defaultSelectLabel = "Sélection...",
    searchEventCallback = null,
  }) {
    if (selectElement === null) {
      throw Error("HTML Select is required !");
    }
    if (typeof selectElement === "String") {
      this.#select = selectElement;
    } else {
      this.#select = document.querySelector(selectElement);
    }

    this.#selectBtn = this.#select.querySelector(".select__btn");

    const content = this.#select.querySelector(".select__content");

    this.#options = content.querySelector(".select__content-options");
    this.#searchInput = content.querySelector(
      ".select__content__search > .select__content__search-inputSearch"
    );

    this.#defaultLabel = defaultSelectLabel;

    this.#onSearchEvent = searchEventCallback; //onSearch(ingredientSelected);

    this.#init();

    this.#listItem = [...initialListItem];
    this.#createListItem(this.#listItem);
  }

  #init() {
    this._setupEventListeners();
  }

  #createListItem(listOfItems) {
    this.#options.innerHTML = "";
    for (const item of listOfItems) {
      this._createItem(item);
    }
    this.#optionsItems = this.#options.querySelectorAll("li");
  }

  _setupEventListeners() {
    this.#selectBtn.addEventListener("click", () => {
      this.#select.classList.toggle("select--active");
    });
    this.#searchInput.addEventListener("input", () => {
      this._searchItems();
    });
  }

  _handleItemClick(currentLi) {
    const btnLabel = this.#selectBtn.firstElementChild;

    if (currentLi.classList.contains("selected")) {
      currentLi.classList.remove("selected");
      this.#select.classList.remove("select--active");
      this.#searchInput.value = "";
      btnLabel.innerText = this.#defaultLabel;
    } else {
      for (const li of this.#optionsItems) {
        li.classList.remove("selected");
      }
      currentLi.classList.add("selected");
      btnLabel.innerText = currentLi.innerText;
    }

    this.#listItem.map((item) => {
      return {
        name: item.name,
        isSelected: item.name === currentLi.innerText && !item.isSelected,
      };
    });

    if (this.#onSearchEvent) {
      this.#onSearchEvent(this.#selectedItem);
    }
  }

  _createItem({ name, isSelected }) {
    let li = document.createElement("li");
    li.textContent = name;
    li.className = isSelected ? "selected" : "";
    li.addEventListener("click", () => {
      this._handleItemClick(li);
    });
    this.#options.appendChild(li);
  }

  _unselectAllItems() {
    console.log(this.#optionsItems);
    for (const li of this.#optionsItems) {
      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      }
    }
    this.#listItem.map((item) => {
      return {
        name: item.name,
        isSelected: false,
      };
    });
  }

  _searchItems() {
    const searchedValue = this.#searchInput.value.toLowerCase().trim();
    const filteredItems = this.#listItem.filter((item) =>
      item.name.toLowerCase().includes(searchedValue)
    );

    if (filteredItems.length > 0) {
      this.#createListItem(filteredItems);
    } else {
      this.#options.innerHTML = "<p> Aucun ingrédient </p>";
    }
  }

  get selectedItem() {
    return this.#selectedItem;
  }

  updateListItem(newListItem) {
    this.#listItem = [...newListItem];
    this.#createListItem(this.#listItem);
  }

  reset() {
    //this.#optionsItems = null;

    this.#selectedItem = "";
    this._unselectAllItems();
    this.#createListItem(this.#listItem);
  }
}
