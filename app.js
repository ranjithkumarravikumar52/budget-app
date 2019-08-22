//IIFE + closures to create budget module
var budgetController = (function () {

})();

//UI CONTROLLER
var UIController = (function(){
    //some code
})();

//The main controller that connects all the other controllers
var appController = (function(budgetCtrl, UICtrl){ //params are named differently to avoid name-space collision and confusion with global variables

    //custom function for event listeners
    var ctrlAddItem = function(){
        console.log("It works");
        //1. Get the field input data
        //2. Add the item to the budgetController
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget on UI
    };

    //when user clicks on the button
    document.querySelector(".add__btn").addEventListener('click', ctrlAddItem);

    //when user clicks on "enter" key
    document.addEventListener('keypress', function(event){ //event here gets automatically passed down by our browser
        // console.log("event", event); //debug
        if(event.keyCode === 13 || event.which === 13){
            // console.log("ENTER was pressed"); //debug
            ctrlAddItem();
        }
    });
})(budgetController, UIController);