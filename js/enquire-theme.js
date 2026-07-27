(function () {
  var theme = new URLSearchParams(window.location.search).get('theme');
  if (theme === 'light' || theme === 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
  }
})();
