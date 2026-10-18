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

### 2026-10-18 — P03 : notes-guides actives sur les cadences II–V–I — PR #24, non fusionnée
- **PR [#24](https://github.com/ocverclock/harmonie-trainer/pull/24)** basée sur la branche P02 / [PR #23](https://github.com/ocverclock/harmonie-trainer/pull/23), pour éviter les collisions entre deux lots touchant le même atelier. Après éventuelle fusion autorisée de P02, cibler main et relancer la CI avant publication.
- **Pédagogie réellement ajoutée :** 5 progressions II–V–I (G/F majeur, D/E/A mineur) × 4 mouvements de notes-guides (tierces et septièmes) = **20 exercices**. Les notes exactes et leur registre sont dérivés des accords/mélodies déjà présentes, avec assertions contre les exemples incohérents.
- **Quatre mouvements par progression** : II tierce → V septième sans déplacement, II septième → V tierce en descendant d’un demi-ton, V tierce → fondamentale du I en montant d’un demi-ton, V septième → tierce du I en descendant d’un demi-ton en majeur ou d’un ton sur nos exemples mineurs. Les élèves doivent cliquer la touche attendue, écouter, vérifier, comprendre le nom de la note et le mouvement. Le réessai après erreur n'efface pas les tentatives antérieures.
- **Interface :** quatrième carte « Notes-guides II–V–I » dans l'atelier jazz, clavier inchangé, source en pointillés, correction verte et erreur rouge avec signes distincts/labels ARIA, bilan par cadence. Écoute source et résolution. Les études utilisent des choix **MIDI précis** afin de vérifier le mouvement d'un demi-ton, contrairement au simple choix de classes de hauteurs.
- **Sauvegarde :** tentatives ajoutées à `harmonie-progress-v2` avec IDs durables `jazzlab:guides:to-g:0` etc. Export JSON V2 conserve anciennes et nouvelles tentatives.
- **Fichiers :** `src/guide-tones.js`, `src/jazz-lab-ui.js`, `src/jazz-lab.css`, `tests/guide-tones.test.js`, `tests/guide-tones-browser.mjs`, versions de cache et workflows test/Pages (pour publication future).
- **Preuves CI :** tests Node [run 39111977358](https://github.com/ocverclock/harmonie-trainer/actions/runs/39111977358) **success** ; tests navigateur [run 39111977364](https://github.com/ocverclock/harmonie-trainer/actions/runs/39111977364) **success**, y compris les tests P02 et P03 à **375×812** et **1024×768**.
- **Non publié** en production et **non testé sur Safari iPhone/iPad réel**. Ne pas compter comme mise en ligne tant que PR #23 puis #24 ne sont pas fusionnées sur autorisation.
- **Prochain lot : P04** — trajets visuels des quatre voix entre accords sur une cadence.



### 2026-10-18 — P02 : évaluation pédagogique de la conduite des voix — PR prête pour revue, non fusionnée
- **PR [#23](https://github.com/ocverclock/harmonie-trainer/pull/23)** sur branche `pedago/P02-conduite-voix-evaluation-20261018`, à conserver hors `main` jusqu'à validation explicite de publication.
- L'atelier jazz distingue maintenant **justesse de l'accord**, notes communes par classe de hauteur, touches réellement communes dans le même registre et immobilité d'une voix selon son rang grave→aigu. Les déplacements d'un demi-ton, ton, et sauts supérieurs à la quinte sont expliqués, sans modifier la validité d'un renversement correct.
- **Défaut corrigé :** un accord faux ou précédé d'un accord non validé comme juste ne reçoit plus de comparaison le présentant comme aussi économe qu'une bonne disposition. Le bouton pour écouter une autre disposition valide est proposé uniquement lorsque les deux accords sont justes.
- Code : `src/voice-leading-feedback.js`, `src/jazz-lab-ui.js`, CSS de l'atelier, tests unitaires `tests/voice-leading-feedback.test.js`, tests Chromium `tests/voice-leading-browser.mjs` à 375×812 et 1024×768.
- **Preuves :** [CI musicale run 39110967980](https://github.com/ocverclock/harmonie-trainer/actions/runs/39110967980) **success** ; [test navigateur run 39110967964](https://github.com/ocverclock/harmonie-trainer/actions/runs/39110967964) **success** avec les deux cas de largeur. Tests Safari iPhone/iPad réels toujours absents.
- Aucun changement des touches MIDI, exercices, huit niveaux, notes des neuvièmes/treizièmes, progression V2 ou scores. Nouveau chargement avec cache `jazz-lab-ui.js?v=2`.
- **Suite :** P03 — notes-guides tierces et septièmes en situation. Ne pas confondre résultats verts sur PR et version publiée : `main` reste inchangé.



### 2026-10-17 — V0.12 publiée : 8 niveaux et tonalités indépendantes
- **Demande validée :** « Accords de 9 · 4 notes, avec difficulté intermédiaire. Applique la refonte en respectant les 8 niveaux et la séparation entre structure et tonalité. »
- **[PR #17](https://github.com/ocverclock/harmonie-trainer/pull/17)** fusionnée, commit `18b287567f076ac1f68394db1284284cdd97c20d`. Suit l'audit [issue #16](https://github.com/ocverclock/harmonie-trainer/issues/16).
- **8 niveaux théoriques fixes :** (1) triades M/m 3 sons ; (2) dim/aug/sus4 3 ; (3) maj7/m7 4 ; (4) 7/m7♭5/dim7 4 ; (5) 6/m6 4 ; (6) 9/m9 4 (sans quinte) ; (7) 13/maj13/m13 5 (sans quinte/11) ; (8) 7♭9/7♯9/7♭13 4–5.
- **3 difficultés indépendantes** : Facile = six fondamentales familières + formule visible ; Intermédiaire = Ré, Mi♭, Mi, La♭, La, Si♭ sans indices ; Difficile = toutes les douze fondamentales, sans indices. À l'ouverture : **niveau 6, Intermédiaire**, selon la validation utilisateur. La difficulté ne remplace jamais une formule par une autre.
- **UX :** huit cartes de niveaux, trois cartes de difficultés, récapitulatif avant bouton « Commencer les 10 exercices », choix mémorisé dans `harmonie-construction-choice-v1`, retour à la sélection depuis un exercice.
- **Historique :** aucune suppression de `harmonie-sessions-v2`. Anciennes sessions affichées « famille non enregistrée », puisqu'on ne peut retrouver avec certitude leur contenu réel ; nouvelles sessions ont `schemaVersion:3`, `familyId`, `realizationId`, `level`, `difficulty`.
- **Audio :** les corrections de neuvièmes/treizièmes répartissent les notes dans des octaves appropriées, plutôt que de faire entendre une unique octave.
- **Tests :** suite musicale réussie avant fusion ([run 39066013813](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066013813)), puis après fusion ([run 39066099898](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066099898)). Navigateur Chromium téléphone/tablette avant et après fusion : [39066013822](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066013822), [39066099903](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066099903), tous **success**. [GitHub Pages deployment](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066099716) et [smoke du site public V0.12](https://github.com/ocverclock/harmonie-trainer/actions/runs/39066099991) **success**, dont chargement de `construction-setup.js`, `music.js?v=4`, `practice-random.js?v=4`.
- **Toujours à tester sur appareil réel :** gestes tactiles, audio Safari, import/export de sauvegarde depuis Fichiers sur iPhone/iPad. Les correcteurs d'accords travaillent en classes de hauteurs, sans imposer une position particulière : ces travaux sont disponibles dans les modules Voicings/Atelier jazz.


### 2026-10-17 — Défi 6/9 à quatre sons, 13 à cinq sons — PUBLIÉ
- **Correction demandée** : le niveau « Défi » ne devait pas seulement retirer les indices et choisir plus de touches noires ; l'utilisateur voulait **4 notes pour les accords 6 et 9 et 5 notes pour les accords 13**.
- **PR [#15](https://github.com/ocverclock/harmonie-trainer/pull/15)** fusionnée dans `main` via commit `f6da839ac6678ac95e5a3bbec4945e4e9cd6c264` ; l'ancienne PR #14 avec conflit a été fermée au profit de la version portée sur le main récent.
- **Défi niveau 1 :** C6/Cm6 et autres tonalités, 4 notes (1–3–5–6 ou 1–♭3–5–6).
- **Défi niveau 2 :** C9/Cm9 et autres tonalités, voicing **4 notes** (1–3/♭3–♭7–9), quinte omise explicitement.
- **Défi niveau 3 :** C13 et autres tonalités, voicing **5 notes** (1–3–♭7–9–13), quinte et onzième omises.
- **Ergonomie :** cartes de familles spécifiques en Défi, nombre de notes affiché, validation bloquée jusqu'à 4 ou 5 touches distinctes, correction expliquant les intervalles et omissions. Découverte, Entraînement, clavier, historique et ateliers jazz inchangés.
- **Vérifications :** CI musicale et tests d'interface Chromium téléphone/tablette verts sur PR #15 ; mêmes tests verts après fusion (runs `39064655311` et `39064655221`). GitHub Pages déployé (`39064655043`), [smoke Pages v0.11](https://github.com/ocverclock/harmonie-trainer/actions/runs/39064655227) **success**. Test physique Safari iPhone/iPad toujours à faire.


### 2026-10-17 — Ateliers jazz pédagogiques V0.10 — ÉTAT : publiés, tests automatisés verts
- L'utilisateur a demandé de poursuivre le programme pédagogique jusqu'à une version testable/publiée.
- **PR d'origine #11** : code terminé et tests Node / Chromium réussis mais GitHub l'a déclarée en conflit après une évolution simultanée de `main` (nouvelles difficultés de constructions). Elle a été **fermée sans fusion** pour éviter d'effacer du travail récent.
- **PR intégrée #13** : https://github.com/ocverclock/harmonie-trainer/pull/13 — reconstitution sur `main` récent, intégration des nouveaux ateliers **sans perte des modes Guidé / Standard / Challenge**, fusion `6966bd45b7ea981895e47b0819815e7e7923ab7c`.
- **Pédagogie musicale** : moteur `src/jazz-lab.js` et UI `src/jazz-lab-ui.js` avec cinq cadences construites à la main, suivi comparatif des quatre voix grave→aigu, position MIDI précédente discrète, séparation exacte entre note juste et conduite fluide, suggestion d'une réalisation valide par recherche du mouvement le plus court.
- **Oreille** : cinq qualités d'accord à identifier sans afficher les notes, progressions dans diverses tonalités, contrôle des erreurs récentes, révision adaptative, maîtrise à partir de deux tonalités distinctes.
- **Réarmonisation** : quatre mini-phrases originales, chacune avec une mélodie de trois notes et plusieurs options harmoniquement recevables (dominantes, backdoor, substitution tritonique). Réponses expliquées et audibles. **Pas encore d'éditeur de mélodies libres.**
- **Sauvegarde** : les résultats des ateliers sont intégrés au `harmonie-progress-v2` exportable/importable. La commande d'effacement avertit et efface également V2 pour rendre la remise à zéro cohérente.
- **Contrôles PR #13** : deux suites réussies avant fusion, `Check Harmonie Trainer` run `39063875470`, `Test jazz pedagogy in a real browser` run `39063875449`.
- **Contrôles sur `main`** : `Check Harmonie Trainer` `39063945686` **success** ; Chromium aux fenêtres **375×812** et **1024×768** `39063945655` **success** (saisie, repères de voix précédents, oreille, mélodie, archive JSON et navigation) ; GitHub Pages `39063945488` **success** ; Pages smoke `39063945670` **success**, nouvel `index.html` et scripts `app.js?v=11`, `jazz-lab.js`, `jazz-lab-ui.js?v=1`, CSS et clavier chargés.
- **Dépendances / limites** : aucun essai sur iPhone Safari réel ou iPadOS réel, ni VoiceOver, ni restauration iCloud/Fichiers inter-appareils ; pas de MIDI physique ni suivi de doigtés, ni harmonisation d'une mélodie totalement libre. La correction de mouvement suppose l'ordre registre grave→aigu, sans imposer la correspondance réelle entre mains/doigts.
- **URL testable** : https://ocverclock.github.io/harmonie-trainer/ — ouvrir « Atelier jazz ».


### 2026-10-17 — V0.8 : constructions aléatoires et mémoire du voicing — ÉTAT : publiée et contrôlée
- **Demande :** plus de variété dans les exercices de construction ; pendant la construction d'un nouvel accord dans « Mes voicings », repères discrets des notes MIDI réellement jouées dans l'accord précédent.
- **PR #10 :** https://github.com/ocverclock/harmonie-trainer/pull/10 — fusionnée dans `main`, commit `3edc56a16bbd7c3e74f9e6d9c831be030a1e1148`.
- **Travail :** `src/practice-random.js` crée un pool de constructions sur de nouvelles fondamentales et qualités et diversifie les sessions de 10 questions en évitant des doublons enharmoniques ; `sessionFor` réutilise ce pool, tout en conservant les 28 définitions historiques.
- **Parcours :** bouton « Mélanger pour réviser » pour revoir les exercices d'une leçon dans un ordre varié (acquis non maîtrisés d'abord), retour possible à l'ordre pédagogique. Aucun ID/exercice corrigé ni ancienne clé `harmonie-parcours-v1`/`harmonie-progress-v2` déplacés.
- **Mes voicings :** sur les étapes 2 et 3, quatre petits anneaux gris pointillés indiquent les touches MIDI jouées sur l'accord précédent, y compris les notes communes ; le jeu en cours demeure en bleu. Le modèle correct n'est jamais révélé avant la validation ; les notes fantômes n'apparaissent pas au premier accord ou si l'étape précédente est incomplète. Accessibilité aria-label associée aux anneaux.
- **Cadences :** ouverture libre sur un objectif aléatoire ; « Nouvelle cadence aléatoire » choisit un autre objectif que le précédent ; l'entrée depuis une question QCM conserve la destination de cette question.
- **Tests :** nouvelle suite `tests/practice-random.test.js` couvrant pool, spelling des accords, ordre varié, stabilité du suivi, objectifs de cadence et notes MIDI précédentes ; GitHub Actions [Check Harmonie Trainer](https://github.com/ocverclock/harmonie-trainer/actions/runs/39061291457) = **success**.
- **Publication :** [GitHub Pages](https://github.com/ocverclock/harmonie-trainer/actions/runs/39061290721) = **success** ; [Pages smoke check v0.8](https://github.com/ocverclock/harmonie-trainer/actions/runs/39061291313) = **success**. Vérification HTTP de la page mise en production et des modules `app.js?v=9`, `curriculum-ui.js?v=4`, `voicing-ui.js?v=3`, `practice-random.js`, `piano-layout.js`.
- **Limites :** la validation tactile réelle sous Safari iPhone/iPad, la lisibilité des anneaux selon le zoom et la persistance de la révision mélangée entre redémarrages n'ont pas été testées sur appareils. Le mode guidé reste séquentiel par défaut.


### 2026-10-17 — V0.7 publiée : cours et sauvegardes testables — ÉTAT : code fusionné, Pages vérifiée
- Autorisation utilisateur du 17 octobre 2026 : « Vas y et tu reviens vers moi quand c’est testable » ; mise en production des évolutions validées aux tests.
- **PR #8 fusionnée** dans `main` avec un merge commit `7cb2f8a52068365d915d7d676021a66747bcefa7`. Contenu : 4 introductions de chapitres, 21 mini-cours, 37 exercices supplémentaires, passage de 52 à 89 exercices, versions de cache rafraîchies.
- **PR #9 fusionnée ensuite** dans `main` avec `c0225d513f6b13414d5cd911b82bfd4cd4f513c7`. Contenu : registre de progression V2 non destructif, reprise, export JSON, import avec fusion et confirmation, conservation de V1.
- **Tests de développement :** CI des deux PR en succès avant fusion ; réussite CI finale de #9 run `39053910434`.
- **Contrôle de disponibilité Pages :** workflow [Pages deployment smoke check](https://github.com/ocverclock/harmonie-trainer/actions/runs/39058070676) **success**. Le job a obtenu le nouvel `index.html` (imports `app.js?v=8`, `curriculum.css?v=3`) puis récupéré sans erreur les scripts `app.js`, `curriculum-ui.js?v=3`, `curriculum.js`, `course-notes.js`, `tonality-variants.js`, `progress-store.js` et `piano-layout.js`. Il vérifie les réponses HTTP et la présence de contenu non vide, pas le comportement de l'application via un navigateur.
- **Version testable** : https://ocverclock.github.io/harmonie-trainer/. Vérifier sur iPhone : ouvrir Parcours, lire un cours, jouer une variante avec touches noires, vérifier un accord, quitter/reprendre, puis exporter un JSON et essayer l'import depuis Fichiers. Les gestes audio, import iOS, VoiceOver et expérience tactile ne sont pas encore testés physiquement.
- **Consigne** : aucune promesse de synchronisation automatique ; conserver le fichier de sauvegarde dans Fichiers / iCloud Drive, les données de navigateur peuvent disparaître. Les développements futurs (révision espacée, meilleure gestion des tonalités) restent distincts.


### 2026-10-17 — Enrichissement du parcours et sauvegarde v2 — ÉTAT : deux PR de développement, CI verte, en attente de validation visuelle
- **PR #8 :** https://github.com/ocverclock/harmonie-trainer/pull/8 — branche `feature/mini-cours-et-tonalites-20261017`, basée sur `main`. 21 mini-cours originaux, 4 introductions de chapitre et 37 exercices supplémentaires (89 au total), notamment vrais renversements et tonalités utilisant des touches noires. **Les 52 exercices d'origine restent au même index** pour ne pas déplacer les anciennes clés du suivi.
- **PR #9 :** https://github.com/ocverclock/harmonie-trainer/pull/9 — branche `feature/sauvegarde-acquis-v2-20261017`, basée sur la branche de #8. Nouveau module `src/progress-store.js`, reprise du dernier exercice, journal local par tonalité, export JSON et import contrôlé avec fusion et restauration non destructive du stockage `harmonie-parcours-v1`. Sans compte ni cloud.
- **CI GitHub Actions PR #8 :** run 39053144864, statut **success** (contrôlé).
- **CI GitHub Actions PR #9 :** runs 39053670087 et 39053759116 en échec puis correction des tests ; run 39053814328 **success** (contrôlé). Les corrections concernaient la syntaxe d'un exemple de JSON invalide et les prototypes des dictionnaires après sérialisation, sans effacer les données des utilisateurs.
- **Risques restants :** tests Node verts, mais **aucune recette Safari iPhone/iPad réelle**, ni restauration manuelle de fichier sur appareils différents, ni contrôle visuel de l'intégration des nouveaux mini-cours. L'export reste manuel et le navigateur peut effacer le stockage local ; aucune synchronisation cloud promise.
- **Intégration :** fusionner #8 en premier, puis rebaser/retargeter #9 sur main avant sa fusion éventuelle ; ne jamais fusionner #9 seule. Les deux PR restent en brouillon et ne changent pas la page publique.
- **Décision de publication de ces deux nouveaux lots :** en attente d'une validation de recette/autorisation applicable. L'accord donné précédemment concernait la publication du parcours initial V0.5.


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
