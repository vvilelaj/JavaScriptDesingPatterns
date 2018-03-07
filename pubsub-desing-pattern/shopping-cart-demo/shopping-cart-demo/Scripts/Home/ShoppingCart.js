/// <reference path="../jquery-1.10.2.intellisense.js" />
var itemsAdded = [];

$(document).ready(function () {
    renderProductsAdded(itemsAdded);

    $.when(getProductsPromise())
        .done(function (productPromiseResult) {
            renderProductList(productPromiseResult);
            $('.btn-add-product').on('click', function (e) {
                var $btn = $(this);
                $btn.attr('disabled', 'disabled')
                var product = $btn.parent('li').data('product');
                var productExists = getProductExists(itemsAdded, product);
                if (isAddButton($btn) && !productExists) {
                    itemsAdded.push(product);
                    renderProductsAdded(itemsAdded);
                    changeButtonIcon($btn);
                }
                if (!isAddButton($btn) && productExists ) {
                    itemsAdded = removeProduct(itemsAdded, product.ProductId);
                    renderProductsAdded(itemsAdded);
                    changeButtonIcon($btn);
                }
                $btn.removeAttr('disabled');
            });
        })
        .fail(function (productPromiseResult) {
            console.log(productPromiseResult);
        });

    
});

function renderProductList(productPromiseResult) {
    for (var i = 0; i < productPromiseResult.length; i++) {
        var product = productPromiseResult[i];
        //
        var li = getListItemInstance();
        li.data('product', product);
        li.append(getAddButtonInstance());
        li.append(getProductDescription(product));
        //
        $('#products-list').append(li);
    }
}

function renderProductsAdded(itemsAdded) {
    $('#products-added').html('');
    renderTotalItemsAndTotalPrice(0, 0);
    if (itemsAdded && itemsAdded.length > 0) {
        var totalItems = itemsAdded.length;
        var totalPrice = 0;
        for (var i = 0; i < itemsAdded.length; i++) {
            var productAdded = itemsAdded[i];
            totalPrice += productAdded.Price;
            //
            var li = getListItemInstance();
            li.append(getProductDescription(productAdded));
            $('#products-added').append(li);
        }
        renderTotalItemsAndTotalPrice(totalItems, totalPrice);
    }
}

function renderTotalItemsAndTotalPrice(totalItems, totalPrice) {
    $('.total-items').html(totalItems);
    $('.total-price').html(getFormatedPrice(totalPrice));
}

function getFormatedPrice(price) {
    return 'S/. ' + price.toFixed(2);
}

function getProductsPromise() {
    var d = $.Deferred();

    $.ajax('/Home/GetProducts', {
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

function getListItemInstance() {
    return $('<li class=\'list-group-item\'></li>').clone();
}

function getAddButtonInstance() {
    var strButton = '';
    strButton += '<button class="btn btn-default btn-add-product" type="button">';
    strButton += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>';
    strButton += '</button>';
    return $(strButton).clone();
}

function getProductDescription(product) {
    return '&nbsp;&nbsp;' + product.Name + ' - ' + getFormatedPrice(product.Price);
}

function changeButtonIcon(button) {
    var hasPlusIcon = isAddButton(button);
    if (hasPlusIcon) {
        button.find('span').removeClass('glyphicon-plus');
        button.find('span').addClass('glyphicon-minus');
    }
    else {
        button.find('span').removeClass('glyphicon-minus');
        button.find('span').addClass('glyphicon-plus');
    }
}

function isAddButton(button) {
    return button.find('span').hasClass('glyphicon-plus');
}

function getProductExists(products, productToFind){
    var productExists = false;
    for (var i = 0; i < products.length; i++) {
        var productAdded = products[i];
        productExists = productAdded.ProductId == productToFind.ProductId;
        if (productExists)
            break;
    }
    return productExists;
}

function removeProduct(products, productId) {
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

