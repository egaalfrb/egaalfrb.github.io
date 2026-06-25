// =========================
// LOAD SECTIONS DYNAMICALLY
// =========================
const sectionsConfig = {
  home: 'sections/hero.html',
  about: 'sections/about.html',
  education: 'sections/education.html',
  experience: 'sections/experience.html',
  project: 'sections/project.html',
  contact: 'sections/contact.html'
};

async function loadFooter() {
  try {
    const res = await fetch('sections/footer.html');
    if (res.ok) {
      const footerContainer = document.getElementById('footer-container');
      if (footerContainer) {
        footerContainer.innerHTML = await res.text();
      }
    }
  } catch (e) {
    console.error('Gagal memuat footer');
  }
}

async function loadSections() {
  for (const [id, file] of Object.entries(sectionsConfig)) {
    const container = document.getElementById(id);
    if (!container) continue;

    try {
      const res = await fetch(file);
      if (res.ok) {
        container.innerHTML = await res.text();
      }
    } catch (e) {
      console.error(`Gagal memuat ${file}`);
    }
  }

  await loadFooter();

  // Jalankan semua fungsi setelah sections selesai dimuat
  setTimeout(() => {
    initAllFeatures();
  }, 300);
}

// =========================
// INIT ALL FEATURES
// =========================
function initAllFeatures() {

  // =========================
  // NAVBAR SCROLL EFFECT
  // =========================
  const nav = document.querySelector("nav");
  const topBtn = document.querySelector(".top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');

      if (topBtn) {
        topBtn.classList.add('visible');
      }
    } else {
      nav.classList.remove('scrolled');

      if (topBtn) {
        topBtn.classList.remove('visible');
      }
    }
  });

  // =========================
  // ACTIVE NAV LINK
  // =========================
  const navLinks = document.querySelectorAll("nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    const allSections = document.querySelectorAll("section");

    allSections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // =========================
  // EDUCATION MODAL
  // =========================
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  // Close modal when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // =========================
  // LIGHTBOX FOR GALLERY
  // =========================
  const galleries = {};
  let currentGallery = '';
  let currentLightboxIndex = 0;

  // Collect gallery images grouped by data-gallery attribute
  document.querySelectorAll('.gallery-item[data-gallery]').forEach(item => {
    const group = item.dataset.gallery;
    if (!galleries[group]) galleries[group] = [];
    const img = item.querySelector('img');
    if (img) galleries[group].push(img.src);
  });

  window.openLightbox = function(index, gallery) {
    currentGallery = gallery || 'default';
    currentLightboxIndex = index;
    const images = galleries[currentGallery];
    if (!images || !images[index]) return;

    const overlay = document.getElementById('lightboxOverlay');
    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    if (!overlay || !image) return;

    image.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;

    overlay.style.display = 'flex';
    // Trigger reflow for animation
    void overlay.offsetWidth;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 350);
    document.body.style.overflow = 'auto';
  };

  window.navigateLightbox = function(direction) {
    const images = galleries[currentGallery];
    if (!images) return;

    currentLightboxIndex += direction;

    // Loop around
    if (currentLightboxIndex < 0) currentLightboxIndex = images.length - 1;
    if (currentLightboxIndex >= images.length) currentLightboxIndex = 0;

    const image = document.getElementById('lightboxImage');
    const counter = document.getElementById('lightboxCounter');

    // Add animation
    const content = document.querySelector('.lightbox-content');
    content.style.animation = 'none';
    void content.offsetWidth;
    content.style.animation = 'lightboxZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

    image.src = images[currentLightboxIndex];
    counter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
  };

  // Close lightbox on overlay click
  document.getElementById('lightboxOverlay')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('lightboxOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // =========================
  // FADE UP ANIMATION
  // =========================
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".card, .edu-card, .project-card").forEach(el => {
    observer.observe(el);
  });

  // =========================
  // TYPING EFFECT HERO
  // =========================
  const typingElement = document.querySelector(".left h3");
  if (typingElement) {
    const text = "D3 Sistem Informasi | IT & Digital Enthusiast";
    let i = 0;
    typingElement.innerHTML = "";

    function typeWriter() {
      if (i < text.length) {
        typingElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      }
    }
    typeWriter();
  }

  // =========================
  // VIDEO CONTROLS PLACEHOLDER
  // =========================
  const promoVideo = document.getElementById('quixoticPromoVideo');
  if (promoVideo) {
    const source = promoVideo.querySelector('source');
    const placeholder = document.getElementById('videoPlaceholder');
    if (source && source.getAttribute('src').trim() !== "") {
      promoVideo.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    }
  }
}

// =========================
// START THE APP
// =========================
window.onload = loadSections;