(function () {
  'use strict';

  var LOGO_SVG = '<svg viewBox="0 0 170 173" fill="currentColor"><path d="M1,61C1,41 1,21 1,1h170v57c-1,1-2,2-3,3c-8,11-18,21-30,28c-13,8-28,13-44,14c-12,1-24,0-36-3c-22-6-41-18-55-38C3,62 2,61 1,61z"/><path d="M1,172V102c8,5 16,11 24,15c25,13 52,18 80,13c21-3 40-11 57-24c3-2 6-3 9-5v71H1z"/><path d="M1,173c54,0 109,0 163,0c1,0 2,0 4,0c0,1 0,2-1,2c-1,0-2,0-3,0c-54,0-109,0-163,0V173z"/></svg>';

  var projectsData = [];
  var currentProjectId = null;
  var currentImageIndex = 0;

  function createSvg(className) {
    var wrap = document.createElement('div');
    wrap.innerHTML = LOGO_SVG;
    var svg = wrap.firstChild;
    if (className) svg.setAttribute('class', className);
    return svg;
  }

  function renderDropdown(projects) {
    var ul = document.querySelector('.dropdown--projects');
    ul.innerHTML = '';
    projects.forEach(function (p) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#';
      a.style.color = p.color;
      a.dataset.project = p.id;
      var svg = createSvg('project-icon');
      a.appendChild(svg);
      var span=document.createElement('span');
      span.style.color = '#ffffff';
      span.textContent = 'REF';
      a.appendChild(span);
      a.appendChild(document.createTextNode(' ' + p.title));
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function renderProjectBar(projects) {
    var container = document.querySelector('.project-bar__inner');
    container.innerHTML = '';
    projects.forEach(function (p) {
      var a = document.createElement('a');
      a.href = '#';
      a.className = 'project-bar__item';
      a.dataset.id = p.id;
      a.style.color = p.color;

      var svg = createSvg('project-bar__logo');
      a.appendChild(svg);

      var textWrap = document.createElement('span');
      textWrap.className = 'project-bar__text';

      var titleSpan = document.createElement('span');
      titleSpan.className = 'project-bar__title';

      var span1 = document.createElement('span');
      span1.textContent = 'REF ';
      span1.style.color = '#fff';

      var span2 = document.createElement('span');
      span2.textContent = p.title;

      titleSpan.appendChild(span1);
      titleSpan.appendChild(span2);

      var subtitleSpan = document.createElement('span');
      subtitleSpan.className = 'project-bar__subtitle';
      subtitleSpan.textContent = p.subtitle;

      textWrap.appendChild(titleSpan);
      textWrap.appendChild(subtitleSpan);
      a.appendChild(textWrap);
      container.appendChild(a);
    });
  }

  function goToSlide(index) {
    var slides = document.querySelectorAll('.showcase-gallery__slide');
    var dots = document.querySelectorAll('.showcase-gallery__dot');
    if (!slides.length) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentImageIndex = index;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
  }

  function renderShowcaseGallery(project) {
    var showcaseInner = document.querySelector('.project-showcase__inner');
    var activeImages = project.images.filter(function (img) { return img.active; }).sort(function (a, b) { return a.order - b.order; });

    showcaseInner.innerHTML = '';

    var galleryContainer = document.createElement('div');
    galleryContainer.className = 'showcase-gallery';
    galleryContainer.style.color = project.color;

    var slidesContainer = document.createElement('div');
    slidesContainer.className = 'showcase-gallery__slides';

    activeImages.forEach(function (img, index) {
      var slide = document.createElement('div');
      slide.className = 'showcase-gallery__slide' + (index === 0 ? ' active' : '');
      var el;
      if (img.cover.endsWith('.svg')) {
        el = createSvg();
      } else {
        el = document.createElement('img');
        el.src = img.cover;
        el.alt = project.title + ' görsel ' + (index + 1);
        el.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      }
      slide.appendChild(el);
      slidesContainer.appendChild(slide);
    });

    galleryContainer.appendChild(slidesContainer);

    if (activeImages.length > 1) {
      var dotsContainer = document.createElement('div');
      dotsContainer.className = 'showcase-gallery__dots';
      activeImages.forEach(function (_, index) {
        var dot = document.createElement('button');
        dot.className = 'showcase-gallery__dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slayt ' + (index + 1));
        dot.addEventListener('click', function () { goToSlide(index); });
        dotsContainer.appendChild(dot);
      });
      galleryContainer.appendChild(dotsContainer);

      var prevBtn = document.createElement('button');
      prevBtn.className = 'showcase-gallery__nav showcase-gallery__nav--prev';
      prevBtn.innerHTML = '‹';
      prevBtn.setAttribute('aria-label', 'Önceki');
      prevBtn.addEventListener('click', function () { goToSlide(currentImageIndex - 1); });
      galleryContainer.appendChild(prevBtn);

      var nextBtn = document.createElement('button');
      nextBtn.className = 'showcase-gallery__nav showcase-gallery__nav--next';
      nextBtn.innerHTML = '›';
      nextBtn.setAttribute('aria-label', 'Sonraki');
      nextBtn.addEventListener('click', function () { goToSlide(currentImageIndex + 1); });
      galleryContainer.appendChild(nextBtn);
    }

    showcaseInner.appendChild(galleryContainer);

    var overlay = document.createElement('div');
    overlay.className = 'project-showcase__overlay';
    var titleEl = document.createElement('h2');
    titleEl.className = 'project-showcase__title';
    titleEl.textContent = project.title;
    overlay.appendChild(titleEl);
    var subtitleEl = document.createElement('p');
    subtitleEl.className = 'project-showcase__subtitle';
    subtitleEl.textContent = project.subtitle;
    overlay.appendChild(subtitleEl);
    var descEl = document.createElement('p');
    descEl.className = 'project-showcase__desc';
    descEl.textContent = project.description;
    overlay.appendChild(descEl);
    showcaseInner.appendChild(overlay);

    currentImageIndex = 0;
  }

  function renderFloorPlans(project) {
    var container = document.querySelector('.floor-plans__container');
    container.innerHTML = '';

    if (!project.floorPlans || project.floorPlans.length === 0) return;

    var titles = ['Tümü'];
    project.floorPlans.forEach(function (fp) {
      if (titles.indexOf(fp.title) === -1) titles.push(fp.title);
    });

    var filterBar = document.createElement('div');
    filterBar.className = 'floor-plans__filter';

    titles.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'floor-plans__filter-btn' + (t === 'Tümü' ? ' active' : '');
      btn.textContent = t;
      btn.dataset.filter = t;
      btn.addEventListener('click', function () {
        filterBar.querySelectorAll('.floor-plans__filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        wrapper.querySelectorAll('.floor-plan-card').forEach(function (card) {
          card.style.display = (t === 'Tümü' || card.dataset.plan === t) ? '' : 'none';
        });
      });
      filterBar.appendChild(btn);
    });

    container.appendChild(filterBar);

    var wrapper = document.createElement('div');
    wrapper.className = 'floor-plans__wrapper';

    project.floorPlans.forEach(function (fp) {
      var card = document.createElement('div');
      card.className = 'floor-plan-card';
      card.dataset.plan = fp.title;

      var title = document.createElement('h3');
      title.className = 'floor-plan-card__title';
      title.textContent = fp.title;
      card.appendChild(title);

      var subtitle = document.createElement('p');
      subtitle.className = 'floor-plan-card__subtitle';
      subtitle.textContent = fp.subtitle;
      card.appendChild(subtitle);

      var coverImage = fp.images.find(function (img) { return img.isCover; }) || fp.images[0];

      if (coverImage) {
        var img = document.createElement('img');
        img.className = 'floor-plan-card__image';
        img.src = coverImage.cover;
        img.alt = fp.title + ' planı';
        img.loading = 'lazy';
        card.appendChild(img);
      }

      wrapper.appendChild(card);
    });

    container.appendChild(wrapper);
  }

  function renderProjectDetail(project) {
    var img = document.querySelector('.project-detail__image');
    var title = document.querySelector('.project-detail__title');
    var desc = document.querySelector('.project-detail__desc');
    var formBtn = document.querySelector('.request-form__btn');

    var activeImage = project.images.filter(function (img) { return img.active; }).sort(function (a, b) { return a.order - b.order; })[0] || project.images[0];

    if (activeImage) {
      img.src = activeImage.cover;
      img.alt = project.title + ' kapak görseli';
    }

    title.textContent = project.title;
    desc.textContent = project.description;

    if (formBtn) {
      formBtn.style.background = project.color;
    }
  }

  function setActiveProject(projectId) {
    currentProjectId = projectId;
    var html = document.documentElement;
    html.dataset.activeProject = projectId;

    var project = projectsData.find(function (p) { return p.id === projectId; });
    if (!project) return;

    html.style.setProperty('--project-color', project.color);

    document.querySelectorAll('.dropdown--projects a, .dropdown-fixed a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.project === projectId);
    });

    document.querySelectorAll('.project-bar__item').forEach(function (item) {
      var isActive = item.dataset.id === projectId;
      item.classList.toggle('active', isActive);
      if (isActive) {
        item.style.borderLeftColor = project.color;
        item.style.borderRightColor = project.color;
        item.style.borderTopColor = project.color;
        item.style.borderBottomColor = 'transparent';
      } else {
        item.style.borderLeftColor = '';
        item.style.borderRightColor = '';
        item.style.borderTopColor = '';
        item.style.borderBottomColor = '';
      }
    });

    renderShowcaseGallery(project);
    renderFloorPlans(project);
    renderProjectDetail(project);
  }

  function initProjectBarScroll() {
    var track = document.querySelector('.project-bar__track');
    var prevBtn = document.querySelector('.project-bar__btn--prev');
    var nextBtn = document.querySelector('.project-bar__btn--next');
    if (!track || !prevBtn || !nextBtn) return;

    function scrollByItem(dir) {
      var items = track.querySelectorAll('.project-bar__item');
      if (!items.length) return;
      var itemWidth = items[0].offsetWidth;
      var gap = 0;
      track.scrollBy({ left: dir * (itemWidth + gap), behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', function () { scrollByItem(-1); });
    nextBtn.addEventListener('click', function () { scrollByItem(1); });

    (function () {
      var isDown = false;
      var startX = 0;
      var scrollLeft = 0;

      track.addEventListener('mousedown', function (e) {
        isDown = true;
        track.classList.add('grabbing');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      track.addEventListener('mouseleave', function () {
        if (isDown) {
          isDown = false;
          track.classList.remove('grabbing');
        }
      });

      track.addEventListener('mouseup', function () {
        isDown = false;
        track.classList.remove('grabbing');
      });

      track.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        var walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });

      (function () {
        var tStartX = 0;
        var tScrollLeft = 0;

        track.addEventListener('touchstart', function (e) {
          tStartX = e.touches[0].pageX - track.offsetLeft;
          tScrollLeft = track.scrollLeft;
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
          var x = e.touches[0].pageX - track.offsetLeft;
          var walk = (x - tStartX) * 1.5;
          track.scrollLeft = tScrollLeft - walk;
        }, { passive: true });
      })();
    })();
  }

  function bindEvents() {
    document.addEventListener('click', function (e) {
      var dropdownLink = e.target.closest('.dropdown--projects a') || e.target.closest('.dropdown-fixed a');
      var barItem = e.target.closest('.project-bar__item');

      if (dropdownLink) {
        e.preventDefault();
        setActiveProject(dropdownLink.dataset.project);
        var nav = document.querySelector('.nav');
        var hamburger = document.querySelector('.hamburger');
        if (nav && hamburger) {
          nav.classList.remove('open');
          hamburger.classList.remove('active');
        }
        document.querySelectorAll('.dropdown.open').forEach(function (el) {
          el.classList.remove('open');
        });
        document.querySelectorAll('.nav__item--dropdown.open').forEach(function (el) {
          el.classList.remove('open');
        });
        var ddFixed = document.getElementById('dropdownFixed');
        if (ddFixed) ddFixed.classList.remove('active');
      }

      if (barItem) {
        e.preventDefault();
        setActiveProject(barItem.dataset.id);
      }
    });
  }

  function init() {
    fetch('assets/data/projects.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        projectsData = data;
        renderDropdown(data);
        renderProjectBar(data);
        initProjectBarScroll();
        if (data.length > 0) {
          setActiveProject(data[0].id);
        }
        bindEvents();
      })
      .catch(function (err) {
        console.error('Projeler yüklenemedi:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
