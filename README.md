# Chez Aida — site vitrine

Site vitrine statique (HTML / CSS / JS, sans build) pour **Chez Aida**, maroquinerie
marocaine de l'ancienne médina de Casablanca : babouches, ceintures, sacs, poufs et
accessoires en cuir sélectionnés à Fès.

**Site en ligne : <https://chez-aida.netlify.app>**

Le magasin **ne fabrique pas** les articles : il les sélectionne et les importe de Fès.
Le site présente les pièces disponibles, leurs prix, tailles et photos, avec une commande
simple via WhatsApp — pensé pour les clients étrangers qui souhaitent rapporter un
souvenir du Maroc.

---

## 1. Aperçu local

Le site fonctionne en ouvrant simplement `index.html` dans un navigateur.
Pour un rendu proche de la production, vous pouvez aussi lancer un petit serveur local :

```bash
python3 -m http.server 8080
```

puis ouvrir <http://localhost:8080>.

---

## 2. Modifier les informations du magasin

Fichier : `data/shop.js`

```js
const SHOP = {
  name: "Chez Aida",
  whatsapp: "212611559841",   // format international, sans + ni espaces
  phone: "+212 6 11 55 98 41",
  email: "chezaida.casablanca@gmail.com",
  instagram: "chezaida.casablanca",
  ...
};
```

À mettre à jour en priorité :

| Champ         | Rôle                                                        |
|---------------|-------------------------------------------------------------|
| `name`        | Nom affiché dans l'en-tête et le pied de page               |
| `whatsapp`    | Numéro utilisé pour la commande (`212611559841`)            |
| `phone`       | Numéro affiché et cliquable                                 |
| `email`       | Adresse e-mail de contact                                   |
| `instagram` / `instagramUrl` | Compte Instagram                               |
| `address`, `city`, `mapsUrl` | Adresse et lien Google Maps                    |
| `hours`       | Horaires (traduits FR/EN)                                   |

### E-mail et Instagram

Le site est déjà configuré pour :

- **E-mail** : `chezaida.casablanca@gmail.com`
- **Instagram** : [@chezaida.casablanca](https://instagram.com/chezaida.casablanca)

Ces comptes **doivent être créés manuellement** (Gmail et Instagram demandent une
vérification par téléphone). Une fois créés avec ces identifiants exacts, le site
fonctionne sans modification. Si vous choisissez d'autres identifiants, mettez-les à
jour dans `data/shop.js`.

> Pensez aussi à mettre à jour le bloc **JSON-LD** (`<script type="application/ld+json">`)
> dans `index.html` (nom, téléphone, adresse) ainsi que les balises `og:title` / `og:description`.
> Ces informations servent au référencement et aux partages sur les réseaux sociaux.

---

## 3. Gérer les produits

Fichier : `data/products.js`

Catégories disponibles :

- **Babouches** (toutes)
- **Babouches femme** / **Babouches homme** / **Babouches enfant**
- **Ceintures**, **Sacs**, **Poufs**, **Accessoires**

Les babouches portent un champ `audience` (`femme`, `homme` ou `enfant`) qui alimente
les sous-catégories.

Chaque produit est un bloc :

```js
{
  id: "sac-004",                         // identifiant unique, sans espace
  name: { fr: "Nom en français", en: "English name" },
  description: { fr: "Texte FR", en: "English text" },
  price: 450,                            // prix en MAD (nombre)
  category: "sacs",                      // babouches | ceintures | sacs | poufs | accessoires
  audience: "femme",                     // uniquement pour les babouches : femme | homme | enfant
  images: ["assets/img/products/sac-004.jpg"],
  color: { fr: "Marron", en: "Brown", hex: "#6B4423" },
  sizes: [{ size: "one", stock: 5 }],    // ou des tailles réelles : "38", "90 cm"…
  oneSize: true,                         // true pour les articles sans taille
  featured: true                         // mis en avant dans le tri par défaut
}
```

Règles utiles :

- **Prix** : nombre seul (`450`, pas `"450 MAD"`), la devise vient de `SHOP.currency`.
- **Stock** : `0` affiche automatiquement la taille comme épuisée et le produit
  comme « Rupture » s'il n'y a plus aucune taille. Un stock total de 1 à 3 affiche
  « Stock limité ».
- **Articles sans taille** (sacs, poufs, portefeuilles…) : utiliser
  `sizes: [{ size: "one", stock: N }]` et `oneSize: true`. L'interface affiche
  « Taille unique » / « One size » et masque le sélecteur de taille.
- **Ceintures** : utilisez des tailles en centimètres (`"80 cm"`, `"85 cm"`…).
- **Ordre d'affichage** : le tri par défaut place les produits `featured: true` en premier.
- **Exemple de rupture** : le produit `pouf-002` est volontairement à `stock: 0`
  pour illustrer le badge « Rupture » et le filtre de disponibilité.

### Ajouter un produit

1. Ajouter la (les) photo(s) dans `assets/img/products/`.
2. Copier un bloc `{ ... }` existant, changer l'`id` et les informations.
3. Enregistrer, puis rafraîchir le site.

### Supprimer un produit

Supprimer son bloc `{ ... }` (attention à bien garder la virgule entre les blocs).

---

## 4. Remplacer les photos

Les images actuelles (`assets/img/products/*.svg`) sont des **visuels d'exemple**
générés automatiquement (une forme différente par type : babouche, ceinture, sac,
pouf, portefeuille).

Pour utiliser de vraies photos :

1. Déposer les photos dans `assets/img/products/` (idéalement carrées, ex. 1000 × 1000 px,
   format `.jpg` ou `.webp`).
2. Dans `data/products.js`, mettre à jour le chemin dans `images` :
   ```js
   images: ["assets/img/products/ma-ceinture-1.jpg"]
   ```
3. Plusieurs images sont possibles (la première sert de vignette) :
   ```js
   images: [
     "assets/img/products/ma-ceinture-1.jpg",
     "assets/img/products/ma-ceinture-2.jpg"
   ]
   ```
   La galerie du produit affiche actuellement la première image ; la structure est
   déjà prévue pour en ajouter d'autres.

---

## 5. Fonctionnement de la commande

- Le visiteur ajoute des articles (taille si nécessaire + quantité) au panier.
- Le panier est conservé dans le navigateur (`localStorage`).
- Le bouton **Commander sur WhatsApp** génère un message pré-rempli avec le détail
  des articles, les tailles, les quantités et le total, puis ouvre WhatsApp vers le
  numéro défini dans `data/shop.js`.
- Le bouton **Copier la commande** copie le même message dans le presse-papiers
  (utile si WhatsApp n'est pas installé).
- Aucun paiement en ligne n'est géré : la commande est confirmée par le magasin sur
  WhatsApp, y compris pour l'expédition internationale.

---

## 6. Langues (FR / EN)

- Les textes de l'interface sont dans `js/i18n.js` (objets `fr` et `en`).
- Les textes produits sont dans les champs `{ fr: ..., en: ... }` de `data/products.js`.
- Le choix de langue est mémorisé dans le navigateur.
- Au premier visite, le site s'affiche en **français** si le navigateur est en français,
  sinon en **anglais** (utile pour les clients étrangers).
- Le bouton FR / EN se trouve dans l'en-tête.

Pour ajouter une langue, dupliquer l'objet `fr` dans `js/i18n.js`, ajouter les champs
de la nouvelle langue dans les produits et compléter le sélecteur dans `index.html`.

---

## 7. Mise en ligne sur Netlify (gratuit)

Le site est **déjà en ligne** sur Netlify :

- URL : **<https://chez-aida.netlify.app>**
- Projet Netlify : `chez-aida`
- Le déploiement est un envoi de fichiers (pas de build, pas de dépôt Git connecté).

### Mettre à jour le site

1. Modifier les fichiers du dossier `vitrine/`.
2. Recréer l'archive :
   ```bash
   cd /home/hayat/clients/vitrine
   zip -qr /home/hayat/chezaida-site.zip .
   ```
3. Sur Netlify, ouvrir le projet `chez-aida` → onglet **Deploys** → glisser le ZIP
   (ou le dossier) dans la zone « Drag and drop your site output folder here ».
4. Le site est mis à jour en quelques secondes.

Alternative : pousser le dossier sur GitHub puis connecter le dépôt au projet Netlify
pour des mises à jour automatiques.

### Domaine personnalisé

L'adresse `*.netlify.app` est gratuite mais contient encore « netlify ». Pour une adresse
100 % au nom du shop (ex. `chezaida.ma` ou `chezaida.com`) :

1. Acheter le domaine chez un registrar (OVH, Namecheap, Genious pour le `.ma`…).
2. Netlify : **Site settings → Domain management → Add custom domain**.
3. Suivre les instructions DNS (Netlify DNS ou enregistrements CNAME/A).

Un domaine `.ma` est généralement plus cher qu'un `.com` ; comptez environ
120–500 MAD/an selon l'extension.

---

## 8. Structure du projet

```
vitrine/
├── index.html                 # page unique (hero, catalogue, à propos, contact)
├── css/styles.css             # thème et responsive
├── js/
│   ├── i18n.js                # traductions FR/EN + gestion de langue
│   ├── cart.js                # panier, stock, commande WhatsApp
│   └── app.js                 # catalogue, filtres, modal, interactions
├── data/
│   ├── shop.js                # infos magasin (nom, WhatsApp, adresse…)
│   └── products.js            # produits, catégories, prix, tailles, stock
├── assets/img/products/       # photos produits (SVG d'exemple au départ)
├── netlify.toml               # configuration d'hébergement
└── README.md
```

---

## 9. Bonnes pratiques de mise à jour

- Toujours vérifier les **prix** et les **stocks** avant de publier.
- Quand un article est épuisé : mettre toutes ses tailles à `stock: 0`
  (le badge « Rupture » s'affiche automatiquement).
- Éviter les photos trop lourdes : viser moins de 300 Ko par image
  (outil conseillé : <https://squoosh.app>).
- Tester le site sur téléphone : la majorité des visiteurs viendront du mobile.
- Le site met en avant l'**expérience du magasin** (plus de 30 ans, deux générations)
  et l'**origine Fès** des articles. Il ne faut pas écrire que le magasin fabrique
  les produits : il les sélectionne et les importe.
