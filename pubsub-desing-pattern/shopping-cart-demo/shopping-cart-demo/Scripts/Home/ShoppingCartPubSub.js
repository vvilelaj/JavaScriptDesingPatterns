/// <reference path="../jquery-1.10.2.intellisense.js" />
var utils = (function () {
    var _getFormatedPrice = function (price) {
        price = price || 0.0;
        return 'S/. ' + price.toFixed(2);
    }

    var _getProductDescription = function (product) {
        return '&nbsp;&nbsp;' + product.Name + ' - ' + _getFormatedPrice(product.Price);
    }

    return {
        getFormatedPrice: _getFormatedPrice,
        getProductDescription: _getProductDescription
    };
}());

var shoppingCartResume = (function () {

    var _elements = {
        totalItemsClass: '.total-items',
        totalPriceClass: '.total-price',
    };

    var _init = function () {
        _renderTotalItemsAndTotalPrice(0, 0);
        _bindEvents();
    };

    var _renderTotalItemsAndTotalPrice = function (totalItems, totalPrice) {
        $(_elements.totalItemsClass).html(totalItems);
        $(_elements.totalPriceClass).html(utils.getFormatedPrice(totalPrice));
    };

    var _bindEvents = function () {
        pubsub.sub(pubsubMessage.productsAddedChange(), function (itemsChanged) {
            itemsChanged = itemsChanged || [];
            var totalItems = itemsChanged.length;
            var totalPrice = _getTotalPrice(itemsChanged);
            _renderTotalItemsAndTotalPrice(totalItems, totalPrice);
        });
    };

    var _getTotalPrice = function (itemsChanged) {
        var totalPrice = 0.0;
        for (var i = 0; i < itemsChanged.length; i++) {
            var productAdded = itemsChanged[i];
            totalPrice += productAdded.Price;
        }
        return totalPrice;
    }

    return {
        init: _init
    };
}());

var productAddedList = (function () {

    var _elements = {
        productsAddedId: '#products-added'
    };

    var _init = function () {
        $(_elements.productsAddedId).html('');
        _bindEvents();
    };

    var _bindEvents = function () {
        pubsub.sub(pubsubMessage.productsAddedChange(), _renderProductsAdded);
    };

    var _renderProductsAdded = function (itemsAdded) {
        itemsAdded = itemsAdded || [];
        //
        $(_elements.productsAddedId).html('');
        for (var i = 0; i < itemsAdded.length; i++) {
            var productAdded = itemsAdded[i];
            var li = _getListItemInstance();
            li.append(utils.getProductDescription(productAdded));
            $(_elements.productsAddedId).append(li);
        }
        
    };

    var _getListItemInstance = function () {
        return $('<li class=\'list-group-item\'></li>').clone();
    }

    return {
        init: _init
    };
}());

var productList = (function () {

    var _itemsAdded = [];

    var _elements = {
        productsListId: '#products-list',
        btnAddProductClass : '.btn-add-product'
    };

    var _urls = {
        HomeGetProduct: '/Home/GetProducts'
    };

    var _dataKey = {
        product: 'product'
    };

    var _init = function () {
        _renderProductsList();
        _bindEvents();
    }

    var _renderProductsList = function () {
        $.when(_getProductsPromise())
            .done(function (getProductPromiseResult) {
                _renderGetProductPromiseResult(getProductPromiseResult);
            })
            .fail(function (productPromiseResult) {
                console.log(productPromiseResult);
            });
    };

    var _getProductsPromise = function getProductsPromise() {
        var d = $.Deferred();

        $.ajax(_urls.HomeGetProduct, {
            method: 'GET',
            data: {},
            success: function (data, textStatus, jqXHR) {
                d.resolve(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                errorThrown = errorThrown || '';
                d.reject(textStatus + ' | ' + errorThrown);
            }
        });

        return d.promise();
    }

    var _renderGetProductPromiseResult = function (productPromiseResult) {
        for (var i = 0; i < productPromiseResult.length; i++) {
            var product = productPromiseResult[i];
            //
            var li = _getListItemInstance();
            li.data(_dataKey.product, product);
            li.append(_getAddButtonInstance());
            li.append(utils.getProductDescription(product));
            //
            $(_elements.productsListId).append(li);
        }
    }

    var _getListItemInstance = function () {
        return $('<li class=\'list-group-item\'></li>').clone();
    }

    var _getAddButtonInstance = function () {
        var strButton = '';
        strButton += '<button class="btn btn-default btn-add-product" type="button">';
        strButton += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';
        strButton += '</button>';
        return $(strButton).clone();
    }

    var _bindEvents = function () {
        $('ul').on('click', _elements.btnAddProductClass, _btnAddProduct_onClick);
    }

    var _btnAddProduct_onClick = function (e) {
        var $btn = $(this);
        $btn.attr('disabled', 'disabled')
        var product = $btn.parent('li').data(_dataKey.product);
        var productExists = _getProductExists(_itemsAdded, product);
        if (_isAddButton($btn) && !productExists) {
            _itemsAdded.push(product);
            pubsub.pub(pubsubMessage.productsAddedChange(), _itemsAdded);
            _changeButtonIcon($btn);
        }
        if (!_isAddButton($btn) && productExists) {
            _itemsAdded = _removeProduct(_itemsAdded, product.ProductId);
            pubsub.pub(pubsubMessage.productsAddedChange(), _itemsAdded);
            _changeButtonIcon($btn);
        }
        $btn.removeAttr('disabled');
    }

    var _getProductExists = function (products, productToFind) {
        var productExists = false;
        for (var i = 0; i < products.length; i++) {
            var productAdded = products[i];
            productExists = productAdded.ProductId == productToFind.ProductId;
            if (productExists)
                break;
        }
        return productExists;
    }

    var _isAddButton = function (button) {
        return button.find('span').hasClass('glyphicon-plus');
    }

    var _changeButtonIcon = function (button) {
        var hasPlusIcon = _isAddButton(button);
        if (hasPlusIcon) {
            button.find('span').removeClass('glyphicon-plus');
            button.find('span').addClass('glyphicon-minus');
        }
        else {
            button.find('span').removeClass('glyphicon-minus');
            button.find('span').addClass('glyphicon-plus');
        }
    }

    var _removeProduct = function (products, productId) {
        var tmp = products;
        for (var i = 0; i < tmp.length; i++) {
            var product = tmp[i];
            if (product.ProductId == productId) {
                tmp.splice(i, 1);
                break;
            }
        }
        return tmp;
    }


    return {
        init: _init
    };
}());

var pubsub = (function () {

    var _channels = {};

    var _pub = function (message) {
        var args = [].slice.call(arguments, 1);
        if (!_channels[message]) {
            _channels[message] = [];
        }

        for (var i = 0; i < _channels[message].length; i++) {
            var fn = _channels[message][i];
            fn.apply(null, args);
        }
    };

    var _sub = function (message, fn) {
        if (!_channels[message]) {
            _channels[message] = [];
        }
        _channels[message].push(fn);
    };

    return {
        pub: _pub,
        sub: _sub
    }
}());

var pubsubMessage = (function () {
    return {
        productsAddedChange: function () {
            return 'products-added-change'
        }
    }
}());

$(document).ready(function () {
    shoppingCartResume.init();
    productAddedList.init();
    productList.init();
});









