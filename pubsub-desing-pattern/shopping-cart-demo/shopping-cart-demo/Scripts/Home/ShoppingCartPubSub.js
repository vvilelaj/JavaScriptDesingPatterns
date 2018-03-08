/// <reference path="../jquery-1.10.2.intellisense.js" />
var itemsAdded = [];

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
    //var _utils;

    var _elements = {
        totalItemsClass: '.total-items',
        totalPriceClass: '.total-price',
    };

    var _init = function (params) {
        //_utils = params.utils;
    };

    var _renderTotalItemsAndTotalPrice = function (totalItems, totalPrice) {
        $(_elements.totalItemsClass).html(totalItems);
        $(_elements.totalPriceClass).html(utils.getFormatedPrice(totalPrice));
    };

    return {
        init: _init,
        renderTotalItemsAndTotalPrice: _renderTotalItemsAndTotalPrice,
    };
}());

var productAddedList = (function () {
    //var _utils;

    var _itemsAdded = _itemsAdded || [];

    var _elements = {
        productsAddedId: '#products-added'
    };

    var _renderProductsAdded = function (itemsAdded) {
        $(_elements.productsAddedId).html('');
        shoppingCartResume.renderTotalItemsAndTotalPrice(0, 0);
        if (itemsAdded && itemsAdded.length > 0) {
            var totalItems = itemsAdded.length;
            var totalPrice = 0;
            for (var i = 0; i < itemsAdded.length; i++) {
                var productAdded = itemsAdded[i];
                totalPrice += productAdded.Price;
                //
                var li = _getListItemInstance();
                li.append(utils.getProductDescription(productAdded));
                $(_elements.productsAddedId).append(li);
            }
            shoppingCartResume.renderTotalItemsAndTotalPrice(totalItems, totalPrice);
        }
    };

    var _getListItemInstance = function () {
        return $('<li class=\'list-group-item\'></li>').clone();
    }

    var _init = function (params) {
        //_utils = params.utils;
        _itemsAdded = params.itemsAdded;
        _renderProductsAdded(_itemsAdded);
    }

    return {
        init: _init,
        renderProductsAdded: _renderProductsAdded
    };
}());

var productList = (function () {
    //var _utils;

    var _itemsAdded = _itemsAdded || [];

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

    var _renderProductList = function (productPromiseResult) {
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

    var _btnAddProduct_onClick = function (e) {
        var $btn = $(this);
        $btn.attr('disabled', 'disabled')
        var product = $btn.parent('li').data(_dataKey.product);
        var productExists = _getProductExists(itemsAdded, product);
        if (_isAddButton($btn) && !productExists) {
            itemsAdded.push(product);
            productAddedList.renderProductsAdded(itemsAdded);
            _changeButtonIcon($btn);
        }
        if (!_isAddButton($btn) && productExists) {
            itemsAdded = _removeProduct(itemsAdded, product.ProductId);
            productAddedList.renderProductsAdded(itemsAdded);
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

    var _bindEvents = function () {
        $('ul').on('click', _elements.btnAddProductClass, _btnAddProduct_onClick);
    }

    var _init = function (params) {
        //_utils = params.utils;
        _itemsAdded = params.itemsAdded;

        _bindEvents();

        $.when(_getProductsPromise())
            .done(function (productPromiseResult) {
                _renderProductList(productPromiseResult);
            })
            .fail(function (productPromiseResult) {
                console.log(productPromiseResult);
            });
    }

    return {
        init: _init
    };
}());

$(document).ready(function () {
    shoppingCartResume.init({
        //utils: utils
    });
    productAddedList.init({
        //utils: utils,
        itemsAdded: itemsAdded
    });
    productList.init({
        //utils: utils,
        itemsAdded: itemsAdded
    });
});









