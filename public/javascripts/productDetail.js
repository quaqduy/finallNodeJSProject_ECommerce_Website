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

