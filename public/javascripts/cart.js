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

// for shipping fee calculate
document.querySelector('#customerAddress_cartPage').addEventListener('input', (e) => {
    const stringAddress = e.target.value;
    const addressItemLs = stringAddress.split(';');

    let fullAddress = '';
    let city = '';
    let state = '';

    if (addressItemLs.length > 0) {
        fullAddress = addressItemLs[0]?.trim() || '';
    }
    if (addressItemLs.length > 1) {
        city = addressItemLs[1]?.trim() || '';
    }
    if (addressItemLs.length > 2) {
        state = addressItemLs[2]?.trim() || '';
    }

    let feeShipping = 0;

    if (state && (state.toLowerCase() === 'vn' || state.toLowerCase() === 'vietnam')) {
        if (['sg', 'hcm', 'sài gòn', 'hồ chí minh'].includes(city.toLowerCase())) {
            feeShipping = 50000;
        } else {
            feeShipping = 100000;
        }
    } else {
        feeShipping = 200000;
    }

    // Định dạng phí vận chuyển thành VND
    const formattedFee = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(feeShipping);

    document.querySelector('#shippingFee').innerText = formattedFee;

    // Lấy subTotal đã định dạng VND
    const subTotalElement = document.querySelector('#subTotal').innerText;
    const subTotal = parseInt(subTotalElement.replace(/[^\d]/g, ''), 10) || 0;

    // Cộng phí vận chuyển và subTotal
    const totalFee = feeShipping + subTotal;

    // Định dạng và hiển thị tổng phí
    const formattedTotalFee = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(totalFee);

    document.querySelector('#totalFee_Cart').innerText = formattedTotalFee;
});
