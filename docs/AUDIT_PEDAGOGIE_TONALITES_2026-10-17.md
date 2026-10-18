# Audit pédagogique — Harmonie Trainer (17 octobre 2026)

**Statut : analyse du code existant ; aucune modification fonctionnelle ni publication.**  
**Issue :** [#5 — mini-cours, renversements et tonalités](https://github.com/ocverclock/harmonie-trainer/issues/5).  
**Source analysée :** `src/curriculum.js` et `src/curriculum-ui.js` sur `main`, avant toute réécriture.

## 1. Résultats constatés

- Le corpus contient **21 leçons et 52 exercices**, répartis sur quatre parties.
- Chaque leçon fournit un `title`, un `summary` et un `principle` ; l'interface affiche une phrase de principe, puis enchaîne immédiatement sur la saisie au piano. Le `why` détaillant une partie de l'explication arrive **après** la vérification. C'est un **entraînement interactif**, pas encore une méthode avec cours préalable.
- **195 des 213 notes MIDI prescrites** dans les 52 exercices sont des touches blanches (**91,5 %**) ; seules **18/213**, soit **8,5 %**, sont des touches noires. Ce comptage porte sur les notes attendues des exercices et non sur les tonalités effectivement travaillées par un élève.
- La plupart des premières leçons restent centrées sur Cmaj7, Fmaj7, G7, Am7, Dm7. L'alternance des tonalités n'est pas construite comme une compétence indépendante.
- Le clavier réel couvre MIDI **48–83** ; les exemples doivent rester jouables dans cette plage, y compris lors des transpositions.

### Distinction à enseigner explicitement

**Renversement** : la note de basse change. Pour Cmaj7, les quatre états serrés sont par exemple C3–E3–G3–B3 (fondamental), E3–G3–B3–C4 (1er renversement), G3–B3–C4–E4 (2e), B3–C4–E4–G4 (3e).  
**Position / disposition** : la basse peut rester sur C tandis que les voix supérieures changent de registre et d'ordre, par exemple C3–E3–B3–G4 (1–3–7–5) ou C3–G3–E4–B4 (1–5–3–7).  
La suite actuelle présente surtout des dispositions à basse fixe. Elle ne doit pas appeler « renversements » ces six positions.

## 2. Architecture de mini-cours à placer avant les exercices

Chaque **partie** affiche une introduction d'environ 120–200 mots avec objectif, prérequis, intérêt sonore, démonstration au clavier et un aperçu « ce que tu sauras faire ». Chaque **leçon** comporte des blocs progressifs originaux :

1. **Objectif et utilité** : une question musicale concrète (« pourquoi placer la 7e au milieu ? »).
2. **Découvrir** : 4 à 8 phrases, vocabulaire défini, degrés et noms de notes.
3. **Comparer et écouter** : deux dispositions ou deux tonalités, bouton de lecture, clavier annoté ; audio seulement après geste.
4. **Un exemple entièrement résolu** : succession des degrés, notes, octaves et justification de la conduite des voix.
5. **Contrôle de compréhension** : un mini-quiz non noté sur fondamentale/3e/7e, position ou attraction.
6. **Exercices actifs** : création au clavier, correction immédiate et explication des erreurs.
7. **Transposer** : reprise de la même compétence dans une autre tonalité, sans donner la réponse d'avance.
8. **Synthèse et progression** : pourquoi la réalisation fonctionne, compétence acquise ou à revoir.

Les cours doivent rester consultables après une réponse incorrecte. Deux modes de correction distincts : **classe de hauteur** (renversements autorisés) et **MIDI exact** (disposition imposée). Dans ce dernier mode, afficher clairement le registre attendu avant la saisie pour éviter une énigme impossible.

## 3. Audit spécifique des 21 leçons et enrichissements prioritaires

| Leçon | Problème actuel | Mini-cours à ajouter | Variation tonale |
| --- | --- | --- | --- |
| 1. Tétrades | Débute directement sur les notes | Formule 1–3–5–7 ; majeure, mineure, dominante ; état fondamental versus trois renversements | C puis F♯m7 / B♭maj7 |
| 2. 1–3–7–5 | Position non expliquée | Différence position / renversement ; 5e au soprano ; comparaison sonore | Cmaj7 → Dmaj7 |
| 3. 1–5–7–3 | Risque de mémorisation mécanique | Pourquoi déplacer la 5e avant la 7e ; tension 7e–3e | Fmaj7 → A♭maj7 |
| 4. 1–5–3–7 | Aucun contexte d'utilisation | Soprano sur 7e, voix intérieures, ouverture | Cmaj7 → Emaj7 |
| 5. 1–7–3–5 | Confusion ordre / renversement | Septième intérieure ; conduite des voix à partir de 3/7 | G7 → D♭7 |
| 6. 1–7–5–3 | Saut étendu non discuté | Timbre et limite du registre ; travailler sans étirement excessif | Cmaj7 → B♭7 |
| 7. Accords de sixte | m6 perçu comme m♭6 | Maj6 versus m6 ; comparaison maj7/6 et m7/m6 | C6/Cm6 → E♭6/F♯m6 |
| 8. Notes-guides | Deux notes à copier | Guide tones 3–7, triton, rôle fonctionnel | Dm7–G7 → G♯m7–C♯7 |
| 9. Cadence majeure | Peu de contexte tonal | II–V–I, tension/résolution 7→3 et 3→1 | C puis E♭ et B |
| 10. Sus4 | La quarte semble arbitraire | Suspension 4→3, tierce retardée, écoute comparative | G7sus4 → B♭7sus4 |
| 11. Cadence mineure | Sensible non introduite | IIø–V–i, mineure harmonique et b9 éventuelle | Em puis Bm |
| 12. Sus4(♭9) | Empilement complexe direct | Différence 4/3 et ♭9, pourquoi la dominante mineure accepte cette couleur | G puis C♯ |
| 13. Renversement des guides | Vocabulaire ambigu | Enchaînement des seules 3e/7e, résolutions obliques/chromatiques | G7→C puis C♯7→F♯ |
| 14. Neuvièmes | Sans distinction 2/9 | Construire 9, fonction versus octave, extensions parfois omises | Dm9, B♭m9 |
| 15. Treizièmes | Six notes à copier | 13 = 6 à l'octave, dominante 13, conflit fréquent 3/11 | G13, D♭13 |
| 16. Transposition | Placée trop tard | Intervalles invariant, changement de signature, orthographe en contexte | C/F → D/B♭ → E♭/A♭ |
| 17. II–V–I secondaires | Déjà présent sans généralisation | Tonicisation locale, rôle de dominante secondaire, mineur IIø | G, Dm, F♯m |
| 18. Substitutions | Triton introduit sans relation claire | 3e et 7e communes, mouvement de basse chromatique | G7/D♭7 puis D7/A♭7 |
| 19. Rootless | Validations différentes d'autres modules | Fondamentale dans la basse, 3/7/9/13 et choix conscient d'omissions | Dm9/G13 puis G♯m9/C♯13 |
| 20. Sept sons | Peut paraître arbitraire | Collection, modes, registre, clusters et ergonomie des mains | C diatonique → E♭ lydien |
| 21. Atelier | Se limite à copier un schéma | Harmonisation originale d'une phrase, choix fonctionnels, auto-explication | F–E7–Am puis B♭–A7–Dm |

**Orthographe** : ne pas déduire systématiquement le nom de note d'une classe de hauteur MIDI. C♯ et D♭ sonnent pareil au piano mais n'ont pas la même fonction dans une tonalité donnée. Introduire un modèle `tonality` + `scaleDegrees` + `spelledNotes`.

## 4. Progression tonale proposée

**Phase A — comprendre sans surcharge (1–3 altérations maximum) :** C/F/G, puis D, B♭ et E♭ ; renforcer les notes-guides.  
**Phase B — transférer (2–5 altérations) :** A, E, A♭, D♭, B ; alterner majeur et relatif mineur, réponses MIDI et sans registre imposé.  
**Phase C — jazz chromatique :** F♯/G♭, C♯ mineur, dominantes secondaires, tritoniques ; privilégier la **fonction** et la bonne orthographe plutôt que le simple nombre de dièses.

**Règle de rotation** : pour chaque nouvelle compétence, fournir au moins deux tonalités contrastées ; après deux réussites consécutives, tester une tonalité moins familière sans afficher les notes ; après erreur, répéter la fonction dans une tonalité voisine avant de retenter la tonalité problématique. Les questions ne doivent pas rester figées sur les mêmes Cmaj7 et G7. Ne pas choisir aléatoirement une tonalité qui rendrait la disposition impossible dans MIDI 48–83.

**Générateur souhaité** : identifiant stable par `lessonId/skillId/tonality/voicingPattern/variantVersion` ; décalage MIDI fondé sur les intervalles ; réajustement d'octave si nécessaire ; `spelledNotes` calculées par degrés diatoniques et altérations contextuelles ; validation des tessitures, doublons et disposition attendue à la génération ; tests couvrant 12 tonalités et modes majeur/mineur.

## 5. Trois exemples de mini-cours originaux à intégrer

### A. Tétrades, renversements et positions

**Pourquoi ?** Une tétrade donne non seulement une couleur d'accord, mais quatre possibilités de placer la basse. La même harmonie peut donc être jouée dans différents registres et s'enchaîner plus naturellement avec l'accord suivant.

**Notion** : Cmaj7 réunit C–E–G–B : 1, 3, 5, 7. Au premier renversement, E devient la basse : E–G–B–C. Au deuxième, G est à la basse ; au troisième, B est à la basse. Rien n'a changé dans les quatre classes de notes : seule l'organisation des octaves a changé. À l'inverse, C–E–B–G garde C à la basse, mais place la quinte au-dessus : c'est une **position différente à état fondamental**, pas le deuxième renversement.

**Écoute guidée** : jouer alternativement C3–E3–G3–B3 et E3–G3–B3–C4 ; puis C3–E3–B3–G4. Identifier la basse, puis la note aiguë.  
**Transposition** : refaire Dmaj7 (D–F♯–A–C♯), notamment son premier renversement F♯–A–C♯–D.  
**Mini-test** : « Si E est à la basse de Cmaj7, est-ce encore un état fondamental ? » → non, premier renversement.  
**Exercice** : construire le premier renversement de Dmaj7, puis sa position 1–3–7–5 avec D à la basse. La correction distingue l'erreur d'accord, l'erreur de basse et l'erreur de disposition.

### B. II–V–I et conduite des voix

**Pourquoi ?** Jouer les trois bons accords ne suffit pas toujours à entendre une cadence fluide. Les voix intérieures créent la sensation de mouvement et de résolution.

**Notion** : en C, Dm7 prépare G7, qui prépare Cmaj7. Les voix-guides du V contiennent B (tierce) et F (septième). En résolvant, B peut monter à C et F descendre à E : chacun parcourt un demi-ton. D'autres notes peuvent rester communes. Le but n'est pas d'imposer un unique voicing mais de **comparer les distances et l'attraction des voix**.

**Écoute guidée** : isoler F–B puis E–C, voir les deux trajectoires alignées au clavier et écouter séparément leurs mouvements.  
**Transposition** : en E♭, Fm7–B♭7–E♭maj7 ; la septième A♭ du B♭7 peut descendre à G, sa tierce D peut monter à E♭.  
**Mini-test** : « Quelle note de B♭7 descend d'un demi-ton vers la tierce de E♭maj7 ? » → A♭ descend à G (un demi-ton).  
**Exercice** : construire librement la cadence en E♭, corriger les notes avant d'évaluer séparément la continuité des voix.

### C. Neuvièmes, treizièmes et tensions

**Pourquoi ?** Les extensions donnent la couleur du jazz, mais doivent avoir une fonction définie plutôt que s'ajouter sans raison.

**Notion** : G9 complète G7 par A, sa neuvième. G13 introduit également E, la treizième. Dans un voicing étendu on peut omettre la quinte selon la consigne, surtout si la basse fournit la fondamentale ; il ne faut pas sanctionner cette omission dans un exercice qui autorise explicitement le « rootless ». En revanche, une étude d'empilement complet peut exiger les notes spécifiées. Éviter le conflit entre la tierce B et la onzième C non altérée dans une réalisation usuelle de G13.

**Écoute guidée** : comparer G7, G9, puis G13 ; distinguer la dominante de la coloration sans changer la fonction.  
**Transposition** : D♭13 : D♭–F–A♭–C♭–E♭–B♭ (sans 11), et non un simple empilement d'altérations autour de Do.  
**Mini-test** : « Quelle note est la treizième de D♭ ? » → B♭.  
**Exercice** : jouer D♭9 puis D♭13 dans un registre possible, avec validation de la version « empilement complet » ou « voicing jazz libre » explicitement sélectionnée.

## 6. Priorités et critères de recette

- **P0 :** rendre les cours visibles *avant* chaque exercice, distinguer renversement/position, supprimer l'ambiguïté des attentes MIDI exactes ; ajouter tests de théorie et d'interface.
- **P1 :** moteur de transposition contextualisé avec variations progressives, notes noires systématiquement utilisées et partition des acquis par tonalité.
- **P2 :** écoute comparée, révisions ciblées, accompagnement au métronome, exercice d'harmonisation plus créatif.

**Critères** : (a) les 21 leçons ont chacune un contenu explicatif original consultable ; (b) toutes les parties disposent d'un cours d'introduction ; (c) les exemples de renversements sont harmoniquement corrects ; (d) au moins deux tonalités par compétence majeure ; (e) aucune réponse générée hors MIDI 48–83 ; (f) aucune régression des 28 accords, QCM et voicings ; (g) interaction mobile vérifiée ; (h) aucune donnée antérieure de progression effacée lors de l'ajout de nouvelles variantes.

**Décisions encore ouvertes** : quantité de théorie visible d'emblée ou déployable, seuil de maîtrise par compétence, interprétation des accords incomplets selon le niveau. Recommandations par défaut : cours court visible et détails dépliables ; 2 réussites sur 2 tonalités distinctes ; tolérer les omissions uniquement dans les exercices explicitement « jazz libre ».

**À ce stade : ceci est une analyse et un cahier des charges, pas des cours implémentés.**
