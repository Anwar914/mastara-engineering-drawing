if (window.parent !== window) {
  const send = (type, data) => {
    window.parent.postMessage({ isStreamlitMessage: true, type, ...data }, window.location.origin);
  };
  const resize = () => send("streamlit:setFrameHeight", {
    height: Math.ceil(document.documentElement.getBoundingClientRect().height),
  });
  window.addEventListener("message", (event) => {
    if (event.source === window.parent && event.origin === window.location.origin &&
        event.data?.type === "streamlit:render") resize();
  });
  send("streamlit:componentReady", { apiVersion: 1 });
  new ResizeObserver(resize).observe(document.documentElement);

  // Der Rahmen wächst mit dem Inhalt. Gescrollt wird deshalb die Streamlit-Seite, nicht der Rahmen.
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollParent = (offset) => {
    try {
      const main = window.parent.document.querySelector('[data-testid="stMain"]');
      if (!main) return;
      const frame = window.frameElement ? window.frameElement.getBoundingClientRect().top : 0;
      const top = main.scrollTop + frame - main.getBoundingClientRect().top + offset;
      main.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    } catch {}
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (href.startsWith("#") && href.length > 1) {
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      event.preventDefault();
      scrollParent(target.getBoundingClientRect().top);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    } else if (href.endsWith(".html")) {
      try { sessionStorage.setItem("mastara-nav", "1"); } catch {}
    }
  });
  try {
    if (sessionStorage.getItem("mastara-nav")) { sessionStorage.removeItem("mastara-nav"); scrollParent(0); }
  } catch {}
}
