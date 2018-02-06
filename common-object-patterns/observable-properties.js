var Book = function(name, price){
    this._name = name;
    this._price = price;
    //
    this._priceChanging = [];
    this._priceChanged   = [];
};

Book.prototype.name = function(val){
    if(val != undefined && val != this._name){
        this._name = val;
    }
    return this._name;
};

Book.prototype.onPriceChanging = function(callback){
    this._priceChanging.push(callback);
}

Book.prototype.onPriceChanged= function(callback){
    this._priceChanged.push(callback);
}

Book.prototype.price = function(val){
    if(val != undefined && val != this._price){
        if(this._priceChanging.length > 0){
            for (var i = 0; i < this._priceChanging.length; i++) {
                if(!this._priceChanging[i](this, val)){
                    return this._price;
                }         
            }
        }

        this._price = val;

        if(this._priceChanged.length > 0){
            for (var i = 0; i < this._priceChanged.length; i++) {
                this._priceChanged[i](this);
            }
        }
    }
    return this._price;
};

var myBook = new Book('A book', 10);
console.log(myBook.name());
console.log(myBook.price());

myBook.onPriceChanging(function(book,price){
    if(price>100){
        console.log('Too expensive ..!!');
        return false;
    }
    return true;
});

myBook.onPriceChanged(function(book){
    console.log('Price : ' + book.price());
});

myBook.price(200);
myBook.price(20);