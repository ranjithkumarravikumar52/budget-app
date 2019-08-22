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
})();

//UI CONTROLLER
var UIController = (function(){
    //externalize all the dom strings here
    var DOMStrings = {
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue : ".add__value",
        inputButton : ".add__btn"
    };

    //write a public method that reads different types of html input
    return {
        getInput : function(){
            return {
                type : document.querySelector(DOMStrings.inputType).value, //this will be either inc or exp
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : document.querySelector(DOMStrings.inputValue).value
            }
        },
        //to pass our DOM string to main controller
        getDOMString : function(){
            return DOMStrings;
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



    //custom function for event listeners
    var ctrlAddItem = function(){
        // console.log("It works"); //debug

        //1. Get the field input data
        var input = UICtrl.getInput();
        console.log("input", input);

        //2. Add the item to the budgetController
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on UI
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