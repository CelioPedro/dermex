gsap.registerPlugin(ScrollTrigger);

// ============================================================
// INITIAL STATES + APPLY DATA-ROT
// ============================================================
gsap.set("#nav", { opacity: 0, y: -20 });
gsap.set(".small-team .word > span", { y: "105%" });
gsap.set(".big-results .letter", { y: 80, opacity: 0 });
gsap.set("#subline", { opacity: 0, y: 20 });
gsap.set(".t-card", { opacity: 0 });
gsap.set(".stats-inner", { opacity: 0 });

// ============================================================
// RESPONSIVE MATCHMEDIA FOR HERO
// ============================================================
let mm = gsap.matchMedia();

mm.add("(min-width: 751px)", () => {
  // Apply each card's natural rotation as the rest-state
  document.querySelectorAll(".card").forEach((card) => {
    const rot = parseFloat(card.dataset.rot) || 0;
    card.dataset.restRot = rot;
    gsap.set(card, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
  });

  // INTRO TIMELINE
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(".small-team .word > span", { y: "0%", duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.3)
    .to(".big-results .letter", { y: 0, opacity: 1, duration: 0.9, stagger: 0.05, ease: "back.out(1.6)" }, 0.55)
    .to(".card", { y: 0, opacity: 1, scale: 1, rotation: (i, el) => parseFloat(el.dataset.restRot) || 0, duration: 1.1, stagger: { each: 0.08, from: "center" }, ease: "back.out(1.4)" }, 0.8)
    .to("#subline", { opacity: 1, y: 0, duration: 0.8 }, 1.6);

  // CONTINUOUS FLOAT
  document.querySelectorAll(".card").forEach((card, i) => {
    const rot = parseFloat(card.dataset.restRot) || 0;
    gsap.to(card, { y: `+=${8 + (i % 3) * 5}`, rotation: rot + (i % 2 === 0 ? 1.5 : -1.5), duration: 3 + (i % 4) * 0.5, delay: 1.8 + i * 0.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
  });

  // MOUSE PARALLAX
  const hero = document.querySelector(".hero");
  let mx = 0, my = 0, tx = 0, ty = 0;
  let rafId;
  const onMouseMove = (e) => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onMouseLeave = () => { mx = 0; my = 0; };
  function parallax() {
    tx += (mx - tx) * 0.05;
    ty += (my - ty) * 0.05;
    document.querySelectorAll(".card").forEach((card) => {
      const d = parseFloat(card.dataset.depth) || 8;
      card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
    });
    rafId = requestAnimationFrame(parallax);
  }
  hero.addEventListener("mousemove", onMouseMove);
  hero.addEventListener("mouseleave", onMouseLeave);
  parallax();

  // HOVER LIFT
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateX: -py * 16, rotateY: px * 16, scale: 1.12, zIndex: 20, duration: 0.4, ease: "power2.out", transformPerspective: 700, overwrite: "auto" });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, zIndex: card.style.zIndex || "", duration: 0.8, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
    });
    card.addEventListener("click", () => {
      gsap.fromTo(card, { scale: 1.15 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
    });
  });

  // SCROLL FAN OUT
  ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(".big-results", { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
      gsap.set(".small-team", { y: -60 * p, opacity: 1 - p * 1.5 });
      const moves = [
        { x: -260, y: -40, rot: -25 }, { x: -200, y: 20, rot: -18 }, { x: -120, y: 80, rot: -10 }, { x: -40, y: 120, rot: -4 },
        { x: 40, y: 120, rot: 4 }, { x: 120, y: 80, rot: 12 }, { x: 200, y: 20, rot: 22 }, { x: 260, y: -40, rot: 28 }
      ];
      document.querySelectorAll(".card").forEach((card, i) => {
        const m = moves[i];
        const rest = parseFloat(card.dataset.restRot) || 0;
        gsap.set(card, { x: m.x * p, y: m.y * p, rotation: rest + m.rot * p });
      });
      gsap.set("#subline", { opacity: 1 - p * 2 });
    }
  });

  return () => {
    cancelAnimationFrame(rafId);
    hero.removeEventListener("mousemove", onMouseMove);
    hero.removeEventListener("mouseleave", onMouseLeave);
  };
});

mm.add("(max-width: 750px)", () => {
  // Mobile specific intro timeline
  gsap.set(".card", { y: -200, opacity: 0, scale: 0.8 });
  gsap.set("#mobileSubline", { opacity: 0, y: 20 });
  
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
    .to(".small-team .word > span", { y: "0%", duration: 0.9, stagger: 0.08 }, 0.3)
    .to(".big-results .letter", { y: 0, opacity: 1, duration: 0.9, stagger: 0.05 }, 0.55)
    .to(".card", { y: 0, opacity: 1, scale: 1, duration: 1, stagger: { each: 0.05, from: "start" }, ease: "back.out(1.2)" }, 0.8)
    .to("#mobileSubline", { opacity: 1, y: 0, duration: 0.8 }, 1.4);

  // Gentle float for mobile cards (no extreme rotations)
  document.querySelectorAll(".card").forEach((card, i) => {
    gsap.to(card, {
      y: `+=${5}`,
      duration: 2 + (i % 3) * 0.5,
      delay: 1.5 + i * 0.1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // Click to bring card to front
    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");
      document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
      if (!isActive) {
        card.classList.add("active");
      }
    });
  });
  
  // No scroll trigger for fan-out so it remains clustered
});

// ============================================================
// TEAM GRID REVEAL ON SCROLL
// ============================================================
gsap.from(".eyebrow, .team-head h2, .team-head p", {
  opacity: 0,
  y: 30,
  duration: 0.9,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".team-head", start: "top 80%" }
});

gsap.fromTo(".t-card", {
  opacity: 0,
  y: 80,
  scale: 0.9,
  rotation: (i) => (i % 2 === 0 ? -3 : 3)
}, {
  opacity: 1,
  y: 0,
  scale: 1,
  rotation: 0,
  duration: 1,
  stagger: 0.08,
  ease: "back.out(1.3)",
  scrollTrigger: { trigger: ".team-grid", start: "top 80%" }
});

// ============================================================
// STATS REVEAL + COUNTERS
// ============================================================
gsap.to(".stats-inner", {
  opacity: 1,
  y: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: { trigger: ".stats", start: "top 80%" }
});
gsap.from(".stats-inner", {
  y: 60,
  scale: 0.97,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: { trigger: ".stats", start: "top 80%" }
});

ScrollTrigger.create({
  trigger: ".stats",
  start: "top 75%",
  onEnter: () => {
    document.querySelectorAll(".stat-block .num").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const span = el.querySelector("span");
      gsap.to(
        { v: 0 },
        {
          v: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            span.textContent = Math.floor(this.targets()[0].v).toLocaleString();
          }
        }
      );
    });
  },
  once: true
});

// ============================================================
// CTA / BUTTON CLICKS
// ============================================================
document.querySelectorAll(".nav-cta, .arrow-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    gsap.fromTo(
      btn,
      { scale: 1 },
      {
        scale: 0.93,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  });
});

// Big results: subtle letter rise on hover of the wrap
document
  .querySelector(".big-results-wrap")
  .addEventListener("mouseenter", () => {
    gsap.to(".big-results .letter", {
      y: -8,
      duration: 0.5,
      stagger: 0.03,
      ease: "back.out(1.6)"
    });
  });
document
  .querySelector(".big-results-wrap")
  .addEventListener("mouseleave", () => {
    gsap.to(".big-results .letter", {
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "elastic.out(1, 0.6)"
    });
  });

// ============================================================
// HEADER MODALS LOGIC
// ============================================================
const modalOverlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");
const modalClose = document.getElementById("modalClose");
const modalContents = document.querySelectorAll(".modal-content");
const modalTriggers = document.querySelectorAll("[data-modal]");

let isModalOpen = false;

function openModal(modalId) {
  if (isModalOpen) return;
  isModalOpen = true;

  // Hide all contents, show only the target
  modalContents.forEach(c => c.style.display = "none");
  const targetContent = document.getElementById("modal-" + modalId);
  if (targetContent) targetContent.style.display = "block";

  modalOverlay.classList.add("active");
  
  gsap.to(modalOverlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
  gsap.fromTo(modalBox, 
    { y: 30, scale: 0.95 },
    { y: 0, scale: 1, duration: 0.5, ease: "back.out(1.2)", delay: 0.1 }
  );
}

function closeModal() {
  if (!isModalOpen) return;
  
  gsap.to(modalBox, { y: 20, scale: 0.95, duration: 0.3, ease: "power2.in" });
  gsap.to(modalOverlay, { 
    opacity: 0, 
    duration: 0.3, 
    ease: "power2.in", 
    delay: 0.1,
    onComplete: () => {
      modalOverlay.classList.remove("active");
      isModalOpen = false;
    }
  });
}

// Event Listeners
modalTriggers.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const modalId = btn.getAttribute("data-modal");
    openModal(modalId);
  });
});

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ============================================================
// MOBILE MENU LOGIC
// ============================================================
const hamburger = document.getElementById("hamburger");
const navLinksContainer = document.getElementById("navLinks");

if (hamburger && navLinksContainer) {
  hamburger.addEventListener("click", () => {
    navLinksContainer.classList.toggle("open");
    hamburger.classList.toggle("is-active");
  });

  // Close menu when clicking a link
  navLinksContainer.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinksContainer.classList.remove("open");
      hamburger.classList.remove("is-active");
    });
  });
}