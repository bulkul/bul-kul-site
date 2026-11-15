'use strict';
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');
function closeMenu() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
  navigation.classList.remove('is-open');
}
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    navigation.classList.toggle('is-open', open);
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
}
const copyButton = document.querySelector('.copy-email');
const copyFeedback = document.querySelector('.copy-feedback');
if (copyButton && copyFeedback) {
  copyButton.addEventListener('click', async () => {
    const helper = document.createElement('textarea');
    helper.value = 'info@bul-kul.com';
    helper.setAttribute('readonly', '');
    helper.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(helper);
    helper.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch { /* use the Clipboard API below */ }
    helper.remove();
    copyButton.focus({ preventScroll: true });
    if (copied) {
      copyFeedback.textContent = 'メールアドレスをコピーしました。';
      return;
    }
    try {
      await navigator.clipboard.writeText('info@bul-kul.com');
      copyFeedback.textContent = 'メールアドレスをコピーしました。';
    } catch {
      copyFeedback.textContent = 'info@bul-kul.com を選択してコピーしてください。';
    }
  });
}

(function () {
  document.documentElement.classList.add('js');
  const header = document.querySelector('.header');
  const toTop = document.querySelector('.to-top');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('is-show', y > 800);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
    const links = [...document.querySelectorAll('.navigation > a[href^="#"]:not(.nav-contact)')];
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if (map.size) {
      const so = new IntersectionObserver(entries => entries.forEach(e => {
        const a = map.get(e.target.id);
        if (a && e.isIntersecting) { links.forEach(l => l.classList.remove('is-current')); a.classList.add('is-current'); }
      }), { rootMargin: '-40% 0px -55% 0px' });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
    }
  } else {
    items.forEach(el => el.classList.add('is-visible'));
  }
})();
