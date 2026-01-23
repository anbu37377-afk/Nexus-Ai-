/* =========================================================
   REQUIRED WEBSITE NAME — Premium Interactions
   - Dark/Light mode with persistence
   - Mobile drawer
   - Scroll reveal animations
   - Smooth scroll offset for sticky header
   - Active nav highlight
   - Contact form validation + toast
   ========================================================= */

   (function () {
    const root = document.documentElement;
    const themeBtn = document.querySelectorAll("[data-theme-toggle]");
    const drawer = document.querySelector(".mobile-drawer");
    const openDrawerBtn = document.querySelector("[data-open-drawer]");
    const closeDrawerBtn = document.querySelector("[data-close-drawer]");
    const backdrop = document.querySelector("[data-backdrop]");
    const backToTop = document.querySelector("[data-back-to-top]");
    const toast = document.querySelector(".toast");
  
    // Theme persistence
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) root.setAttribute("data-theme", savedTheme);
  
    themeBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        showToast("Theme updated", `Switched to ${next} mode.`);
      });
    });
  
    // Mobile drawer
    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("open");
      drawer.querySelector("a")?.focus();
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    }
    openDrawerBtn?.addEventListener("click", openDrawer);
    closeDrawerBtn?.addEventListener("click", closeDrawer);
    backdrop?.addEventListener("click", closeDrawer);
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });
  
    // Smooth scroll with header offset
    const header = document.querySelector("header");
    const headerOffset = () => (header ? header.offsetHeight + 8 : 76);
  
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  
    // Reveal on scroll (IntersectionObserver)
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) ent.target.classList.add("in");
      });
    }, { threshold: 0.14 });
  
    revealEls.forEach(el => io.observe(el));
  
    // Active nav link highlight (by current file)
    const file = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('a[data-nav]').forEach(link => {
      const href = link.getAttribute("href");
      if (href === file) link.classList.add("active");
    });
  
    // Back to top
    backToTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  
    // Contact form validation + toast
    const form = document.querySelector("form[data-contact-form]");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const subject = form.querySelector("#subject");
      const message = form.querySelector("#message");
  
      const errors = [];
      if (!name.value.trim() || name.value.trim().length < 2) errors.push("Name must be at least 2 characters.");
      if (!validateEmail(email.value)) errors.push("Enter a valid email address.");
      if (!subject.value.trim() || subject.value.trim().length < 4) errors.push("Subject must be at least 4 characters.");
      if (!message.value.trim() || message.value.trim().length < 20) errors.push("Message must be at least 20 characters.");
  
      if (errors.length) {
        showToast("Form needs attention", errors[0]);
        return;
      }
  
      // success
      form.reset();
      showToast("Message sent", "Thanks — our lab will reply within 24 hours.");
    });
  
    function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
    }
  
    function showToast(title, msg) {
      if (!toast) return;
      toast.querySelector("strong").textContent = title;
      toast.querySelector("span").textContent = msg;
      toast.classList.add("show");
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }
  })();
  

  /* ===========================
   AUTH (LocalStorage Demo)
   - signup creates user
   - login validates user
   - session stored
   =========================== */

(function () {
    const signupForm = document.querySelector("form[data-signup-form]");
    const loginForm = document.querySelector("form[data-login-form]");
  
    function getUsers() {
      return JSON.parse(localStorage.getItem("aurora_users") || "[]");
    }
    function setUsers(users) {
      localStorage.setItem("aurora_users", JSON.stringify(users));
    }
    function setSession(email) {
      localStorage.setItem("aurora_session", JSON.stringify({ email, time: Date.now() }));
    }
  
    // SIGNUP
    signupForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = signupForm.querySelector("#su_name").value.trim();
      const email = signupForm.querySelector("#su_email").value.trim().toLowerCase();
      const pass = signupForm.querySelector("#su_password").value;
  
      if (name.length < 2) return toast("Invalid name", "Name must be at least 2 characters.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Invalid email", "Enter a valid email address.");
      if (pass.length < 6) return toast("Weak password", "Password must be at least 6 characters.");
  
      const users = getUsers();
      const exists = users.find(u => u.email === email);
      if (exists) return toast("Account exists", "This email is already registered. Please login.");
  
      users.push({ name, email, pass });
      setUsers(users);
      setSession(email);
  
      toast("Account created", "Welcome to Aurora Nexus AI Lab.");
      setTimeout(() => location.href = "dashboard.html", 700);
    });
  
    // LOGIN
    loginForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("#li_email").value.trim().toLowerCase();
      const pass = loginForm.querySelector("#li_password").value;
  
      const users = getUsers();
      const user = users.find(u => u.email === email && u.pass === pass);
      if (!user) return toast("Login failed", "Incorrect email or password.");
  
      setSession(email);
      toast("Login success", "Redirecting to dashboard...");
      setTimeout(() => location.href = "dashboard.html", 700);
    });
  
    // toast helper (uses existing toast)
    function toast(title, msg) {
      const toastEl = document.querySelector(".toast");
      if (!toastEl) return;
      toastEl.querySelector("strong").textContent = title;
      toastEl.querySelector("span").textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
    }
  })();
  