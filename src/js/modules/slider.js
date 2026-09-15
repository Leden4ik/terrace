const root = document.querySelector(".js--services");

if (root) {
  const track = root.querySelector(".js--services-track");
  const section = root.closest("section") || root;
  const prevButtons = section.querySelectorAll(".js--services-prev");
  const nextButtons = section.querySelectorAll(".js--services-next");

  const items = () => Array.from(track.children);

  const step = () => {
    const list = items();
    if (list.length < 2) return track.clientWidth;
    return list[1].offsetLeft - list[0].offsetLeft;
  };

  const maxScroll = () => track.scrollWidth - track.clientWidth;

  const updateArrows = () => {
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= maxScroll() - 1;
    prevButtons.forEach((btn) => {
      btn.classList.toggle("is-disabled", atStart);
      btn.setAttribute("aria-disabled", String(atStart));
    });
    nextButtons.forEach((btn) => {
      btn.classList.toggle("is-disabled", atEnd);
      btn.setAttribute("aria-disabled", String(atEnd));
    });
  };

  const scrollByStep = (direction) => {
    track.scrollBy({left: step() * direction, behavior: "smooth"});
  };

  prevButtons.forEach((btn) => btn.addEventListener("click", () => scrollByStep(-1)));
  nextButtons.forEach((btn) => btn.addEventListener("click", () => scrollByStep(1)));

  track.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByStep(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByStep(-1);
    }
  });

  // drag мышью, на таче хватает нативного скролла
  let isDown = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    isDown = true;
    moved = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
  });

  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
    const s = step();
    track.scrollTo({left: Math.round(track.scrollLeft / s) * s, behavior: "smooth"});
  };

  track.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 4) moved = true;
    track.scrollLeft = startScroll - delta;
  });
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointerleave", endDrag);

  track.addEventListener(
    "click",
    (event) => {
      if (moved) {
        event.preventDefault();
        moved = false;
      }
    },
    true
  );

  track.addEventListener("scroll", updateArrows, {passive: true});
  window.addEventListener("resize", updateArrows);
  updateArrows();
}
