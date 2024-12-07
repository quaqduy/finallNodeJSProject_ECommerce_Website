const detailHandle = {
    actionColorChoosing(e, color){
        document.querySelectorAll('#colorList li').forEach((item)=>{
            item.style.opacity = '1';
        });

        e.target.style.opacity = '0.5';
        document.querySelector('#colorChoose').value = color;
    },
    start(){
        document.querySelector('#currentURL').value = window.location.href;
    }
}

detailHandle.start();


document.querySelector('#quantity').addEventListener('input',(e)=>{
    const stockMessageClass = 'stock-message'; 
    const existingMsg = document.querySelector(`.${stockMessageClass}`);    

    const stock = document.querySelector('#stockProduct').value;
    
    document.querySelector('#btnSubmitCartItem').disabled = false;

    if(parseInt(stock) < parseInt(e.target.value)){
        if(!existingMsg){
            const msg = document.createElement('div');
            msg.innerText = 'The quantity you chose is out of the amount in stock. There are '+this.current_productQuantity+' available.';
            msg.style.color = 'red';
            msg.style.fontWeight = 'bold';
            msg.classList.add(stockMessageClass);
            document.querySelector('#msgProductDetail').appendChild(msg);
        }
        document.querySelector('#btnSubmitCartItem').disabled = true;
    }
    else if (existingMsg) { 
        existingMsg.remove(); 
    }
})

const addToWishlist = ()=>{
    document.querySelector('.wishlistAdd_form input[name = "currentUrl"]').value = window.location.href;

    document.querySelector('.wishlistAdd_form input[type = "submit"]').click();
}