const confirmDelWishlistItem = document.querySelector('#confirmDelWishlistItem');
const openConfirmDelModal = (wishlistId, productId)=>{
    confirmDelWishlistItem.querySelector('input[name = "wishlistId"]').value = wishlistId;
    confirmDelWishlistItem.querySelector('input[name = "productId"]').value = productId;
    confirmDelWishlistItem.querySelector('input[name = "currentUrl"]').value = window.location.href;
}

const confirmDelWishlistItemAction = ()=>{
    confirmDelWishlistItem.querySelector('input[type = "submit"]').click();
}

const addItemCartFromWishlist_form = document.querySelector('#addItemCartFromWishlist_form');
const createDialogAddToCart = (productName, productId, colors)=>{
    document.querySelector('#addToCartModel_productName').innerHTML = productName;
    addItemCartFromWishlist_form.querySelector('input[name="productId"]').value = productId;

    const colorSelectBox = document.querySelector('#colorSelect');

    if(colors.length > 0){
        const colorList = colors.split(',');
        colorList.forEach((color)=>{
            const childElement = document.createElement('option');
            childElement.value = color.trim();
            childElement.textContent = color.trim();  
    
            colorSelectBox.appendChild(childElement); 
        })
    }
}

const handleFormAdd = () => {
    addItemCartFromWishlist_form.querySelector('input[name="color"]').value = document.querySelector('#colorSelect').value;
    addItemCartFromWishlist_form.querySelector('input[name="quantity"]').value = document.querySelector('#quantity_ModelAddToCart').value;
    addItemCartFromWishlist_form.querySelector('input[name="currentURL"]').value = window.location.href;

    addItemCartFromWishlist_form.querySelector('input[type="submit"]').click();
}