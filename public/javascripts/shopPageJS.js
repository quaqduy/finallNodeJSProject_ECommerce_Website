let webLocationHost = document.querySelector('#urlBaseToFetch');
if(webLocationHost){
  webLocationHost = webLocationHost.value;
}

document.addEventListener('DOMContentLoaded', () => {
    const quantityInput = document.getElementById('quantity_ModelAddToCart');
    const increaseBtn = document.getElementById('increase');
    const decreaseBtn = document.getElementById('decrease');

    // Increase quantity
    if(increaseBtn){
      increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
      });
  
      // Decrease quantity
      decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) { // Prevent going below 1
          quantityInput.value = currentValue - 1;
        }
      });
    }
  });


const shopModelHandle = {
  current_productName: '',
  current_productQuantity: '',
  current_productPrice: '',
  current_productID: '',
  listItemMiniCart: [],
  readyForAddToCartModel(productName, productQuantity, productColors, productPrice, productID){
    this.current_productName = productName;
    this.current_productQuantity = productQuantity;
    this.current_productPrice = productPrice;
    this.current_productID = productID;

    const colorSelectBox = document.querySelector('#colorSelect');
    if(productColors){
      productColors.split(',').forEach((color) => {
        const childElement = document.createElement('option');
        childElement.value = color.trim();
        childElement.textContent = color.trim();  
    
        colorSelectBox.appendChild(childElement); 
      });
    }

    document.querySelector('#addToCartModel_productName').innerText = productName;
    // document.querySelector('#addToCartModel_productName').innerText = productName;
  },
  addToCart_Action(){
    const ModelBtn_btnAddToCart = document.querySelector('#ModelBtn_btnAddToCart');
    if(ModelBtn_btnAddToCart){
      ModelBtn_btnAddToCart.addEventListener('click',()=>{
        const quantityChossing = document.querySelector('#quantity_ModelAddToCart').value;
        const colorChoosing = document.querySelector('#colorSelect').value;
  
        let checkItemCartExist = false;
        if(this.listItemMiniCart.length > 0){
          this.listItemMiniCart.forEach((itemCart)=>{
            if(itemCart.productId == this.current_productID){
              itemCart.quantityChossing = parseInt(itemCart.quantityChossing) + parseInt(quantityChossing);
              itemCart.colorChoosing = colorChoosing;
              checkItemCartExist = true;
              //add cartItem quantity to DB
              shopModelHandle.updateCartItem_ToDB(itemCart.quantityChossing , itemCart.colorChoosing);
              return;
            }
          })
        }
  
        if(checkItemCartExist == false){
          this.listItemMiniCart.push({
            productId : this.current_productID,
            productName : this.current_productName,
            quantityChossing,
            colorChoosing,
            productPrice : this.current_productPrice,
          });
          //add cartItem to DB
          shopModelHandle.createNewCartItem_ToDB();
        }
        this.renderMiniCart();
        document.querySelector('#btnCloseModelAddToCart').click();
      })
    }
  },
  renderMiniCart(){
    const miniCart_boxs = document.querySelectorAll('.miniCart_box');
    const miniCart_price = document.querySelectorAll('.miniCart_price');
    let totalPrice = 0;
      miniCart_boxs.forEach((box) => {
        box.innerHTML = '';
        shopModelHandle.listItemMiniCart.forEach((item) =>{
          box.innerHTML += `
            <div class="cart_item p-3 rounded shadow-sm d-flex align-items-center mb-3">
              <!-- Product Image -->
              <div class="cart_img me-3">
                <a href="/product-details/${item.productId}">
                  <img src="/images/s-product/product.jpg" alt="${item.productName}" class="img-fluid rounded" style="width: 80px; height: 80px;">
                </a>
              </div>
              
              <!-- Product Information -->
              <div class="cart_info flex-grow-1">
                <a href="/product-details/${item.productId}" class="text-dark text-decoration-none fw-bold d-flex align-items-center">
                  <i class="bi bi-box-seam me-2 text-primary"></i> <!-- Icon cho sản phẩm -->
                  ${item.productName}
                </a>
                <p class="mb-0 text-muted">
                  <i class="bi bi-tag-fill me-1 text-success"></i> <!-- Icon cho giá -->
                  Qty: ${item.quantityChossing} x <span class="text-primary fw-bold">${formatCurrency(item.productPrice)}</span>
                </p>
              </div>
              
              <!-- Remove Button -->
              <div class="cart_remove">
                <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmRemoveModal" 
                onclick = "shopModelHandle.removeItemCartHandle('${item.productId}','${item.productName}')">
                    <i class="bi bi-trash-fill"></i>
                </button>
              </div>
            </div>
          `;
        })
      })


      shopModelHandle.listItemMiniCart.forEach((item =>{
        totalPrice += (parseInt(item.productPrice)*parseInt(item.quantityChossing));
      }))
      miniCart_price.forEach((item)=>{
        item.innerText = formatCurrency(totalPrice);
      });

      document.querySelectorAll('.header_totalPrice').forEach((item)=>{
        item.innerText = formatCurrency(totalPrice);
      })

      document.querySelectorAll('.header_totalQuantity').forEach((item)=>{
        item.innerText = shopModelHandle.listItemMiniCart.length;
      })
  },
  removeItemCartHandle(productId, productName){
    document.querySelector('#modelConfirm_removeCartItem--Context').innerText = `Are you sure you want to remove ${productName} from the cart?`;
    document.querySelector('#modelConfirm_removeCartItem--productId').value = productId;
  },
  removeItemCartAction(){
    document.querySelector('#confirmRemoveItemCartBtn').addEventListener('click', ()=>{
      const idProductRemove = document.querySelector('#modelConfirm_removeCartItem--productId').value;
      let idCartItemRemove = '';
      shopModelHandle.listItemMiniCart.forEach((item)=>{
        if(item.productId == idProductRemove){
          idCartItemRemove = item.cartItemId;
        }
      })
      shopModelHandle.listItemMiniCart = shopModelHandle.listItemMiniCart.filter(item => item.productId != idProductRemove);
      shopModelHandle.renderMiniCart();

      //Delete to DB
      shopModelHandle.deleteCartItem_ToDB(idCartItemRemove);

      document.querySelector('#modelConfirm_removeCartItem--Close').click();
    })
  },
  createNewCartItem_ToDB(){
    const cartID_input = document.querySelector('#cartID_input');
    const cartId = cartID_input.value;
    const quantityChossing = document.querySelector('#quantity_ModelAddToCart').value;
    const colorChoosing = document.querySelector('#colorSelect').value;

    fetch(webLocationHost+'/api/cart_item',{
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
        cartId: cartId,
        productId: shopModelHandle.current_productID,
        quantity: quantityChossing,
        color: colorChoosing
      })
    })
    .then(response => response.json())  
    .then(data => {
      console.log('Success:', data);

      shopModelHandle.listItemMiniCart.forEach((item)=>{
        if(item.productId == data.productId){
          item.cartItemId = data._id;
        }
      })

    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },
  updateCartItem_ToDB(newQuantity,color){
    const cartID_input = document.querySelector('#cartID_input');
    let itemCartId = '';
    shopModelHandle.listItemMiniCart.forEach((item)=>{
      if(item.productId == shopModelHandle.current_productID){
        itemCartId = item.cartItemId;
      }
    })

    fetch(webLocationHost+`/api/cart_item/${itemCartId}`,{
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json'  
      },
      body: JSON.stringify({
        quantity: newQuantity,
        color: color
      })
    })
    .then(response => response.json())  
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },
  deleteCartItem_ToDB(itemCartId){
    const cartID_input = document.querySelector('#cartID_input');

    fetch(webLocationHost+`/api/cart_item/${itemCartId}`,{
      method: 'DELETE',  
      headers: {
        'Content-Type': 'application/json'  
      }
    })
    .then(response => response.json())  
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  },
  takeCurrentCartItemList(){
    const miniCart_box = document.querySelector('.miniCart_box');
    const miniCart_items = miniCart_box.querySelectorAll('.cart_item');

    miniCart_items.forEach((item)=>{
      const productId = item.querySelector('input[name="productId"]').value;
      const productName = item.querySelector('input[name="productName"]').value;
      const quantityChossing = item.querySelector('input[name="productQuantity"]').value;
      const productPrice = item.querySelector('input[name="productPrice"]').value;
      const cartItemId = item.querySelector('input[name="cartItemId"]').value;

      shopModelHandle.listItemMiniCart.push({
        productId ,
        productName ,
        quantityChossing,
        productPrice ,
        cartItemId
      });
    })
  },
  start(){
    this.addToCart_Action();
    this.removeItemCartAction();
    this.takeCurrentCartItemList();
  }
}

shopModelHandle.start();

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

