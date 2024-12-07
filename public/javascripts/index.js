(function ($) {
    "use strict";

    new WOW().init();  

    /*---background image---*/
	function dataBackgroundImage() {
		$('[data-bgimg]').each(function () {
			var bgImgUrl = $(this).data('bgimg');
			$(this).css({
				'background-image': 'url(' + bgImgUrl + ')', // + meaning concat
			});
		});
    }
    
    $(window).on('load', function () {
        dataBackgroundImage();
    });
    
    /*---stickey menu---*/
    $(window).on('scroll',function() {    
           var scroll = $(window).scrollTop();
           if (scroll < 100) {
            $(".sticky-header").removeClass("sticky");
           }else{
            $(".sticky-header").addClass("sticky");
           }
    });
    
    /*---jQuery MeanMenu---*/
    $('.mobile-menu nav').meanmenu({
        meanScreenWidth: "9901",
        meanMenuContainer: ".mobile-menu",
        onePage: true,
    });
    
    /*---slider activation---*/
    var $slider = $('.slider_area');
    if($slider.length > 0){
        $slider.owlCarousel({
            animateOut: 'fadeOut',
            loop: true,
            nav: false,
            autoplay: false,
            autoplayTimeout: 8000,
            items: 1,
            dots:true,
        });
    }




    /*---product column5 activation---*/
       $('.product_column5').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 5,
        margin:20,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            576:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:4,
			},
            1200:{
				items:5,
			},


		  }
    });
    
    /*---product slick column5 activation---*/
    $('.product_slick_column5').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 5,
        rows: 2,
        prevArrow:'<button class="prev_arrow"><i class="ion-ios-arrow-left"></i></button>',
        nextArrow:'<button class="next_arrow"><i class="ion-ios-arrow-right"></i></button>', 
        responsive:[
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                  slidesToScroll: 2,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
                  slidesToScroll: 3,
              }
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
                  slidesToScroll: 4,
              }
            },
        ]
    });
    
    /*---product slick column4 activation---*/
    $('.product_slick_column4').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 4,
        rows: 2,
        prevArrow:'<button class="prev_arrow"><i class="ion-ios-arrow-left"></i></button>',
        nextArrow:'<button class="next_arrow"><i class="ion-ios-arrow-right"></i></button>', 
        responsive:[
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                  slidesToScroll: 2,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 3,
                  slidesToScroll: 3,
              }
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                  slidesToScroll: 3,
              }
            },
        ]
    });
    
    /*---product column4 activation---*/
       $('.product_column4').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 5,
        margin:20,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            576:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:3,
			},
            1200:{
				items:4,
			},


		  }
    });
    
    
    /*---product deals column4 activation---*/
       $('.product_deals_column4').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        dots:false,
        navText: ['Prev','Next'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            576:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:3,
			},
            1200:{
				items:4,
			},


		  }
    });
    
    /*---product column1 activation---*/
       $('.product_column1').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 1,
        margin:20,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            576:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:1,
			},

		  }
    });
    

    /*---category column5 activation---*/
       $('.category_column5').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: false,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 5,
        margin: 20,
        dots:false,
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            400:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:4,
			},
            1200:{
				items:5,
			},    

		  }
    });
    
    
    /*---featured column3 activation---*/
    $('.featured_column3').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 3,
        margin: 20,
        rows: 2,
        prevArrow:'<button class="prev_arrow"><i class="ion-ios-arrow-left"></i></button>',
        nextArrow:'<button class="next_arrow"><i class="ion-ios-arrow-right"></i></button>', 
        responsive:[
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 2,
                  slidesToScroll: 2,
              }
            },
        ]
    });
    
    /*---small product activation---*/
    $('.small_product_active').slick({
        centerMode: true,
        centerPadding: '0',
        slidesToShow: 1,
        rows: 3,
        prevArrow:'<button class="prev_arrow"><i class="ion-ios-arrow-left"></i></button>',
        nextArrow:'<button class="next_arrow"><i class="ion-ios-arrow-right"></i></button>', 
        responsive:[
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                  slidesToScroll: 1,
              }
            },
            {
              breakpoint: 991,
              settings: {
                slidesToShow: 2,
                  slidesToScroll: 2,
              }
            },
        ]
    });
 
    
    /*---testimonial active activation---*/
    $('.testimonial_active').owlCarousel({
        autoplay: true,
		loop: true,
        nav: false,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 1,
        dots:true,
    })
    
    
     /*---blog column4 activation---*/
    $('.blog_column4').owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 4,
        margin: 24,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            768:{
				items:3,
			},
             992:{
				items:3,
			}, 
            1200:{
				items:4,
			}, 
		  }
    });
    
    /*---blog column1 activation---*/
    $('.blog_column1').owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 1,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            768:{
				items:3,
                margin:30,
			},
             992:{
				items:1,
			},  
		  }
    });
    
    /*---blog thumb activation---*/
    $('.blog_thumb_active').owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 1,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
    });
    
    /*---brand container activation---*/
     $('.brand_container').on('changed.owl.carousel initialized.owl.carousel', function (event) {
        $(event.target).find('.owl-item').removeClass('last').eq(event.item.index + event.page.size - 1).addClass('last')}).owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 5,
        dots:false,
        navText: ['<i class="ion-ios-arrow-left"></i>','<i class="ion-ios-arrow-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            480:{
				items:2,
			},
            768:{
				items:3,
			},
            992:{
				items:4,
			},
            1200:{
				items:5,
			},

		  }
    });
    
    
    /*---single product activation---*/
    $('.single-product-active').owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 4,
        margin:15,
        dots:false,
        navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            320:{
				items:2,
			},
            992:{
				items:3,
			},
            1200:{
				items:4,
			},


		  }
    });
 
   
    /*---product navactive activation---*/
    $('.product_navactive').owlCarousel({
        autoplay: true,
		loop: true,
        nav: true,
        autoplay: false,
        autoplayTimeout: 8000,
        items: 4,
        dots:false,
        navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
        responsiveClass:true,
		responsive:{
				0:{
				items:1,
			},
            250:{
				items:2,
			},
            480:{
				items:3,
			},
            768:{
				items:4,
			},
		  
        }
    });

    $('.modal').on('shown.bs.modal', function (e) {
        $('.product_navactive').resize();
    })

    $('.product_navactive a').on('click',function(e){
      e.preventDefault();

      var $href = $(this).attr('href');

      $('.product_navactive a').removeClass('active');
      $(this).addClass('active');

      $('.product-details-large .tab-pane').removeClass('active show');
      $('.product-details-large '+ $href ).addClass('active show');

    })
       
    /*--- video Popup---*/
    $('.video_popup').magnificPopup({
        type: 'iframe',
        removalDelay: 300,
        mainClass: 'mfp-fade'
    });
    
    /*--- Magnific Popup Video---*/
    $('.port_popup').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });
    
   
    
    /*--- niceSelect---*/
     $('.select_option').niceSelect();
    
    /*---  Accordion---*/
    $(".faequently-accordion").collapse({
        accordion:true,
        open: function() {
        this.slideDown(300);
      },
      close: function() {
        this.slideUp(300);
      }		
    });	  

    /*--- counterup activation ---*/
    $('.counter_number').counterUp({
        delay: 10,
        time: 1000
    });

    /*---  ScrollUp Active ---*/
    $.scrollUp({
        scrollText: '<i class="fa fa-angle-double-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });   
    
    /*---countdown activation---*/
		
	 $('[data-countdown]').each(function() {
		var $this = $(this), finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function(event) {
		$this.html(event.strftime('<div class="countdown_area"><div class="single_countdown"><div class="countdown_number">%D</div><div class="countdown_title">days</div></div><div class="single_countdown"><div class="countdown_number">%H</div><div class="countdown_title">hours</div></div><div class="single_countdown"><div class="countdown_number">%M</div><div class="countdown_title">mins</div></div><div class="single_countdown"><div class="countdown_number">%S</div><div class="countdown_title">secs</div></div></div>'));     
               
       });
	});	
    
   /*---slider-range here---*/
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 100000000,  // Max value is 100 million
        step: 500000,    // Step size is 500,000
        values: [ 0, 100000000 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( ui.values[ 0 ].toLocaleString() + " VNĐ - " + ui.values[ 1 ].toLocaleString() + " VNĐ" );
        }
    });
    $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ).toLocaleString() + " VNĐ - " + $( "#slider-range" ).slider( "values", 1 ).toLocaleString() + " VNĐ" );

    
    /*---niceSelect---*/
     $('.niceselect_option').niceSelect();
    
    /*---elevateZoom---*/
    $("#zoom1").elevateZoom({
        gallery:'gallery_01', 
        responsive : true,
        cursor: 'crosshair',
        zoomType : 'inner'
    
    });  
    
    /*---portfolio Isotope activation---*/
      $('.portfolio_gallery').imagesLoaded( function() {

        var $grid = $('.portfolio_gallery').isotope({
           itemSelector: '.gird_item',
            percentPosition: true,
            masonry: {
                columnWidth: '.gird_item'
            }
        });

          /*---ilter items on button click---*/
        $('.portfolio_button').on( 'click', 'button', function() {
           var filterValue = $(this).attr('data-filter');
           $grid.isotope({ filter: filterValue });
            
           $(this).siblings('.active').removeClass('active');
           $(this).addClass('active');
        });
       
    });
    
    /*---slide toggle activation---*/
   $('.mini_cart_wrapper > a').on('click', function(event){
        if($(window).width() < 991){
            $('.mini_cart').slideToggle('medium');
        }
    });
    
    /*---categories slideToggle---*/
    $(".categories_title").on("click", function() {
        $(this).toggleClass('active');
        $('.categories_menu_toggle').slideToggle('medium');
    }); 

    /*---widget sub categories---*/
    $(".widget_sub_categories > a").on("click", function() {
        $(this).toggleClass('active');
        $('.widget_dropdown_categories').slideToggle('medium');
    }); 
    
    /*---addClass/removeClass categories---*/
   $("#cat_toggle.has-sub > a").on("click", function() {
            $(this).removeAttr('href');
            $(this).toggleClass('open').next('.categorie_sub').toggleClass('open');
            $(this).parents().siblings().find('#cat_toggle.has-sub > a').removeClass('open');
    });
    
    
    /*---MailChimp---*/
    $('#mc-form').ajaxChimp({
        language: 'en',
        callback: mailChimpResponse,
        // ADD YOUR MAILCHIMP URL BELOW HERE!
        url: 'http://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef'

    });
    function mailChimpResponse(resp) {

        if (resp.result === 'success') {
            $('.mailchimp-success').html('' + resp.msg).fadeIn(900);
            $('.mailchimp-error').fadeOut(400);

        } else if(resp.result === 'error') {
            $('.mailchimp-error').html('' + resp.msg).fadeIn(900);
        }  
    }
    
    /*---Category menu---*/
    function categorySubMenuToggle(){
        $('.categories_menu_toggle li.menu_item_children > a').on('click', function(){
        if($(window).width() < 991){
            $(this).removeAttr('href');
            var element = $(this).parent('li');
            if (element.hasClass('open')) {
                element.removeClass('open');
                element.find('li').removeClass('open');
                element.find('ul').slideUp();
            }
            else {
                element.addClass('open');
                element.children('ul').slideDown();
                element.siblings('li').children('ul').slideUp();
                element.siblings('li').removeClass('open');
                element.siblings('li').find('li').removeClass('open');
                element.siblings('li').find('ul').slideUp();
            }
        }
        });
        $('.categories_menu_toggle li.menu_item_children > a').append('<span class="expand"></span>');
    }
    categorySubMenuToggle();


    /*---shop grid activation---*/
    $('.shop_toolbar_btn > button').on('click', function (e) {
        
		e.preventDefault();
        
        $('.shop_toolbar_btn > button').removeClass('active');
		$(this).addClass('active');
        
		var parentsDiv = $('.shop_wrapper');
		var viewMode = $(this).data('role');
        
        
		parentsDiv.removeClass('grid_3 grid_4 grid_5 grid_list').addClass(viewMode);

		if(viewMode == 'grid_3'){
			parentsDiv.children().addClass('col-lg-4 col-md-4 col-sm-6').removeClass('col-lg-3 col-cust-5 col-12');
            
		}

		if(viewMode == 'grid_4'){
			parentsDiv.children().addClass('col-lg-3 col-md-4 col-sm-6').removeClass('col-lg-4 col-cust-5 col-12');
		}
        
        if(viewMode == 'grid_list'){
			parentsDiv.children().addClass('col-12').removeClass('col-lg-3 col-lg-4 col-md-4 col-sm-6 col-cust-5');
		}
            
	});
  
    
   /*---Newsletter Popup activation---*/
   
       setTimeout(function() {
            if($.cookie('shownewsletter')==1) $('.newletter-popup').hide();
            $('#subscribe_pemail').keypress(function(e) {
                if(e.which == 13) {
                    e.preventDefault();
                    email_subscribepopup();
                }
                var name= $(this).val();
                  $('#subscribe_pname').val(name);
            });
            $('#subscribe_pemail').change(function() {
             var name= $(this).val();
                      $('#subscribe_pname').val(name);
            });
            //transition effect
            if($.cookie("shownewsletter") != 1){
                $('.newletter-popup').bPopup();
            }
            $('#newsletter_popup_dont_show_again').on('change', function(){
                if($.cookie("shownewsletter") != 1){   
                    $.cookie("shownewsletter",'1')
                }else{
                    $.cookie("shownewsletter",'0')
                }
            }); 
        }, 2500);
    
    
    /*---canvas menu activation---*/
    $('.canvas_open').on('click', function(){
        $('.Offcanvas_menu_wrapper,.off_canvars_overlay').addClass('active')
    });
    
    $('.canvas_close,.off_canvars_overlay').on('click', function(){
        $('.Offcanvas_menu_wrapper,.off_canvars_overlay').removeClass('active')
    });
    
    
    /*---Off Canvas Menu---*/
    var $offcanvasNav = $('.offcanvas_main_menu'),
        $offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu');
    $offcanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="fa fa-angle-down"></i></span>');
    
    $offcanvasNavSubMenu.slideUp();
    
    $offcanvasNav.on('click', 'li a, li .menu-expand', function(e) {
        var $this = $(this);
        if ( ($this.parent().attr('class').match(/\b(menu-item-has-children|has-children|has-sub-menu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand')) ) {
            e.preventDefault();
            if ($this.siblings('ul:visible').length){
                $this.siblings('ul').slideUp('slow');
            }else {
                $this.closest('li').siblings('li').find('ul:visible').slideUp('slow');
                $this.siblings('ul').slideDown('slow');
            }
        }
        if( $this.is('a') || $this.is('span') || $this.attr('clas').match(/\b(menu-expand)\b/) ){
        	$this.parent().toggleClass('menu-open');
        }else if( $this.is('li') && $this.attr('class').match(/\b('menu-item-has-children')\b/) ){
        	$this.toggleClass('menu-open');
        }
    });
    
    // Update Form
    // Wait until the DOM is fully loaded
    document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("update_profile");
        if(btn){
            // Get the modal and button
        const modal = document.getElementById("updateForm");
        const profileCloseModal = document.querySelector("#updateForm .close");

        // When the user clicks the button, open the modal
        if(btn){
            btn.onclick = function () {
                modal.style.display = "block";
            };
        }

        // When the user clicks on <span> (x), close the modal
        if(profileCloseModal){
            profileCloseModal.onclick = function () {
                document.getElementById("updateForm").style.display = "none";
            };
        }

        // Profile form: close when clicking outside
        window.addEventListener("click", function (event) {
            const modal = document.getElementById("updateForm");
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });

        }
    });
    
})(jQuery);	



// Mini cart code

const miniCartHandleExceptShopPage  = {
    checkIsShopPage : false,
    windowLocation: '',
    checkAction() {
        const currentURL = window.location.href;
        this.windowLocation = currentURL;
        let checkPathIncludeShop = false;

        if (currentURL) {
            const paths = currentURL.split('/');
            paths.forEach((path) => {
                if (path === 'shop') { 
                    checkPathIncludeShop = true;
                }
            });
        }
        this.checkIsShopPage = checkPathIncludeShop;
    },
    modelConfirmHandle(productId,productName,cartItemId){
        const confirmRemoveModal = document.querySelector('#confirmRemoveModal');
        confirmRemoveModal.classList.remove('d-none');
        document.querySelector('#modelConfirm_removeCartItem--Context').innerText = `Are you sure you want to remove ${productName} from the cart?`;
        document.querySelector('#currentURLModelInput').value = this.windowLocation;
        const formRemoveItemMiniCartAction = document.querySelector('#formRemoveItemMiniCartAction');
        const urlBaseToFetch = document.querySelector('#urlBaseToFetch').value;
        formRemoveItemMiniCartAction.setAttribute('action',urlBaseToFetch+'/cart_item/'+cartItemId);
        formRemoveItemMiniCartAction.setAttribute('method','POST');
    },
    removeItemCartDB(){
        
    },
    start(productId, productName, cartItemId){
        this.checkAction();
        if(!this.checkIsShopPage){
            this.modelConfirmHandle(productId,productName,cartItemId);
            this.removeItemCartDB();
        }
    }
}

//For Search
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('.searchInput_Header');
    const searchResults = document.querySelectorAll('.searchResults');
    
    const categories = JSON.parse(document.getElementById('categoriesData').value);
    const products = JSON.parse(document.getElementById('productsData').value);

    // Lắng nghe sự kiện khi người dùng nhập vào ô tìm kiếm
    searchInputs.forEach((searchInput, index) => {
        searchInput.addEventListener('input', function() {
            const urlBaseToFetch = document.querySelector('#urlBaseToFetch').value;

            const searchTerm = searchInput.value.toLowerCase();
            let resultHtml = '';
    
            // Tìm kiếm trong danh mục
            categories.forEach(category => {
                if (category.name.toLowerCase().includes(searchTerm)) {
                    resultHtml += `<a href="${urlBaseToFetch}/shop/${category._id}" class="list-group-item list-group-item-action result-item" data-id="${category._id}" data-type="category">
                        (Category) - ${category.name} 
                    </a>`;
                }
            });
    
            // Tìm kiếm trong sản phẩm
            products.forEach(product => {
                if (product.name.toLowerCase().includes(searchTerm)) {
                    resultHtml += `<a href="${urlBaseToFetch}/product-details/${product._id}" class="list-group-item list-group-item-action result-item" data-id="${product._id}" data-type="product">
                        (Product) - ${product.name}
                    </a>`;
                }
            });

            // Hiển thị kết quả tìm kiếm
            if (resultHtml) {
                searchResults[index].innerHTML = resultHtml;
                searchResults[index].classList.remove('d-none');
            } else {
                searchResults[index].classList.add('d-none');
            }
        });

        // Xử lý khi người dùng click ra ngoài ô tìm kiếm (blur)
        searchInput.addEventListener('blur', function() {
            setTimeout(() => {  // Dùng setTimeout để đảm bảo người dùng có thể click vào kết quả
                searchResults[index].classList.add('d-none');
            }, 200);  // Độ trễ 200ms để tránh ẩn kết quả quá sớm
        });
    });

    // Xử lý khi người dùng click vào kết quả
    searchResults.forEach(resultContainer => {
        resultContainer.addEventListener('click', function(e) {
            const item = e.target;
            if (item.classList.contains('result-item')) {
                const itemId = item.getAttribute('data-id');
                const itemType = item.getAttribute('data-type');
                
                if (itemType === 'product') {
                    window.location.href = `/product/${itemId}`;
                } else if (itemType === 'category') {
                    window.location.href = `/category/${itemId}`;
                }
            }
        });
    });
});


const addProductToWishList = (productId)=>{
    const wishlistAdd_form = document.querySelector(`.wishlistAdd_form[_productId="${productId}"]`);
    wishlistAdd_form.querySelector('input[name="currentUrl"]').value = window.location.href;
    wishlistAdd_form.querySelector('input[type="submit"]').click();
  }

//for quick view product
const quickViewModel_create = (name, price, desc, colors, productId, stock) => {
    document.querySelector('#modelQuickView_ProductName').innerText = name;
    document.querySelector('#modelQuickView_ProductPrice').innerText = new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price);
    document.querySelector('#modelQuickView_ProductDesc').innerText = desc;

    colors = colors.split(',');
    if (colors && colors.length > 0) {
        const lsElementOptionColor = colors.map((color, index) => {
            const newElement = document.createElement('option');
            newElement.value = color.trim();
            newElement.innerText = color.trim();
            return newElement.outerHTML;
        });

        document.querySelector('#modelQuickView_Colors').innerHTML = lsElementOptionColor.join('');
    }

    document.querySelector('#modelQuickView_Quantity').addEventListener('input',(e)=>{
        const stockMessageClass = 'stock-message'; 
        const existingMsg = document.querySelector(`.${stockMessageClass}`);    

        document.querySelector('#modelQuickView_buttonSubmit').disabled = false;

        if(parseInt(e.target.value) > parseInt(stock)){
            if(!existingMsg){
                const msg = document.createElement('div');
                msg.innerText = 'The quantity you chose is out of the amount in stock. There are '+stock+' available.';
                msg.style.color = 'red';
                msg.style.fontWeight = 'bold';
                msg.classList.add(stockMessageClass);
                document.querySelector('.modal_add_to_cart').appendChild(msg);
            }
            document.querySelector('#modelQuickView_buttonSubmit').disabled = true;
        }
        else if (existingMsg) { 
            existingMsg.remove(); 
        }

    })

    document.querySelector('#modelQuickView_buttonSubmit').addEventListener('click',()=>{
        const cartID = document.querySelector('#cartID_input').value;
        const color = document.querySelector('#modelQuickView_Colors').value;
        const quantity = document.querySelector('#modelQuickView_Quantity').value;
        const hiddenForm = createHiddenForm(cartID, productId, color, quantity, window.location.href);
        hiddenForm.querySelector('[type="submit"]').click();
    })
};

// Tạo formSubmit cho model quickview
function createHiddenForm(cartId, productId, color, quantity, currentURL) {
    // Tạo form
    const form = document.createElement('form');
    form.method = 'POST';

    const url = document.querySelector('#urlBaseToFetch').value + "/cart_item";
    form.action = url; 
    form.style.display = 'none';

    // Tạo các input
    const inputs = [
        { name: 'cartId', value: cartId },
        { name: 'productId', value: productId },
        { name: 'color', value: color },
        { name: 'quantity', value: quantity },
        { name: 'currentURL', value: currentURL }
    ];

    inputs.forEach(inputData => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = inputData.name;
        input.value = inputData.value;
        form.appendChild(input);
    });

    // Tạo nút submit
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    form.appendChild(submitButton);

    // Thêm form vào body
    document.body.appendChild(form);

    return form;
}

// Thêm sự kiện cho các sao
document.querySelectorAll(".rating_stars li").forEach((star) => {
    star.addEventListener("click", function () {
      // Lấy giá trị rating
      const rating = this.getAttribute("data-value");
      // Cập nhật input ẩn
      document.getElementById("ratingValue").value = rating;
      // Highlight các sao đã chọn
      document.querySelectorAll(".rating_stars li").forEach((s) => {
        s.classList.remove("active");
      });
      for (let i = 0; i < rating; i++) {
        document.querySelectorAll(".rating_stars li")[i].classList.add("active");
      }
    });
  });
  