// Sotrage Controller

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
    items: [
      // { id: 0, name: 'Steak', calories: 1200 },
      // { id: 1, name: 'Cookie', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    ],
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
    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '.list-group',
    addBtn: '.add-btn',
    nameItemInput: '#item-name',
    caloriesItemInput: '#item-calories'
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
      <a href="#" class="float-right"><i class="fa fa-pen"></i></a>`;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.nameItemInput).value = '';
      document.querySelector(UISelectors.caloriesItemInput).value = '';
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  //Load event listeners
  const loadEventListeners = function() {
    //Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', addItemSubmit);
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
      //Clear input
      UICtrl.clearInput();
    } else {
      console.log('Not OK!!');
    }

    e.preventDefault();
  };

  //Public methods
  return {
    init: function() {
      //Fetch data
      const items = ItemCtrl.getItems();

      //Populate list with items
      UICtrl.populateItems(items);

      //Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
