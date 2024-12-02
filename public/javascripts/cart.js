const listCartIemID = document.querySelectorAll('.itemCartId');
const carItem_tags = document.querySelectorAll('.cartItem');
const removeItemCofirmBtn = document.querySelector('#removeItemCofirmBtn');
const submitNewCartForm = document.querySelector('#submitNewCartForm');
const quantityItemCarts = document.querySelectorAll('.quantityItemCart');
const listCartItemID_remove = [];
const listQuantityUpdate = [];

const handleViewerAction = (cartItemID,productName)=>{
    document.getElementById('modalProductName').textContent = productName;
    removeItemCofirmBtn.setAttribute('_cartItemID',cartItemID)

    const modal = new bootstrap.Modal(document.getElementById('confirmRemoveModal'));
    modal.show();
}

const handleRemoveItemCart_view = (e)=>{
    listCartItemID_remove.push(e.target.getAttribute('_cartItemID'));

    carItem_tags.forEach((item)=>{
        if(item.getAttribute('_cartItemID') == e.target.getAttribute('_cartItemID')){
            item.classList.add('d-none');
        }
    })

    const removeItemCancelBtn = document.querySelector('#removeItemCancelBtn');
    removeItemCancelBtn.click();
}

const submitNewCart = ()=>{
    submitNewCartForm.querySelector('input[name="listCartItemID_remove"]').value = listCartItemID_remove.join(';');
    submitNewCartForm.querySelector('input[name="currentURL"]').value = window.location.href;
    submitNewCartForm.querySelector('input[name="listQuantity_change"]').value =JSON.stringify(listQuantityUpdate);

    document.querySelector('#submitHandleCartBtn').click();
}

quantityItemCarts.forEach((item)=>{
    item.addEventListener('input', () => {
        if(item.value == 0){
            alert('Quantity must not empty.');
        }else{
            let newTotalPrice = 0;
            carItem_tags.forEach((tag) => {
                if (tag.getAttribute('_cartItemID') === item.getAttribute('_cartItemID')) {
                    const productPriceElement = tag.getAttribute('_cartItem_ProductPrice');
                    newTotalPrice = parseInt(productPriceElement)*parseInt(item.value);
                    if(newTotalPrice){
                        tag.querySelector('.product_total').innerText = parseInt(newTotalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    }else{
                        tag.querySelector('.product_total').innerText = parseInt(newTotalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    }

                    const recordExits = listQuantityUpdate.filter((i)=> i.cartItemID == tag.getAttribute('_cartItemID'));
                    if(recordExits.length > 0){
                        recordExits[0].quantity = item.value;
                    }else{
                        listQuantityUpdate.push({
                            cartItemID: tag.getAttribute('_cartItemID'),
                            quantity: item.value
                        })
                    }
                }
            });
        }
    });
    
})