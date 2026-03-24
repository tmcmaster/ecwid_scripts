function createProductQuantityMap(cart) {
    const productQuantityMap = {};
    cart.items.forEach((item) => {
        productQuantityMap[item.product.id] = item.quantity;
    });
    console.log('productQuantityMap', productQuantityMap);
    return productQuantityMap;
}

Ecwid.OnAPILoaded.add(async function() {
    const productQuantityMap = {};
    const productSpanMap = {};
    Ecwid.OnPageLoaded.add((page) => {
        console.log('Page Loaded', page);
        if (page.type === "CATEGORY") {
          console.log('Page Loaded: Category has been loaded');
          Ecwid.Cart.get(function(cart){
              console.log('Cart', cart);
              const newProductQuantityMap = createProductQuantityMap(cart);
              Object.assign(productQuantityMap, newProductQuantityMap);
              var buttons = document.getElementsByClassName('grid-product__wrap');
              console.log('Buttons', buttons);
              for (let i = 0; i < buttons.length; i++) {
                const productId = buttons[i].getAttribute('data-product-id');
                 console.log(`Product ID: ${productId}`);

                 var span = document.createElement('span');
                 span.style = "color:blue;padding:0 4px 0 4px;";
                 span.innerText = productQuantityMap[productId] ?? 0;
                 productSpanMap[productId] = span;

                 var buttonAdd = document.createElement('button');
                 buttonAdd.style = 'padding: 4px';
                 buttonAdd.width = 20;
                 buttonAdd.height = 20;
                 buttonAdd.textContent = '+1';
                 buttonAdd.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Ecwid.Cart.addProduct({
                        id: productId,
                        quantity: 1,
                        callback: function(success, product, cart, error) {
                            console.log('Finished trying to add product', productId, success, cart.cartId, error);
                            const newProductQuantityMap = createProductQuantityMap(cart);
                            Object.assign(productQuantityMap, newProductQuantityMap);
                            productSpanMap[productId].innerText = newProductQuantityMap[productId];
                        }
                    });
                 });
                 var buttonRemove = document.createElement('button');
                 buttonRemove.textContent = '-1';
                 buttonRemove.style = 'padding: 4px';
                 buttonRemove.width = 20;
                 buttonRemove.height = 20;
                 buttonRemove.addEventListener('click', (e) => {
                    e.stopPropagation();
                    Ecwid.Cart.removeProduct({
                        id: productId,
                        quantity: 1,
                        callback: function(success, product, cart, error) {
                            console.log('Finished trying to remove product', productId, success, cart.cartId, error);
                            const newProductQuantityMap = createProductQuantityMap(cart);
                            Object.assign(productQuantityMap, newProductQuantityMap);
                            productSpanMap[productId].innerText = newProductQuantityMap[productId];
                        }
                    });
                 });
                 const controls = document.createElement('div');
                 controls.appendChild(buttonRemove);
                 controls.appendChild(span);
                 controls.appendChild(buttonAdd);
                 buttons[i].appendChild(controls);
             }
          });
        }
    });
});
