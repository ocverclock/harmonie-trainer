# Audit du suivi des acquis et de la sauvegarde — Harmonie Trainer

**Date : 17 octobre 2026 — Analyse uniquement ; aucun changement de stockage appliqué.**  
**Issue :** [#6 — suivi, reprise, export/import](https://github.com/ocverclock/harmonie-trainer/issues/6).  
**Sources :** `src/curriculum-ui.js`, `src/app.js`, `src/voicing-ui.js` et `src/curriculum.js` sur `main`.

## 1. État réel de l'application

| Fonction | Réalisation actuelle | Limite constatée |
| --- | --- | --- |
| Parcours des 21 leçons | `localStorage["harmonie-parcours-v1"]` ; clé `lesson.id + ":" + exerciseIndex` | Un réordonnancement d'exercices peut associer une ancienne réussite au mauvais exercice |
| Champs enregistrés | `correct` cumulatif, `attempts`, `at` (dernière tentative) | Aucune réponse jouée, tonalité, première réussite, difficulté, contexte de leçon ou dernier exercice ouvert |
| Validation / répétition | `correct = previous.correct || latest.correct` | Une réussite ancienne reste définitivement affichée malgré des erreurs plus récentes ; pas de distinction maîtrise / connaissance ponctuelle |
| Reprendre | Première leçon avec un exercice non marqué correct | Ce n'est pas « là où je me suis arrêté » ; même une leçon partiellement suivie n'est pas forcément restaurée à l'exercice actif |
| QCM 28 accords | `harmonie-sessions-v2` : sessions `{level,score,at}` | Peu de granularité par type d'accord ou erreur |
| II–V–I « Mes voicings » | `harmonie-voicing-results-v1` : `{id,correct,at}` | Pas de notes jouées, tonalité réelle, trajectoire ni tentative par accord |
| Tableau de bord | Nombre global d'exercices réussis et liste simplifiée de scores | Ne distingue ni la maîtrise par tonalité ni les révisions à faire |
| Sauvegarde externe | Aucune | Données propres au navigateur/appareil, perdues si stockage effacé ; aucune restauration sur iPhone/iPad/PC |

Le code utilise `try/catch` pour l'accès local : en cas d'échec d'écriture (quota, stockage bloqué), le jeu peut continuer, mais **l'utilisateur n'est pas averti** que la sauvegarde n'a pas fonctionné. Le total des exercices est encore réécrit « 52 » dans une partie du tableau de bord de `src/app.js`, ce qui ne doit pas survivre à l'ajout de transpositions.

## 2. But de la V2 : « une notion maîtrisée dans une tonalité »

**Séparer trois niveaux de données** :

1. **Référentiel immuable** : `lessonId`, `skillId` (ex. `seventh-voicing-1375`), `exerciseId` stable, `variantId`, `tonalityId`, `mode` (`exact-midi`, `pitch-classes`, `voice-leading`), `curriculumVersion`.
2. **Événements de tentative** append-only, chacun avec UUID local, instant, choix MIDI (facultatif), justesse, erreurs, nombre de tentatives et niveau de difficulté. Les événements permettent de reconstruire les statistiques et d'éviter l'écrasement silencieux.
3. **Projection de maîtrise et navigation** : meilleur score, dernière réponse, réussite au premier essai, compteur par tonalité, dernières répétitions, date de révision prévue, exercice en cours et dernier écran visité. Les projections sont recalculables à partir des événements.

### Exemple de sauvegarde v2

```json
{
  "format": "harmonie-trainer-progress",
  "schemaVersion": 2,
  "exportedAt": "2026-10-17T15:00:00.000Z",
  "curriculumVersion": "0.5.0",
  "profile": { "localProfileId": "install-generated-uuid" },
  "cursor": { "lessonId": "position-1375", "exerciseId": "position-1375:dmaj7:1-3-7-5:v1", "view": "lesson" },
  "attempts": [
    {
      "id": "uuid-for-one-attempt",
      "at": "2026-10-17T14:31:00.000Z",
      "lessonId": "position-1375",
      "skillId": "seventh-voicing-1375",
      "exerciseId": "position-1375:dmaj7:1-3-7-5:v1",
      "variantId": "dmaj7-1375-v1",
      "tonalityId": "D-major",
      "mode": "exact-midi",
      "selectedMidis": [50, 54, 61, 69],
      "correct": true,
      "firstTryCorrect": true,
      "attemptNumber": 1
    }
  ],
  "legacy": {
    "migratedFrom": ["harmonie-parcours-v1", "harmonie-sessions-v2", "harmonie-voicing-results-v1"]
  }
}
```

**Attention** : l'exemple est **un schéma cible**, pas un fichier téléchargé du profil réel. L'enregistrement des notes effectivement jouées doit être explicite et idéalement optionnel pour éviter une croissance excessive et préserver la confidentialité. Aucun compte nominatif requis.

## 3. Migration sûre depuis les trois stockages existants

**Principe : migration non destructive**. Conserver les clés V1 intactes tant que l'utilisateur n'a pas créé et vérifié une sauvegarde V2. Introduire `harmonie-progress-v2` sans réécrire les anciens jeux.

1. Charger les trois sources séparément, contrôler leur type et leur taille ; ignorer les entrées malformées avec journal d'alerte visible.
2. Pour `harmonie-parcours-v1`, parcourir chaque leçon de la **version source 0.5.0** et reconstruire la correspondance `lessonId:exerciseIndex → exerciseId stable` via une **table figée**, non via les index de la future version transposée.
3. Créer un enregistrement « acquis V1 importé » pour `correct`, `attempts`, `at`, avec `confidence:legacy` et **sans prétendre connaître les anciennes réponses ni leurs tonalités si elles n'étaient pas stockées**.
4. Importer les scores globaux du QCM et des cadences en événements historiques agrégés ; aucune invention de tentatives individuelles.
5. Stocker un `migrationId` stable pour rendre la migration **idempotente** ; si elle est relancée, aucun doublon ne doit être créé.
6. Vérifier l'invariant : la somme des acquis historiques connus ne diminue pas et les résultats actuels restent visibles. Consigner le nombre migré et les anomalies.
7. Autoriser un retour à l'ancien affichage temporairement ; ne supprimer des clés legacy que dans une étape ultérieure et après sauvegarde externe confirmée.

**Risque majeur** : créer des dizaines de variantes par tonalité et continuer à utiliser `lesson.id:0` détruirait le sens des scores anciens sans effacer physiquement les données. D'où la nécessité d'un identifiant stable par **compétence / tonalité / variation**.

## 4. Reprise d'étude réellement personnalisée

Au lancement, proposer des actions claires :
- **Reprendre à l'endroit exact** : curseur `lessonId`/`exerciseId`/écran, sauvegardé après chaque navigation. Si l'exercice a disparu après mise à jour, ouvrir sa leçon et signaler l'adaptation.
- **Revoir mes erreurs** : dernières compétences échouées, priorité aux erreurs répétées et aux difficultés dans les nouvelles tonalités.
- **Nouvelle tonalité** : reprendre une compétence déjà réussie en C mais jamais vue en E♭, D♭, F♯.
- **Revoir plus tard** : après une réussite initiale, un contrôle à J+1 puis J+7, modulé par les erreurs. Ce sont des intervalles proposés, pas un mécanisme de mémorisation déjà implémenté.
- **Comparer** : progrès global, chapitre, compétence, tonalité, ratio de réussite au premier essai, évolution chronologique (avec échantillons).

Règle de maîtrise **proposée** : `mastered` après deux réussites sur **deux tonalités distinctes**, dont au moins une sans indices ; une erreur ultérieure transforme le statut en `needsReview`, sans effacer les réussites antérieures. Une erreur peut déclencher un exercice plus guidé au lieu de sanctionner immédiatement tout le cours.

## 5. Sauvegarde indépendante du navigateur, utilisable sur iPhone

### Phase 1 : fichier JSON local, sans serveur

- Bouton **« Exporter ma progression »** : produire un JSON versionné avec date, total d'événements, empreinte de contrôle et taille affichée, puis proposer le téléchargement via le navigateur. Le fichier peut être placé dans Fichiers/iCloud Drive par l'utilisateur ; l'application ne présume pas de sa synchronisation.
- Bouton **« Importer une sauvegarde »** : sélectionner un JSON via `<input type=file>`, analyser sans écrire, vérifier format/version/tailles/nombres/champs et **montrer une prévisualisation** (données nouvelles, doublons, conflits).
- **Confirmation explicite** avant import ; fusion d'événements par UUID, ne jamais écraser un résultat existant. Résoudre les `cursor` concurrents par choix utilisateur ; récalculer les compétences après fusion.
- **Test de restauration** sur autre navigateur/appareil, et export de retour pour vérifier le round-trip JSON.
- Proposer un rappel de sauvegarde après un palier significatif, **pas** après chaque exercice.
- En cas de perte de stockage Safari, expliquer clairement que seul un export antérieur permet la restauration : la synchronisation automatique n'existe pas encore.

### Phase 2 facultative : meilleur stockage

`localStorage` peut suffire au début si le volume reste très petit et les écritures sont tolérantes ; il n'offre ni transactions multi-enregistrements ni garantie de conservation. **IndexedDB** devient recommandé pour un historique de tentatives, des schémas indexés par compétences/tonalités et des importations atomiques. Prévoir stockage transactionnel des événements et projections, avec export portable JSON indépendant du moteur local.

Une éventuelle synchronisation entre appareils **avec comptes/serveur** exige une décision distincte (authentification, confidentialité, conflit, durée de conservation). **Ne pas l'activer par défaut.**

## 6. Contrat d'interface proposé

**Dashboard principal**, responsive :
- Partie 1 « Fondations et positions » : pourcentage de compétences acquises, date du dernier travail, tonalités acquises, prochaine leçon ;
- Partie 2 « Conduite des voix » : résolution II–V–I par tonalité, déplacements et accuracy séparés ;
- Partie 3 « Harmonie jazz » : dominantes, extensions, rootless, tensions ;
- Partie 4 « Atelier » : exercices autonomes et autres tonalités ;
- barre « Dernière séance » avec bouton Reprendre ;
- zone « À retravailler » triée par difficulté réelle, avec boutons Rejouer ;
- Exporter / Importer + « Dernière sauvegarde exportée » (sans prétendre avoir accès à l'emplacement du fichier après export).

**Protéger le clavier** : ne pas encombrer la page des exercices avec le dashboard complet ; réserver l'historique aux écrans « Progression », avec liens contextuels depuis les cours.

## 7. Matrice de tests obligatoire

| Cas | Vérification |
| --- | --- |
| Migration idempotente | Deux lancements = un seul événement V1 importé par unité historique |
| Réordonnancement | L'ancien `position-1375:0` reste attaché à sa compétence d'origine |
| Nouvelle tonalité | Réussite C n'est pas interprétée comme réussite D♭ |
| Renversements libres | Vrai résultat suivi sur la compétence, sans exiger une octave arbitraire |
| Dernier échec | `mastered` vs `needsReview` conservés, sans perdre le meilleur score |
| Export JSON | Champs/version/taille vérifiés, données relisibles, tests round-trip |
| Fusion fichiers | UUID identiques non doublés, divergences signalées |
| Format corrompu | Import refusé, stockage courant inchangé |
| Quota bloqué | Avertissement visible « progrès non sauvegardés » ; exercice jouable |
| Appareil différent | Export iPhone → import iPad / navigateur, compteurs reconstitués |
| Safari stockage effacé | Impossible sans fichier export : message clair, pas de promesse de restauration |
| Navigation | Retour sur le même exercice sans effacer des réponses déjà vérifiées |
| Suppression | Confirmation explicite + possibilité d'export avant effacement |
| Nouveau corpus | Total dynamique ; statistiques des anciennes versions conservées, séparées du total actuel |

## 8. Plan de livraison conseillé

- **Lot A — préserver l'existant** : IDs d'exercice stables, import V1 non destructif, suivi de la dernière position, compteur dynamique, tests de migration. Ne pas produire de nouvelles tonalités avant ce lot.
- **Lot B — exporter et restaurer** : JSON v2, validation de fichier, prévisualisation et fusion, téléchargement mobile, tests round-trip.
- **Lot C — progression pédagogique** : tableau de bord par leçon/compétence/tonalité, premières révisions, indicateurs de première réussite et erreurs récentes.
- **Lot D — historisation durable** : IndexedDB si le volume réel le justifie ; éventuelle stratégie multi-appareils, sans backend avant validation spécifique.

## 9. Choix à acter et risques

Par défaut, recommander : données **locales**, **export/import JSON manuel**, **pas de compte**, **pas de service cloud**, migration **non destructive**, maîtrise par **deux tonalités différentes**, disponibilité de l'historique agrégé. L'utilisateur doit pouvoir exporter ses données avant toute refonte de l'organisation du programme.

**Points nécessitant une décision ultérieure** : conservation ou non des notes MIDI effectivement jouées dans l'historique, éventuelle synchronisation automatique multi-appareils, politique de durée d'historique, seuil de « maîtrise » définitif. Aucun de ces choix ne bloque l'analyse.

**Bilan** : analyse livrée ; sauvegarde V2, dashboard détaillé et restauration **ne sont pas implémentés**.
