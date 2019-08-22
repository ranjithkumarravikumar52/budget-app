//IIFE + closures to create budget module
var budgetController = (function () {
    //function constructor, notice the UpperCase E
    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //function constructor, notice the UpperCase I
    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //best?
    var data = {
        allItems : {
            exp : [], //named based on html value
            inc : [], //named based on html value
        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget : 0,
        percentage : -1
    };

    //calculate either total expense or total incomes
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(currentElement, currentIndex, completeArray){
            sum += currentElement.value; //currentElement could be either expense or income object which was created from the function constructor
        });
        data.totals[type] = sum; //better than returning, store it in our global
    };

    //public method exposing our functionality
    return {
        addItem : function(type, des, val){
            var newItem, ID;

            //ID = last id + 1;
            //Create a new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }


            //Create a new item based on exp/inc type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            return newItem;
        },
        testing : function(){
            console.log(data);
        },
        calculateBudget : function(){
            // sum of all incomes, expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // budget is difference of allIncomes and Expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate percentage of income we spent
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            //expense = 100, income  = 200, percentageSpent = 100/200 = 50%

        },
        getBudget : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        }
    }


})();

//UI CONTROLLER
var UIController = (function(){
    //externalize all the dom strings here
    var DOMStrings = {
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue : ".add__value",
        inputButton : ".add__btn",
        incomeContainer : ".income__list",
        expenseContainer : ".expenses__list"
    };

    //write a public method that reads different types of html input
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, //this will be either inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value) //converts string to float
            }
        },
        //to pass our DOM string to main controller
        getDOMString : function(){
            return DOMStrings;
        },

        //add item to the UI
        addListItem : function(obj, type){
            var html, newHtml, element;
            //Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert html into DOM
            /*
            <!-- beforebegin -->
            <p>
              <!-- afterbegin -->
              foo
              <!-- beforeend (WE NEED THIS!!!)-->
            </p>
            <!-- afterend -->
             */
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        clearFields : function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription +", " + DOMStrings.inputValue);

            //the above fields object is a list, not an array, we needed an array
            fieldsArray = Array.prototype.slice.call(fields);

            //iterate the fieldsArray and clear each object in it. We do this using for-each
            fieldsArray.forEach(function(currentElement, index, array){
                currentElement.value = "";
            });

            //to place the focus back to description
            fieldsArray[0].focus();
        }
    };
})();

//The main controller that connects all the other controllers
var appController = (function(budgetCtrl, UICtrl){ //params are named differently to avoid name-space collision and confusion with global variables

    var setUpEventListeners = function(){
        var DOM = UICtrl.getDOMString();

        //when user clicks on the button
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        //when user clicks on "enter" key
        document.addEventListener('keypress', function(event){ //event here gets automatically passed down by our browser
            // console.log("event", event); //debug
            if(event.keyCode === 13 || event.which === 13){
                // console.log("ENTER was pressed"); //debug
                ctrlAddItem();
            }
        });
    };

    //methods for updating and deletion of the budget
    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Returns the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on UI
        console.log("budget", budget);
    };

    //custom function for event listeners
    var ctrlAddItem = function(){
        // console.log("It works"); //debug

        //1. Get the field input data
        var input = UICtrl.getInput();
        console.log("input", input);

        //description can't be empty, value is greater than 0
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the budgetController
            var addItem = budgetCtrl.addItem(input.type, input.description, input.value);
            budgetCtrl.testing();

            //3. Add the item to the UI
            UICtrl.addListItem(addItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calculate and updateBudget
            updateBudget();
        }
    };

    //exposing our methods
    return {
        init : function(){
            console.log("Application has started");
            setUpEventListeners();
        }
    };
})(budgetController, UIController);

appController.init();