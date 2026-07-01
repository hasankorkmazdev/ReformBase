(function () {
  'use strict';

  var projectsData;

  /* ============================
     RENDER DROPDOWN
  ============================ */
  function renderDropdown(data) {
    var $dropdown = $('#dropdown-projects');
    $dropdown.empty();

    data.forEach(function (project) {
      var $li = $('<li>');
      var $a = $('<a>', {
        href: '#',
        'data-project-id': project.id,
        html: '<span class="project-icon"><img src="' + project.logo + '" alt="' + project.title + '"></span> '
      });
      $li.append($a);
      $dropdown.append($li);
    });
  }

  /* ============================
     RENDER PROJECT BAR
  ============================ */
  function renderProjectBar(data) {
    var $inner = $('.project-bar__inner');
    $inner.empty();

    data.forEach(function (project) {
      var $item = $('<div>', {
        class: 'project-bar__item',
        'data-project-id': project.id
      });

      $('<img>', {
        class: 'project-bar__logo',
        src: project.logo,
        alt: project.title
      }).appendTo($item);


      $inner.append($item);
    });
  }

  /* ============================
     RENDER PROJECT PLANS
  ============================ */
  function renderProjectPlans(project) {
    var $container = $('.project-plans__container');
    $container.empty();

    if (!project.plans || !project.plans.length) return;

    project.plans.forEach(function (plan) {
      var imageUrl = plan.typeImage || (plan.images && plan.images.length > 0 ? plan.images[0].url : '');

      var $card = $('<div>', { class: 'project-plan-card' });

      if (imageUrl) {
        $('<img>', {
          class: 'project-plan-card__image',
          src: imageUrl,
          alt: plan.title
        }).appendTo($card);
      }

      $('<div>', {
        class: 'project-plan-card__title',
        text: plan.title
      }).appendTo($card);

      $container.append($card);
    });
  }

  /* ============================
     RENDER PROJECT OUTERMEDIA
  ============================ */
  function renderProjectOuterMedia(project) {
    var $img = $('.project-detail__image');
    if (!project.outerMedia || !project.outerMedia.length) {
      $img.attr('src', '');
      return;
    }

    var cover = project.outerMedia.find(function (m) { return m.cover; })
            || project.outerMedia.find(function (m) { return m.active; })
            || project.outerMedia[0];

    $img.attr('src', cover.url);
  }

  /* ============================
     SET ACTIVE PROJECT
  ============================ */
  function setActiveProject(id) {
    $('.project-bar__item').removeClass('active');
    $('#dropdown-projects a').removeClass('active');

    $('.project-bar__item[data-project-id="' + id + '"]').addClass('active');
    $('#dropdown-projects a[data-project-id="' + id + '"]').addClass('active');

    var project = projectsData.find(function (p) { return p.id === id; });
    if (project) {
      document.documentElement.style.setProperty('--project-color', project.color);
      renderProjectPlans(project);
      renderProjectOuterMedia(project);
    }

    $('#projectPlans').slideDown(500);
  }

  /* ============================
     PROJECT BAR SCROLL
  ============================ */
  function initProjectBarScroll() {
    var $track = $('.project-bar__track');
    var $prev = $('.project-bar__btn--prev');
    var $next = $('.project-bar__btn--next');

    $prev.on('click', function () {
      $track.animate({ scrollLeft: '-=200' }, 300);
    });

    $next.on('click', function () {
      $track.animate({ scrollLeft: '+=200' }, 300);
    });

    // Drag to scroll
    var isDown = false;
    var startX, scrollLeft;

    $track.on('mousedown', function (e) {
      isDown = true;
      $track.addClass('grabbing');
      startX = e.pageX - $track.offset().left;
      scrollLeft = $track.scrollLeft();
    });

    $track.on('mouseleave', function () {
      isDown = false;
      $track.removeClass('grabbing');
    });

    $track.on('mouseup', function () {
      isDown = false;
      $track.removeClass('grabbing');
    });

    $track.on('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - $track.offset().left;
      var walk = (x - startX) * 1.5;
      $track.scrollLeft(scrollLeft - walk);
    });
  }

  /* ============================
     BIND EVENTS
  ============================ */
  function bindEvents() {
    // Project bar item click
    $('.project-bar__inner').on('click', '.project-bar__item', function () {
      var id = $(this).data('project-id');
      setActiveProject(id);
    });

    // Dropdown project click (inline)
    $('#dropdown-projects').on('click', 'a', function (e) {
      e.preventDefault();
      var id = $(this).data('project-id');
      setActiveProject(id);

      // Close mobile nav
      $('.nav').removeClass('open');
      $('.hamburger').removeClass('active');
    });

    // Dropdown project click (fixed/cloned)
    $('#dropdownFixed').on('click', 'a[data-project-id]', function (e) {
      e.preventDefault();
      var id = $(this).data('project-id');
      setActiveProject(id);
      $('#dropdownFixed').removeClass('active');
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

        // Initial state: black, no project selected
        document.documentElement.style.setProperty('--project-color', '#231f20');
        $('.project-plans__container').empty();
        $('.project-detail__image').attr('src', '');
        $('#projectPlans').hide();

        bindEvents();

        // Hide splash screen after a brief delay
        // setTimeout(function () {
        //   $('#pageSplash').addClass('exit');
        //   setTimeout(function () { $('#pageSplash').remove(); }, 1400);
        // }, 1500);
      })
      .fail(function (jqXHR, textStatus, error) {
        console.error('Projeler yüklenemedi:', textStatus, error);
      });
  }

  $(init);

})();
