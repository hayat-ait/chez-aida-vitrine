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

## 3. Gérer les produits et les stocks (Excel)

Le catalogue est géré dans **`catalogue.xlsx`**. C'est la source de vérité :
**Netlify régénère automatiquement `data/products.js` à partir de ce fichier**
à chaque déploiement.

> ⚠️ Ne modifie pas `data/products.js` à la main : il est écrasé à chaque build.

### Mettre à jour un stock (le plus courant)

1. Ouvre `catalogue.xlsx` (Excel, LibreOffice ou Google Sheets).
2. Va dans l'onglet **Produits**.
3. Trouve la ligne de l'article et la colonne de la taille (ex. `stock_40`).
4. Remplace la valeur :
   - **un nombre** = stock disponible ;
   - **`0`** = taille proposée mais **en rupture** ;
   - **vide** = taille **non proposée**.
5. Enregistre le fichier.
6. Envoie-le sur GitHub (voir « Envoyer le fichier » plus bas) → Netlify met le site à jour.

### Ajouter un produit

1. Ajoute une ligne dans l'onglet **Produits**.
2. Renseigne au minimum : `id`, `nom_fr`, `prix_mad`, `categorie`, `image_1`.
3. Choisis un `id` unique, en minuscules avec tirets (ex. `bab-013`, `sac-004`).
4. Remplis les colonnes de stock selon la catégorie :
   - **Babouches** : `stock_24` à `stock_45` ;
   - **Ceintures** : `stock_75cm` à `stock_105cm` ;
   - **Sacs, poufs, accessoires** : `taille_unique = OUI` et `stock_unique`.
5. Mets `mise_en_avant = OUI` si tu veux le voir en premier.
6. Enregistre et envoie le fichier sur GitHub.

### Colonnes importantes

| Colonne | Rôle |
|---|---|
| `id` | Identifiant unique (ex. `bab-013`) |
| `nom_fr` / `nom_en` | Nom en français / anglais (l'anglais est optionnel) |
| `description_fr` / `description_en` | Description (l'anglais est optionnel) |
| `prix_mad` | Prix en dirhams, nombre seul (ex. `250`) |
| `categorie` | `babouches`, `ceintures`, `sacs`, `poufs`, `accessoires` |
| `audience` | Pour les babouches uniquement : `femme`, `homme`, `enfant` |
| `couleur_fr` / `couleur_en` / `couleur_hex` | Couleur affichée et code hex |
| `image_1` / `image_2` | Chemin des photos dans `assets/img/products/` |
| `taille_unique` | `OUI` pour les articles sans taille (sacs, poufs…) |
| `mise_en_avant` | `OUI` pour le tri par défaut |
| `stock_*` | Stock par taille (voir ci-dessus) |

Règles automatiques :

- Stock `0` → taille en rupture ; produit en « Rupture » si plus aucune taille.
- Stock total 1 à 3 → badge « Stock limité ».
- Image vide ou introuvable → visuel « Photo à venir ».
- Une erreur dans le fichier (ID en double, prix manquant…) **bloque le build** :
  l'ancien site reste en ligne et le journal Netlify indique la ligne à corriger.

### Envoyer le fichier sur GitHub

**Option A — interface GitHub (recommandé)**

1. Ouvre <https://github.com/hayat-ait/chez-aida-vitrine>
2. **Add file → Upload files**
3. Glisse `catalogue.xlsx` (il remplace l'ancien)
4. **Commit changes**
5. Netlify redéploie automatiquement.

**Option B — en local**

```bash
cd /home/hayat/clients/vitrine
git add catalogue.xlsx
git commit -m "Mise à jour du catalogue"
git push
```

**Option C — transmets le fichier** à ton consultant : il le pousse pour toi.

### Aperçu local (optionnel)

```bash
python3 -m pip install openpyxl   # une seule fois
python3 tools/excel_to_products.py catalogue.xlsx data/products.js
python3 -m http.server 8080
```

### Exemple de rupture

Le produit `pouf-002` est volontairement à `stock_unique = 0` pour illustrer le
badge « Rupture » et le filtre de disponibilité.

---

## 4. Remplacer les photos

Les images actuelles (`assets/img/products/*.svg`) sont des **visuels d'exemple**
générés automatiquement.

Pour utiliser de vraies photos :

1. Déposer les photos dans `assets/img/products/` (idéalement carrées, ex. 1000 × 1000 px,
   format `.jpg` ou `.webp`).
2. Dans `catalogue.xlsx` (onglet **Produits**), colonne **`image_1`**, indiquer le chemin :
   `assets/img/products/ma-ceinture-1.jpg`
3. Une deuxième photo est possible dans `image_2` :
   `assets/img/products/ma-ceinture-2.jpg`
   (la première sert de vignette ; la galerie affiche actuellement la première image).
4. Envoyer `catalogue.xlsx` sur GitHub : le site se met à jour automatiquement.

Si `image_1` est vide ou si le fichier est introuvable, le site affiche le visuel
`assets/img/products/placeholder.svg` (« Photo à venir »).

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
- Dépôt GitHub connecté : `hayat-ait/chez-aida-vitrine` (branche `main`, dépôt public)

### Mettre à jour le site (déploiement automatique)

Chaque `git push` sur la branche `main` déclenche automatiquement un build Netlify :

```bash
cd /home/hayat/clients/vitrine
git add -A
git commit -m "Mise à jour du site"
git push
```

Netlify détecte le commit et redéploie en quelques secondes. Réglages du projet :
**build command vide** et **publish directory `.`** (défini dans `netlify.toml`).

### Déploiement manuel (secours)

1. Modifier les fichiers du dossier `vitrine/`.
2. Recréer l'archive :
   ```bash
   cd /home/hayat/clients/vitrine
   zip -qr /home/hayat/chezaida-site.zip .
   ```
3. Sur Netlify, ouvrir le projet `chez-aida` → onglet **Deploys** → glisser le ZIP
   (ou le dossier) dans la zone « Drag and drop your site output folder here ».

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
├── catalogue.xlsx             # SOURCE : produits, prix, tailles, stock (Excel)
├── tools/
│   └── excel_to_products.py   # convertit l'Excel en data/products.js
├── data/
│   ├── shop.js                # infos magasin (nom, WhatsApp, adresse…)
│   └── products.js            # GÉNÉRÉ depuis catalogue.xlsx (ne pas éditer)
├── assets/img/products/       # photos produits + placeholder.svg
├── netlify.toml               # configuration d'hébergement + build
└── README.md
```

---

## 9. Bonnes pratiques de mise à jour

- Toujours vérifier les **prix** et les **stocks** avant de publier.
- Quand un article est épuisé : mettre toutes ses tailles à `0` dans `catalogue.xlsx`
  (ou `taille_unique = OUI` + `stock_unique = 0`). Le badge « Rupture » s'affiche
  automatiquement.
- Éviter les photos trop lourdes : viser moins de 300 Ko par image
  (outil conseillé : <https://squoosh.app>).
- Tester le site sur téléphone : la majorité des visiteurs viendront du mobile.
- Le site met en avant l'**expérience du magasin** (plus de 30 ans, deux générations)
  et l'**origine Fès** des articles. Il ne faut pas écrire que le magasin fabrique
  les produits : il les sélectionne et les importe.
