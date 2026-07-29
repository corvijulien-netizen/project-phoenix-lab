# Project Phoenix Lab

Environnement public de test et de développement de **Project Phoenix**.

- Site Lab : https://corvijulien-netizen.github.io/project-phoenix-lab/
- Site officiel : https://corvijulien-netizen.github.io/project-phoenix/
- Figma : https://www.figma.com/design/fdV1J0UoXkfHd4ABXBbPO4

## Règle principale

Le dépôt officiel n’est jamais modifié pendant une expérimentation. Toutes les idées sont d’abord développées et validées ici.

Point de restauration créé avant la refonte :

```text
backup-before-full-redesign-2026-07-30
```

## Architecture

```text
index.html                  Charge la page officielle puis applique le Lab
details.html                Charge les détails officiels puis applique le Lab
lab.css                     Direction artistique et responsive du Lab
lab.js                      Avatars, Phoenix Pulse, calendrier et insights
assets/avatars/             Avatars publics et optimisés
manifest.webmanifest        Installation mobile
sw.js                       Cache léger du Lab
.github/workflows/          Publication GitHub Pages
```

## Expérimentations actives

- Phoenix principal animé dans le héros
- sept avatars thématiques
- Phoenix Pulse et score animé
- objectifs Activité, Sommeil et premier palier
- calendrier de régularité sur 365 jours
- trajectoire vers 110, 105, 100, 90 et 80 kg
- premiers trophées
- contexte enrichi dans les pages détaillées
- expérience mobile à une main
- respect de `prefers-reduced-motion`
- aucune donnée manquante inventée

## Sources de données

Le Lab reprend les données publiées par le site officiel. Les données complètes Apple Santé, les fichiers RENPHO et les photos privées ne sont pas exposés dans ce dépôt.

## Retour arrière

Pour revenir au Lab initial, repositionner `main` ou `gh-pages` sur la branche de sauvegarde. Le site officiel reste indépendant de cette opération.
