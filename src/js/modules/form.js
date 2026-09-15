import "./mask.js";
import {isPhoneComplete} from "./mask.js";

const NAME_RE = /^[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z\s'’-]*$/;

const rules = {
  name: (value) => {
    const v = value.trim();
    if (!v) return "Введите ваше имя";
    if (v.length < 2) return "Имя слишком короткое";
    if (v.length > 50) return "Имя слишком длинное";
    if (!NAME_RE.test(v)) return "Имя может содержать только буквы, пробел и дефис";
    return "";
  },
  phone: (value) => {
    const v = value.trim();
    if (!v) return "Введите номер телефона";
    if (!isPhoneComplete(v)) return "Введите номер полностью: +7 (___) ___-__-__";
    return "";
  },
};

const getErrorBox = (input) => {
  const id = input.getAttribute("aria-describedby");
  return id ? document.getElementById(id) : null;
};

const setError = (input, message) => {
  const box = getErrorBox(input);
  const hasError = Boolean(message);
  input.classList.toggle("is-error", hasError);
  input.classList.toggle("is-valid", !hasError && input.value.trim() !== "");
  input.setAttribute("aria-invalid", String(hasError));
  if (box) {
    box.textContent = message;
    box.classList.toggle("is-visible", hasError);
  }
};

const validateField = (input) => {
  const rule = rules[input.dataset.validate];
  if (!rule) return true;
  const message = rule(input.value);
  setError(input, message);
  return !message;
};

const resetField = (input) => {
  input.classList.remove("is-error", "is-valid");
  input.removeAttribute("aria-invalid");
  const box = getErrorBox(input);
  if (box) {
    box.textContent = "";
    box.classList.remove("is-visible");
  }
};

// бэкенда нет, тут будет fetch(form.action, {method: "POST", body: new FormData(form)})
const send = (form) =>
  new Promise((resolve) => {
    console.info("Заявка:", Object.fromEntries(new FormData(form).entries()));
    setTimeout(resolve, 700);
  });

document.querySelectorAll(".js--form").forEach((form) => {
  const fields = Array.from(form.querySelectorAll("[data-validate]"));
  const submit = form.querySelector('[type="submit"]');
  const status = form.querySelector(".tr__form--status");
  const modal = form.closest(".js--modal");
  const success = modal?.querySelector(".js--form-success");

  const showStatus = (text) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-visible", Boolean(text));
  };

  fields.forEach((input) => {
    input.addEventListener("blur", () => {
      if (input.value.trim() !== "" || input.classList.contains("is-error")) validateField(input);
    });
    input.addEventListener("input", () => {
      if (input.classList.contains("is-error") || input.classList.contains("is-valid")) validateField(input);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    showStatus("");
    submit?.classList.add("is-loading");
    submit?.setAttribute("disabled", "");

    try {
      await send(form);
      form.reset();
      fields.forEach(resetField);
      if (modal && success) {
        modal.classList.add("is-sent");
        success.classList.add("is-visible");
        success.querySelector("button")?.focus();
      }
    } catch (e) {
      showStatus("Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.");
    } finally {
      submit?.classList.remove("is-loading");
      submit?.removeAttribute("disabled");
    }
  });

  modal?.addEventListener("modal:close", () => {
    form.reset();
    fields.forEach(resetField);
    modal.classList.remove("is-sent");
    success?.classList.remove("is-visible");
    showStatus("");
  });
});
