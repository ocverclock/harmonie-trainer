# Harmonie Trainer

Application de formation musicale tactile pour iPhone, iPad et navigateurs modernes.

## Jouer
https://ocverclock.github.io/harmonie-trainer/

## Version en cours — parcours complet 0.5
- 21 leçons originales et 52 exercices actifs dans l’onglet « Parcours » : positions de tétrades, accords de sixte, notes-guides, enchaînements majeurs/mineurs, sus4 et sus4(♭9), neuvièmes, treizièmes, transpositions, II–V–I secondaires, substitutions tritoniques, voicings sans fondamentale et collections à sept sons.
- Deux évaluations adaptées aux consignes : « position exacte » (touches/octaves exigées) et « libre » (classes de hauteurs sans imposer le renversement). Erreurs et corrections matérialisées en rouge sur le clavier.
- Suivi des exercices maîtrisés par leçon dans le stockage local du navigateur. Les exercices faux se retravaillent sans blocage.
- Mode « Mes voicings » : notes fausses entourées en rouge et propositions de remplacement dans le registre choisi, tant sur le schéma que sur le clavier. Les octaves suggérées ne deviennent pas obligatoires.
- Clavier de piano réaliste : touches noires au-dessus des blanches, défilement horizontal sur téléphone.
- 28 accords de référence, 3 niveaux, sessions de 10 questions et correction musicale.
- Module « II–V–I secondaires » : répondre d'abord à la question, valider, voir la réponse et l'explication, puis les points colorés, leurs trajectoires, les voix isolables et le clavier de l'accord actif.
- 5 exercices secondaires : vers G majeur, D mineur, E mineur, A mineur et F majeur.
- Affichage adaptatif : deux étapes sur téléphone, trois sur grand écran.
- Son à la demande ; aucune requête audio automatique.
- Scores enregistrés localement, sans compte utilisateur.

## Développement
Aucune dépendance à installer pour la page elle-même. Les modules ES et le CSS sont sous `src/`. L'entrée est `index.html`.

Pour les tests de théorie :
```bash
npm test
```

GitHub Actions lance les tests à chaque push sur `main`.

## Inspiration pédagogique

Le [sommaire public des « Bases de l’harmonisation » d’Étienne Guéreau](https://www.pianojazzconcept.com/produit/les-bases-de-lharmonisation-2-2/) inspire l’ordre des notions. L’application, les exercices, les explications et les exemples sont indépendants et originaux ; aucun cours payant, fichier, partition ou standard arrangé de cette formation n’est reproduit.

## Limites et à vérifier
- Tests automatiques exécutés via `npm test` et CI de GitHub sur la pull request ; contrôle manuel de l’audio, du tactile et du rendu iPhone/iPad encore nécessaire.
- La progression du module des II–V–I secondaires n'est pas encore conservée entre sessions.
- Les correspondances de voix sont des exemples pédagogiques explicites, sans calcul de voicings optimisés.
- La version actuelle n'est pas une application native App Store ; pas de garantie de disponibilité hors ligne.
- La publication GitHub Pages doit être activée dans Settings → Pages (Deploy from main /root).

## Documents de projet
- [Spécifications](https://docs.google.com/document/d/1NvPK5SX2wOk-WMPpHHmQ7TeAMdlAHomV5AcD_FoYZjc/edit)
- [Consignes de développement pour IA](https://docs.google.com/document/d/1NxDHTKqsd39_yGCiLv1mVcA8gNan3oXxYHmoTXdmSaY/edit)

## Synchronisation visuelle des voix (V0.3)

- **Temps vertical :** les trois accords du II–V–I sont placés en trois rangées, du haut vers le bas.
- **Hauteur horizontale :** chaque point est centré au-dessus de sa touche réelle, noire ou blanche.
- **Couleur et numéro fixes :** une même voix garde exactement sa couleur et son numéro dans les boules, les courbes et sur le clavier de l’accord sélectionné.
- **Un seul défilement tactile :** schéma et clavier bougent ensemble sur les petits écrans ; les boutons d’accord recentrent sur les notes concernées.
- **Conservation du clavier :** géométrie blanche/noire et aspect général inchangés.
- Géométrie partagée dans `src/piano-layout.js` ; tests de concordance dans `tests/music.test.js`.


## Nouveau mode : construire soi-même les voicings (V0.4)

**Le QCM existant est conservé.** Depuis l'accueil, la navigation « Mes voicings » ou une question de QCM, ouvrir le mode de création.

- Un objectif de II–V–I secondaire est proposé, avec les noms des trois accords à réaliser. Il s'agit d'un exercice de **voicing** et non d'identification du II/V/I, qui reste réservé au QCM.
- Pour chaque accord, choisir **quatre touches physiques** du piano (C3 et C4 sont deux notes distinctes) ; retour possible aux accords précédents avant validation globale.
- La correction, seulement après les trois accords, est fondée sur les quatre **classes de notes attendues**, indépendamment des renversements et des octaves. Le mode initial exige l'ensemble complet fondamentale, tierce, quinte, septième ; voicings rootless, omissions et tensions ne sont pas notés comme justes dans ce niveau.
- Après correction : détail des notes absentes/en trop/doublées, visualisation de « Mon voicing » et d'un « Exemple corrigé » avec les mêmes couleurs et centres de touches, comparaison pédagogique des mouvements.
- Les déplacements ne sont **pas** utilisés pour sanctionner une construction d'accord juste. Les positions grave → aigu servent de correspondances visibles entre étapes et ne revendiquent pas être un réarrangement algorithmique optimal.
- Le score (nombre d'accords justes sur trois) est enregistré localement, distinct des sessions d'accords. Les tests de théorie sont dans `tests/voicing.test.js`.


## Suivi des agents et validation

Les trois chantiers sont consignés dans le **[journal des agents et décisions](docs/AGENT_WORK_LOG.md)**. Le 17 octobre 2026, l'utilisateur a donné une **autorisation explicite de publication du parcours complet** ; cette autorisation est spécifique au travail décrit dans la PR correspondante. Toute autre future évolution majeure devra être validée selon la règle habituelle.


## Enrichissement des cours (V0.6 — publié)

- Chacun des quatre chapitres présente maintenant **une introduction pédagogique**, son intérêt, le principe à connaître et l'objectif d'apprentissage.
- Avant les exercices de chaque leçon : **pourquoi**, **explication**, **exemple résolu**, **deux écoutes comparatives** et **question de compréhension**.
- Distinction fondamentale : un **renversement** change la basse ; une **disposition / position** modifie l'espacement ou la succession des voix, parfois avec la même basse.
- Le programme passe de **52 à 89 exercices** en ajoutant 37 activités (transpositions majeures/mineures, nouvelles touches noires et premiers renversements véritables). Les 52 exercices d'origine restent aux mêmes indices ; les clés de progression déjà sauvegardées dans le navigateur ne sont donc pas déplacées.
- Les nouveaux exercices utilisent explicitement des tonalités telles que Ré majeur, Si♭, Mi♭, La♭, Ré♭, Fa♯ majeur/mineur et Si mineur. Les notes sont toujours situées dans le clavier MIDI 48–83.
- Les orthographes théoriques sont indiquées dans le corrigé pour les variantes (`Mi♯` ou `Do♭` selon tonalité), même si le clavier MIDI utilise les mêmes touches enharmoniques.

L'évolution du suivi et des sauvegardes est publiée en V0.7. Voir les [PR #8 (cours)](https://github.com/ocverclock/harmonie-trainer/pull/8) et [#9 (sauvegarde)](https://github.com/ocverclock/harmonie-trainer/pull/9). Recette Safari iPhone et iPad à effectuer sur appareils réels.


## Suivi de progression V2 et sauvegardes portables (V0.7 — publié)

- « Reprendre mon travail » retrouve le **dernier exercice visité**, et non la première leçon incomplète ; si le curseur est introuvable après une mise à jour, le système revient au parcours normal.
- Les nouvelles tentatives sont archivées dans `harmonie-progress-v2`, indexées par **ID d'exercice stable et tonalité** ; le statut « déjà réussi » et le résultat de la dernière tentative restent distincts.
- Les données originales `harmonie-parcours-v1` sont préservées pendant la migration et continuent d'alimenter les anciens indicateurs. Les 52 anciens exercices restent à leurs indices historiques ; les 37 nouveaux ont leur propre ID.
- Le parcours propose « Exporter mes progrès » (fichier JSON daté) et « Importer une sauvegarde » (aperçu du nombre d'éléments, confirmation, fusion sans réinitialiser le stockage existant).
- **Aucune synchronisation automatique** : l'utilisateur doit sauvegarder le fichier dans Fichiers / iCloud Drive ou un autre emplacement de son choix et le réimporter sur l'autre appareil. Les données peuvent être perdues si Safari efface le stockage et qu'aucun fichier n'a été exporté.
- Contrôles : migration V1, validation des fichiers, dédoublonnage des tentatives, préservation des réussites et refus de contenus invalides ; tests dans `tests/progress-store.test.js`.

**Limites connues :** les événements détaillés sont plafonnés à 3 000 dans le navigateur, sans effacer les acquis historiques importés ; la fusion de deux appareils utilise des UUID de tentatives et consolide les acquis historiques par maximum, sans prétendre résoudre toutes les divergences de parcours. La validation Safari iPhone/iPad reste à réaliser. Pas de serveur ni de compte.

## Publication vérifiée — 17 octobre 2026

- Les PR **#8 puis #9** ont été fusionnées sur `main` (commits de fusion `7cb2f8a` et `c0225d5`).
- Les suites de tests des deux PR sont vertes ; le workflow [Pages deployment smoke check](https://github.com/ocverclock/harmonie-trainer/actions/runs/39058070676) a réussi en accédant à la page publique et en téléchargeant le nouvel `index.html`, les modules de cours, de tonalités, de progression et du clavier.
- Version testable : https://ocverclock.github.io/harmonie-trainer/ — onglet **Parcours**, puis **Exporter mes progrès** / **Importer une sauvegarde** dans le tableau du parcours.
- **Non vérifié dans ce contrôle** : gestes tactiles sur Safari iPhone, fonctionnement audio sur appareil réel, sélection/import de fichier via l'app Fichiers sur iOS, et parcours utilisateur complet dans un navigateur. Le contrôle Pages confirme la disponibilité HTTP des ressources, pas l'absence de tout défaut d'interface.
