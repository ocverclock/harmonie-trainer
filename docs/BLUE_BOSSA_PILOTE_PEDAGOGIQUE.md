# Blue Bossa : premier pilote de transfert pédagogique

22 octobre 2026. Étude issue d'un MusicXML effectivement téléchargé et analysé, et non d'une grille reconstituée de mémoire.

## Source et périmètre

- Blue Bossa, Kenny Dorham : [exemple MusicXML compressé publié par CLaMP](https://ai-muzic.github.io/clamp/mxls/Blue%20Bossa.mxl), accessible depuis la [page du projet de recherche](https://ai-muzic.github.io/clamp/).
- Empreinte SHA-256 du MXL consulté : `946d5e222dc56f3d25b6cc29534ab05b176ad7f34de922f4d6f1ae54ae66a0db`.
- Le fichier comporte 38 mesures écrites : exemple de basse, levée, premier thème, seconde version et coda. On retient les mesures écrites **4 à 19**, renumérotées **1 à 16** pour le travail.
- Les reprises et le D.S./coda ne sont pas développés. Les 16 mesures représentent un passage écrit du thème, pas le déroulé complet de la performance.
- L'analyse exportée contient 17 événements harmoniques, leurs mesures et leurs temps. La mélodie comporte 62 segments de hauteurs, dont 14 prolongements liés et 12 notes supplémentaires de doublures ; ce n'est donc pas une ligne strictement monophonique à traiter aveuglément.
- Le fichier source complet et la mélodie ne sont pas recopiés dans le dépôt. Les partitions produites sont nos études d'accompagnement, sans mélodie ; la référence en ligne ne vaut pas autorisation générale de redistribuer le standard.

## Grille réellement lue

Numéros relatifs au thème sélectionné, pas au document entier.

| Mesures | Harmonie dans ce fichier | Lecture pédagogique proposée |
| --- | --- | --- |
| 1–2 | Cm6 | Installer la tonique mineure avec sixte majeure. |
| 3–4 | Fm7 puis B♭7 | Passage par le IV mineur ; le couple peut suggérer un II–V vers Mi♭, sans résolution directe sur Mi♭ ici. Ne pas imposer une analyse unique. |
| 5–8 | Dm7♭5 → G7♯9 → Cm6 → Cm6 | II–V–I mineur et maintien de la tonique. |
| 9–12 | E♭m7 → A♭7 → D♭maj7 → D♭maj7 | II–V–I dans le centre tonal de Ré♭ majeur. |
| 13–15 | Dm7♭5 → G7♯9 → Cm6 | Retour au centre tonal de Do mineur. |
| 16 | Cm6 pendant trois temps, G7 au quatrième | Préparer la reprise sans changer d'accord trop tôt. |

Cette version diffère des grilles qui conservent Fm7 en quatrième mesure ou indiquent G7♭9. La variante est conservée et identifiée.

Les événements et durées sont extraits du XML. Les fonctions, les centres tonals et les objectifs pédagogiques ci-dessus sont des annotations explicites de ce pilote ; Tonal ne les a pas déduits automatiquement.

## Ce que la mélodie apporte à l'analyse

### Une altération qui change le travail

Sur le G7♯9 de la sixième mesure du thème (mesure écrite 9), la mélodie tient Si♭ au début. Cette hauteur correspond au son de la neuvième augmentée, théoriquement La♯. Remplacer mécaniquement l'accord par notre ancien G7♭9 ferait perdre cette couleur. Le voicing complet de l'étude conserve Si naturel, tierce majeure, et Si♭, son de la ♯9. Leur frottement est intentionnel.

### Un retard à reconnaître, plutôt qu'une « mauvaise note »

Sur le D♭maj7 de la onzième mesure du thème (mesure écrite 14), le Sol♭ venant de la dominante est prolongé au début, puis descend sur Fa au bout d'une noire pointée. Il s'entend comme un retard de la quarte vers la tierce, ou 11 vers 3.

Notre réalisation de grille contient Fa4. Jouée telle quelle avec le Sol♭4 de la mélodie à cet instant, elle crée un demi-ton rapproché. Une version d'accompagnement du thème devrait, par exemple, retarder ou omettre ce Fa puis le réintroduire à la résolution. Les trois partitions livrées travaillent la grille seule : elles ne prétendent pas avoir adapté tous les voicings aux événements mélodiques.

Même principe pour le La naturel de Cm6 : sa présence ne transforme pas chaque La♭ mélodique de passage ou d'approche en erreur. Il faut distinguer accord, mélodie, durée et direction de résolution.

### Une saisie à contrôler avant utilisation

L'armure comporte trois bémols mais le champ XML de mode indique « major ». Cette information seule ne permet pas de conclure au centre tonal du passage. La grille et les résolutions conduisent ici à Do mineur, puis Ré♭ majeur.

Dans la coda exclue du pilote, un accord annoté Cm6 contient Do–Mi♭–Sol–La♭ : la hauteur écrite n'est pas la sixte majeure attendue. Cela suffit à montrer qu'une partition disponible en XML doit être auditée, et non traitée comme une référence infaillible. Ce point n'affecte pas les 16 mesures de grille retenues.

## Trois partitions à essayer

| Fichier | Contenu et contrat de travail |
| --- | --- |
| [01 — Notes-guides](../samples/standards/blue-bossa/Blue_Bossa_01_notes_guides.musicxml) | 16 mesures, trois touches : fondamentale à gauche ; tierce et septième à droite, sauf sur Cm6 où l'on joue tierce et sixte. Les tensions et la quinte diminuée ne sont pas toutes réalisées à ce stade. |
| [02 — Voicings avec basses](../samples/standards/blue-bossa/Blue_Bossa_02_voicings.musicxml) | 16 mesures, six touches : fondamentale et quinte à gauche, quatre notes à droite. La quinte est diminuée sur Dm7♭5. |
| [03 — Cadences ciblées](../samples/standards/blue-bossa/Blue_Bossa_03_cadences.musicxml) | Les mesures 5 à 12 du thème : cadence mineure puis cadence majeure, huit mesures, six touches. Les deux durées de tonique proviennent du passage source. |

Les trois études utilisent une attaque par mesure ; la dernière mesure des grilles complètes change au quatrième temps. Les notes-guides et les voicings sont des réalisations de travail, pas une transcription d'une interprétation enregistrée. Tempo indicatif : 60 à la noire. Le rythme de bossa et les anticipations d'accompagnement constituent un autre axe, non évalué par ces rondes.

Enrichissements annoncés du fichier 02 et de l'extrait 03 : Cm6 devient Cm6/9, Fm7 et E♭m7 deviennent des voicings de neuvième, B♭7 et A♭7 des voicings de treizième, D♭maj7 un voicing de neuvième majeure. G7♯9 et le G7 final conservent leurs qualités. Les racines et durées de la grille restent celles du passage.

Les dictionnaires sont définis dans notre générateur. Tonal calcule les candidats ; notre code choisit une chaîne selon les déplacements des voix ordonnées, la tessiture et les lignes supplémentaires. Les deux mains sont séparées et chaque voicing complet comporte six touches distinctes. Cette sélection ne constitue ni un jugement esthétique universel ni une analyse automatique de la mélodie.

Lisibilité vérifiée : aucune ligne supplémentaire dans les études 01 et 03 ; une au maximum dans l'étude 02.

## Séance proposée et transfert

1. Commencer par les quatre premières mesures de l'extrait 03 : annoncer II demi-diminué, V altéré, I mineur, puis jouer lentement.
2. Passer aux quatre mesures majeures : dans les notes-guides, observer Ré♭ → Do sur E♭m7 → A♭7, puis Sol♭ → Fa sur A♭7 → D♭maj7.
3. Retrouver ces deux passages dans la grille complète, d'abord avec les trois touches du fichier 01, puis les six touches du fichier 02. Entrer une mesure avant la cadence et continuer après la résolution.
4. Rejouer avec les seuls symboles d'accords de la grille source : les notes écrites cessent de fournir la réponse.
5. Pour le transfert avec le thème, préparer une version qui tient compte des retards et approches relevés ; la chanter ou l'écouter en jouant l'accompagnement adapté. Le passage sur D♭maj7 est le premier cas de contrôle à traiter.

La réussite dans PTS vérifie d'abord la réalisation écrite. Elle ne prouve pas à elle seule la mémorisation, la reconnaissance à l'oreille, le placement de bossa ou la capacité d'accompagner librement.

## Reproduction et état technique

Le laboratoire existant garde Tonal 6.5.1. La génération et les contrôles n'ont pas besoin d'un accès réseau : ils utilisent l'analyse enregistrée.

```bash
npm run generate:blue-bossa --prefix tools/voicing-lab
npm run check:blue-bossa --prefix tools/voicing-lab
```

Pour refaire l'extraction à partir du MXL indiqué en source, avec Python 3 et sa bibliothèque standard :

```bash
python3 tools/voicing-lab/analyze-leadsheet.py Blue_Bossa_source.mxl --start 4 --end 19 --source-url https://ai-muzic.github.io/clamp/mxls/Blue%20Bossa.mxl --output samples/standards/blue-bossa/analysis.json
```

L'extracteur accepte un MusicXML partwise à une partie et sélectionne des mesures complètes de 4/4. Il suit divisions, backups, forwards, symboles hérités et offsets ; il ne développe pas les reprises et ne constitue pas un importeur universel.

Contrôles réalisés : chronologie de la source, maintien de la ♯9 et du dernier G7 au quatrième temps, notes autorisées, nombre de touches distinctes, séparation des mains, durées des voix, XML, reproduction déterministe et chargement/rendu dans OSMD. Aucun essai dans PTS sur iPad ou piano physique n'est revendiqué.

Les trois études et cette fiche sont des livrables du pilote. Aucun nouvel écran, correcteur MIDI ou module automatique d'analyse harmonique n'a été ajouté à l'application.

