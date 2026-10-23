# Direction de travail : pratique harmonique, Tonal et doigtés

Consolidation des décisions du 23 octobre 2026. Document de conception validé dans la conversation ; il ne constitue pas une intégration déjà réalisée.

## Objectif

Prolonger Harmonie Trainer / Tetra vers une pratique au piano MIDI sur Android : comprendre une structure, construire une réalisation, la jouer, puis retrouver le même mouvement dans un standard. PianoML est une base à étudier pour l'espace de pratique et les générateurs d'exercices, aux côtés de PTS ; aucun fork ni déploiement de notre propre PianoML n'est créé à ce stade.

Préserver les huit niveaux pédagogiques existants et la séparation entre structure d'accord et difficulté de tonalité. La richesse du voicing, le registre et le rythme doivent être des choix explicites.

## Répartition des responsabilités

| Élément | Rôle retenu ou envisagé | Limite |
| --- | --- | --- |
| Moteur pédagogique Harmonie Trainer | Objectifs, structures permises, fonctions, réalisations, critères d'évaluation et transfert aux standards. | Une bonne réponse écrite ne prouve pas une maîtrise au piano. |
| Tonal | Notes, intervalles, transpositions et candidats de voicings dans nos dictionnaires. | Ne choisit pas les doigts, ne fournit pas notre progression et ne transforme pas seul un thème en accompagnement abouti. |
| Espace de pratique inspiré de PianoML / PTS | Partition, clavier virtuel, MIDI, mains séparées, attente, boucle, tempo et retour visuel. | Une réalisation imposée ne remplace pas le futur correcteur acceptant plusieurs voicings. |
| Couche de doigtés | Propositions contextualisées et validées, variantes personnelles, correspondance avec les notes affichées. | La correction harmonique des notes ne garantit pas la cohérence du geste. |
| AutoHarmonizer, éventuellement | Proposer une grille pour une mélodie sans accords, ou explorer une autre harmonisation. | Génération de suggestions, distincte du calcul de voicings, de leur validation pédagogique et du doigté. |

Chaîne proposée : consigne harmonique → candidats Tonal → sélection selon le contexte → doigtés vérifiés → MusicXML et affichage clavier → pratique MIDI → transfert vers le morceau.

Pour l'autonomie Android, privilégier d'abord les exercices générés à l'avance et/ou les calculs Tonal locaux. Les traitements Python et les modèles ML de PianoML sont des traitements serveur dans l'architecture consultée ; leur présence dans un dépôt n'en fait pas des fonctions disponibles hors connexion dans un navigateur Android.

## Générateurs d'exercices harmoniques

Étendre le principe des exercices de gammes de PianoML avec trois choix indépendants :

| Axe | Premières possibilités |
| --- | --- |
| Contenu harmonique | II–V–I majeur et mineur ; ensuite dominantes secondaires et substitutions tritoniques. |
| Réalisation pianistique | Notes-guides, voicings avec basse, puis variantes A/B explicitement définies. |
| Parcours tonal | Une tonalité, chaîne où le I devient II, cycle des quintes, ordre mélangé. |

La première version joue une réalisation écrite déterminée et connue du correcteur. Le mode où plusieurs dispositions correctes sont acceptées demande un contrat d'évaluation harmonique supplémentaire ; il n'est pas assimilé au mode d'attente de PianoML.

La cadence doit ensuite être travaillée dans un passage réel, avec ses mesures avant et après, sa durée harmonique et le contexte mélodique. Le [pilote Blue Bossa](BLUE_BOSSA_PILOTE_PEDAGOGIQUE.md) sert de premier cas : ses retards et sa dominante ♯9 montrent les limites d'une sélection de voicings reposant uniquement sur les symboles.

## Doigtés : exigences retenues

### Choix musical et vérification physique

- Commencer avec quelques réalisations précises et des doigtés éprouvés sur toute la cadence, y compris le passage du I au II suivant.
- Contrôler séparément les transpositions : déplacer la structure sur les touches ne garantit pas de conserver le même doigté.
- Évaluer le registre, les écarts, les touches noires, les notes communes, les tenues, la position précédente et la suivante, ainsi que les possibilités de la main.
- Présenter le résultat comme un **doigté proposé**, pas comme l'unique solution.
- Permettre sa modification et la sauvegarde d'une variante personnelle.
- Afficher l'absence de proposition quand aucun doigté n'a été validé ; ne pas remplir automatiquement les chiffres pour donner une illusion de complétude.
- Toute évolution vers la génération automatique devra être comparée à des solutions vérifiées au piano, sur des séquences et pas uniquement sur des accords isolés.

Statuts proposés : absent, candidat automatique non validé, proposition vérifiée, variante personnelle. La provenance et le contexte de validation doivent être conservés ; une modification de disposition, d'octave ou de séquence rend nécessaire une nouvelle vérification.

### Affichage sur le clavier virtuel

Demande retenue : afficher les chiffres **1 à 5 directement sur les touches attendues**, en plus de leur présence dans la partition.

- Distinguer les deux mains par une indication cohérente avec les couleurs du clavier.
- Associer chaque chiffre à une note et à un instant précis ; aucun doigté global et permanent d'une touche.
- Rendre les chiffres lisibles sur touches blanches et noires.
- Prévoir le masquage de l'aide lorsque le geste est acquis.
- Gérer les accords, les reprises, les notes liées, les changements de position et les éventuelles substitutions de doigt sans transférer le chiffre à la mauvaise note.
- Ne pas inventer un doigté à l'affichage lorsque la source n'en fournit pas.

Le MIDI d'un piano transmet notamment les notes et vélocités, pas l'identité du doigt. Cet affichage propose donc un geste ; il ne certifie pas que l'élève utilise ce doigt. Une validation du doigté joué demeure humaine dans ce périmètre.

Les exercices MusicXML créés jusqu'ici pour nos II–V–I et Blue Bossa ne contiennent pas encore de doigtés validés.

## Ce que PianoML possède déjà pour les doigtés

Révision consultée : [174bc7abffaef62095ee056d40c61da614eaec9c](https://github.com/piano-ml/piano-ml/tree/174bc7abffaef62095ee056d40c61da614eaec9c).

- [Clavier](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/frontend/src/app/desktop/service/player-keyboard.service.ts) : coloration des touches et distinction des mains ; aucun rendu de chiffres de doigté dans ce service.
- [Import MusicXML](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/backend/scripts/musicxml2pack.sh) : si l'option MAKE_FINGERING est activée et qu'aucun doigté n'est détecté, le script lance PianoPlayer pour en proposer.
- [extract_fingering.py](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/backend/scripts/extract_fingering.py) : extrait les annotations de doigté en JSON. Il ne les invente pas. La sortie est une liste par partie ; elle ne fournit pas explicitement pour chaque entrée une hauteur, un temps et une main.
- La correspondance entre doigt, hauteur et main devra donc être auditée et rendue robuste avant l'affichage sur les touches, notamment pour les notes d'un même accord et nos partitions à une partie/deux portées.

[PianoPlayer](https://github.com/marcomusy/pianoplayer) est une référence à évaluer avant de réinventer un générateur : le projet décrit une recherche de doigtés réduisant les mouvements sur une séquence, avec taille de main et profondeur de recherche. La documentation actuelle décrit aussi l'utilisation de doigtés préexistants comme points d'ancrage. Ces possibilités ne prouvent ni qu'elles sont présentes dans la version installée par PianoML ni que le résultat convient à nos voicings jazz ; aucune version de PianoPlayer ni qualité de doigté n'a été testée ici.

## Les scripts d'harmonie : clarification des noms et rôles

Aucun fichier nommé exactement `harmonisation.py` n'a été trouvé dans l'arbre actuel de Harmonie Trainer ou de PianoML. Les fichiers proches effectivement consultés sont les suivants.

| Fichier | Fonction observée |
| --- | --- |
| [harmonizer.py](https://github.com/piano-ml/autoharmonizer/blob/3b3a72179f38e3d98ace1ca9a4682f8663bc90bd/harmonizer.py), dans le dépôt AutoHarmonizer de PianoML | Charge un modèle appris et propose successivement des accords à partir de la mélodie, de la position rythmique, de la tonalité encodée et des accords déjà générés. Exporte un MXL en ajoutant des symboles d'accords. Ce code ne réalise pas les doigtés et ne constitue pas notre générateur de positions pianistiques. |
| [auto_harmonize.sh](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/backend/scripts/auto_harmonize.sh) | Prépare le fichier, appelle `harmonizer.py`, puis reconvertit la sortie avec MuseScore. |
| [extract_harmonies.py](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/backend/scripts/extract_harmonies.py) | Lit les symboles d'accords déjà présents dans le MusicXML et exporte mesure, temps, fondamentale, famille et éventuellement basse. Cette extraction ne décide pas des accords. |
| [extract_chord_progression.py](https://github.com/piano-ml/piano-ml/blob/174bc7abffaef62095ee056d40c61da614eaec9c/backend/scripts/extract_chord_progression.py) | Recherche des motifs répétés dans une liste d'accords et tente un chiffrage en degrés selon une tonalité fournie. Ce n'est pas une analyse des fonctions et modulations déjà validée pour notre usage. |

AutoHarmonizer consulté : [révision 3b3a72179f38e3d98ace1ca9a4682f8663bc90bd](https://github.com/piano-ml/autoharmonizer/tree/3b3a72179f38e3d98ace1ca9a4682f8663bc90bd). Son [README](https://github.com/piano-ml/autoharmonizer/blob/3b3a72179f38e3d98ace1ca9a4682f8663bc90bd/README.md) présente l'adaptation d'un système entraîné sur des lead sheets Wikifonia. Dans le code lu, l'export ajoute des objets `ChordSymbol` ; cela ne doit pas être confondu avec une partie de piano complète à jouer.

Points de vigilance constatés :
- Dans les scripts d'import MusicXML et MIDI consultés, les appels à l'harmonisation automatique sont commentés. Le code est prévu et la dépendance installée dans le Dockerfile ; cela ne démontre pas une fonctionnalité active du site public.
- L'extracteur `extract_harmonies.py` ne transmet pas explicitement les éléments MusicXML `degree` dans sa sortie. Des tensions comme la ♯9 de notre Blue Bossa doivent être préservées dans notre propre chaîne.
- Le script de progressions emploie des conversions de familles et un chiffrage sommaires. Les résultats ne doivent pas être utilisés comme corrigés pédagogiques sans contrôle.
- Aucun de ces scripts n'a été exécuté dans cette consultation et aucun modèle n'a été téléchargé.

Pour le premier jalon, utiliser la grille source contrôlée et les règles explicites de notre moteur avec Tonal. Réserver les propositions AutoHarmonizer à une exploration distincte, clairement identifiée comme suggestion à vérifier.

## Jalons proposés et état réel

| Jalon | État au 23 octobre 2026 |
| --- | --- |
| II–V–I majeurs/mineurs avec basse, MusicXML lisibles et génération Tonal reproductible | Créés, enregistrés dans Git et vérifiés en XML/OSMD. |
| Analyse d'un standard et trois études Blue Bossa | Créées, enregistrées dans Git et vérifiées en XML/OSMD. |
| PianoML dans les liens de l'accueil | Ajouté et présence du lien vérifiée sur le site publié. |
| Affichage des doigtés sur le clavier virtuel | Exigence documentée ; non codée. |
| Banque de doigtés vérifiés pour nos cadences et leurs transpositions | À constituer et éprouver au piano. |
| Choix interactif des exercices harmoniques et des parcours tonals | Conception documentée ; non intégré à PianoML. |
| Correction MIDI acceptant plusieurs voicings et évaluant leur simultanéité | À concevoir et tester. |
| Fork PianoML, application Android et autonomie hors connexion | Pistes à étudier ; non réalisés. |

Premier prototype proposé : un II–V–I majeur et un mineur dans une tonalité chacun, six touches avec basse, doigtés vérifiés et affichés au clavier ; validation physique de la transition complète ; extension contrôlée aux autres tonalités ; transfert vers Blue Bossa.

Cette consolidation modifie uniquement la documentation du projet.
