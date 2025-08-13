export const loadGtag = (id: string) => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (document.getElementById("gtag-js")) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.id = "gtag-js";
  document.head.appendChild(script);

  const w = window as Window;
  w.dataLayer = w.dataLayer || [];
  w.gtag = (...args: unknown[]) => {
    w.dataLayer.push(args as unknown as (typeof w.dataLayer)[number]);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, { send_page_view: false });
};
