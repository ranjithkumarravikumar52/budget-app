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
            console.log(addFunction(b));
        }
    }
})();