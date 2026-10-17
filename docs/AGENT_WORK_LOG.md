# Harmonie Trainer — Journal des agents et décisions à valider

**Mis en place le : 17 octobre 2026**  
**Dépôt source de vérité :** https://github.com/ocverclock/harmonie-trainer  
**Objectif :** conserver durablement les demandes, choix pédagogiques, modifications techniques, vérifications, blocages et décisions **avant** toute validation utilisateur. Un autre agent ou une conversation ultérieure doit pouvoir reprendre sans perdre le contexte.

## Règles impératives

1. **Aucun code produit ne doit être fusionné dans `main` sans validation explicite de l'utilisateur.** Les agents travaillent chacun sur une branche dédiée, puis ouvrent une **pull request non fusionnée**. La création de ce journal et sa maintenance documentaire sur `main` ne valent pas approbation du code.
2. **Avant toute demande de validation**, consigner ici un compte rendu daté ET dans la PR associée : ce qui a changé, pourquoi, quels fichiers, les choix fonctionnels, les résultats **effectivement exécutés** des tests, les captures si disponibles, les limitations et les risques de régression.
3. Une PR doit identifier l'issue suivie, son commit de tête, les points non couverts, les conflits avec les autres PR, et proposer une marche à suivre pour la recette iPhone/iPad.
4. Ne jamais déclarer un test « réussi » sans sortie de test ni preuve CI ; ne jamais déclarer un agent « en cours » si sa tâche n'a pas réellement été lancée.
5. **Conserver les acquis** : QCM II–V–I, construction libre de quatre notes, clavier réaliste à touches noires superposées, couleurs de voix identiques sur diagramme et piano, progressions vers G/F majeur et A/D/E mineur.
6. **Éviter les conflits** : agent 1 → correction visuelle, agent 2 → curriculum et première leçon originale, agent 3 → interface/performance mobile. Toute modification commune (`src/app.js`, `src/style.css`, `src/voices.js`) doit être signalée avant une fusion ; vérifier la compatibilité des trois PR.
7. **Sources pédagogiques** : prendre le *sommaire public* du programme d'Étienne Guéreau comme inspiration de structure ; créer exercices, explications, exemples et contenus indépendants. Ne pas copier de contenus réservés à l'acheteur.

## État vérifié au 17 octobre 2026

| Chantier | Issue GitHub | Travail attendu | Dernier statut vérifié | Conditions de validation |
| --- | --- | --- | --- | --- |
| 1 — Correction visuelle | [#1](https://github.com/ocverclock/harmonie-trainer/issues/1) | Montrer saisie erronée et note de remplacement proposée en **rouge** (schéma + clavier), ex. Gmaj7 : **F3 → F♯3** | Issue ouverte, aucun assigné GitHub, aucune PR ouverte lors du relevé. Une seule tâche ChatGPT horaire a été créée pour cette mission ; sa réalisation effective doit être constatée séparément. | Cas F3/F♯3 démontré, anneaux alignés, inversions correctes acceptées, QCM intact, tests vérifiés, validation utilisateur |
| 2 — Suite pédagogique jazz | [#2](https://github.com/ocverclock/harmonie-trainer/issues/2) | Modules originaux inspirés du sommaire public de Piano Jazz Concept : tétrades, positions, 6e, conduites, sus4, transpositions… Première leçon interactive et tests. | Issue ouverte, aucun assigné, aucune PR ; aucun agent récurrent autonome confirmé | Théorie relue, progression claire, pas de duplication de cours payants, exercice jouable, CI/recette |
| 3 — Optimisation mobile | [#3](https://github.com/ocverclock/harmonie-trainer/issues/3) | Audit responsive, tactile, scroll commun, performances, accessibilité, Safari mobile | Issue ouverte, aucun assigné, aucune PR ; aucun agent récurrent autonome confirmé | Comparaison mobile/tablette, pas de perte de notes/état, clavier inchangé, tests et limites documentés |

**Limite d'orchestration constatée :** l'affectation directe au bot GitHub Copilot a été refusée par GitHub ; la création de deux tâches ChatGPT supplémentaires a échoué car la limite de tâches actives est atteinte. Ces trois issues constituent des cahiers des charges et **ne prouvent pas que trois agents travaillent en parallèle**. Pour les activer réellement, il faut une capacité d'exécution supplémentaire ou libérer des créneaux de tâches. Ne pas présenter cette situation autrement.

## Détails non négociables par chantier

### Issue #1 — Visualiser clairement la correction du voicing
- Deux vues : **Mon voicing** = notes réellement jouées + annotations rouges ; **Exemple corrigé** = voicing de référence clairement distingué.
- En cas d'erreur, marquer à la fois la **note jouée en trop** et la **note attendue** au même endroit musical sur le schéma et sur la touche du clavier.
- La correction par **classe de hauteur** n'impose pas une octave particulière ; si l'on dessine F♯3 pour remplacer F3, le texte doit expliquer qu'il s'agit d'une **suggestion de remplacement dans le registre joué**, pas d'un renversement unique.
- Tester les accords déjà justes, les registres inversés et le défilement synchronisé.

### Issue #2 — Progresser sans questionnaire « au hasard »
- Conserver le QCM pour l'identification harmonique et la variante « Mes voicings » pour la construction libre.
- Proposer des **leçons graduées**, par objectifs, explications courtes, exercices actifs, correction et suivi des acquis.
- Débuter par les positions de tétrades et enchaînements de voix (modes majeurs/mineurs), puis enrichir avec accords de sixte, sus4, tensions et II–V–I secondaires.
- Définir pour chaque exercice si la réponse exige des **pitch classes** ou une **disposition précise de notes MIDI** ; ne pas pénaliser les renversements lorsque la consigne les autorise.
- L'origine de la structure du programme peut être mentionnée ; **aucun contenu pédagogique payant n'est une source à reproduire**.

### Issue #3 — Performance et ergonomie mobile
- Préserver le joli clavier existant, la position chromatique exacte des points et l'identité des couleurs.
- Le diagramme et le piano sont **un seul bloc défilant**, y compris sur iPhone ; éviter les deux scrolls désynchronisés.
- Contrôler iPhone portrait, iPad et Split View, orientation, zoom/texte agrandi, grosses touches tactiles, focus et VoiceOver.
- Séparer taille d'affichage et données musicales : **même corpus et mêmes corrections sur tous appareils**. Charger les modules supplémentaires à la demande ; mesurer avant de déclarer une amélioration de performance.

## Modèle obligatoire : entrée de journal avant validation

Copier ce bloc **à chaque jalon significatif** et le compléter avec des éléments vérifiés :

```md
### AAAA-MM-JJ HH:MM — Agent/chantiers : #N — ÉTAT : préparation | développement | PR à relire | validé | bloqué
- Besoin de départ / décision retenue :
- Branche et commit de tête :
- PR : URL et état (ou « pas encore ouverte »)
- Fichiers modifiés :
- Résultat visible avant → après (avec capture/lien si possible) :
- Choix pédagogiques/techniques et raisons :
- Tests effectivement exécutés : commande, résultat, preuve (CI) :
- Vérifications non faites :
- Risques, limitations et conflits possibles :
- Validation utilisateur demandée : quoi précisément ?
- Décision utilisateur / date : EN ATTENTE tant qu'aucun accord explicite
- Suite prévue :
```

## Journal chronologique

### 2026-10-17 — Publication autorisée et fusion GitHub — ÉTAT : fusionné sur main ; Pages à constater
- **Accord utilisateur** : publication intégrale autorisée explicitement pendant la conversation du 17/10/2026.
- **PR de livraison** : [#4](https://github.com/ocverclock/harmonie-trainer/pull/4), fusionnée par squash sur `main` ; commit de fusion **`f493958c42e886210b2f944e48a8f7dadfbb8049`**.
- **CI vérifiée** : [run #39034617931](https://github.com/ocverclock/harmonie-trainer/actions/runs/39034617931), workflow « Check Harmonie Trainer », job `music-tests` **success**, étape `Verify musical theory and progressions` **success** (`npm test`).
- **Contenu effectivement présent sur main après fusion** : `src/curriculum.js` (21 leçons, 52 exercices), `src/curriculum-ui.js`, correction visuelle `src/voicing-ui.js`, `src/voices.js`, styles responsive et tests.
- **Ajustement post-fusion** : paramètres de cache des imports graphiques et du script d'entrée mis à jour, afin de charger les nouveaux cercles rouges au lieu d'anciens modules du navigateur.
- **Issues de suivi** : #1 (correction visuelle) et #2 (cursus) fermées après fusion ; #3 (recette mobile) reste ouverte pour tests en conditions réelles.
- **Automatisation** : tâche horaire « Harmonie — correction visuelle » désactivée après sa réalisation pour éviter une PR redondante. Aucun autre agent du projet n'a été déclaré actif.
- **Vérification restant à effectuer** : GitHub Pages n'a pas pu être lu par l'outil Web (accès technique bloqué), donc ne pas prétendre qu'un chargement client en production a été constaté. Les tests Safari iPhone/iPad, audio, accessibilité et interactions restent à faire sur appareil.


### 2026-10-17 — Intégration du parcours complet — ÉTAT : développement terminé, PR/CI à vérifier
- **Validation explicite de l'utilisateur** : « Va jusqu'à publier, tout est bon là. Je valide l'ensemble avec le programme d'Étienne ». Cette autorisation couvre l'intégration, la fusion et la publication du parcours pédagogique ainsi que les corrections visuelles et ajustements mobiles liés au périmètre discuté ; elle remplace l'attente de validation initialement prévue pour ce chantier précis, sans autoriser les modifications futures sans rapport.
- **Branche** : `feature/parcours-harmonisation-complet`. PR à renseigner une fois créée ; fusion et GitHub Pages à confirmer par constat.
- **Fichiers nouveaux** : `src/curriculum.js`, `src/curriculum-ui.js`, `src/curriculum.css`, `src/mobile.css`, `tests/curriculum.test.js`.
- **Fichiers modifiés** : `src/app.js`, `src/voicing.js`, `src/voicing-ui.js`, `src/voices.js`, `index.html`, `package.json`, `README.md`, présent journal.
- **Pédagogie** : 21 leçons, 52 exercices originaux. Modes « position exacte » (octaves imposées) et « libre » (renversements permis), suivi local des exercices réussis, écoute du jeu et de la correction, affichage rouge des notes manquantes/erronées. Conservation du QCM et du module Mes voicings.
- **Correction visuelle** : en cas de réponse erronée, cercles rouges sur les points du diagramme et sur les touches ; exemple F3 joué au lieu de F♯3 → proposition F♯3 sans exclure les autres octaves justes.
- **Mobile** : barre de navigation responsive, commandes tactiles et un seul scroll diagramme/clavier conservé ; le rendu Safari iPhone, iPad et VoiceOver ne sont pas encore testés sur appareil physique.
- **Contrôles exécutés** : vérification syntaxique JavaScript sur les modules concernés ; vérification programmatique des 52 corrections théoriques, de la distinction positions/renversements, du cas F3→F♯3 et de la génération des repères rouges sur le diagramme. Aucun échec lors de ces contrôles. **CI `npm test` sur GitHub non encore confirmée à cette étape.**
- **Provenance** : sommaire public d'Étienne Guéreau uniquement, exercices indépendants ; aucune partition/vidéo payante copiée.
- **Suite** : ouvrir PR, attendre le résultat CI, fusionner sous cette autorisation explicite, puis vérifier la disponibilité GitHub Pages et corriger si nécessaire.


### 2026-10-17 — Coordination initiale — ÉTAT : cahiers des charges préparés, pas encore de PR
- Issues créées : #1 correction en rouge, #2 progression pédagogique, #3 optimisation mobile.
- Vérification GitHub : les trois issues sont **ouvertes et sans assigné**, et aucune PR ouverte n'a été trouvée lors du relevé.
- Une tâche récurrente ChatGPT a été enregistrée pour le chantier #1 (horaire) ; la capacité d'ajouter les tâches #2 et #3 est actuellement bloquée par la limite des tâches actives.
- L'utilisateur demande que **tout soit gardé en mémoire avant validation**, sans fusion de code automatique.
- **Validation utilisateur des futures PR : en attente.**
