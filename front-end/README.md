# Voisilab - Site Vitrine Fablab

Une application web moderne et professionnelle pour Voisilab, un fablab innovant qui démocratise la fabrication numérique depuis 2019.

## 🚀 Fonctionnalités

### Sections principales

- **Hero Section** : Présentation impactante avec statistiques clés
- **À propos** : Valeurs et mission du fablab
- **Équipements** : Catalogue complet des machines disponibles (imprimantes 3D, découpeuse laser, CNC, etc.)
- **Ateliers & Événements** : Système d'onglets pour formations, ateliers créatifs et événements
- **Innovations** : Galerie de projets réalisés par la communauté avec système de likes
- **Équipe** : Présentation de l'équipe principale et des jeunes talents
- **Formulaire de projet** : Système complet de soumission de demandes avec validation
- **Footer** : Informations de contact et liens réseaux sociaux

### Technologies utilisées

- **Next.js 16** avec App Router
- **React 19** avec TypeScript
- **Tailwind CSS v4** pour le styling
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes
- Design système moderne avec thème sombre et accent orange

## 🎨 Design

Le design s'inspire des codes visuels de l'innovation technologique :
- Fond sombre élégant (bleu-gris très foncé)
- Accent orange vif pour les CTAs et éléments interactifs
- Typographie moderne avec la police Geist
- Animations et transitions fluides
- Responsive design mobile-first

## 📁 Structure du projet

\`\`\`
voisilab/
├── app/
│   ├── layout.tsx          # Layout principal avec métadonnées SEO
│   ├── page.tsx            # Page d'accueil assemblant toutes les sections
│   └── globals.css         # Thème et styles globaux
├── components/
│   ├── navigation.tsx      # Barre de navigation sticky
│   ├── hero-section.tsx    # Section hero avec CTA
│   ├── about-section.tsx   # Présentation des valeurs
│   ├── equipment-section.tsx           # Catalogue équipements
│   ├── workshops-section.tsx           # Ateliers avec tabs
│   ├── innovations-section.tsx         # Galerie projets
│   ├── team-section.tsx               # Équipe et talents
│   ├── project-request-section.tsx    # Formulaire projet
│   ├── footer.tsx          # Footer complet
│   ├── section-header.tsx  # Composant réutilisable pour en-têtes
│   └── ui/                # Composants UI shadcn
└── public/                # Images générées
\`\`\`

## 🛠️ Installation

1. Téléchargez le projet
2. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
3. Lancez le serveur de développement :
   \`\`\`bash
   npm run dev
   \`\`\`
4. Ouvrez [http://localhost:3000](http://localhost:3000)

## 🚀 Déploiement

Le projet est prêt à être déployé sur Vercel :

\`\`\`bash
npm run build
\`\`\`

## 📝 Personnalisation

### Modifier les couleurs

Éditez `app/globals.css` pour ajuster le thème :
- `--primary` : Couleur principale (orange)
- `--background` : Fond de page
- `--foreground` : Texte principal
- Etc.

### Ajouter du contenu

- **Équipements** : Modifiez le tableau `equipment` dans `components/equipment-section.tsx`
- **Ateliers** : Éditez les tableaux dans `components/workshops-section.tsx`
- **Projets** : Modifiez `projects` dans `components/innovations-section.tsx`
- **Équipe** : Adaptez les données dans `components/team-section.tsx`

## 📱 Responsive

Le site est entièrement responsive avec des breakpoints :
- Mobile : < 768px
- Tablet : 768px - 1024px
- Desktop : > 1024px

## ✨ Fonctionnalités avancées

- Navigation sticky avec backdrop blur
- Système d'onglets interactif pour les ateliers
- Système de likes pour les projets
- Formulaire avec validation et état de succès
- Animations au hover sur tous les éléments interactifs
- Images générées automatiquement avec placeholder intelligent

## 📄 License

Tous droits réservés - Voisilab 2024

---

**Développé avec ❤️ pour la communauté maker**
