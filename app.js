//IIFE + closures to create budget module
var budgetController = (function () {
    //function constructor, notice the UpperCase E
    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //-1 for default
    };

    //adding percentage field to Expense prototype, so that any object that inherits Expense will have it in their prototype
    Expense.prototype.calcPercentages = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1; //non-existent flag, which we will use it html
            }
            //expense = 100, income  = 200, percentageSpent = 100/200 = 50%

        },
        calculatePercentages  : function(){
            /**
             * Sample case:
             *  Total income = 100
             *  3 expenses - a = 20, b = 10, c = 40
             *  percentages : 20/100*100, 10/100*100, 40/100*100 = 20%, 10%, 40%
             */
            data.allItems.exp.forEach(function(currentElement){
               currentElement.calcPercentages(data.totals.inc);
            });
        },

        getPercentages : function(){
            var allPercentages =  data.allItems.exp.map(function(currentElement){
                return currentElement.getPercentage();
            });
            return allPercentages;
        },

        getBudget : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        },

        //to delete an item from our DS
        deleteItem : function(type, ID){
            var ids, index;
            //let's say ID is 6
            //data.allItems[type][id] //will only work when ids are ordered,
            // in other words, elements are arranged based on 0-based
            // and we are trying to access based on the array form
            //IDS array = [1 2 3 4 6], find the index where our ID is present


            //the difference between map and forEach is that map returns a new array
            ids = data.allItems[type].map(function(currentElement){
                return currentElement.id;
            });

            //get the index of our target ID
            index = ids.indexOf(ID); //-1 if item id not found

            if(index !== -1){
                //splice is used to delete element(s) in an array
                data.allItems[type].splice(index, 1);
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
        expenseContainer : ".expenses__list",
        budgetLabel : ".budget__value",
        incomesLabel : ".budget__income--value",
        expensesLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage",
        container : ".container",
        expensesPercentageLabel : ".item__percentage"
    };


    //format budget numbers
    var formatNumber = function(number, type){
        var numSplit, int, dec, sign;
        /*
        1. + or - before the number
        2. exactly 2 decimal (Ex: 98.75)
        3. comma separating the thousands

        2109.56777 = 2109.57
        2000 = 2000.00
         */
        //get the absolute number
        number = Math.abs(number);

        //fixing our decimal numbers to 2
        number = number.toFixed(2);

        //comma separating the thousands
        numSplit = number.split('.');
        int = numSplit[0]; //this int is still a string

        //1000 -> 1,000
        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        //decimal part
        dec = numSplit[1];

        type === 'exp' ? sign = '-' : sign = '+';
        console.log("type", type, "sign", sign);

        //append the sign before int
        int = sign + " " + int + '.' + dec;
        console.log("formatted number", int);
        return int;
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
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }else if(type === 'exp'){
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

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
        },
        displayBudget : function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : 'exp' ;
            //obj contains 4 pieces of data
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomesLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        //better to have the entire selectorID like "inc-0" than sending two different vars type, id
        deleteListItem : function(selectorID){
            //apparently we can't delete an element directly in DOM, we can only delete the child element
            var elementById = document.getElementById(selectorID);
            elementById.parentNode.removeChild(elementById);
        },

        //display percentages to the UI
        displayPercentages : function(percentages){
            //we need to get all the item__percentage elements from the html
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length ; i++){
                    callback(list[i], i);
                }
            };

            //apparently we don't have for each on nodeList
            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });
        },
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

        //here we choose container because it's the parent of both income and expenses list
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    // when will our income-percentages be actually updated?
    // each time we add or delete an item
    // percentage of income for each expense
    var updatePercentages = function(){
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read them from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        // console.log("percentages ", percentages); //debug
        UICtrl.displayPercentages(percentages);

    };

    //methods for updating and deletion of the budget
    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Returns the budget
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on UI
        UICtrl.displayBudget(budget);

        // 4. Calculate and update percentages
        updatePercentages();
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

            // 6. Calculate and update percentages
            updatePercentages();
        }
    };

    //function to delete an item
    var ctrlDeleteItem = function(event) {
        var splitID, type, ID;
        //this will give us the target element
        //the whole point of this is to get the id of the item that we eventually want to delete
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(itemID); //we want to traverse (4 times) the DOM till we reach the div containing ID, when we hit the delete icon
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. Delete the item from our DS
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from our UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();
        }
        /*
        <div class="item clearfix" id="income-0">
            <div class="item__description">Salary</div>
            <div class="right clearfix">
                <div class="item__value">+ 2,100.00</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    when we click on the i icon above we want to trigger event bubble to the point of reaching div containing income id
                    and delete that whole div, thus clearing the item
                </div>
            </div>
        </div>
         */
    };

    //exposing our methods
    return {
        init : function(){
            console.log("Application has started");
            UICtrl.displayBudget({
                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            }); //set everything to 0
            setUpEventListeners();
        }
    };
})(budgetController, UIController);

appController.init();