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
      { id: 0, name: 'Steak', calories: 1200 },
      { id: 1, name: 'Cookie', calories: 400 },
      { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };
  //Public methods
  return {
    getItems: function() {
      return data.items;
    },

    logData: function() {
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '.list-group'
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
    }
  };
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
  //Public methods
  return {
    init: function() {
      //Fetch data
      const items = ItemCtrl.getItems();

      //Populate list with items
      UICtrl.populateItems(items);
    }
  };
})(ItemCtrl, UICtrl);

App.init();
