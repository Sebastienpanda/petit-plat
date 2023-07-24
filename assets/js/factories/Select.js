export class Select {
  #select = null;
  #selectBtn = null;
  #options = null;
  #optionsItems = null;
  #searchInput = null;
  #defaultLabel = "";
  #selectedItem = "";
  #tags = null;
  #img = null;
  #btnLabel = null;


  #onSearchEvent = null;
  #onResetEvent = null;
  #onDeleteTagEvent = null;

  #listItem = [];
  #initialListItems = [];
  #selectedItems = [];

  constructor({
                selectElement = null,
                initialListItem,
                defaultSelectLabel = "Sélection...",
                searchEventCallback = null,
                deleteTagEventCallBack = null,
                resetEventCallBack = null
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

    this.#btnLabel = this.#selectBtn.firstElementChild;

    const content = this.#select.querySelector(".select__content");

    this.#options = content.querySelector(".select__content-options");
    this.#searchInput = content.querySelector(
      ".select__content__search > .select__content__search-inputSearch"
    );

    this.#tags = document.getElementById("tags");
    this.#defaultLabel = defaultSelectLabel;

    this.#onSearchEvent = searchEventCallback; //onSearch(ingredientSelected);
    this.#onResetEvent = resetEventCallBack;
    this.#onDeleteTagEvent = deleteTagEventCallBack;

    this.#init();

    this.#initialListItems = [...initialListItem];
    this.#listItem = [...initialListItem];
    this.#createListItem(this.#listItem);
  }

  #init() {
    this._setupEventListeners();
  }

  #createListItem(listOfItems) {
    this.#options.innerHTML = "";
    listOfItems.map((item) => {
      this._createItem(item);
    });
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

    if (currentLi.classList.contains("selected")) {
      currentLi.classList.remove("selected");
      this.#select.classList.remove("select--active");
      this.#searchInput.value = "";
      this.#btnLabel.innerText = this.#defaultLabel;
    } else {
      this.#optionsItems.forEach((li) => {
        li.classList.remove("selected");
      });
      currentLi.classList.add("selected");
      this.#btnLabel.innerText = currentLi.innerText;
      this.#selectedItem = currentLi.innerText;
      const newTag = document.createElement("span");
      const image = document.createElement("img");
      image.className = "img";
      image.src = "../../../assets/header/Vector.svg";
      image.alt = "Vector cross";
      newTag.textContent = currentLi.innerText;
      this.#selectedItems.push(currentLi.innerText);

      newTag.appendChild(image);
      newTag.addEventListener("click", (event) => {
        const tagToRemove = event.target.parentNode;
        console.log('SELECTED ITEMS BEFORE = ', this.#selectedItems)
        console.log('REMOVE TAGS :', tagToRemove.innerText )
        this.#selectedItems.splice(this.#selectedItems.indexOf(tagToRemove.innerText,0), 1);

        this.#tags.removeChild(tagToRemove);
        console.log('SELECTED ITEMS AFTER = ', this.#selectedItems)

        if (this.#selectedItems.length === 0) {
          this._unselectAllItems(true);
          this.#select.classList.toggle("select--active");
          return;
        }
        if (this.#onDeleteTagEvent) {
          console.log("ON DELETE TAG EVENT");
          this.#onDeleteTagEvent(this.#selectedItems)
        }
      });
      this.#tags.appendChild(newTag);
    }

    this.#listItem.map((item) => {
      return {
        name: item.name,
        isSelected: item.name === currentLi.innerText && !item.isSelected
      };
    });

    if (this.#onSearchEvent) {
      this.#onSearchEvent(this.#selectedItem);
    }
    this.#select.classList.toggle("select--active");
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

  _unselectAllItems(emitEvent = false) {
    console.log("UNSELECT ALL");
    this.#optionsItems.forEach((li) => {
      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      }
    });

    this.#btnLabel.innerText = this.#defaultLabel;
    this.#listItem = [...this.#initialListItems];
    this.#createListItem(this.#listItem);

    if ((this.#onResetEvent !== null) && (emitEvent)) {
      console.log("ON RESET EVENT");
      this.#onResetEvent();
    }
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

  get selectedItems() {
    return this.#selectedItems;
  }

  updateListItem(newListItem) {
    this.#listItem = [...newListItem];
    this.#createListItem(this.#listItem);
  }

  reset() {
    //this.#optionsItems = null;
    this.#selectedItem = "";
    this._unselectAllItems();
    this.#tags.innerHTML = "";
  }
}
