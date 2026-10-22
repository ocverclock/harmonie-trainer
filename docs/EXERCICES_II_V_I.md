# Exercices II–V–I : basses et transformation du I en II

Premier essai MusicXML réalisé le 22 octobre 2026 avec Tonal 6.5.1, destiné à Piano Trainer Studio (PTS). Ces exercices sont originaux et prolongent l'analyse du projet Harmonie Trainer.

## Partitions enregistrées

- [Test court : trois cadences](../samples/ii-v-i/II-V-I_test_court.musicxml) : Do, Si bémol, La bémol ; 9 mesures et 54 notes.
- [Deux boucles couvrant les douze tonalités](../samples/ii-v-i/II-V-I_12_tonalites.musicxml) : 36 mesures et 216 notes.

Dans la série majeure, chaque accord dure une ronde en 4/4, au tempo indicatif de 60 à la noire. Les six notes sont réparties ainsi : main gauche = fondamentale et quinte, main droite = quatre notes de voicing. C'est une réalisation particulière pour la pratique à deux mains, pas une modification des structures des huit niveaux existants.

Dans PTS : importer le MusicXML depuis Scores ; sélectionner Practice → Wait for Me ; cocher Left et Right pour que l'attente porte sur les six notes.

## Progression demandée

Le I d'une cadence devient le II de la cadence suivante, en conservant sa fondamentale :

1. Dm9 → G13 → Cmaj9.
2. Cm9 → F13 → B♭maj9.
3. B♭m9 → E♭13 → A♭maj9.

À la jonction Cmaj9 → Cm9, Do–Sol restent à la main gauche ; Mi–Sol–Si–Ré deviennent Mi♭–Sol–Si♭–Ré à droite. Les tierce et septième majeures descendent chacune d'un demi-ton ; quinte et neuvième restent en place. Le générateur impose cette transformation dans les mêmes octaves à l'intérieur de chaque boucle.

Cette chaîne descend par tons et visite six tonalités :

- Boucle 1 : Do, Si♭, La♭, Sol♭, Mi, Ré.
- Boucle 2 : Ré♭, Si, La, Sol, Fa, Mi♭.

Le deuxième départ est décalé d'un demi-ton. Le changement entre les deux boucles est signalé dans la partition ; il ne constitue pas une jonction I → II. Certaines orthographes changent par enharmonie pour éviter des armures inutilement complexes, par exemple Sol♭maj9 → Fa♯m9.

## Qui choisit les voicings ?

Le dictionnaire ci-dessous est défini dans notre générateur. Tonal calcule les notes et les positions possibles dans la tessiture demandée. Notre code choisit ensuite une combinaison en limitant les déplacements des quatre voix ordonnées et en privilégiant le registre central.

| Famille | Formule A, main droite du grave vers l'aigu | Formule B, main droite du grave vers l'aigu |
| --- | --- | --- |
| m9 | ♭3–5–♭7–9 | ♭7–9–♭3–5, avec octaves adaptées |
| 13 | 3–13–♭7–9 | ♭7–9–3–13 |
| maj9 | 3–5–7–9 | 7–9–3–5, avec octaves adaptées |

Exemples : Dm9 = Fa–La–Do–Mi ou Do–Mi–Fa–La ; G13 = Si–Mi–Fa–La ou Fa–La–Si–Mi ; Cmaj9 = Mi–Sol–Si–Ré ou Si–Ré–Mi–Sol. Les fondamentales sont jouées à la main gauche.

Le calcul musical et la sélection sont déterministes : il n'y a ni IA générative, ni décision pédagogique spontanée de Tonal. La sélection est locale à chaque cadence et contrainte par les jonctions ; elle ne prétend pas optimiser globalement toute la chaîne ni déterminer un doigté humain.

## Régénérer et vérifier

Le laboratoire dispose de son propre package et d'un verrou de dépendances. Il n'ajoute pas Tonal à l'application chargée par le navigateur.

Depuis la racine du dépôt :

```bash
npm ci --prefix tools/voicing-lab
npm run check --prefix tools/voicing-lab
npm run generate --prefix tools/voicing-lab
```

`check` ne modifie pas les partitions. Il vérifie la reproduction exacte des fichiers enregistrés et exécute les assertions musicales du générateur : notes des accords, six touches distinctes, tessitures, séparation des mains, couverture des douze tonalités et transformation I → II avec fondamentale de basse conservée.

## Vérifications et limites

- Notes et transpositions calculées avec Tonal 6.5.1.
- Structure XML, six notes par mesure et durées des deux voix contrôlées.
- Les deux fichiers ont été chargés et rendus avec OpenSheetMusicDisplay 2.2.1 ; le test court a été inspecté visuellement.
- Le rendu OSMD ne vaut pas un test d'import complet dans PTS, et aucun test de jeu sur piano physique n'est revendiqué.
- L'attente de PTS marque les notes jouées ; la simultanéité, les notes supplémentaires et la pédale devront être évaluées séparément pour notre application.

## Variantes à développer

Les deux formules par famille sont déjà présentes dans le dictionnaire, mais ne sont pas encore exposées comme options utilisateur. Les variantes suivantes restent à concevoir et tester :

- Imposer une formule A ou B pour comparer les positions.
- Basse seule, fondamentale–septième ou autre répartition des deux mains.
- Positions ouvertes et drop-2, avec contrôle de l'écartement et de la jouabilité.
- Autres dominantes altérées et réalisations mineures ; la première série II–V–I mineure est disponible ci-dessous.
- Rythmes d'accompagnement et indépendance des mains, après validation des notes.

Références : [Tonal et PTS](REFERENCES_MIDI_VOICINGS.md), [module Tonal Voicing](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voicing). Tonal est distribué sous licence MIT ; aucun code de PTS n'est copié ici.

## Série mineure — première réalisation, 22 octobre 2026

- [Test court mineur](../samples/ii-v-i/II-V-I_mineur_test_court.musicxml) : Do mineur, Si♭ mineur, La♭ mineur ; 9 mesures, 54 notes.
- [Deux boucles mineures dans les douze tonalités](../samples/ii-v-i/II-V-I_mineur_12_tonalites.musicxml) : 36 mesures, 216 notes.

La progression est II demi-diminué → V7♭9 → I mineur 6/9, puis le I devient le II suivant sur la même fondamentale :

1. Dm7♭5 → G7♭9 → Cm6/9.
2. Cm7♭5 → F7♭9 → B♭m6/9.
3. B♭m7♭5 → E♭7♭9 → A♭m6/9.

| Accord | Main gauche | Main droite, du grave vers l'aigu |
| --- | --- | --- |
| Dm7♭5 | Ré3–La♭3 | Fa4–La♭4–Do5–Fa5 |
| G7♭9 | Sol3–Ré4 | Fa4–La♭4–Si4–Ré5 |
| Cm6/9 | Do3–Sol3 | Mi♭4–Sol4–La4–Ré5 |

Le II contient la quinte diminuée, y compris à la main gauche : aucune quinte juste n'est ajoutée. Le V contient la tierce majeure et la neuvième mineure. Le I choisi contient une sixte majeure et une neuvième, sans septième ; par exemple La naturel et Ré dans Cm6/9. Une tonique mineure avec septième majeure sera une autre réalisation à étudier, et n'est pas mélangée à celle-ci.

Les six notes sont six touches distinctes ; sur le II certains degrés sont doublés à l'octave. Ce n'est pas un accord à six classes de hauteurs différentes.

À la jonction Cm6/9 → Cm7♭5, la fondamentale Do reste en place. La quinte de basse Sol descend à Sol♭. À droite, les notes sont choisies pour obtenir tierce mineure, quinte diminuée et septième mineure avec doublure ; les déplacements sont minimisés. On n'applique pas la règle des tierce et septième majeures abaissées du cycle majeur.

Deux boucles par tons descendants :
- Do mineur, Si♭ mineur, La♭ mineur, Fa♯ mineur, Mi mineur, Ré mineur.
- Do♯ mineur, Si mineur, La mineur, Sol mineur, Fa mineur, Mi♭ mineur.

Fa♯ mineur et Do♯ mineur évitent des armures à neuf ou dix bémols. Les changements enharmoniques ne changent pas les touches physiques à la jonction I → II. Les deux boucles sont distinctes.

### Régénération de la série mineure

```bash
npm run generate:minor --prefix tools/voicing-lab
npm run check:minor --prefix tools/voicing-lab
```

`npm run check --prefix tools/voicing-lab` contrôle désormais les deux séries, majeure et mineure. `generate:all` régénère les quatre fichiers.

Le générateur mineur est séparé pour conserver les exemples majeurs à l'identique. Tonal utilise le symbole interne `m69` ; la partition porte une harmonie MusicXML « minor-sixth » avec neuvième ajoutée. Les harmonies de II et V sont encodées comme demi-diminué et dominante avec neuvième abaissée.

Contrôles : reproduction exacte, notes et durées des deux portées, basses justes/diminuées, orthographes enharmoniques avec octaves réelles (dont Do♭ et Fa♭), couverture des douze fondamentales, lecture et rendu OSMD. L'import et l'attente sur un piano physique restent à vérifier. Les variantes A/B ne constituent pas le chantier de cette série.

## Registre de lecture retenu — 22 octobre 2026

Les quatre fichiers de référence ci-dessus utilisent désormais la version plus lisible, à la demande de l'utilisateur. Ils remplacent les premières versions sous les mêmes noms et aux mêmes liens ; les doublons suffixés `_lecture` sont retirés.

Toutes les notes des deux mains sont décalées ensemble de **+12 demi-tons par rapport au premier essai**. Les voicings, intervalles entre les mains, basses, renversements, conduites des voix, tonalités et durées sont strictement conservés. Les clés restent sol à droite et fa à gauche, sans clé transpositrice : PTS attend les touches une octave au-dessus du premier essai.

Maximum de lignes supplémentaires par note : une dans la série majeure, deux dans la série mineure complète, une dans les deux tests courts, contre quatre dans les premières versions.

Les générateurs majeur et mineur conservent leur sélection de positions puis relèvent uniformément l'octave à l'écriture des hauteurs MusicXML. Il n'y a aucun second traitement à appliquer aux fichiers de référence. Les commandes habituelles `generate:all` et `check` produisent et vérifient directement ces quatre fichiers.

Les premiers essais restent consultables dans l'historique Git avant le remplacement. Contrôles : reproduction exacte des quatre partitions de lecture déjà validées, transposition de +12 pour chaque note par rapport au premier essai, conservation des harmonies et durées, structure XML et rendu OSMD. Aucun essai sur l'iPad ou un piano physique n'est revendiqué.
