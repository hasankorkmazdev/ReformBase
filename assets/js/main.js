(function () {
  'use strict';

  var hamburger = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav');
  var dropdownFixed = document.getElementById('dropdownFixed');
  var currentNavItem = null;
  var hideTimeout = null;

  function isMobile() { return window.innerWidth <= 992; }

  function bindDesktopHover() {
    document.querySelectorAll('.nav__item--dropdown').forEach(function (item) {
      item.removeEventListener('mouseenter', item._mEnter);
      item.removeEventListener('mouseleave', item._mLeave);
      item._mEnter = function () { showFixed(this); };
      item._mLeave = scheduleHide;
      item.addEventListener('mouseenter', item._mEnter);
      item.addEventListener('mouseleave', item._mLeave);
    });
    if (!dropdownFixed) return;
    dropdownFixed.removeEventListener('mouseenter', cancelHide);
    dropdownFixed.removeEventListener('mouseleave', scheduleHide);
    dropdownFixed.addEventListener('mouseenter', cancelHide);
    dropdownFixed.addEventListener('mouseleave', scheduleHide);
  }

  // ---- Fixed dropdown helpers ----
  function cloneToFixed(navItem) {
    var src = navItem.querySelector('.dropdown');
    if (!src) return;
    dropdownFixed.innerHTML = '';
    src.querySelectorAll('a').forEach(function (a) { dropdownFixed.appendChild(a.cloneNode(true)); });
    var rect = navItem.getBoundingClientRect();
    dropdownFixed.style.top = rect.bottom + 8 + 'px';
    dropdownFixed.style.left = rect.left + 'px';
    dropdownFixed.style.right = 'auto';
    dropdownFixed.style.transform = 'none';
    dropdownFixed.style.width = 'auto';
  }

  function showFixed(navItem) {
    if (isMobile()) return;
    cancelHide();
    currentNavItem = navItem;
    cloneToFixed(navItem);
    requestAnimationFrame(function () { dropdownFixed.classList.add('active'); });
  }

  function hideFixed() {
    dropdownFixed.classList.remove('active');
    currentNavItem = null;
  }

  function scheduleHide() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideFixed, 200);
  }

  function cancelHide() {
    if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
  }

  // ---- Hamburger ----
  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    nav.classList.toggle('open');
    hideFixed();
  });

  // ---- Hover: desktop only (gated inside handlers) ----
  bindDesktopHover();

  // ---- Click: mobile toggle inline, desktop toggle fixed ----
  document.querySelectorAll('.nav__item--dropdown > .nav__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = this.parentElement;

      if (!isMobile()) {
        if (currentNavItem === parent) { hideFixed(); return; }
        showFixed(parent);
        return;
      }

      // Mobile
      var dd = parent.querySelector('.dropdown');
      if (!dd) return;
      dd.classList.toggle('open');
      parent.classList.toggle('open');
    });
  });

  // ---- Close on outside click ----
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.header')) {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
    }
    if (e.target.closest('.dropdown-fixed') || e.target.closest('.nav__item--dropdown')) return;
    hideFixed();
  });

  // ---- Resize ----
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 992) {
        document.querySelectorAll('.nav__item--dropdown.open, .dropdown.open').forEach(function (el) {
          el.classList.remove('open');
        });
        bindDesktopHover();
      }
    }, 200);
  });
})();
