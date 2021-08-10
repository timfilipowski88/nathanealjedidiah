$(function () {

  // Sticky Navbar
  window.onscroll = function () {
    navSticky()
  };

  var navbar = document.getElementsByClassName("main-nav")[0];
  var sticky = navbar.offsetTop;

  function navSticky() {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }

  // Mobile Nav Overlay
  $('.btn-mobile-open').click(function (e) {
    e.preventDefault;
    document.getElementById("nav-overlay").style.height = "100%";
  })

  $('.btn-mobile-close').click(function (e) {
    e.preventDefault;
    document.getElementById("nav-overlay").style.height = "0%";
  })


  // Contact Me Modal
  $('.btn-contact-open').click(function (e) {
    e.preventDefault;
    let contactModal = document.getElementById("contact-modal")
    console.log(contactModal);
    contactModal.style.display = "block";

    document.getElementById("nav-overlay").style.height = "0%";
  })

  $('.btn-contact-close').click(function (e) {
    e.preventDefault;
    let contactModal = document.getElementById("contact-modal")
    console.log(contactModal);
    contactModal.style.display = "none";
  })

  // Smooth Scroll
  $('#navbar a, .btn').on('click', function (e) {
    if (this.hash !== '') {
      e.preventDefault();

      const hash = this.hash;
      $('html, body').animate({
          scrollTop: $(hash).offset().top - 100,
        },
        800
      );
    }
  });

  // Mobile Menu Smoothscroll
  $('#nav-overlay .btn').on('click', function (e) {
    if (this.hash !== '') {
      e.preventDefault();

      const hash = this.hash;
      $('html, body').animate({
          scrollTop: $(hash).offset().top - 100,
        },
        800
      );

      document.getElementById("nav-overlay").style.height = "0%";
    }
  });


  // LightBox Gallery
  // Query Selectors
  const lightboxEnabled = document.querySelectorAll('.lightbox-enabled');
  // Array.from turns a node list (lightboxEnabled) into an array.
  const lightboxArray = Array.from(lightboxEnabled);
  const lastImage = lightboxArray.length - 1;
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImage = document.querySelector('.lightbox-image');

  const lightboxBtns = document.querySelectorAll('.lightbox-btn');
  const lightboxBtnRight = document.querySelector('#lightbox-btn-right');
  const lightboxBtnLeft = document.querySelector('#lightbox-btn-left');

  let activeImage;

  // Functions
  const showLightbox = () => {
    lightboxContainer.classList.add('active')
  }
  const hideLightbox = () => {
    lightboxContainer.classList.remove('active')
  }

  const setActiveImage = (image) => {
    lightboxImage.src = image.dataset.imagesrc;
    // active image is set to the .indexOf method on the array created from the lightboxEnabled images. It is passed the current image as a parameter
    activeImage = lightboxArray.indexOf(image);
    // Using a switch statement we can hide the left or right keys if the user is at the end or beggining of the gallery, useful on mobile devices so they don't loop through by accident. The default statement runs on all other cases to make sure we get our buttons back. The removeBtnActiveClass makes sure that we have buttons on screen before we go through our cases. 
    removeBtnInactiveClass()
    switch (activeImage) {
      case 0:
        lightboxBtnLeft.classList.add('inactive');
        break;
      case lastImage:
        lightboxBtnRight.classList.add('inactive');
        break;
      default:
        removeBtnInactiveClass()
    }
  }

  const removeBtnInactiveClass = () => {
    lightboxBtns.forEach(btn => {
      btn.classList.remove('inactive');
    })

  }
  const removeBtnAnimation = () => {
    lightboxBtns.forEach(btn => {
      // setTimeout lets us wait for a period and then call the call the function. btn.blur removes the focus state
      setTimeout(function () {
        btn.blur()
      }, 200);
    })
  }

  const transitionSlidesLeft = () => {
    lightboxBtnLeft.focus();
    // Terenary to set active image that check if activeImage is equal to 0, if true it sets it to the last image in the array, if false it sets it to the previous element sibling in the array
    activeImage === 0 ? setActiveImage(lightboxArray[lastImage]) : setActiveImage(lightboxArray[activeImage].previousElementSibling);
    removeBtnAnimation();
  }

  const transitionSlidesRight = () => {
    lightboxBtnRight.focus();
    // Terenary to set active image, same as transitionSlidesLeft
    activeImage === lastImage ? setActiveImage(lightboxArray[0]) : setActiveImage(lightboxArray[activeImage].nextElementSibling);
    removeBtnAnimation();
  }

  const transitionSlideHandler = (moveItem) => {
    // This is a terinary operator that checks if the first statement is true, if so it will run the first action(transitionSlidesLeft) if false it will run the second action(transitionSlidesRight)
    moveItem.includes('left') ? transitionSlidesLeft() : transitionSlidesRight();
  }
  // Event Listeners

  lightboxEnabled.forEach(image => {
    // add event listener for click to lightbox-enabled images that sets .active to .lightbox-container and sets the src for the .lightbox-image
    image.addEventListener('click', (e) => {
      showLightbox();
      setActiveImage(image);
    })
  })

  lightboxContainer.addEventListener('click', () => {
    hideLightbox();
  })

  // 
  lightboxBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // stopPropagation is a method that lives on the btn click event that prevents the event listener for hiding the lightbox(which is elsewhere) from firing. i.e. it doesn't "bubble up"
      e.stopPropagation();

      transitionSlideHandler(e.currentTarget.id);
    })
  })

  // to get keyboard to work
  window.addEventListener('keydown', (e) => {
    // To prevent anything from happening if the lightbox container isn't active
    if (!lightboxContainer.classList.contains('active')) return;
    // and if statement with 'or' || operator in the middle
    if (e.key.includes('Left') || e.key.includes('Right')) {
      e.preventDefault();
      // pass left or right key to transitionSlidesHandler, making it lowercase so it matches the function
      transitionSlideHandler(e.key.toLowerCase());
    }
  })

})