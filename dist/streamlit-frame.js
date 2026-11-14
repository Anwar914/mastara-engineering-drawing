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
}
