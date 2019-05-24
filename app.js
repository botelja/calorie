// Sotrage Controller
const StorageCtrl = (function() {
  //Public methods
  return {
    storeItem: function(item) {
      let items;
      //Check if any items in localstorage
      if (localStorage.getItem('items') === null) {
        items = [];
        //Push new item
        items.push(item);
        //Set localstorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        //Push new item
        items.push(item);
        //Reset localstorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }

      return items;
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
  //Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let id;
      //Create ID
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      //Create new Item
      const newItem = new Item(id, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      return (found = data.items.filter((item) => item.id === id))[0];
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let found = data.items.filter(
        (item) => item.id === data.currentItem.id
      )[0];
      found.name = name;
      found.calories = calories;
      return found;
    },
    deleteItem: function(id) {
      const found = data.items.filter((item) => item.id === id)[0];

      data.items.splice(found.id, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = data.items.reduce(function(total, item) {
        return total + item.calories;
      }, 0);

      //Set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '.list-group',
    listItems: '.list-group li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    nameItemInput: '#item-name',
    caloriesItemInput: '#item-calories',
    totalCalories: '.total-calories'
  };
  //Public methods
  return {
    populateItems: function(items) {
      let output = '';

      items.map(function(item) {
        output += `<li id="item-${item.id}" class="list-group-item">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="float-right"><i class="fa fa-pen"></i></a>
    </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = output;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.nameItemInput).value,
        calories: document.querySelector(UISelectors.caloriesItemInput).value
      };
    },
    addListItem: function(item) {
      //Create li element
      const li = document.createElement('li');
      //Add class
      li.className = 'list-group-item';
      //Add id
      li.id = `item-${item.id}`;
      //Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${
        item.calories
      } Calories</em>
      <a href="#" class="float-right edit-item"><i class="fa fa-pen"></i></a>`;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn Node list to array
      listItems = Array.from(listItems);

      listItems.filter((listItem) => {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            item.name
          }: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="float-right edit-item"><i class="fa fa-pen"></i></a>`;
        }
      })[0];
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearAllListItems: function() {
      let items = document.querySelectorAll(UISelectors.listItems);
      //Node list to array
      items = Array.from(items);

      items.forEach((item) => item.remove());
    },
    clearInput: function() {
      document.querySelector(UISelectors.nameItemInput).value = '';
      document.querySelector(UISelectors.caloriesItemInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.nameItemInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.caloriesItemInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    setInitialState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    showEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  //Load event listeners
  const loadEventListeners = function() {
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', addItemSubmit);

    //Disable enter key
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    //Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    //Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    //Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.setInitialState);

    //Clear all items
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);
  };

  //Add item submit
  const addItemSubmit = function(e) {
    //Get form input from UIController
    const input = UICtrl.getItemInput();

    //Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add Item to UI
      UICtrl.addListItem(newItem);
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Store to localstorage
      StorageCtrl.storeItem(newItem);
      //Clear input
      UICtrl.clearInput();
    } else {
      console.log('Not OK!!');
    }

    e.preventDefault();
  };

  //Click edit item
  const itemEditClick = function(e) {
    if (e.target.classList.contains('fa')) {
      //Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;
      const listIdArray = listId.split('-');
      const id = parseInt(listIdArray[1]);
      //Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      //Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      //Add current item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  //Update item submit
  const itemUpdateSubmit = function(e) {
    //Get item input
    const input = UICtrl.getItemInput();

    //Update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updateItem);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.setInitialState();

    e.preventDefault();
  };

  //Delete item submit
  const itemDeleteSubmit = function(e) {
    //Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.setInitialState();

    e.preventDefault();
  };

  //Clear all items
  const clearAllItemsClick = function() {
    ItemCtrl.clearAllItems();
    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    //Clear UI
    UICtrl.clearAllListItems();
  };

  //Public methods
  return {
    init: function() {
      //Set initial state
      UICtrl.setInitialState();
      //Fetch data
      const items = ItemCtrl.getItems();
      if (items.length !== 0) {
        //Populate list with items
        UICtrl.populateItems(items);
      }
      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
