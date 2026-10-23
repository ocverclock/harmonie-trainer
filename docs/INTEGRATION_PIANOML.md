# PianoML dans Harmonie Trainer

## État de cette intégration

Le code de PianoML est importé dans `apps/pianoml`, à partir de
[piano-ml/piano-ml](https://github.com/piano-ml/piano-ml), branche `develop`,
commit `174bc7abffaef62095ee056d40c61da614eaec9c`.
Il constitue la base de travail du futur lecteur interactif. Le trainer statique
actuel reste à la racine. Les workflows amont, imbriqués dans ce dossier,
ne sont pas des workflows actifs du dépôt Harmonie Trainer.

Les licences et attributions amont sont conservées, notamment GPL-3.0 dans
`apps/pianoml/LICENSE`. Les modifications apportées à cette base sont soumises
à sa licence. Cette importation n'inclut pas la bibliothèque de partitions
hébergée par PianoML, ses comptes ou ses fichiers privés.

## Changements fonctionnels

- Accueil : `/` redirige immédiatement vers `/summary`. Les composants d'accueil
  WebGL et CSS animés sont supprimés. Aucun rendu WebGL d'introduction ne tourne
  en arrière-plan. Les anciens shaders restent dans les ressources amont mais
  ne sont plus exécutés par l'accueil.
- Clavier : affiche les chiffres 1 à 5 déjà présents dans les annotations
  MusicXML, à partir des notes OSMD au curseur. Cela réutilise l'alignement
  partition/MIDI existant, y compris ses reprises ; aucun second alignement
  approximatif par ordre de notes n'est introduit.
- Les chiffres suivent le curseur, les retours au début et les changements de
  partition. La recréation du clavier reprend la position courante. Les réglages
  existants pour masquer les doigtés s'appliquent aussi au clavier.
- Sur une partie à deux portées, portée 1 = main droite (jaune), portée 2 = main
  gauche (bleu). C'est une convention de piano, pas une détection des mains.
  Pour une autre instrumentation, les chiffres restent neutres. Les doigtés
  absents ou ambigus (substitutions, combinaisons) sont laissés vides.
- Les chiffres sont placés dans le SVG du clavier, suivent son redimensionnement
  et laissent passer les clics. Ils indiquent le doigt proposé ; le MIDI ne
  permet pas de connaître le doigt réellement employé.

Tonal et nos règles pédagogiques ne sont pas encore raccordés à ce lecteur.
Nos exercices harmoniques existants n'ont pas encore de doigtés validés : cette
modification ne leur invente pas de numéros. Le prochain chantier consiste à
ajouter le parcours harmonique et ses doigtés relus au générateur d'exercices.

## Développement local

Prérequis : Node 24, npm, Java 17 ou supérieur pour le générateur OpenAPI.
Depuis la racine du dépôt :

```sh
cd apps/pianoml/frontend
npm ci --ignore-scripts
npm run test:integration
npm run build:prod
npm start
```

`npm start` génère le client API et lance Angular avec `proxy.conf.json`.
Le proxy de développement vise le serveur local sur le port 8080. En production,
configurer `/api` sur notre backend. Adapter les variables serveur selon le
README amont. Les configurations amont vers le service public ne sont plus les
valeurs utilisées par défaut.
Aucun serveur, compte ou stockage distant n'est provisionné par cette importation.

PianoML utilise aussi un backend Java, PostgreSQL et du stockage compatible S3
pour la bibliothèque et les imports. Son déploiement complet nécessite leur
configuration. Copier son dossier sur GitHub Pages ne suffit pas. L'intégration
n'active pas automatiquement cette nouvelle application sur le site public.
Les exercices générés localement peuvent être étudiés indépendamment, mais
l'autonomie hors connexion complète n'est pas encore vérifiée.

## Validation

- Compilation Angular en développement et en production réussie. La compilation
  conserve des avertissements amont concernant les tailles CSS et CommonJS.
- Tests Node : accord à deux mains, absence de doigté, numéros ambigus,
  changement de doigt sur une même hauteur, touches blanches/noires,
  nettoyage et notes hors de la plage du clavier.
- Lecture d'un vrai MusicXML par OSMD : vérification des doigtés de chaque note
  d'accord et de l'identité des deux portées.
- Tests du trainer exécutés séparément de ceux d'Angular. Une ancienne assertion
  de référence a été actualisée : les cinq cadences historiques sont préservées
  et les sept transpositions déjà présentes portent le total à douze.
- Essai visuel sur Android et essai MIDI avec piano physique encore à réaliser.
  Les tests ne mesurent pas le gain CPU/GPU sur la tablette.

## Suivi amont

L'import est une copie versionnée, pas un sous-module ni une fusion de deux
applications déjà raccordées. Pour une mise à jour, comparer la version amont
avec le commit indiqué ci-dessus, réappliquer nos changements et relancer les
tests. Les fichiers de référence amont restent identifiables ; ne pas écraser
le trainer existant lors d'une mise à jour.
