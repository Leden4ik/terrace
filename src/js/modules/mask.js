// Маска телефона +7 (___) ___-__-__

const MAX_DIGITS = 10;

export const phoneDigits = (value) => {
  let digits = String(value).replace(/\D/g, "");
  if (digits.length > 0 && (digits[0] === "7" || digits[0] === "8")) digits = digits.slice(1);
  return digits.slice(0, MAX_DIGITS);
};

export const formatPhone = (digits) => {
  let out = "+7";
  if (digits.length > 0) out += " (" + digits.slice(0, 3);
  if (digits.length >= 3) out += ") " + digits.slice(3, 6);
  if (digits.length >= 6) out += "-" + digits.slice(6, 8);
  if (digits.length >= 8) out += "-" + digits.slice(8, 10);
  return out;
};

export const isPhoneComplete = (value) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);

export const applyPhoneMask = (input) => {
  let lastDigits = "";

  const render = (digits) => {
    lastDigits = digits;
    input.value = digits.length ? formatPhone(digits) : "";
    const end = input.value.length;
    try {
      input.setSelectionRange(end, end);
    } catch (e) {
      // type=tel не везде поддерживает выделение
    }
  };

  input.addEventListener("input", (event) => {
    let digits = phoneDigits(input.value);
    // backspace попал на скобку или дефис, цифры не изменились
    if (event.inputType === "deleteContentBackward" && digits === lastDigits && digits.length > 0) {
      digits = digits.slice(0, -1);
    }
    render(digits);
  });

  input.addEventListener("focus", () => {
    if (!input.value) input.value = "+7 (";
  });

  input.addEventListener("blur", () => {
    if (phoneDigits(input.value).length === 0) {
      input.value = "";
      lastDigits = "";
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData("text");
    render(phoneDigits(text));
    input.dispatchEvent(new Event("input", {bubbles: true}));
  });

  if (input.value) render(phoneDigits(input.value));
};

document.querySelectorAll('[data-mask="phone"]').forEach(applyPhoneMask);
