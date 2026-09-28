(() => {
  "use strict";
  const match = location.pathname.match(/DreamB(\d+)(?:\.html)?\/?$/i);
  if (!match) return;
  const sequence = [1,2,3,4,5,9,10,11,12,23,24,25,26,27,28,13,14,15,16];
  const page = Number(match[1]);
  const position = sequence.indexOf(page);
  const nextPage = sequence[position + 1];
  if (!nextPage) return;
  const href = "DreamB" + nextPage + ".html" + location.search;
  const style = document.createElement("style");
  style.textContent = ".dreamb-fallback-next{position:fixed!important;z-index:2147483647!important;right:16px!important;border:3px solid #172b48!important;border-radius:12px!important;padding:10px 16px!important;color:#172b48!important;background:#fff7bd!important;box-shadow:0 4px 0 #3975c6!important;font:800 18px Arial,sans-serif!important;text-decoration:none!important;cursor:pointer!important}.dreamb-fallback-top{top:82px!important}.dreamb-fallback-bottom{bottom:18px!important}@media(max-width:750px){.dreamb-fallback-next{right:10px!important;padding:9px 12px!important;font-size:15px!important}.dreamb-fallback-top{top:62px!important}.dreamb-fallback-bottom{bottom:10px!important}}@media print{.dreamb-fallback-next{display:none!important}}";
  document.head.append(style);
  const add = (className, selector) => {
    if (document.querySelector(selector)) return;
    const link = document.createElement("a");
    link.className = "dreamb-fallback-next " + className;
    link.href = href;
    link.textContent = "Next Page →";
    document.body.append(link);
  };
  add("dreamb-fallback-top", ".dreamb-top-next,.dreamb-fallback-top");
  add("dreamb-fallback-bottom", ".dreamb-page-nav,.dreamb-fallback-bottom");
})();
