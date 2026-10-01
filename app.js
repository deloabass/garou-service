/*
  GAROU SERVICES - script du site
  Ici, uniquement le fonctionnement du site.
  Images, réalisations, services et coordonnées se modifient dans data.js.
*/

// Petits raccourcis pour sélectionner des éléments
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ---------------------------------------------------------------
// Images
// Les données viennent de data.js : des objets { src, alt, width, height }.
// ---------------------------------------------------------------

// Cadre gris affiché quand une photo est introuvable
const PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#252525"/><text x="400" y="310" fill="#8c9198" font-family="sans-serif" font-size="32" text-anchor="middle">Photo à venir</text></svg>`
);

// Applique un objet image de data.js sur une balise <img> existante
function applyImage(img, data) {
    img.src = data.src;
    img.alt = data.alt || "";
    if (data.width) img.width = data.width;
    if (data.height) img.height = data.height;
}

// Fabrique une balise <img> à partir d'un objet image (sections construites en JS)
function imageTag(data, classes, width, height) {
    return `<img src="${data.src}" alt="${data.alt || ""}" class="${classes}" width="${width}" height="${height}" loading="lazy">`;
}

// ---------------------------------------------------------------
// Médias d'une réalisation (photos + vidéos, voir PROJECTS dans data.js)
// ---------------------------------------------------------------
const videosOf = (project) => project.videos || [];
const coverOf = (project) => project.cover || project.images[0];

// Liste unique : d'abord les photos, ensuite les vidéos
function getMedia(project) {
    const photos = project.images.map((src, index) => ({
        type: "image",
        src,
        alt: `${project.title} - photo ${index + 1}`
    }));
    const videos = videosOf(project).map((src) => ({ type: "video", src }));
    return [...photos, ...videos];
}

// Petit compteur affiché sur la vignette : nombre de photos et de vidéos
function mediaBadge(project) {
    const videoCount = videosOf(project).length;
    const videoPart = videoCount ? `<i class="ri-play-circle-line ml-1"></i>${videoCount}` : "";

    return `<span class="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2.5 py-1.5" aria-hidden="true"><i class="ri-image-line"></i>${project.images.length}${videoPart}</span>`;
}

// Photo introuvable : on affiche le cadre gris et on prévient dans la console (F12).
// Les erreurs de chargement ne "remontent" pas, d'où l'écoute en phase de capture.
document.addEventListener("error", (event) => {
    const img = event.target;
    if (img.tagName !== "IMG" || img.src.startsWith("data:")) return;

    console.warn("Image introuvable :", img.getAttribute("src"));
    img.src = PLACEHOLDER;
}, true);

// ---------------------------------------------------------------
// WhatsApp
// ---------------------------------------------------------------
const whatsappNumber = CONFIG.whatsapp.replace(/\D/g, "");
const hasWhatsapp = whatsappNumber.length >= 8;

function whatsappLink(message) {
    const base = `https://wa.me/${hasWhatsapp ? whatsappNumber : ""}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// ---------------------------------------------------------------
// Construction des sections dynamiques
// ---------------------------------------------------------------

// Images posées dans le HTML avec data-image="clé" (voir IMAGES dans data.js)
$$("[data-image]").forEach((img) => {
    const data = IMAGES[img.dataset.image];
    if (data) applyImage(img, data);
    else console.warn(`Aucune image "${img.dataset.image}" dans IMAGES (data.js)`);
});

$("#favicon").href = IMAGES.logo.src;

// Services : une rangée par service, l'image alterne de côté
$("#services-list").innerHTML = SERVICES
    .map((service, index) => {
        const imageClasses = index % 2
            ? "md:order-first md:col-span-5 md:col-start-1"
            : "md:col-span-6";

        return `
        <div class="group grid md:grid-cols-12 gap-6 items-center py-8 reveal">
          <span class="font-display text-5xl text-brand md:col-span-1">0${index + 1}</span>
          <div class="md:col-span-5 transition-transform duration-300 group-hover:translate-x-3">
            <h3 class="text-4xl lg:text-5xl font-bold">${service.title}</h3>
            <p class="mt-3 text-white/70 max-w-md">${service.text}</p>
          </div>
          <div class="${imageClasses} aspect-[16/7] overflow-hidden img-zoom">
            ${imageTag(service.image, "w-full h-full object-cover", 900, 400)}
          </div>
        </div>`;
    })
    .join("");

// Grille des réalisations
$("#grid").innerHTML = PROJECTS
    .map((project, index) => `
      <button class="card on-dark relative overflow-hidden img-zoom text-left text-white ${project.span}"
              data-category="${project.category}" data-index="${index}" aria-label="Voir les photos et vidéos : ${project.title}">
        ${imageTag({ src: coverOf(project), alt: project.title }, "w-full h-full object-cover", 800, 600)}
        ${mediaBadge(project)}
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
        <div class="absolute bottom-0 p-4 lg:p-5">
          <p class="text-brand text-xs tracking-widest uppercase">${project.category}</p>
          <h3 class="text-2xl lg:text-3xl font-bold">${project.title}</h3>
          <p class="hidden lg:block text-sm text-white/70 mt-1">${project.description.split(". ")[0]}.</p>
        </div>
      </button>`)
    .join("");

// Galerie en mosaïque
$("#gallery-masonry").innerHTML = GALLERY
    .map((item) => `
      <div class="${item.ratio} overflow-hidden img-zoom">
        ${imageTag(item.image, "w-full h-full object-cover", 600, 700)}
      </div>`)
    .join("");

// ---------------------------------------------------------------
// Filtres des réalisations
// ---------------------------------------------------------------
const filterBar = $("#filters");

// Le filtre "Vidéos" n'apparaît que si au moins une réalisation a une vidéo
const filterNames = PROJECTS.some((project) => videosOf(project).length > 0) ? [...CATEGORIES, "Vidéos"] : CATEGORIES;

filterBar.innerHTML = filterNames
    .map((name, index) => `
      <button class="btn ${index === 0 ? "btn-primary" : "border border-neutral-300"} filter-btn !py-2 !px-4"
              data-category="${name}" aria-pressed="${index === 0}">${name}</button>`)
    .join("");

filterBar.addEventListener("click", (event) => {
    const clicked = event.target.closest(".filter-btn");
    if (!clicked) return;

    // Bouton actif
    $$(".filter-btn").forEach((button) => {
        button.classList.remove("btn-primary");
        button.classList.add("border", "border-neutral-300");
        button.setAttribute("aria-pressed", "false");
    });
    clicked.classList.add("btn-primary");
    clicked.classList.remove("border", "border-neutral-300");
    clicked.setAttribute("aria-pressed", "true");

    // Cartes : on les estompe, puis on affiche ou masque selon la catégorie
    const wanted = clicked.dataset.category;

    $$("#grid .card").forEach((card) => {
        const project = PROJECTS[Number(card.dataset.index)];
        const matches =
            wanted === "Tous" ||
            (wanted === "Vidéos" ? videosOf(project).length > 0 : project.category === wanted);

        card.classList.add("is-fading");
        setTimeout(() => {
            card.classList.toggle("is-hidden", !matches);
            requestAnimationFrame(() => card.classList.remove("is-fading"));
        }, 250);
    });
});

// ---------------------------------------------------------------
// Modal plein écran
// ---------------------------------------------------------------
const modal = $("#modal");
let currentProject = null; // la réalisation ouverte
let mediaList = [];        // ses photos et vidéos
let mediaIndex = 0;        // le média affiché
let previousFocus = null;

const twoDigits = (n) => String(n).padStart(2, "0");

// Affiche le média courant (photo ou vidéo) et met à jour compteur et miniatures
function showMedia() {
    const media = mediaList[mediaIndex];
    const image = $("#modal-image");
    const video = $("#modal-video");

    video.pause();

    if (media.type === "video") {
        image.classList.add("hidden");
        video.classList.remove("hidden");
        video.poster = coverOf(currentProject);
        video.src = media.src;
    } else {
        video.classList.add("hidden");
        video.removeAttribute("src");
        image.classList.remove("hidden");
        applyImage(image, media);
    }

    $("#modal-counter").textContent = `${twoDigits(mediaIndex + 1)} / ${twoDigits(mediaList.length)}`;

    $$("#modal-thumbs .thumb").forEach((thumb, index) => {
        thumb.classList.toggle("is-active", index === mediaIndex);
        if (index === mediaIndex) thumb.scrollIntoView({ inline: "center", block: "nearest" });
    });
}

// Vidéo introuvable : cadre gris + avertissement dans la console
$("#modal-video").addEventListener("error", (event) => {
    if (!event.target.getAttribute("src")) return;

    console.warn("Vidéo introuvable :", event.target.getAttribute("src"));
    event.target.classList.add("hidden");
    applyImage($("#modal-image"), { src: PLACEHOLDER, alt: "Vidéo à venir" });
    $("#modal-image").classList.remove("hidden");
});

// Une miniature par média (les vidéos ont une icône lecture)
function buildThumbs() {
    $("#modal-thumbs").innerHTML = mediaList
        .map((media, index) => {
            const content = media.type === "video"
                ? `<span class="flex items-center justify-center w-full h-full bg-graphite"><i class="ri-play-fill text-2xl"></i></span>`
                : `<img src="${media.src}" alt="" class="w-full h-full object-cover" loading="lazy">`;

            return `<button class="thumb" data-index="${index}" aria-label="Média ${index + 1} sur ${mediaList.length}">${content}</button>`;
        })
        .join("");
}

function openModal(projectIndex) {
    currentProject = PROJECTS[projectIndex];
    mediaList = getMedia(currentProject);
    mediaIndex = 0;

    $("#modal-title").textContent = currentProject.title;
    $("#modal-category").textContent = currentProject.category;
    $("#modal-description").textContent = currentProject.description;

    // Avec un seul média, pas besoin de flèches ni de miniatures
    const single = mediaList.length < 2;
    $("#modal-prev").classList.toggle("hidden", single);
    $("#modal-next").classList.toggle("hidden", single);
    $("#modal-thumbs").classList.toggle("hidden", single);

    previousFocus = document.activeElement;
    modal.classList.replace("hidden", "flex");
    document.body.style.overflow = "hidden";

    buildThumbs();
    showMedia();
    $("#modal-close").focus();
}

function closeModal() {
    $("#modal-video").pause();
    modal.classList.replace("flex", "hidden");
    document.body.style.overflow = "";
    if (previousFocus) previousFocus.focus();
}

function isModalOpen() {
    return !modal.classList.contains("hidden");
}

// direction : -1 pour précédent, 1 pour suivant
function goToNeighbour(direction) {
    mediaIndex = (mediaIndex + direction + mediaList.length) % mediaList.length;
    showMedia();
}

$("#modal-thumbs").addEventListener("click", (event) => {
    const thumb = event.target.closest(".thumb");
    if (!thumb) return;

    mediaIndex = Number(thumb.dataset.index);
    showMedia();
});

$("#grid").addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card) openModal(Number(card.dataset.index));
});

$("#modal-close").addEventListener("click", closeModal);
$("#modal-prev").addEventListener("click", () => goToNeighbour(-1));
$("#modal-next").addEventListener("click", () => goToNeighbour(1));

// Clic en dehors de l'image = fermeture
modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.tagName === "FIGURE") closeModal();
});

// ---------------------------------------------------------------
// Vidéo d'accueil (facultative) : elle se règle avec HERO_VIDEO dans data.js.
// Pas de vidéo si HERO_VIDEO est vide ou si le visiteur préfère moins d'animations.
// ---------------------------------------------------------------
const heroVideo = $("#hero-video");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (HERO_VIDEO && !prefersReducedMotion) {
    heroVideo.addEventListener("error", () => heroVideo.remove());
    heroVideo.poster = IMAGES.hero.src;
    heroVideo.src = HERO_VIDEO;
} else {
    heroVideo.remove();
}

// ---------------------------------------------------------------
// Menu mobile
// ---------------------------------------------------------------
const menu = $("#menu");
const burger = $("#burger");

function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
}

burger.addEventListener("click", () => setMenu(true));
$("#menu-close").addEventListener("click", () => setMenu(false));
$$(".menu-link").forEach((link) => link.addEventListener("click", () => setMenu(false)));

// ---------------------------------------------------------------
// Clavier
// ---------------------------------------------------------------
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenu(false);
        if (isModalOpen()) closeModal();
    }

    if (isModalOpen()) {
        if (event.key === "ArrowLeft") goToNeighbour(-1);
        if (event.key === "ArrowRight") goToNeighbour(1);
    }
});

// ---------------------------------------------------------------
// Scroll : header, bouton retour en haut, lien actif
// ---------------------------------------------------------------
const header = $("#site-header");
const backToTop = $("#back-to-top");

function onScroll() {
    header.classList.toggle("is-solid", window.scrollY > 60);

    const showTopButton = window.scrollY > 800;
    backToTop.classList.toggle("hidden", !showTopButton);
    backToTop.classList.toggle("flex", showTopButton);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

// Le lien du menu correspond à la section au milieu de l'écran
const navLinks = $$("nav .nav-link");
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

["accueil", "apropos", "services", "realisations", "contact"].forEach((id) => {
    sectionObserver.observe(document.getElementById(id));
});

// Apparition douce des blocs au scroll (une seule fois par bloc)
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.12 }
);

$$(".reveal").forEach((element) => revealObserver.observe(element));

// ---------------------------------------------------------------
// Coordonnées affichées sur la page
// ---------------------------------------------------------------
const phoneHref = "tel:" + CONFIG.phone.replace(/[^\d+]/g, "");

$("#contact-phone").textContent = CONFIG.phone;
$("#contact-phone").href = phoneHref;
$("#contact-whatsapp").textContent = hasWhatsapp ? CONFIG.phone : "À CONFIGURER";
$("#contact-whatsapp").href = whatsappLink();
$("#contact-email").textContent = CONFIG.email;
$("#contact-email").href = `mailto:${CONFIG.email}`;
$("#contact-address").textContent = CONFIG.city;

$("#footer-address").textContent = CONFIG.city;
$("#footer-phone").textContent = CONFIG.phone;
$("#footer-whatsapp").textContent = "WhatsApp : " + (hasWhatsapp ? CONFIG.phone : "À CONFIGURER");

$("#whatsapp-button").href = whatsappLink("Bonjour GAROU SERVICES, je souhaite avoir des informations concernant un projet.");

// ---------------------------------------------------------------
// Formulaire de devis : validation, puis ouverture de WhatsApp
// Rien n'est envoyé à un serveur.
// ---------------------------------------------------------------
const quoteForm = $("#quote-form");

const rules = [
    {
        id: "form-name",
        isValid: (value) => value.length >= 2,
        message: "Indiquez votre nom complet."
    },
    {
        id: "form-phone",
        isValid: (value) => /^\+?[\d\s().-]{8,16}$/.test(value),
        message: "Saisissez un numéro valide (8 chiffres minimum)."
    },
    {
        id: "form-type",
        isValid: (value) => value !== "",
        message: "Choisissez un type de projet."
    },
    {
        id: "form-message",
        isValid: (value) => value.length >= 10,
        message: "Décrivez votre besoin en quelques mots."
    }
];

const valueOf = (id) => document.getElementById(id).value.trim();

function validateForm() {
    let allValid = true;

    rules.forEach((rule) => {
        const field = document.getElementById(rule.id);
        const valid = rule.isValid(valueOf(rule.id));

        field.classList.toggle("has-error", !valid);
        field.parentElement.querySelector(".field-error").textContent = valid ? "" : rule.message;
        if (!valid) allValid = false;
    });

    return allValid;
}

function buildMessage() {
    return [
        "Bonjour GAROU SERVICES,",
        "",
        "Je souhaite avoir des informations concernant un projet.",
        "",
        `Nom : ${valueOf("form-name")}`,
        `Téléphone : ${valueOf("form-phone")}`,
        `Type de projet : ${valueOf("form-type")}`,
        `Localisation : ${valueOf("form-location") || "Non précisée"}`,
        `Description : ${valueOf("form-message")}`,
        "",
        "Merci."
    ].join("\n");
}

quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    $("#form-success").classList.add("hidden");

    if (!validateForm()) {
        $(".has-error").focus(); // on amène l'utilisateur sur le premier champ à corriger
        return;
    }

    $("#form-success").classList.remove("hidden");
    window.open(whatsappLink(buildMessage()), "_blank", "noopener");
});

// ---------------------------------------------------------------
// Année du pied de page
// ---------------------------------------------------------------
$("#year").textContent = new Date().getFullYear();