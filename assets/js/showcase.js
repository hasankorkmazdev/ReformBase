(function () {
  'use strict';

  var SWIPER_INSTANCE = null;

  function loadShowcase() {
    $.getJSON('assets/data/showcase.json')
      .done(function (slides) {
        if (!slides || !slides.length) return;
        slides.sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
        renderSlides(slides);
        initSwiper(slides);
      })
      .fail(function (jqXHR, textStatus, error) {
        console.error('Showcase slaytları yüklenemedi:', textStatus, error);
      });
  }

  function renderSlides(slides) {
    var $wrapper = $('.project-showcase__inner');
    var html = '';

    html += '<div class="swiper showcase-swiper">';
    html += '<div class="swiper-wrapper">';

    slides.forEach(function (slide) {
      var isVideo = slide.type === 'video';

      var duration = slide.duration || 5000;
      html += '<div class="swiper-slide" data-type="' + slide.type + '" data-duration="' + duration + '">';

      if (isVideo) {
        html += '<video class="showcase-media showcase-video" src="' + slide.url + '" muted playsinline preload="metadata"></video>';
      } else {
        html += '<div class="showcase-media showcase-image" style="background-image: url(' + slide.url + ')"></div>';
      }

      html += '<div class="showcase-overlay">';
      html += '<div class="showcase-content">';
      if (slide.title) {
        html += '<h2 class="showcase-title"><span class="slide-animate" data-delay="0">' + slide.title + '</span></h2>';
      }
      if (slide.subtitle) {
        html += '<p class="showcase-subtitle"><span class="slide-animate" data-delay="150">' + slide.subtitle + '</span></p>';
      }
      if (slide.description) {
        html += '<p class="showcase-description"><span class="slide-animate" data-delay="300">' + slide.description + '</span></p>';
      }
      html += '</div>';
      html += '</div>';

      html += '</div>';
    });

    html += '</div>';

    html += '<div class="swiper-pagination showcase-pagination"></div>';
    html += '</div>';

    $wrapper.html(html);
  }

  function initSwiper() {
    if (SWIPER_INSTANCE) {
      SWIPER_INSTANCE.destroy(true, true);
      SWIPER_INSTANCE = null;
    }

    SWIPER_INSTANCE = new Swiper('.showcase-swiper', {
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 800,
      loop: true,
      autoplay: {
        delay: getActiveDuration(),
        disableOnInteraction: false
      },
      pagination: {
        el: '.showcase-pagination',
        clickable: true
      },
      on: {
        slideChangeTransitionStart: function () {
          animateOut();
          pauseAllVideos();
        },
        slideChangeTransitionEnd: function () {
          updateAutoplayDelay(this);
          animateIn();
          playActiveVideo();
        },
        init: function () {
          updateAutoplayDelay(this);
          animateIn();
          playActiveVideo();
        }
      }
    });

    animateIn();
    playActiveVideo();
  }

  function pauseAllVideos() {
    $('.showcase-video').each(function () {
      this.pause();
    });
  }

  function playActiveVideo() {
    if (!SWIPER_INSTANCE) return;
    var activeIndex = SWIPER_INSTANCE.realIndex;
    var $slides = $('.swiper-slide');
    var $active = $slides.eq(SWIPER_INSTANCE.activeIndex);
    var video = $active.find('.showcase-video')[0];
    if (video) {
      video.currentTime = 0;
      var playPromise = video.play();
      if (playPromise) {
        playPromise.catch(function () {});
      }
    }
  }

  function getActiveDuration() {
    var $active = $('.swiper-slide-active');
    if (!$active.length) {
      $active = $('.swiper-slide').first();
    }
    return parseInt($active.data('duration'), 10) || 5000;
  }

  function updateAutoplayDelay(swiper) {
    if (!swiper || !swiper.autoplay) return;
    var delay = getActiveDuration();
    swiper.autoplay.stop();
    swiper.params.autoplay.delay = delay;
    swiper.autoplay.start();
  }

  function animateIn() {
    var $active = $('.swiper-slide-active');
    $active.find('.slide-animate').each(function () {
      var $el = $(this);
      var delay = parseInt($el.data('delay'), 10) || 0;
      $el.css({
        'animation-delay': delay + 'ms',
        'animation-name': 'showcaseSlideUp',
        'animation-fill-mode': 'both',
        'animation-duration': '600ms',
        'animation-timing-function': 'ease-out'
      });
    });
  }

  function animateOut() {
    $('.slide-animate').each(function () {
      var $el = $(this);
      $el.css({
        'animation-name': 'showcaseFadeOut',
        'animation-duration': '300ms',
        'animation-fill-mode': 'both',
        'animation-timing-function': 'ease-in'
      });
    });
  }

  $(loadShowcase);

})();
