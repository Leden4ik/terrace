const burger = document.querySelector(".js--burger");
const drawer = document.querySelector(".js--drawer");
const backdrop = document.querySelector(".js--drawer-backdrop");

if (burger && drawer && backdrop) {
  const closeBtn = drawer.querySelector(".js--drawer-close");
  const links = drawer.querySelectorAll(".js--drawer-link");

  const setState = (open) => {
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("is-locked", open);
    if (open) {
      closeBtn?.focus();
    } else {
      burger.focus();
    }
  };

  burger.addEventListener("click", () => setState(!drawer.classList.contains("is-open")));
  closeBtn?.addEventListener("click", () => setState(false));
  backdrop.addEventListener("click", () => setState(false));
  links.forEach((link) => link.addEventListener("click", () => setState(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) setState(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769 && drawer.classList.contains("is-open")) setState(false);
  });
}
