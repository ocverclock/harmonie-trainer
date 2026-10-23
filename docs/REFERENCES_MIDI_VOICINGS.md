# Références pour la pratique MIDI et les voicings jazz

Date d'ajout : 22 octobre 2026.

## Décision et portée

Direction retenue : application Android interactive, reliée à un piano MIDI, en continuité avec Harmonie Trainer / Tetra et son programme pédagogique.

Tonal, Piano Trainer Studio (PTS) et PianoML sont enregistrés ici comme références techniques à évaluer. Cette modification documentaire n'installe aucune dépendance, n'importe aucun code tiers et ne constitue ni une intégration MIDI ni une version Android.

Le choix du modèle de piano et de tablette appartient à la recette matérielle ; il ne conditionne pas cette analyse du projet.

## Références identifiées

| Référence | Dépôt | Révision consultée | Licence annoncée |
| --- | --- | --- | --- |
| Tonal | https://github.com/tonaljs/tonal | e555422aef910daa87cb924028f71f0a013f3ed7 | MIT |
| Piano Trainer Studio | https://github.com/ztbishop/piano-trainer-studio | 6c215c3c975285da86e9ab804b488f1085d96922 | AGPL-3.0 |
| PianoML | https://github.com/piano-ml/piano-ml | 174bc7abffaef62095ee056d40c61da614eaec9c | GPL-3.0 |

Conserver les mentions de licence et vérifier les conditions applicables avant toute reprise de code. L'ajout de liens n'importe pas ces projets dans Harmonie Trainer.

## Tonal : calcul musical

Sources :
- [Présentation](https://github.com/tonaljs/tonal).
- [Génération de voicings](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voicing).
- [Dictionnaires de voicings](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voicing-dictionary).
- [Sélection selon la conduite des voix](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voice-leading).

Usages à évaluer :
- Calculer notes, intervalles, transpositions et orthographes enharmoniques.
- Définir nos familles de voicings par intervalles, puis en déduire les notes dans chaque tonalité.
- Énumérer les réalisations d'un dictionnaire dans une tessiture donnée.
- Comparer les notes jouées aux réponses permises par l'exercice.
- Proposer une réalisation suivante à partir d'un voicing précédent.

Limites à préserver dans la conception :
- Tonal ne reçoit pas lui-même le MIDI, ne dessine pas les partitions et ne fournit pas notre programme pédagogique.
- La reconnaissance d'un ensemble de notes peut avoir plusieurs interprétations ; le contexte et la consigne doivent déterminer les réponses acceptées.
- Les dictionnaires ne sont pas une définition universelle de chaque symbole d'accord. Certains voicings enrichissent un accord de septième avec une neuvième. Nos niveaux doivent employer des réalisations explicites et contrôlées.
- Dans la révision consultée, le critère de conduite fourni par défaut est `topNoteDiff` : déplacement de la note supérieure. Il ne suffit pas à évaluer toutes les voix, les résolutions, les croisements et la qualité musicale d'un enchaînement.
- Les sections « Optional » du README du module voicing ne doivent pas être considérées comme des API implémentées sans vérification des exports et tests.
- Ne pas remplacer nos formules et évaluateurs déjà testés avant comparaison et tests de non-régression.

Exemple de règle pédagogique originale :
- F13 sans fondamentale, réalisation imposée 3–♭7–9–13 : La–Mi♭–Sol–Ré.
- Même réalisation sur B♭13 : Ré–La♭–Do–Sol.
- Le calcul des hauteurs est distinct du choix de l'octave, du doigté et du contexte musical.

## PTS : pratique interactive

Sources :
- [Application publique](https://pianotrainerstudio.com/).
- [Architecture](https://github.com/ztbishop/piano-trainer-studio/blob/6c215c3c975285da86e9ab804b488f1085d96922/docs/ARCHITECTURE.md).
- [Moteur de pratique](https://github.com/ztbishop/piano-trainer-studio/blob/6c215c3c975285da86e9ab804b488f1085d96922/docs/PRACTICE_ENGINE.md).
- [Code du moteur](https://github.com/ztbishop/piano-trainer-studio/blob/6c215c3c975285da86e9ab804b488f1085d96922/js/trainer-core.js).

Fonctions à étudier :
- Réception MIDI et correction visuelle.
- Modes Realtime, Wait for Me et Follow Me.
- Import de partitions et association entre notes attendues, curseur et notes jouées.

Dans le code consulté, le mode d'attente se choisit dans « Practice » → « Wait for Me ». L'avancement vérifie que toutes les notes attendues du groupe ont été marquées comme jouées. Cette condition ne garantit pas, à elle seule, que le voicing entier est tenu simultanément et sans notes étrangères. Définir puis tester nos exigences avant toute réutilisation.

Format de partition privilégié : MusicXML (`.musicxml`, `.xml`) ou MusicXML compressé (`.mxl`). Les imports MIDI, MuseScore et Guitar Pro reposent sur des conversions dont les limites sont documentées par PTS. Un PDF ou une image n'est pas directement une partition analysable par ce moteur.

PTS utilise déjà OpenSheetMusicDisplay (OSMD) pour le rendu des partitions, et Tone.js pour l'audio et la planification. OSMD n'est pas une deuxième application à juxtaposer à PTS. Une utilisation dans un APK Android reste un travail d'intégration à concevoir et à valider.

Aucun comportement de PTS n'a encore été vérifié ici sur un piano physique.

## PianoML : pratique d'une partition et cycles techniques

Ajout et consultation : 23 octobre 2026. Le lien est accessible depuis l'accueil de Harmonie Trainer et s'ouvre dans un nouvel onglet. Ressource externe, sans intégration, import automatique ou synchronisation des résultats.

Sources :
- [Application](https://pianoml.org/).
- [Dépôt et présentation](https://github.com/piano-ml/piano-ml).
- [Guide des commandes Practice / Workbench](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/frontend/src/app/desktop/components/workbench/workbench.tour.ts).
- [Cycles d'exercices](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/frontend/src/app/exercises/home/home.component.html).
- [Évaluation des notes](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/frontend/src/app/desktop/service/player-assess.service.ts).

Dans le code public consulté, « Practice » ouvre l'espace de travail d'une partition : lecture, connexion MIDI, attente sélectionnable pour la main droite, la main gauche ou les deux, tempo, métronome, sélection de mesures et boucle. Le projet annonce l'import MusicXML et MIDI ; l'OMR est une voie distincte pour les PDF et images, avec une qualité à vérifier.

Le parcours de travail que nous en retenons : écouter un passage ; sélectionner quelques mesures ; déchiffrer avec attente, éventuellement mains séparées ; réunir les mains ; répéter ; éprouver la continuité au tempo sans dépendre des pauses. Cette dernière progression est notre proposition pédagogique, pas une affirmation de paliers automatiquement imposés par le site.

« Exercises » propose des générateurs de gammes et des exercices d'agilité/accords/arpèges, avec choix de tonalité et de motif. Sa page présente des cycles explicites :
- Niveau 1 : deux tonalités par jour, sur douze jours pour les douze majeures et les douze mineures.
- Niveau 2 : relatives majeures et mineures regroupées sur six jours.
- Niveau 3 : tonalités parallèles majeures et mineures sur deux jours, après mémorisation des motifs précédents.
- Niveau 4 : tour complet en quintes ascendantes ou descendantes sur une journée. Il s'agit d'une proposition avancée, pas de notre objectif initial pour David.

Ces cycles sont un programme proposé dans la page ; ils ne prouvent pas une adaptation automatique aux acquis. La méthode est principalement orientée réalisation écrite, technique et répétition. Pour notre projet, la reconnaissance des fonctions, le choix de plusieurs voicings valides et le transfert vers un standard restent des objectifs à construire explicitement.

Limite observée dans le code d'attente : les hauteurs attendues sont retirées au fil des frappes, puis la lecture reprend lorsque l'ensemble des attentes est vide. Cela ne certifie pas à lui seul une attaque parfaitement simultanée du voicing ou une tenue complète. Ne pas confondre cette vérification avec l'évaluation d'un geste pianistique, d'un doigté, du son ou du swing.

Cette consultation porte sur la documentation et la révision publique indiquée ; aucune session de jeu physique, validation de nos MusicXML dans PianoML ou conformité de cette révision avec le déploiement courant n'est revendiquée.

## Continuité avec notre pédagogie

Préserver :
- Les cours, QCM, clavier tactile, exercices et sauvegardes existants.
- Les huit niveaux de construction indépendants de la difficulté tonale.
- La distinction entre renversement, disposition et voicing sans fondamentale.
- Des réalisations pédagogiques explicites : notamment neuvièmes à quatre notes et treizièmes à cinq notes dans les exercices existants ; les nouveaux rootless doivent avoir leur propre contrat.
- La séparation entre justesse harmonique, conduite des voix et rythme.
- Les corrections montrant simultanément le jeu de l'élève et les changements proposés.
- Des identifiants d'exercices stables et des résultats distinguant compréhension tactile et réalisation au piano.

Piste prioritaire à éprouver : enrichir Harmonie Trainer avec une entrée MIDI et un moteur de validation du jeu, utiliser Tonal pour les calculs utiles et étudier les mécanismes de PTS. La reprise complète de PTS n'est pas décidée.

Premier jalon proposé : une leçon existante menée de bout en bout, de l'explication à la construction tactile, puis au jeu MIDI, à la correction et à la sauvegarde du résultat. La partition ne remplace pas les règles de l'exercice.

## Standards et transfert vers le jeu

Voir [Sources de standards et transfert vers le jeu](SOURCES_STANDARDS_ET_TRANSFERT.md) : JAZZMUS, Jazz Harmony Treebank, OpenEWLD et sources complémentaires, formats, conditions d'accès, limites et premiers cas pédagogiques. Ce document distingue grille, arrangement écrit et voicings générés.

## Architecture de pratique et doigtés

La [direction de travail consolidée](ARCHITECTURE_PRATIQUE_HARMONIQUE_ET_DOIGTES.md) distingue les générateurs Tonal, la pratique inspirée de PianoML, les doigtés proposés et vérifiés, et l'éventuelle harmonisation automatique. Elle fixe l'affichage des doigts sur le clavier, les trois axes de choix d'exercices et les étapes de transfert vers un standard. Elle documente aussi les rôles réels des scripts AutoHarmonizer et PianoPlayer consultés.
