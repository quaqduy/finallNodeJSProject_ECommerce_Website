document.addEventListener('DOMContentLoaded', () => {
    const southeastAsianCountries = [
      { name: 'Vietnam', value: 'Vietnam' },
      { name: 'Thailand', value: 'Thailand' },
      { name: 'Indonesia', value: 'Indonesia' },
      { name: 'Philippines', value: 'Philippines' },
      { name: 'Malaysia', value: 'Malaysia' },
      { name: 'Singapore', value: 'Singapore' },
      { name: 'Cambodia', value: 'Cambodia' },
      { name: 'Laos', value: 'Laos' },
      { name: 'Myanmar', value: 'Myanmar' },
      { name: 'Brunei', value: 'Brunei' },
      { name: 'Timor-Leste', value: 'Timor-Leste' }
    ];
  
    const selectElement = document.querySelector('#country');
  
    // Xóa tất cả các tùy chọn hiện tại
    selectElement.innerHTML = '';
  
    // Thêm các tùy chọn mới
    southeastAsianCountries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.value;
      option.textContent = country.name;
      selectElement.appendChild(option);
    });
  });

  
let shippingFee = 0;
const orderTotal = document.querySelector('#orderTotal');
const orderSubTotal = document.querySelector('#orderSubTotal').innerHTML;
const shippingFeeElement = document.querySelector('#shippingFeeElement');

document.querySelector('#country').addEventListener('change', (e) => {
    const state = e.target.value;
    if(state == 'Vietnam'){
        shippingFee = 100000;
    }else{
        shippingFee = 200000;
    }
    
    shippingFeeElement.innerText = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(shippingFee);

    orderTotal.innerText = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(shippingFee + parseInt(orderSubTotal.replace(/[^\d]/g, ''), 10));
})

document.querySelector('#city').addEventListener('input',(e)=>{
    const city = e.target.value;

    if(city.toLowerCase() == 'ho chi minh' || city.toLowerCase() == 'sai gon' || city.toLowerCase() == 'hcm' || city.toLowerCase() == 'sg'){
        if(shippingFee == 100000){
            shippingFee = 50000;
        }
    }

    shippingFeeElement.innerText = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(shippingFee);
    orderTotal.innerText = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(shippingFee + parseInt(orderSubTotal.replace(/[^\d]/g, ''), 10));
})


document.getElementById("toggleCollapse").addEventListener("click", function() {
    var collapseElement = document.getElementById("collapseOne");
    collapseElement.classList.toggle("show");  // Thêm/loại bỏ class 'show' để mở/đóng
});