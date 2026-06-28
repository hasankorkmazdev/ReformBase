(function () {
  'use strict';

  /* ============================
     CONSTANTS & STATE
  ============================ */

  var LOGO_SVG =
    '<svg viewBox="0 0 170 173" fill="currentColor">' +
      '<path d="M1,61C1,41 1,21 1,1h170v57c-1,1-2,2-3,3c-8,11-18,21-30,28c-13,8-28,13-44,14c-12,1-24,0-36-3c-22-6-41-18-55-38C3,62 2,61 1,61z"/>' +
      '<path d="M1,172V102c8,5 16,11 24,15c25,13 52,18 80,13c21-3 40-11 57-24c3-2 6-3 9-5v71H1z"/>' +
      '<path d="M1,173c54,0 109,0 163,0c1,0 2,0 4,0c0,1 0,2-1,2c-1,0-2,0-3,0c-54,0-109,0-163,0V173z"/>' +
    '</svg>';

  var projectsData      = [];
  var currentProjectId  = null;
  var currentImageIndex = 0;

  /* ============================
     SVG HELPERS
  ============================ */

  function createSvg(className) {
    var $wrap = $('<div>').html(LOGO_SVG);
    var $svg  = $wrap.children().first();

    if (className) {
      $svg.attr('class', className);
    }

    return $svg[0];
  }

  /* ============================
     RENDER: DROPDOWN
  ============================ */

  function renderDropdown(projects) {
    var $ul = $('.dropdown--projects').empty();

    $.each(projects, function (_, project) {
      var $a = $('<a>', {
        href         : '#',
        'data-project': project.id,
        css          : { color: project.color }
      });

      var $svg   = $(createSvg('project-icon'));
      var $span  = $('<span>', {
        text: 'REF',
        css : { color: '#ffffff' }
      });

      $a.append($svg, $span, ' ' + project.title);

      $('<li>').append($a).appendTo($ul);
    });
  }

  /* ============================
     RENDER: PROJECT BAR
  ============================ */

  function renderProjectBar(projects) {
    var $container = $('.project-bar__inner').empty();

    $.each(projects, function (_, project) {
      var $a = $('<a>', {
        href     : '#',
        'class'  : 'project-bar__item',
        'data-id': project.id,
        css      : { color: project.color }
      });

      var $svg = $(createSvg('project-bar__logo'));

      var $titleSpan = $('<span>', { class: 'project-bar__title' })
        .append(
          $('<span>', { text: 'REF ', css: { color: '#fff' } }),
          $('<span>', { text: project.title })
        );

      var $subtitleSpan = $('<span>', {
        class: 'project-bar__subtitle',
        text : project.subtitle
      });

      var $textWrap = $('<span>', { class: 'project-bar__text' })
        .append($titleSpan, $subtitleSpan);

      $a.append($svg, $textWrap).appendTo($container);
    });
  }

  /* ============================
     GALLERY SLIDE NAVIGATION
  ============================ */

  function goToSlide(index) {
    var $slides = $('.showcase-gallery__slide');
    var $dots   = $('.showcase-gallery__dot');

    if (!$slides.length) return;

    if (index < 0)            index = $slides.length - 1;
    if (index >= $slides.length) index = 0;

    currentImageIndex = index;

    $slides.removeClass('active').eq(index).addClass('active');
    $dots.removeClass('active').eq(index).addClass('active');
  }

  /* ============================
     RENDER: SHOWCASE GALLERY
  ============================ */

  function renderShowcaseGallery(project) {
    var $showcaseInner = $('.project-showcase__inner').empty();

    var activeImages = $.grep(project.images, function (img) {
      return img.active;
    }).sort(function (a, b) {
      return a.order - b.order;
    });

    // Gallery container
    var $gallery = $('<div>', {
      class: 'showcase-gallery',
      css  : { color: project.color }
    });

    var $slidesContainer = $('<div>', { class: 'showcase-gallery__slides' });

    $.each(activeImages, function (index, img) {
      var $slide = $('<div>', {
        class: 'showcase-gallery__slide' + (index === 0 ? ' active' : '')
      });

      if (img.cover.endsWith('.svg')) {
        $slide.append(createSvg());
      } else {
        $slide.append(
          $('<img>', {
            src : img.cover,
            alt : project.title + ' görsel ' + (index + 1),
            css : {
              width        : '100%',
              height       : '100%',
              objectFit    : 'cover',
              display      : 'block'
            }
          })
        );
      }

      $slidesContainer.append($slide);
    });

    $gallery.append($slidesContainer);

    // Dots & navigation (if more than 1 image)
    if (activeImages.length > 1) {
      var $dotsContainer = $('<div>', { class: 'showcase-gallery__dots' });

      $.each(activeImages, function (index) {
        var $dot = $('<button>', {
          class          : 'showcase-gallery__dot' + (index === 0 ? ' active' : ''),
          'aria-label'   : 'Slayt ' + (index + 1),
          click          : function () { goToSlide(index); }
        });

        $dotsContainer.append($dot);
      });

      $gallery.append($dotsContainer);

      var $prevBtn = $('<button>', {
        class        : 'showcase-gallery__nav showcase-gallery__nav--prev',
        html         : '‹',
        'aria-label' : 'Önceki',
        click        : function () { goToSlide(currentImageIndex - 1); }
      });

      var $nextBtn = $('<button>', {
        class        : 'showcase-gallery__nav showcase-gallery__nav--next',
        html         : '›',
        'aria-label' : 'Sonraki',
        click        : function () { goToSlide(currentImageIndex + 1); }
      });

      $gallery.append($prevBtn, $nextBtn);
    }

    $showcaseInner.append($gallery);

    // Overlay with title, subtitle, description
    var $overlay = $('<div>', { class: 'project-showcase__overlay' });

    var $titleEl = $('<h2>', { class: 'project-showcase__title' })
      .append(
        $('<span>', { text: 'REF', css: { color: '#ffffff' } }),
        ' ' + project.title
      );

    $overlay.append($titleEl);

    var $subtitleEl = $('<p>', {
      class: 'project-showcase__subtitle',
      text : project.subtitle
    });

    $overlay.append($subtitleEl);

    var $descEl = $('<p>', {
      class: 'project-showcase__desc',
      text : project.description
    });

    $overlay.append($descEl);
    $showcaseInner.append($overlay);

    currentImageIndex = 0;
  }

  /* ============================
     RENDER: FLOOR PLANS
  ============================ */

  function renderFloorPlans(project) {
    var $container = $('.floor-plans__container').empty();

    if (!project.floorPlans || project.floorPlans.length === 0) return;

    // Collect unique plan titles
    var titles = ['Tümü'];

    $.each(project.floorPlans, function (_, fp) {
      if (titles.indexOf(fp.title) === -1) {
        titles.push(fp.title);
      }
    });

    // Filter bar
    var $filterBar = $('<div>', { class: 'floor-plans__filter' });

    $.each(titles, function (_, title) {
      var $btn = $('<button>', {
        class        : 'floor-plans__filter-btn' + (title === 'Tümü' ? ' active' : ''),
        text         : title,
        'data-filter': title,
        click        : function () {
          $filterBar.find('.floor-plans__filter-btn').removeClass('active');
          $btn.addClass('active');

          $wrapper.find('.floor-plan-card').each(function () {
            var $card  = $(this);
            var shouldShow = title === 'Tümü' || $card.data('plan') === title;
            $card.toggle(shouldShow);
          });
        }
      });

      $filterBar.append($btn);
    });

    $container.append($filterBar);

    // Cards wrapper
    var $wrapper = $('<div>', { class: 'floor-plans__wrapper' });

    $.each(project.floorPlans, function (_, fp) {
      var $card = $('<div>', {
        class      : 'floor-plan-card',
        'data-plan': fp.title
      });

      $('<h3>', { class: 'floor-plan-card__title',  text: fp.title    }).appendTo($card);
      $('<p>',  { class: 'floor-plan-card__subtitle', text: fp.subtitle }).appendTo($card);

      var coverImage = fp.images.find(function (img) {
        return img.isCover;
      }) || fp.images[0];

      if (coverImage) {
        $('<img>', {
          class  : 'floor-plan-card__image',
          src    : coverImage.cover,
          alt    : fp.title + ' planı',
          loading: 'lazy'
        }).appendTo($card);
      }

      $wrapper.append($card);
    });

    $container.append($wrapper);
  }

  /* ============================
     RENDER: PROJECT DETAIL
  ============================ */

  function renderProjectDetail(project) {
    var activeImage = $.grep(project.images, function (img) {
      return img.active;
    }).sort(function (a, b) {
      return a.order - b.order;
    })[0] || project.images[0];

    var $img   = $('.project-detail__image');
    var $title = $('.project-detail__title');
    var $desc  = $('.project-detail__desc');

    if (activeImage) {
      $img.attr({
        src: activeImage.cover,
        alt: project.title + ' kapak görseli'
      });
    }

    $title.text(project.title);
    $desc.text(project.description);

    $('.request-form__btn').css('background', project.color);
  }

  /* ============================
     SET ACTIVE PROJECT
  ============================ */

  function setActiveProject(projectId) {
    currentProjectId = projectId;

    var $html   = $('html');
    var project = $.grep(projectsData, function (p) {
      return p.id === projectId;
    })[0];

    if (!project) return;

    $html
      .data('activeProject', projectId)
      .css('--project-color', project.color);

    // Toggle active class on dropdown links
    $('.dropdown--projects a, .dropdown-fixed a')
      .removeClass('active')
      .filter('[data-project="' + projectId + '"]')
      .addClass('active');

    // Toggle active class & border colors on project bar items
    $('.project-bar__item').each(function () {
      var $item    = $(this);
      var isActive = $item.data('id') === projectId;

      $item.toggleClass('active', isActive);

      if (isActive) {
        $item.css({
          borderLeftColor  : project.color,
          borderRightColor : project.color,
          borderTopColor   : project.color,
          borderBottomColor: 'transparent'
        });
      } else {
        $item.css({
          borderLeftColor  : '',
          borderRightColor : '',
          borderTopColor   : '',
          borderBottomColor: ''
        });
      }
    });

    renderShowcaseGallery(project);
    renderFloorPlans(project);
    renderProjectDetail(project);
  }

  /* ============================
     PROJECT BAR DRAG SCROLL
  ============================ */

  function initProjectBarScroll() {
    var $track   = $('.project-bar__track');
    var $prevBtn = $('.project-bar__btn--prev');
    var $nextBtn = $('.project-bar__btn--next');

    if (!$track.length || !$prevBtn.length || !$nextBtn.length) return;

    function scrollByItem(direction) {
      var items   = $track.find('.project-bar__item');
      if (!items.length) return;

      var itemWidth = items[0].offsetWidth;
      var trackEl   = $track[0];

      trackEl.scrollBy({
        left   : direction * itemWidth,
        behavior: 'smooth'
      });
    }

    $prevBtn.on('click', function () { scrollByItem(-1); });
    $nextBtn.on('click', function () { scrollByItem( 1); });

    // Mouse drag & touch drag
    (function () {
      var isDown    = false;
      var startX    = 0;
      var scrollLeft = 0;
      var trackEl   = $track[0];

      $track.on('mousedown', function (e) {
        isDown     = true;
        $track.addClass('grabbing');
        startX     = e.pageX - $track.offset().left;
        scrollLeft = trackEl.scrollLeft;
      });

      $track.on('mouseleave', function () {
        if (isDown) {
          isDown = false;
          $track.removeClass('grabbing');
        }
      });

      $track.on('mouseup', function () {
        isDown = false;
        $track.removeClass('grabbing');
      });

      $track.on('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x    = e.pageX - $track.offset().left;
        var walk = (x - startX) * 1.5;
        trackEl.scrollLeft = scrollLeft - walk;
      });

      // Touch events
      var tStartX = 0, tScrollLeft = 0;

      $track.on('touchstart', function (e) {
        tStartX     = e.originalEvent.touches[0].pageX - $track.offset().left;
        tScrollLeft = trackEl.scrollLeft;
      });

      $track.on('touchmove', function (e) {
        var x    = e.originalEvent.touches[0].pageX - $track.offset().left;
        var walk = (x - tStartX) * 1.5;
        trackEl.scrollLeft = tScrollLeft - walk;
      });
    })();
  }

  /* ============================
     EVENT BINDING
  ============================ */

  function bindEvents() {
    $(document).on('click', function (e) {
      var $dropdownLink = $(e.target).closest('.dropdown--projects a, .dropdown-fixed a');
      var $barItem      = $(e.target).closest('.project-bar__item');

      if ($dropdownLink.length) {
        e.preventDefault();
        setActiveProject($dropdownLink.data('project'));

        $('.nav').removeClass('open');
        $('.hamburger').removeClass('active');
        $('.dropdown.open, .nav__item--dropdown.open').removeClass('open');
        $('#dropdownFixed').removeClass('active');
      }

      if ($barItem.length) {
        e.preventDefault();
        setActiveProject($barItem.data('id'));
      }
    });
  }

  /* ============================
     INIT
  ============================ */

  function init() {
    $.getJSON('assets/data/projects.json')
      .done(function (data) {
        projectsData = data;

        renderDropdown(data);
        renderProjectBar(data);
        initProjectBarScroll();

        if (data.length > 0) {
          setActiveProject(data[0].id);
        }

        bindEvents();
      })
      .fail(function (jqXHR, textStatus, error) {
        console.error('Projeler yüklenemedi:', textStatus, error);
      });
  }

  $(init);

})();
