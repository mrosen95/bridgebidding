(function () {
  const select = document.getElementById('page-select');
  const content = document.getElementById('page-content');

  PAGES.forEach((page) => {
    const option = document.createElement('option');
    option.value = page.id;
    option.textContent = suitsPlain(page.label);
    select.appendChild(option);
  });

  function getPageIdFromHash() {
    const id = window.location.hash.replace('#', '');
    return PAGES.some((page) => page.id === id) ? id : PAGES[0].id;
  }

  function showPage(id) {
    const page = PAGES.find((p) => p.id === id) || PAGES[0];
    content.innerHTML = page.render();
    select.value = page.id;
    content.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  select.addEventListener('change', () => {
    window.location.hash = select.value;
  });

  window.addEventListener('hashchange', () => {
    showPage(getPageIdFromHash());
  });

  showPage(getPageIdFromHash());
})();
