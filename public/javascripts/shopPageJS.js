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
    const quantityChossing = document.querySelector('#quantity_ModelAddToCart').value;



    if(ModelBtn_btnAddToCart){
      document.querySelector('#quantity_ModelAddToCart').addEventListener('input', (e)=>{
        const stockMessageClass = 'stock-message'; 
        const existingMsg = document.querySelector(`.${stockMessageClass}`);    
        
        document.querySelector('#ModelBtn_btnAddToCart').disabled = false;

        if(parseInt(this.current_productQuantity) < parseInt(e.target.value)){
            if(!existingMsg){
                const msg = document.createElement('div');
                msg.innerText = 'The quantity you chose is out of the amount in stock. There are '+this.current_productQuantity+' available.';
                msg.style.color = 'red';
                msg.style.fontWeight = 'bold';
                msg.classList.add(stockMessageClass);
                document.querySelector('#msgModelAdd').appendChild(msg);
            }
            document.querySelector('#ModelBtn_btnAddToCart').disabled = true;
        }
        else if (existingMsg) { 
            existingMsg.remove(); 
        }

      })

      ModelBtn_btnAddToCart.addEventListener('click',()=>{
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

// For break page
let productBox_items = document.querySelectorAll('.productBox_item');
const productBox_items_FromOldToNew = productBox_items;
const hideAllProduct = () => {
  productBox_items.forEach((item) => {
    item.classList.add('d-none');
  });
}

let currentProduct_start = 0;
let currentProduct_end = 0;
let currentProduct_pageNumber = 0;

// Function to show products for a specific page
const showPage = (clickedElement, pageNumber) => {
  const paginationItems = document.querySelectorAll('.pagination li');
  paginationItems.forEach((i) => {
    i.classList.remove('current');
  });

  const itemsPerPage = 6;
  if (pageNumber === 'next') {
    currentProduct_pageNumber++;
    clickedElement = paginationItems[currentProduct_pageNumber - 1];
  } else {
    currentProduct_pageNumber = pageNumber;
  }

  if ((currentProduct_pageNumber - 1) * itemsPerPage < productBox_items.length) {
    currentProduct_start = (currentProduct_pageNumber - 1) * itemsPerPage;
    currentProduct_end = currentProduct_start + itemsPerPage;

    const page_amountContent = document.querySelector('.page_amount');
    page_amountContent.innerHTML = `Showing ${currentProduct_start + 1} – ${currentProduct_end} of ${productBox_items.length} results`;

    productBox_items.forEach((item, index) => {
      if (index >= currentProduct_start && index < currentProduct_end) {
        item.classList.remove('d-none');
      } else {
        item.classList.add('d-none');
      }
    });

    if (clickedElement) {
      clickedElement.classList.add('current');
    } else {
      paginationItems[0].classList.add('current');
    }
  }
};

// Initial hide all products and show the first page
hideAllProduct();
showPage(null, 1);


//for sort
const sortSelection = document.querySelector('#sortSelection');

function pickSort(selectedValue) {
  switch (selectedValue) {
      case 1:
        console.log("Sort by average rating");
        sortByAverageRating();
        break;
      case 2:
        console.log("Sort by popularity");
        sortByPopularity();
        break;
      case 3:
        console.log("Sort by newness");
        sortByNewness();
        break;
      case 4:
        console.log("Sort by price: low to high");
        sortByPriceLowToHigh();
        break;
      case 5:
        console.log("Sort by price: high to low");
        sortByPriceHighToLow();
        break;
      case 6:
        console.log("Product Name: Z");
        sortByProductNameZ();
        break;
      default:
        console.log("Invalid selection");
    }
}

// Function to sort products by price from low to high
function sortByPriceLowToHigh() {
  // Get all product items
  productBox_items = document.querySelectorAll('.productBox_item');
  
  // Convert NodeList to an array to allow sorting
  let productArray = Array.from(productBox_items);

  // Sort products by price (ascending)
  productArray.sort((a, b) => {
    // Get the price as string from the _itemPrice attribute
    const priceA = parseFloat(a.getAttribute('_itemPrice'));  // Convert to number
    const priceB = parseFloat(b.getAttribute('_itemPrice'));  // Convert to number
    
    // Return comparison result
    return priceA - priceB;  // Sort from low to high
  });


  // Reorder the product elements in the DOM
  const container = document.querySelector('.shop_wrapper');
  productArray.forEach(item => {
    container.appendChild(item);  // Re-append sorted items to the container
  });

  // Optionally, reassign the sorted list to productBox_items if needed
  productBox_items = document.querySelectorAll('.productBox_item');

  // Initial hide all products and show the first page
  hideAllProduct();
  showPage(null, 1);
}

// Function to sort products by price from high to low
function sortByPriceHighToLow() {
  // Get all product items
  productBox_items = document.querySelectorAll('.productBox_item');
  
  // Convert NodeList to an array to allow sorting
  let productArray = Array.from(productBox_items);

  // Sort products by price (descending)
  productArray.sort((a, b) => {
    // Get the price as string from the _itemPrice attribute
    const priceA = parseFloat(a.getAttribute('_itemPrice'));  // Convert to number
    const priceB = parseFloat(b.getAttribute('_itemPrice'));  // Convert to number
    
    // Return comparison result for high to low sorting
    return priceB - priceA;  // Sort from high to low
  });

  // Reorder the product elements in the DOM
  const container = document.querySelector('.shop_wrapper');
  productArray.forEach(item => {
    container.appendChild(item);  // Re-append sorted items to the container
  });

  // Optionally, reassign the sorted list to productBox_items if needed
  productBox_items = document.querySelectorAll('.productBox_item');

  // Initial hide all products and show the first page
  hideAllProduct();
  showPage(null, 1);
}

function sortByProductNameZ() {
  // Get all product items
  productBox_items = document.querySelectorAll('.productBox_item');
  
  // Convert NodeList to an array to allow sorting
  let productArray = Array.from(productBox_items);

  // Sort products by product name (Z to A)
  productArray.sort((a, b) => {
    // Get the product name from the _itemName attribute
    const nameA = a.getAttribute('_itemName').toUpperCase();  // Convert to uppercase for case-insensitive comparison
    const nameB = b.getAttribute('_itemName').toUpperCase();  // Convert to uppercase for case-insensitive comparison
    
    // Return comparison result for Z to A sorting
    if (nameA > nameB) {
      return 1;  // nameA comes after nameB (A to Z)
    } else if (nameA < nameB) {
      return -1;  // nameA comes before nameB (A to Z)
    } else {
      return 0;  // names are equal
    }
  });

  // Reorder the product elements in the DOM
  const container = document.querySelector('.shop_wrapper');
  productArray.forEach(item => {
    container.appendChild(item);  // Re-append sorted items to the container
  });

  // Optionally, reassign the sorted list to productBox_items if needed
  productBox_items = document.querySelectorAll('.productBox_item');

  // Initial hide all products and show the first page
  hideAllProduct();
  showPage(null, 1);
}


function sortByNewness() {
  productBox_items = Array.from(productBox_items_FromOldToNew).reverse();
  // Reorder the product elements in the DOM
  const container = document.querySelector('.shop_wrapper');
  productBox_items.forEach(item => {
    container.appendChild(item);  // Re-append sorted items to the container
  });
  
  // Optionally, reassign the sorted list to productBox_items if needed
  productBox_items = document.querySelectorAll('.productBox_item');
  
  // Initial hide all products and show the first page
  hideAllProduct();
  showPage(null, 1);
}

// Placeholder functions for other sorts, you can add logic as needed
function sortByAverageRating() {
  console.log("Sorting by average rating...");
}

function sortByPopularity() {
  console.log("Sorting by popularity...");
}


// Function to filter products and create a new pagination
function applyPriceFilter() {
  const minValue = $("#slider-range").slider("values", 0);
  const maxValue = $("#slider-range").slider("values", 1);

  // Filter the products based on the selected price range
  productBox_items = Array.from(productBox_items_FromOldToNew).filter(item => {
    const price = parseFloat(item.getAttribute('_itemPrice')); // Get the price
    return price >= minValue && price <= maxValue; // Check if within range
  });

  // Update the product container with filtered products
  const container = document.querySelector('.shop_wrapper');
  container.innerHTML = '';
  productBox_items.forEach(item => {
    container.appendChild(item); // Re-append filtered products
  });

  // Hide the original pagination
  const originalPagination = document.querySelector('.pagination');
  originalPagination.style.display = 'none';

  // Generate new pagination if filtered products exceed 6
  const pagination_forFilter = document.querySelector('#pagination_forFilter');
  pagination_forFilter.innerHTML = ''; // Clear any existing content

  if (productBox_items.length > 6) {
    const itemsPerPage = 6;
    const pageNumber = Math.ceil(productBox_items.length / itemsPerPage);

    const ul = document.createElement('ul');

    // Create page links dynamically
    for (let i = 0; i < pageNumber; i++) {
      const li = document.createElement('li');
      
      // Add 'current' class to the first page
      if (i === 0) {
        li.classList.add('current');
      }
      
      li.setAttribute('onclick', `showPageForFilter(this, ${i + 1})`);
      li.innerHTML = `<a href="#">${i + 1}</a>`;
      ul.appendChild(li);
    }    

    // Create "next" button
    const nextLi = document.createElement('li');
    nextLi.classList.add('next');
    nextLi.setAttribute('onclick', `showPageForFilter(this, 'next')`);
    nextLi.innerHTML = `<a href="#">next</a>`;
    ul.appendChild(nextLi);

    // Append the new pagination to the container
    pagination_forFilter.appendChild(ul);
  } else {
    // If there are less than 6 items, no pagination is needed
    pagination_forFilter.innerHTML = '';
  }

  // Show the first page of filtered products
  hideAllProduct();
  showPageForFilter(null, 1);
}

// Function to show a specific page for filtered products
function showPageForFilter(clickedElement, pageNumber) {
  const itemsPerPage = 6;
  const paginationItems = document.querySelectorAll('#pagination_forFilter li');

  // Remove "current" class from all pagination items
  paginationItems.forEach(i => i.classList.remove('current'));

  if (pageNumber === 'next') {
    currentProduct_pageNumber++;
    clickedElement = paginationItems[currentProduct_pageNumber - 1];
  } else {
    currentProduct_pageNumber = pageNumber;
  }

  if ((currentProduct_pageNumber - 1) * itemsPerPage < productBox_items.length) {
    currentProduct_start = (currentProduct_pageNumber - 1) * itemsPerPage;
    currentProduct_end = currentProduct_start + itemsPerPage;

    productBox_items.forEach((item, index) => {
      if (index >= currentProduct_start && index < currentProduct_end) {
        item.classList.remove('d-none');
      } else {
        item.classList.add('d-none');
      }
    });

    if (clickedElement) {
      clickedElement.classList.add('current');
    }

    if(clickedElement == null){
      paginationItems[0].classList.add('current');
    }
  }
}
