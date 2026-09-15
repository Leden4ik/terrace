// Открытие: любой элемент с data-modal-open="<id>". Закрытие: .js--modal-close, фон, Esc

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let activeModal = null;
let opener = null;

const open = (modal, trigger) => {
  if (activeModal === modal) return;
  if (activeModal) close(activeModal, false);

  activeModal = modal;
  opener = trigger || null;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");

  const firstField = modal.querySelector("input, textarea, select");
  const target = firstField && firstField.offsetParent ? firstField : modal;
  setTimeout(() => target.focus({preventScroll: true}), 50);

  modal.dispatchEvent(new CustomEvent("modal:open"));
};

const close = (modal, restoreFocus = true) => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  modal.dispatchEvent(new CustomEvent("modal:close"));

  if (activeModal === modal) activeModal = null;
  if (restoreFocus && opener) opener.focus();
  opener = null;
};

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-modal-open]");
  if (trigger) {
    const modal = document.getElementById(trigger.dataset.modalOpen);
    if (modal) {
      event.preventDefault();
      open(modal, trigger);
    }
    return;
  }

  const closer = event.target.closest(".js--modal-close");
  if (closer) {
    close(closer.closest(".js--modal"));
    return;
  }

  if (event.target.classList.contains("js--modal")) close(event.target);
});

document.addEventListener("keydown", (event) => {
  if (!activeModal) return;

  if (event.key === "Escape") {
    event.preventDefault();
    close(activeModal);
    return;
  }

  if (event.key === "Tab") {
    const focusable = Array.from(activeModal.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

export {open, close};
