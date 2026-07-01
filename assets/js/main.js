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

  // ---- Chat Widget ----
  var chatBtn = document.getElementById('chatBtn');
  var chatPanel = document.getElementById('chatPanel');
  var chatClose = document.getElementById('chatClose');
  var chatForm = document.getElementById('chatForm');
  var chatInput = chatForm.querySelector('.chat-form__input');
  var chatMessages = document.getElementById('chatMessages');

  function toggleChat(open) {
    var isActive = chatPanel.classList.contains('active');
    if (open === undefined) open = !isActive;
    chatPanel.classList.toggle('active', open);
    chatBtn.classList.toggle('active', open);
    if (open) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.focus();
    }
  }

  chatBtn.addEventListener('click', function () { toggleChat(); });
  chatClose.addEventListener('click', function () { toggleChat(false); });

  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = chatInput.value.trim();
    if (!text) return;

    // User message
    var userMsg = document.createElement('div');
    userMsg.className = 'chat-message chat-message--user';
    userMsg.innerHTML = '<div class="chat-message__text">' + escapeHtml(text) + '</div><span class="chat-message__time">Şimdi</span>';
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Auto-reply after short delay
    setTimeout(function () {
      var botMsg = document.createElement('div');
      botMsg.className = 'chat-message chat-message--bot';
      botMsg.innerHTML = '<div class="chat-message__text">Teşekkür ederiz. En kısa sürede size dönüş yapacağız.</div><span class="chat-message__time">Şimdi</span>';
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ---- Page Sections (Vision, etc.) ----
  var $projectShowcase = document.getElementById('projectShowcase');
  var $projectBar = document.getElementById('projectBar');
  var $projectPlans = document.getElementById('projectPlans');
  var $visionPage = document.getElementById('visionPage');

  function showVision() {
    $visionPage.classList.add('active');
    $projectShowcase.style.display = 'none';
    $projectBar.style.display = 'none';
    $projectPlans.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showProjects() {
    $visionPage.classList.remove('active');
    $projectShowcase.style.display = '';
    $projectBar.style.display = '';
    $projectPlans.style.display = '';
  }

  // Listen for clicks on VİZYONUMUZ link
  document.querySelectorAll('.dropdown a').forEach(function (a) {
    if (a.textContent.trim() === 'VİZYONUMUZ') {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        hideFixed();
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        showVision();
      });
    }
  });

  // Listen for PROJELER nav link to go back to projects view
  document.querySelectorAll('.nav__link').forEach(function (link) {
    if (link.textContent.trim() === 'PROJELER') {
      link.addEventListener('click', function (e) {
        showProjects();
      });
    }
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
