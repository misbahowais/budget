var budgetCalculator = (function() {
   
    var expense = function(id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    
    expense.prototype.calcpercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }
    
    expense.prototype.returnPercentage = function() {
        return this.percentage;
    }
    
    var income = function (id, description, value) {
        
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var data = {
        
        allItems: {
            exp: [],
            inc: []
        },
        
        total: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        percentage: -1
    };
    
    var calc = function(type) {
        var sum = 0;
        for (var i = 0; i < data.allItems[type].length; i++) {
            sum = sum + data.allItems[type][i].value;
        }
        data.total[type] = sum;
    }
    
    return {
        
        addItem: function(type, des, val) {
            var newItem, id;
            
            //create new id
            
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            
            //create new method
            
            if (type === 'exp') {
                newItem = new expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new income(id, des, val);
            }
            data.allItems[type].push(newItem);
            return newItem; 
        },
        
        deleteData: function(type, id) {
            var index
            for (var i = 0; i < data.allItems[type].length; i++) {
                if (data.allItems[type][i].id === id) {
                    index = i;
                }
            }
            /* or use dis method
            var ids = data.allitems[type].map(functio(curr) {
                return curr.id
            });
            index = ids.indexof(id) */
            if (index !== -1) {
                //to delete data
                data.allItems[type].splice(index,1);
            }

        },
        
        test: function() {
            return data;
        },
        
        calculate: function(type) {
            //calculate income and expense
            calc(type);
            //calculate budget
            data.budget = data.total.inc - data.total.exp;
            //claculate percentage
            if (data.total.inc > 0) {
                data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        calculatePercentage: function() {
            var perc = []; 
            for(var i = 0; i < data.allItems.exp.length; i++) {
                data.allItems.exp[i].calcpercentage(data.total.inc);
                perc[i] = data.allItems.exp[i].returnPercentage();
            }
            return perc;
        },
        
        getBudget: function() {
            return{
                totBudget: data.budget,
                totInc : data.total.inc,
                totExp : data.total.exp,
                percentage: data.percentage
            
            }
        }
    };
    
})();

var UIController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetContainer: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        budgetPercentage: '.budget__expenses--percentage',
        container: '.container',
        expPercentage: '.item__percentage',
        month: '.budget__title--month'
    }
    
var setNum = function (type, num) {
        var numArr;
        num = Math.abs(num);
        num = num.toFixed(2);
        numArr = num.split('.');
        //console.log(numArr[0]);
        if (numArr[0].length > 3) {
            numArr[0] = numArr[0].substr(0, numArr[0].length - 3) + ',' + numArr[0].substr(numArr[0].length - 3, 3);
        }
            
        type === 'exp' ? num = '-' + numArr[0] + '.' + numArr[1] : num = '+' + numArr[0] + '.' + numArr[1];
        return num;
        };
    var printPercentage = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i],i);
                }
            };

    //code
    return {
        
        initialConsole: function() {
            document.querySelector(DOMStrings.budgetContainer).textContent = 0;
            document.querySelector(DOMStrings.budgetIncome).textContent = 0;
            document.querySelector(DOMStrings.budgetExpense).textContent = 0;
            document.querySelector(DOMStrings.budgetPercentage).textContent = 0 + '%';
        },
        
        DOM: function() {
            return DOMStrings;
        },
        
        input: function () {
        return {
            type: document.querySelector(DOMStrings.inputType).value,
            text: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
        };
        },
        
        addList: function(obj, type) {
            var html, newHtml, container;
            //create html string placeholder
            if (type === 'inc') {
                container = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
            } else if(type === 'exp') {
                container = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //replace the placeholdertext with actula data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', setNum(type,obj.value));
            //insert html into dom
            document.querySelector(container).insertAdjacentHTML('beforeend', newHtml);
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            fields= document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(curr, index, array) {
                curr.value = "";
            });
            fieldsArr[0].focus();
        },
        
        budgetConsole: function(obj) {
           
            var type 
            obj.totBudget >= 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetContainer).textContent = setNum(type, obj.totBudget);
            document.querySelector(DOMStrings.budgetIncome).textContent = setNum('inc', obj.totInc);
            document.querySelector(DOMStrings.budgetExpense).textContent = setNum('exp', obj.totExp);
            document.querySelector(DOMStrings.budgetPercentage).textContent = obj.percentage + '%';
            
            //document.querySelector(DOMStrings.expPercentage).textContent = 
        },
        
        expConsole: function(obj) {
            var fields = document.querySelectorAll(DOMStrings.expPercentage);
            
            
            printPercentage(fields, function(list,index) {
                list.textContent = obj[index] + '%';
            });
            
            
        },
        
        displayMonth: function() {
            var now, year, month, date;
            now = new Date();
            
            year = now.getFullYear();
            month = now.getMonth();
            monthWord = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec' ];
            date = now.getDate();
            
            document.querySelector(DOMStrings.month).textContent = date + ' ' + monthWord[month] + ' ' + year;
        },
        
        colourChange: function() {
            
            var field = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            printPercentage(field, function(cur) {
                cur.classList.toggle('red-focus');
            });
            
             document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        
        deleteItems: function(selectorID) {
            var repeat = document.getElementById(selectorID);
            repeat.parentNode.removeChild(repeat);
            
        }
    }
    
})();

var controller = (function(budgetCtrl, UICtrl) {
    
    var initial = function () {
        UICtrl.initialConsole();
        UICtrl.displayMonth();
    }
    
    var eventListnerCall = function() {
        
       var DOMString = UICtrl.DOM(); document.querySelector(DOMString.inputBtn).addEventListener('click', change);
    
        document.addEventListener('keypress', function(event) {
            //console.log(event.keyCode);
            if (event.keyCode === 13 || event.which === 13 || event.code == "Enter") {
                change();
            }
        });
        document.querySelector(DOMString.container).addEventListener('click', deleteItem);
         document.querySelector(DOMString.inputType).addEventListener('change',UICtrl.colourChange);
    };
    
    var updateBudget = function(type) {
        //calculate budget
        budgetCtrl.calculate(type);
        //return the budget
        var budg = budgetCtrl.getBudget();
        //display budget on ui
        UICtrl.budgetConsole(budg);
        //console.log(budg);
        //percentage calc
        var ok = budgetCtrl.calculatePercentage();
        UICtrl.expConsole(ok);
        //console.log(ok);
    };
    
    var change = function() {
        var inputData, updateData;
        //take input from ui
        inputData = UICtrl.input();
        //console.log(UICtrl.input());
        if(inputData.text !== "" && !isNaN(inputData.value) && inputData.value > 0) {
            //update to budgetController
            updateData = budgetCtrl.addItem(inputData.type, inputData.text, inputData.value);
            //update to ui
            UICtrl.addList(updateData, inputData.type);
            //clear fields
            UICtrl.clearFields();
            //calculate budget
            updateBudget(inputData.type);
            //update budget to ui
        }
    };
    
    var deleteItem = function(event) {
        var item, split, type, id;
        item = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (item) {
           split = item.split('-');
            type = split[0];
            id = parseInt(split[1]); 
        }
        
        //delete from database
        budgetCtrl.deleteData(type, id);
        //delete from console
        UICtrl.deleteItems(item);
        
        //updtae value in database
        updateBudget(type);
        
    }
    
    return {
        init: function() {
            initial();
            eventListnerCall();
            
        },
    };
   
    
})(budgetCalculator, UIController);

controller.init();