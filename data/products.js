/* ============================================================
   CATALOGUE DES PRODUITS
   ------------------------------------------------------------
   Pour ajouter un produit, copie un bloc { ... } et adapte :
   - id        : identifiant unique (pas d'espace) ex. "sac-004"
   - name      : nom en français et en anglais
   - description : texte en français et en anglais
   - price     : prix en dirhams (nombre, sans "MAD")
   - category  : "babouches" | "ceintures" | "sacs" | "poufs" | "accessoires"
   - images    : liste de chemins d'images (la 1re sert de vignette)
   - color     : couleur principale affichée
   - sizes     : liste des tailles avec le stock disponible (0 = rupture)
   - oneSize   : true pour les articles sans taille (sacs, poufs, accessoires)
   - featured  : true pour mettre en avant dans le tri par défaut
   ============================================================ */

const CATEGORIES = [
  { id: "all", label: { fr: "Tout", en: "All" } },
  { id: "babouches", label: { fr: "Babouches", en: "Babouches" } },
  { id: "babouches-femme", label: { fr: "Babouches femme", en: "Women's babouches" } },
  { id: "babouches-homme", label: { fr: "Babouches homme", en: "Men's babouches" } },
  { id: "babouches-enfant", label: { fr: "Babouches enfant", en: "Kids' babouches" } },
  { id: "ceintures", label: { fr: "Ceintures", en: "Belts" } },
  { id: "sacs", label: { fr: "Sacs", en: "Bags" } },
  { id: "poufs", label: { fr: "Poufs", en: "Poufs" } },
  { id: "accessoires", label: { fr: "Accessoires", en: "Accessories" } }
];

const PRODUCTS = [
  /* ---------------------- BABOUCHES ---------------------- */
  {
    id: "bab-001",
    name: { fr: "Babouche Classique Marron", en: "Classic Brown Babouche" },
    description: {
      fr: "La babouche intemporelle en cuir souple, sélectionnée à Fès. Confort immédiat et semelle en cuir naturel.",
      en: "The timeless babouche in soft leather, selected in Fez. Immediate comfort with a natural leather sole."
    },
    price: 250,
    category: "babouches",
    audience: "femme",
    images: ["assets/img/products/bab-001.svg"],
    color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
    sizes: [
      { size: "36", stock: 3 }, { size: "37", stock: 6 }, { size: "38", stock: 5 },
      { size: "39", stock: 2 }, { size: "40", stock: 0 }, { size: "41", stock: 4 }
    ],
    featured: true
  },
  {
    id: "bab-002",
    name: { fr: "Babouche Brodée de Fès", en: "Fassi Embroidered Babouche" },
    description: {
      fr: "Broderie traditionnelle fassie au fil doré sur velours rouge profond. Une pièce élégante importée de Fès.",
      en: "Traditional Fassi embroidery with golden thread on deep red velvet. An elegant piece imported from Fez."
    },
    price: 320,
    category: "babouches",
    audience: "femme",
    images: ["assets/img/products/bab-002.svg"],
    color: { fr: "Rouge & Or", en: "Red & Gold", hex: "#8E2F2F" },
    sizes: [
      { size: "36", stock: 2 }, { size: "37", stock: 1 }, { size: "38", stock: 4 },
      { size: "39", stock: 3 }, { size: "40", stock: 2 }, { size: "41", stock: 0 }
    ],
    featured: true
  },
  {
    id: "bab-003",
    name: { fr: "Babouche Homme Camel", en: "Men's Camel Babouche" },
    description: {
      fr: "Cuir camel pleine fleur, semelle renforcée et finitions soignées. Une babouche homme robuste qui se patine avec le temps.",
      en: "Full-grain camel leather, reinforced sole and careful finishing. A sturdy men's babouche that ages beautifully."
    },
    price: 380,
    category: "babouches",
    audience: "homme",
    images: ["assets/img/products/bab-003.svg"],
    color: { fr: "Camel", en: "Camel", hex: "#A9744F" },
    sizes: [
      { size: "40", stock: 4 }, { size: "41", stock: 5 }, { size: "42", stock: 6 },
      { size: "43", stock: 3 }, { size: "44", stock: 2 }, { size: "45", stock: 0 }
    ],
    featured: true
  },
  {
    id: "bab-004",
    name: { fr: "Babouche Velours Émeraude", en: "Emerald Velvet Babouche" },
    description: {
      fr: "Velours émeraude et doublure coton respirante. Une couleur profonde qui sublime les tenues de soirée.",
      en: "Emerald velvet with a breathable cotton lining. A deep colour that elevates evening outfits."
    },
    price: 350,
    category: "babouches",
    audience: "femme",
    images: ["assets/img/products/bab-004.svg"],
    color: { fr: "Émeraude", en: "Emerald", hex: "#1F5C4A" },
    sizes: [
      { size: "37", stock: 2 }, { size: "38", stock: 1 }, { size: "39", stock: 3 },
      { size: "40", stock: 2 }, { size: "41", stock: 1 }
    ],
    featured: false
  },
  {
    id: "bab-005",
    name: { fr: "Babouche Enfant Rose", en: "Kids Pink Babouche" },
    description: {
      fr: "Petite babouche toute douce en cuir rose, semelle souple et légère. Facile à enfiler par les enfants.",
      en: "A soft little pink leather babouche with a flexible, light sole. Easy for children to slip on."
    },
    price: 150,
    category: "babouches",
    audience: "enfant",
    images: ["assets/img/products/bab-005.svg"],
    color: { fr: "Rose", en: "Pink", hex: "#D98FA3" },
    sizes: [
      { size: "24", stock: 5 }, { size: "26", stock: 4 }, { size: "28", stock: 3 },
      { size: "30", stock: 2 }, { size: "32", stock: 0 }, { size: "34", stock: 2 }
    ],
    featured: false
  },
  {
    id: "bab-006",
    name: { fr: "Babouche Enfant Bleue", en: "Kids Blue Babouche" },
    description: {
      fr: "Cuir bleu résistant et semelle antidérapante : parfaite pour les petits explorateurs.",
      en: "Durable blue leather with a non-slip sole: perfect for little explorers."
    },
    price: 150,
    category: "babouches",
    audience: "enfant",
    images: ["assets/img/products/bab-006.svg"],
    color: { fr: "Bleu", en: "Blue", hex: "#3E6C9B" },
    sizes: [
      { size: "24", stock: 3 }, { size: "26", stock: 2 }, { size: "28", stock: 4 },
      { size: "30", stock: 1 }, { size: "32", stock: 2 }, { size: "34", stock: 1 }
    ],
    featured: false
  },
  {
    id: "bab-007",
    name: { fr: "Babouche Homme Noire", en: "Men's Black Babouche" },
    description: {
      fr: "Babouche homme en cuir noir lisse, discrète et élégante. Un classique intemporel pour le quotidien comme pour les cérémonies.",
      en: "Men's babouche in smooth black leather, understated and elegant. A timeless classic for everyday wear and ceremonies."
    },
    price: 360,
    category: "babouches",
    audience: "homme",
    images: ["assets/img/products/bab-007.svg"],
    color: { fr: "Noir", en: "Black", hex: "#221C18" },
    sizes: [
      { size: "40", stock: 3 }, { size: "41", stock: 4 }, { size: "42", stock: 5 },
      { size: "43", stock: 3 }, { size: "44", stock: 2 }, { size: "45", stock: 1 }
    ],
    featured: false
  },
  {
    id: "bab-008",
    name: { fr: "Babouche Velours Bordeaux", en: "Bordeaux Velvet Babouche" },
    description: {
      fr: "Velours bordeaux profond et doublure coton. Une babouche raffinée qui apporte une touche de couleur aux tenues de soirée.",
      en: "Deep bordeaux velvet with a cotton lining. A refined babouche that adds a touch of colour to evening outfits."
    },
    price: 350,
    category: "babouches",
    audience: "femme",
    images: ["assets/img/products/bab-008.svg"],
    color: { fr: "Bordeaux", en: "Bordeaux", hex: "#6E2233" },
    sizes: [
      { size: "37", stock: 2 }, { size: "38", stock: 3 }, { size: "39", stock: 2 },
      { size: "40", stock: 2 }, { size: "41", stock: 1 }
    ],
    featured: false
  },

  /* ---------------------- CEINTURES ---------------------- */
  {
    id: "cei-001",
    name: { fr: "Ceinture Cuir Tressé", en: "Braided Leather Belt" },
    description: {
      fr: "Ceinture en cuir tressé à la main, boucle en laiton. Un grand classique de la maroquinerie de Fès.",
      en: "Hand-braided leather belt with a brass buckle. A great classic of Fez leather craftsmanship."
    },
    price: 220,
    category: "ceintures",
    images: ["assets/img/products/cei-001.svg"],
    color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
    sizes: [
      { size: "80 cm", stock: 4 }, { size: "85 cm", stock: 5 }, { size: "90 cm", stock: 4 },
      { size: "95 cm", stock: 2 }, { size: "100 cm", stock: 1 }
    ],
    featured: true
  },
  {
    id: "cei-002",
    name: { fr: "Ceinture Camel Boucle Laiton", en: "Camel Belt with Brass Buckle" },
    description: {
      fr: "Cuir camel pleine fleur et boucle en laiton massif. Une ceinture élégante qui s'accorde à toutes les tenues.",
      en: "Full-grain camel leather with a solid brass buckle. An elegant belt that matches any outfit."
    },
    price: 260,
    category: "ceintures",
    images: ["assets/img/products/cei-002.svg"],
    color: { fr: "Camel", en: "Camel", hex: "#A9744F" },
    sizes: [
      { size: "80 cm", stock: 3 }, { size: "85 cm", stock: 4 }, { size: "90 cm", stock: 5 },
      { size: "95 cm", stock: 3 }, { size: "100 cm", stock: 2 }, { size: "105 cm", stock: 1 }
    ],
    featured: false
  },
  {
    id: "cei-003",
    name: { fr: "Ceinture Fine Noire", en: "Slim Black Belt" },
    description: {
      fr: "Ceinture fine en cuir noir lisse, discrète et raffinée. Idéale avec un pantalon ou une robe.",
      en: "Slim smooth black leather belt, understated and refined. Ideal with trousers or a dress."
    },
    price: 180,
    category: "ceintures",
    images: ["assets/img/products/cei-003.svg"],
    color: { fr: "Noir", en: "Black", hex: "#221C18" },
    sizes: [
      { size: "75 cm", stock: 2 }, { size: "80 cm", stock: 3 }, { size: "85 cm", stock: 4 },
      { size: "90 cm", stock: 3 }, { size: "95 cm", stock: 1 }
    ],
    featured: false
  },

  /* ------------------------- SACS ------------------------- */
  {
    id: "sac-001",
    name: { fr: "Cabas Cuir Camel", en: "Camel Leather Tote" },
    description: {
      fr: "Grand cabas en cuir camel, spacieux et solide. Parfait pour le marché, la plage ou le retour de voyage.",
      en: "Large camel leather tote, roomy and sturdy. Perfect for the market, the beach or the trip home."
    },
    price: 650,
    category: "sacs",
    images: ["assets/img/products/sac-001.svg"],
    color: { fr: "Camel", en: "Camel", hex: "#A9744F" },
    sizes: [{ size: "one", stock: 6 }],
    oneSize: true,
    featured: true
  },
  {
    id: "sac-002",
    name: { fr: "Sac Bandoulière Marron", en: "Brown Shoulder Bag" },
    description: {
      fr: "Sac bandoulière en cuir marron, format pratique pour les essentiels. Bandoulière réglable et finitions soignées.",
      en: "Brown leather shoulder bag, a practical size for the essentials. Adjustable strap and careful finishing."
    },
    price: 520,
    category: "sacs",
    images: ["assets/img/products/sac-002.svg"],
    color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
    sizes: [{ size: "one", stock: 8 }],
    oneSize: true,
    featured: false
  },
  {
    id: "sac-003",
    name: { fr: "Pochette Cuir Naturel", en: "Natural Leather Clutch" },
    description: {
      fr: "Petite pochette en cuir naturel, à glisser dans une valise ou à porter en soirée. Fermeture par rabat.",
      en: "Small natural leather clutch, easy to pack in a suitcase or carry in the evening. Flap closure."
    },
    price: 320,
    category: "sacs",
    images: ["assets/img/products/sac-003.svg"],
    color: { fr: "Naturel", en: "Natural", hex: "#C9A97A" },
    sizes: [{ size: "one", stock: 5 }],
    oneSize: true,
    featured: false
  },

  /* ------------------------- POUFS ------------------------ */
  {
    id: "pouf-001",
    name: { fr: "Pouf Cuir Tressé Marron", en: "Brown Braided Leather Pouf" },
    description: {
      fr: "Pouf en cuir tressé marron, rembourré et confortable. Une pièce artisanale qui apporte la chaleur du Maroc à la maison.",
      en: "Brown braided leather pouf, padded and comfortable. An artisan piece that brings Moroccan warmth home."
    },
    price: 850,
    category: "poufs",
    images: ["assets/img/products/pouf-001.svg"],
    color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
    sizes: [{ size: "one", stock: 3 }],
    oneSize: true,
    featured: true
  },
  {
    id: "pouf-002",
    name: { fr: "Pouf Cuir Blanc Ivoire", en: "Ivory Leather Pouf" },
    description: {
      fr: "Pouf en cuir blanc ivoire, coutures apparentes et base solide. Élégant et intemporel.",
      en: "Ivory white leather pouf with visible stitching and a solid base. Elegant and timeless."
    },
    price: 900,
    category: "poufs",
    images: ["assets/img/products/pouf-002.svg"],
    color: { fr: "Blanc ivoire", en: "Ivory", hex: "#D9CFC0" },
    sizes: [{ size: "one", stock: 0 }],
    oneSize: true,
    featured: false
  },

  /* --------------------- ACCESSOIRES ---------------------- */
  {
    id: "acc-001",
    name: { fr: "Portefeuille Cuir", en: "Leather Wallet" },
    description: {
      fr: "Portefeuille en cuir souple avec plusieurs compartiments. Un souvenir utile et durable du Maroc.",
      en: "Soft leather wallet with several compartments. A useful and lasting souvenir from Morocco."
    },
    price: 180,
    category: "accessoires",
    images: ["assets/img/products/acc-001.svg"],
    color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
    sizes: [{ size: "one", stock: 10 }],
    oneSize: true,
    featured: true
  },
  {
    id: "acc-002",
    name: { fr: "Porte-clés Cuir Tressé", en: "Braided Leather Keyring" },
    description: {
      fr: "Petit porte-clés en cuir tressé, à offrir ou à garder en souvenir. Disponible en plusieurs coloris.",
      en: "Small braided leather keyring, to give as a gift or keep as a souvenir. Available in several colours."
    },
    price: 80,
    category: "accessoires",
    images: ["assets/img/products/acc-002.svg"],
    color: { fr: "Naturel", en: "Natural", hex: "#C9A97A" },
    sizes: [{ size: "one", stock: 15 }],
    oneSize: true,
    featured: false
  }
];
