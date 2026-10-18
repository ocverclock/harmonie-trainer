# P01 — Socle de tests d'acceptation pédagogiques

**Date :** 18 octobre 2026. **Suivi :** [plan horaire #18](https://github.com/ocverclock/harmonie-trainer/issues/18). **Portée :** tests et documentation uniquement ; la production n'est pas modifiée.

## Invariants protégés avant d'avancer

| Domaine | Attendu |
| --- | --- |
| Parcours principal | 4 chapitres, 21 leçons, 89 exercices |
| Historique V1 | 52 exercices initiaux inchangés, identifiés par `lessonId:index` |
| Extensions V1 | 37 variantes avec IDs explicites, sans collisions et sans remanier le parcours |
| Correction du Parcours | `exact` vérifie les vraies touches MIDI ; `free` vérifie les classes de hauteurs, sans doubles classes |
| Registre | Toutes les notes du piano pédagogique entre MIDI 48 et 83 |
| Construction | 8 niveaux avec structures fixes ; 3 difficultés ne changent que les fondamentales |
| Jazz | Neuvièmes à 4 notes, treizièmes à 5 notes ; pas de quinte/onzième involontaire |
| Conduite des voix | 5 études en 3 accords, voicings corrects indépendamment de leur inversion |
| Oreille | 5 familles, 60 premiers exercices jouables dans des tonalités variées |
| Réharmonisation | 4 études guidées avec mélodies originales et deux options valides dans chaque |
| Sauvegardes | L'archive JSON version 2 préserve les réussites V1 sans inventer de nouvelles tentatives |

## Tests ajoutés

`tests/pedagogy-baseline.test.js` parcourt le programme réel et établit des assertions transversales. La CI du dépôt exécute `node --test` sans dépendance additionnelle. Ce test constitue un **filet de sécurité** pour les lots P02 à P24.

## Observation produite par le premier passage CI

- Le test a signalé un commentaire réellement très court dans la leçon `cadences-secondaires`, exercice initial `Am7 — II de G` : `A C E G.`. Ce commentaire est correct pour l'orthographe, mais n'explique pas la **fonction II** ou la conduite des voix. La suite P09/P12 devra rendre l'explication pédagogique plus instructive ; pour P01 on exige une justification présente et non une longueur arbitraire qui invaliderait la banque existante.

## Lacunes identifiées pour les lots suivants

- Le score de conduite des voix est aujourd'hui une distance entre quatre hauteurs classées grave–aigu : il ne suffit pas à expliquer le *pourquoi* d'une note-guide ; P02 et P03 devront séparer analyse musicale et choix pianistique.
- Les introductions sont textuelles avec écoutes : les cours de vrais renversements, notes-guides et extensions méritent une démonstration progressive ; P07 à P12.
- Le suivi conserve des tentatives V2 mais ne propose pas encore un diagnostic global par notion / fondamentale ; P13 à P17.
- Les sessions « Accords » dans `harmonie-sessions-v2` sont séparées du registre `harmonie-progress-v2` : P13/P17 devront maintenir une compatibilité explicite.
- Les 60 questions d'oreille sont prédictibles par index : P19 doit introduire une variété réelle tout en conservant les IDs, sans divulguer les notes avant réponse.
- Les mélodies de réharmonisation actuellement proposées sont guidées (3 sons) : P22 et P23 élargiront les options et le rôle des tensions.
- La compatibilité tactile Safari, la restitution audio et la restauration de fichiers sur des appareils physiques demandent une recette réelle ; P24 ne devra pas revendiquer un test matériel inexistant.

**Définition de terminé pour P01 :** CI des nouveaux tests verte sur une PR dédiée ; aucune modification aux modules applicatifs ni aux historiques.
