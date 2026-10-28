// reCAPTCHA v3, loaded on demand: the script (about 400 KB and a lot of main-thread work) is added the first time a
// visitor starts using a form, not on every page. One shared load for all forms; a failed load can be retried.
// Each submission asks for a fresh token. Google's badge shows (bottom right) as soon as the script has loaded.

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const LOAD_TIMEOUT_MS = 15000;

export const RECAPTCHA_RETRY_MESSAGE =
  "We couldn't complete the security check. Please check your internet connection and try again.";

let loading = null; // the shared load, or null before the first one (and after a failure, so it can be retried)

export function loadRecaptcha() {
  if (typeof window === "undefined") return Promise.reject(new Error("reCAPTCHA runs in the browser only"));
  if (!SITE_KEY) return Promise.reject(new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set"));
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const fail = (error) => {
        clearTimeout(timer);
        script.remove();
        loading = null;
        reject(error);
      };
      const timer = setTimeout(() => fail(new Error("reCAPTCHA load timed out")), LOAD_TIMEOUT_MS);
      script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
      script.async = true;
      script.onerror = () => fail(new Error("reCAPTCHA script could not be loaded"));
      script.onload = () => {
        if (!window.grecaptcha?.ready) return fail(new Error("reCAPTCHA did not start"));
        window.grecaptcha.ready(() => {
          clearTimeout(timer);
          resolve(window.grecaptcha);
        });
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

// Start loading on the first interaction with a form (focus, tap or click), so it is ready by the time it is sent
export function startRecaptcha() {
  loadRecaptcha().catch(() => {}); // a failure is reported when the form is sent
}

// A fresh token for one submission. Throws if reCAPTCHA cannot load or run: never send the form without one.
export async function getRecaptchaToken(action) {
  const grecaptcha = await loadRecaptcha();
  const token = await grecaptcha.execute(SITE_KEY, { action });
  if (!token) throw new Error("reCAPTCHA returned no token");
  return token;
}
