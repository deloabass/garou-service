/*
  GAROU SERVICES - données du site

  C'est le seul fichier à modifier pour changer les images, les réalisations,
  les services ou les coordonnées. La logique du site est dans app.js.

  Les chemins sont relatifs à index.html. Exemple : "images/hero.jpg"
  Si une image est introuvable, un cadre gris "Photo à venir" s'affiche et le
  chemin manquant est signalé dans la console du navigateur (touche F12).
*/

// ---------------------------------------------------------------
// Coordonnées (issues de la carte de visite)
// ---------------------------------------------------------------
const CONFIG = {
    companyName: "GAROU SERVICES STRUCTURE MÉTALLIQUE",
    city: "Saguia, Rive Droite, Niamey, Niger",
    phone: "+227 96 63 66 87",
    whatsapp: "22796636687", // format international, sans "+" ni espaces
    email: "isoufouabdouharouna@gmail.com"
};

// ---------------------------------------------------------------
// Images fixes de la page
// Chaque clé correspond à un attribut data-image="..." dans index.html.
// Exemple : <img data-image="hero" class="..."> reçoit src, alt, width et height d'ici.
// ---------------------------------------------------------------
const IMAGES = {
    logo: {
        src: "images/logo.jpeg",
        alt: "GAROU SERVICES",
        width: 96,
        height: 96
    },
    hero: {
        src: "images/hero.jpg",
        alt: "Charpente métallique d'un hangar",
        width: 1600,
        height: 1000
    },
    aboutMain: {
        src: "images/aboutOverlay.jpeg",
        alt: "Structure métallique en cours d'assemblage",
        width: 800,
        height: 1000
    },
    aboutDetail: {
        src: "images/about1.jpeg",
        alt: "Détail d'assemblage d'une poutre métallique",
        width: 500,
        height: 500
    },
    field: {
        src: "images/terrain.jpeg",
        alt: "Grande charpente métallique sur le terrain",
        width: 1600,
        height: 900
    }
};

// Vidéo d'ambiance de l'accueil (facultative). Laisser vide pour ne pas en mettre.
// Exemple : "videos/hero.mp4"
const HERO_VIDEO = "videos/hero.mp4";

// ---------------------------------------------------------------
// Services
// ---------------------------------------------------------------
const SERVICES = [
    {
        title: "Construction moderne",
        text: "Réalisation de projets de construction modernes, adaptés aux besoins et aux exigences de chaque client.",
        image: {
            src: "images/services/construction-moderne.jpg",
            alt: "Construction moderne de bâtiments"
        }
    },
    {
        title: "Construction métallique",
        text: "Conception et réalisation de structures métalliques destinées aux bâtiments, hangars et infrastructures.",
        image: {
            src: "images/services/construction-metallique.jpg",
            alt: "Construction de structures métalliques"
        }
    },
    {
        title: "Montage de structures métalliques",
        text: "Assemblage et installation de structures métalliques sur site, selon les caractéristiques de chaque projet.",
        image: {
            src: "images/services/montage.jpg",
            alt: "Montage de structures métalliques"
        }
    },
    {
        title: "Travaux publics",
        text: "Intervention dans les travaux d'aménagement et la réalisation d'infrastructures publiques.",
        image: {
            src: "images/services/travaux-publics.jpg",
            alt: "Travaux publics et aménagement"
        }
    },
    {
        title: "Génie civil",
        text: "Réalisation de travaux de génie civil pour répondre aux besoins des projets de construction et d'infrastructure.",
        image: {
            src: "images/services/genie-civil.jpg",
            alt: "Travaux de génie civil"
        }
    }
];

// ---------------------------------------------------------------
// Réalisations
//
// Chaque réalisation contient ses propres photos et vidéos :
//
//   title        titre affiché sur la vignette
//   category     doit correspondre à une catégorie de CATEGORIES (plus bas)
//   description  courte phrase
//   images       la liste des photos. La 1re sert de vignette dans la grille.
//   videos       facultatif : la liste des vidéos (ex. ["videos/hangar-1.mp4"])
//   cover        facultatif : une autre image pour la vignette
//   span         taille de la vignette dans la grille
//
// Au clic sur une vignette, toutes les photos puis les vidéos s'ouvrent dans
// une galerie plein écran (avec flèches, miniatures et compteur).
//
// Pour ajouter une réalisation : copiez un bloc { ... } et changez les valeurs.
// Pour ajouter une photo : ajoutez une ligne dans "images". Idem pour "videos".
// ---------------------------------------------------------------
const PROJECTS = [
    {
        title: "Hangar métallique",
        category: "Hangars",
        description: "Structure destinée à un espace de stockage.",
        images: [
            "images/realisations/hangar-1.jpg",
            "images/realisations/hangar-2.jpg",
            "images/realisations/hangar-3.jpg",
            "images/realisations/hangar-4.webp",
        ],
        span: "col-span-2 row-span-2"
    },
    {
        title: "Entrepôt logistique",
        category: "Entrepôts",
        description: "Bâtiment de stockage à portiques.",
        images: [
            "images/realisations/entrepot-1.webp",
            "images/realisations/entrepot-2.webp",
            "images/realisations/entrepot-3.webp",
        ],
        span: "col-span-1 row-span-1"
    },
    {
        title: "Charpente de toiture",
        category: "Charpentes",
        description: "Ferme et pannes de couverture.",
        images: [
            "images/realisations/charpente-1.jpg",
            "images/realisations/charpente-2.jpg",
        ],
        span: "col-span-1 row-span-2"
    },
    {
        title: "Structure industrielle",
        category: "Structures métalliques",
        description: "Ossature acier de bâtiment industriel.",
        images: [
            "images/realisations/structure-1.jpg",
            "images/realisations/structure-2.jpg",
            "images/realisations/structure-3.jpg"
        ],
        span: "col-span-1 row-span-1"
    },
    {
        title: "Chantier de montage",
        category: "Chantiers",
        description: "Montage de structure sur site.",
        images: [
            "images/realisations/chantier-1.webp",
            "images/realisations/chantier-2.webp",
            "images/realisations/chantier-3.jfif"
        ],
        span: "col-span-2 row-span-1"
    },
    {
        title: "Grand hangar",
        category: "Hangars",
        description: "Vue générale d'un grand volume couvert.",
        images: [
            "images/realisations/hangar-1-g.webp",
            "images/realisations/hangar-2-g.jpg",
            "images/realisations/hangar-3-g.jpg"
        ],
        span: "col-span-1 row-span-1"
    },
    {
        title: "Entrepôt de stockage",
        category: "Entrepôts",
        description: "Nef métallique pour le stockage.",
        images: [
            "images/realisations/entrepot-1-s.webp",
            "images/realisations/entrepot-2-s.webp",
            "images/realisations/entrepot-1-s.jpg"
        ],
        span: "col-span-1 row-span-1"
    },
    {
        title: "Charpente à fermes",
        category: "Charpentes",
        description: "Fermes triangulées.",
        images: [
            "images/realisations/charpente-1-f.jpg",
            "images/realisations/charpente-2-f.jpg",
        ],
        span: "col-span-2 row-span-1"
    }
];

// Catégories affichées dans les filtres (doivent correspondre aux "category" ci-dessus)
const CATEGORIES = ["Tous", "Hangars", "Entrepôts", "Charpentes", "Structures métalliques", "Chantiers"];

// ---------------------------------------------------------------
// Galerie en mosaïque ("Le métal en détail")
// ratio : proportion de l'image (les formats variés donnent l'effet mosaïque)
// ---------------------------------------------------------------
const GALLERY = [
    { image: { src: "images/galerie/detail-1.jpeg", alt: "Assemblage boulonné" }, ratio: "aspect-[3/4]" },
    { image: { src: "images/galerie/detail-2.jpeg", alt: "Poutre en I" }, ratio: "aspect-[4/3]" },
    { image: { src: "images/galerie/detail-3.jpeg", alt: "Soudure" }, ratio: "aspect-square" },
    { image: { src: "images/galerie/detail-4.jpeg", alt: "Chantier" }, ratio: "aspect-[3/5]" },
    { image: { src: "images/galerie/detail-5.jpeg", alt: "Structure terminée" }, ratio: "aspect-[16/10]" },
    { image: { src: "images/galerie/detail-6.jpeg", alt: "Vue générale" }, ratio: "aspect-[4/5]" }
];