(function ($) {
    "use strict";
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "73px");
        } else {
            $('.nav-bar').removeClass('nav-sticky');
            $('.carousel, .page-header').css("margin-top", "0");
        }
    });
    
    
    
    
    // jQuery counterUp
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });
    
    
    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Testimonial Slider
    $('.testimonial-slider').slick({
        infinite: true,
        autoplay: true,
        arrows: false,
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.testimonial-slider-nav'
    });
    $('.testimonial-slider-nav').slick({
        arrows: false,
        dots: false,
        focusOnSelect: true,
        centerMode: true,
        centerPadding: '22px',
        slidesToShow: 3,
        asNavFor: '.testimonial-slider'
    });
    $('.testimonial .slider-nav').css({"position": "relative", "height": "160px"});
    
    
    // Blogs carousel
    $(".related-slider").owlCarousel({
        autoplay: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="fa fa-angle-left" aria-hidden="true"></i>',
            '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });

    
})(jQuery);

//  set --n (used for calc in CSS) via JS, after getting
// .container and the number of child images it holds:

const _C = document.querySelector(".slider-container"),
  N = _C.children.length;

_C.style.setProperty("--n", N);

// detect the direction of the motion between "touchstart" (or "mousedown") event
// and the "touched" (or "mouseup") event
// and then update --i (current slide) accordingly
// and move the container so that the next image in the desired direction moves into the viewport

// on "mousedown"/"touchstart", lock x-coordiate
// and store it into an initial coordinate variable x0:
let x0 = null;
let locked = false;

function lock(e) {
  x0 = unify(e).clientX;
  // remove .smooth class
  _C.classList.toggle("smooth", !(locked = true));
}

// next, make the images move when the user swipes:
// was the lock action performed aka is x0 set?
// if so, read current x coordiante and compare it to x0
// from the difference between these two determine what to do next

let i = 0; // counter
let w; //image width

// update image width w on resive
function size() {
  w = window.innerWidth;
}

function move(e) {
  if (locked) {
    // set threshold of 20% (if less, do not drag to the next image)
    // dx = number of pixels the user dragged
    let dx = unify(e).clientX - x0,
      s = Math.sign(dx),
      f = +(s * dx / w).toFixed(2);

    // Math.sign(dx) returns 1 or -1
    // depending on this, the slider goes backwards or forwards

    if ((i > 0 || s < 0) && (i < N - 1 || s > 0) && f > 0.2) {
      _C.style.setProperty("--i", (i -= s));
      f = 1 - f;
    }

    _C.style.setProperty("--tx", "0px");
    _C.style.setProperty("--f", f);
    _C.classList.toggle("smooth", !(locked = false));
    x0 = null;
  }
}

size();

addEventListener("resize", size, false);

// ===============
// drag-animation for the slider when it reaches the end
// ===============

function drag(e) {
  e.preventDefault();

  if (locked) {
    _C.style.setProperty("--tx", `${Math.round(unify(e).clientX - x0)}px`);
  }
}

// ===============
// prev, next
// ===============
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

prev.addEventListener("click", () => {
  if (i == 0) {
    console.log("start reached");
  } else if (i > 0) {
    // decrease i as long as it is bigger than the number of slides
    _C.style.setProperty("--i", i--);
  }
});

next.addEventListener("click", () => {
  if (i < N) {
    // increase i as long as it's smaller than the number of slides
    _C.style.setProperty("--i", i++);
  }
});

// ===============
// slider event listeners for mouse and touch (start, move, end)
// ===============

_C.addEventListener("mousemove", drag, false);
_C.addEventListener("touchmove", drag, false);

_C.addEventListener("mousedown", lock, false);
_C.addEventListener("touchstart", lock, false);

_C.addEventListener("mouseup", move, false);
_C.addEventListener("touchend", move, false);

// override Edge swipe behaviour
_C.addEventListener(
  "touchmove",
  e => {
    e.preventDefault();
  },
  false
);

// unify touch and click cases:
function unify(e) {
  return e.changedTouches ? e.changedTouches[0] : e;
}


