/* Scidata shared site script: skip-link a11y, menu keyboard support,
   lead-form + newsletter handling via WhatsApp (no backend needed).
   Loaded with defer on every main page. Pure ASCII, no dependencies. */
(function () {
    "use strict";

    function $(s, c) { return (c || document).querySelector(s); }
    function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

    var WA_NUMBER = "https://wa.me/8801797636430";

    /* 1. Skip-link styling (anchors + #main-content ids live in HTML). */
    var st = document.createElement("style");
    st.textContent = ".skip-link{position:fixed;top:-70px;left:12px;z-index:9999;background:#c6f135;color:#0a0a0a;font-weight:700;padding:10px 16px;border-radius:10px;text-decoration:none;transition:top .2s}.skip-link:focus{top:12px}";
    document.head.appendChild(st);
    $all(".skip-link").forEach(function (a) {
        a.addEventListener("click", function () {
            var t = document.querySelector(a.getAttribute("href"));
            if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: false }); }
        });
    });

    /* 2. Menu trigger: keyboard access + aria-expanded sync with overlay. */
    var triggers = $all("[data-menu-trigger]");
    triggers.forEach(function (tr) {
        tr.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tr.click(); }
        });
    });
    var overlay = $("[data-nav-overlay]");
    if (overlay && triggers.length) {
        var sync = function () {
            var open = overlay.classList.contains("nav-overlay--open");
            triggers.forEach(function (tr) { tr.setAttribute("aria-expanded", open ? "true" : "false"); });
        };
        if (window.MutationObserver) {
            new MutationObserver(sync).observe(overlay, { attributes: true, attributeFilter: ["class"] });
        }
        sync();
    }

    /* 3. Lead + newsletter forms -> prefilled WhatsApp message. */
    function showMsg(form, msg, ok) {
        var p = form.querySelector("[data-lead-msg]");
        if (!p) {
            p = document.createElement("p");
            p.setAttribute("data-lead-msg", "");
            p.style.cssText = "margin-top:10px;font-size:.9rem;";
            form.appendChild(p);
        }
        p.textContent = msg;
        p.style.color = ok ? "#c6f135" : "#ff6b6b";
    }

    function bindLead(form, kind) {
        if (form.__leadBound) { return; }
        form.__leadBound = true;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var data = {};
            $all("input, select, textarea", form).forEach(function (el) {
                if (el.type === "submit" || el.type === "button" || el.type === "checkbox" && !el.checked) { return; }
                var key = el.getAttribute("name") || el.getAttribute("placeholder") || el.type || "field";
                var val = (el.value || "").trim();
                if (val) { data[key] = val; }
            });
            var lines;
            if (kind === "newsletter") {
                var email = data.email || data.Email || "";
                if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                    showMsg(form, "Please enter a valid email address.", false);
                    return;
                }
                lines = ["NEWSLETTER SIGNUP", "Email: " + email];
            } else {
                /* Spam honeypot: silently accept, never send. */
                if (data.company2) {
                    showMsg(form, "Thanks - your brief is with our Data & IoT crew. Expect a scheduling email within 24 hours. Talk soon.", true);
                    form.reset();
                    return;
                }
                delete data.company2;
                /* Privacy consent required where present (booking form). */
                if (form.querySelector("[name=consent]") && !form.querySelector("[name=consent]:checked")) {
                    showMsg(form, "Please accept the Privacy Policy so we can contact you.", false);
                    return;
                }
                lines = ["NEW " + String(kind).toUpperCase() + " BRIEF"];
                Object.keys(data).forEach(function (k) { lines.push(k + ": " + data[k]); });
                if (lines.length < 2) {
                    showMsg(form, "Please fill in the form first.", false);
                    return;
                }
            }
            window.open(WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
            showMsg(form, kind === "newsletter"
                ? "Thanks - WhatsApp is opening to confirm your signup."
                : "Thanks - WhatsApp is opening with your brief. Talk soon.", true);
            form.reset();
        }, true);
    }

    $all("form[data-lead]").forEach(function (f) { bindLead(f, f.getAttribute("data-lead")); });
    $all(".footer-newsletter").forEach(function (f) { bindLead(f, "newsletter"); });
})();
