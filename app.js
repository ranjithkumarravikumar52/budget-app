//IIFE + closures to create budget module
var budgetController = (function () {

    //private variable
    var x = 10; //test in console budgetController.x

    //private function
    var addFunction = function (a) { //test in console budgetController.addFunction(10)
        return x + a;
    };

    //return an object that we want it to be public
    return {
        publicTest : function(b){
            return addFunction(b);
        }
    }
})();

var UIController = (function(){
    //some code
})();

//the main controller that connects all the other controllers
var appController = (function(budgetCtrl, UICtrl){ //params are named differently to avoid name-space collision and confusion with global variables

    //we want to access any function from the param but not from global
    // budgetController.publicTest(10); //bad practice

    //sample test of budgetController
    var z = budgetCtrl.publicTest(10);

    //return in an object
    return {
        anotherPublicTest : function(){
            console.log("z", z);
        }
    }

})(budgetController, UIController);