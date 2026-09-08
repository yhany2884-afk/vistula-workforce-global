
(function(){
  const key='vwg-theme';
  const saved=localStorage.getItem(key);
  const dark = saved ? saved==='dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
  window.toggleTheme=function(){
    const next=!document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem(key, next?'dark':'light');
  };
})();
