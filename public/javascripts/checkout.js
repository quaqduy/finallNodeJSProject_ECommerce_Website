document.addEventListener('DOMContentLoaded', () => {
    const southeastAsianCountries = [
      { name: 'Choose state', value: 'Please choose your state' },
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
    if(selectElement){
      selectElement.innerHTML = '';
  
      // Thêm các tùy chọn mới
      southeastAsianCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.value;
        option.textContent = country.name;
        selectElement.appendChild(option);
      });
    }
  });

  
let shippingFee = 0;
const orderTotal = document.querySelector('#orderTotal');
const orderSubTotal = document.querySelector('#orderSubTotal').innerHTML;
const shippingFeeElement = document.querySelector('#shippingFeeElement');

const countryOption = document.querySelector('#country');

if(countryOption){
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

      document.querySelector('#shippingCost').value = shippingFee;
      document.querySelector('#totalPrice').value = shippingFee + parseInt(orderSubTotal.replace(/[^\d]/g, ''), 10);
  })
}

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

    document.querySelector('#shippingCost').value = shippingFee;
    document.querySelector('#totalPrice').value = shippingFee + parseInt(orderSubTotal.replace(/[^\d]/g, ''), 10);
})


if(document.getElementById("toggleCollapse")){
  document.getElementById("toggleCollapse").addEventListener("click", function() {
      var collapseElement = document.getElementById("collapseOne");
      collapseElement.classList.toggle("show");  // Thêm/loại bỏ class 'show' để mở/đóng
  });
}

// Lấy các phần tử DOM
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');
const createAccountCheckbox = document.getElementById('create-account-checkbox');

// Lắng nghe sự kiện click trên checkbox
if(createAccountCheckbox){
  createAccountCheckbox.addEventListener('click', () => {
    if (createAccountCheckbox.checked) {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const repassword = repasswordInput.value.trim();
  
      let errorMessage = "";
  
      // Kiểm tra xem các trường có rỗng không
      if (!username) {
        errorMessage += "Username is required.\n";
      }
      if (!password) {
        errorMessage += "Password is required.\n";
      }
  
      // Kiểm tra độ dài mật khẩu
      if (password && password.length < 8) {
        errorMessage += "Password must be at least 8 characters long.\n";
      }
  
      // Kiểm tra mật khẩu và xác nhận mật khẩu
      if (password && password !== repassword) {
        errorMessage += "Passwords do not match.\n";
      }
  
      // Nếu có lỗi, hiển thị lỗi và đưa checkbox về off
      if (errorMessage) {
        alert(errorMessage);
        // Đưa checkbox về trạng thái off
        createAccountCheckbox.checked = false;
      } else {
        alert("Account validated successfully!");
      }
    }
  });
}

  