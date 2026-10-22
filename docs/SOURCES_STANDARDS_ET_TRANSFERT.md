# Sources de standards et transfert vers le jeu

État vérifié le 22 octobre 2026. Référencement documentaire ; aucun corpus tiers n'est importé dans le dépôt et aucun nouveau moteur d'arrangement n'est intégré.

## Sources prioritaires

| Source | Données et accès constatés | Usage envisagé et limites |
| --- | --- | --- |
| [JAZZMUS](https://grfia.dlsi.ua.es/jazz-omr/) — [données](https://huggingface.co/datasets/PRAIG/JAZZMUS) | 163 standards distincts ; mélodies et symboles d'accords en MusicXML et Humdrum. Les auteurs indiquent une provenance Wikifonia avec corrections partielles. L'exemple de lecture expose le MusicXML dans les annotations. Accès aux fichiers soumis aux conditions et à une demande sur Hugging Face. Licence affichée : CC BY-NC 4.0. | Candidat pour relier mélodie, harmonie et mesure. Ni téléchargement des données ni validation des fichiers individuels réalisés ici. La licence du corpus ne doit pas être assimilée à une autorisation générale de redistribuer toutes les compositions. |
| [Jazz Harmony Treebank](https://github.com/DCMLab/JazzHarmonyTreebank) — [format](https://github.com/DCMLab/JazzHarmonyTreebank/blob/master/readme.md) — [données](https://github.com/DCMLab/JazzHarmonyTreebank/blob/master/treebank.json) | Le fichier JSON lu contient 1 170 grilles, dont 150 avec au moins une analyse en arbre. Accords, numéros de mesures, temps de départ et métadonnées. Les analyses sont décrites comme établies et vérifiées par des experts dans l'[article](https://program.ismir2020.net/static/final_papers/80.pdf). [Licence des données](https://github.com/DCMLab/JazzHarmonyTreebank/blob/master/LICENSE.md) : CC BY-NC-SA 4.0. | Référence pour les fonctions harmoniques et l'évaluation de nos analyses. Ce n'est ni une collection MusicXML de parties de piano ni une transcription de voicings. Préserver les variantes et commentaires éditoriaux. |
| [OpenEWLD](https://github.com/00sapo/OpenEWLD) | Sous-ensemble de Wikifonia fourni en MusicXML compressé, avec mélodie et symboles d'accords. Les fichiers musicaux sont présentés par l'auteur comme contenant du domaine public. Licences distinctes selon les composants : notamment CC BY-NC 3.0 pour certaines métadonnées, MIT pour le logiciel. | Candidat accessible pour un premier corpus de partitions. Vérifier chaque œuvre retenue et les composants redistribués. Le README signale des problèmes de métrique, d'armure et de numérotation ; il indique aussi un filtrage excluant les fortes modulations. Ne convient pas à une représentation exhaustive du répertoire jazz. |

Les observations de quantité du Treebank correspondent au fichier consulté ce jour ; toutes les grilles ne possèdent pas d'analyse experte.

## Sources complémentaires

- [iReal Pro : export MIDI et MusicXML](https://www.irealpro.com/learn/exporting-to-midi-and-musicxml/) : le MusicXML exporte la grille et la forme, sans mélodie ; le MIDI représente l'accompagnement joué. Voie d'import possible, distincte d'une autorisation de constituer et distribuer un catalogue.
- [ireal-musicxml](https://github.com/infojunkie/ireal-musicxml) : convertisseur de grilles iReal vers MusicXML, logiciel annoncé GPL-3.0. Étudier sa compatibilité de licence si une reprise de code est envisagée.
- [Freed Jazz](https://freedjazz.org/) : partitions et sources MuseScore de standards anciens ; le site revendique le domaine public aux États-Unis et indique explicitement que le statut peut différer ailleurs. Le format source demanderait un export MusicXML. Référence secondaire, pas un catalogue déclaré libre en France.
- [EWLD complet](https://zenodo.org/records/1476555) : plus de 5 000 partitions annoncées ; accès restreint et engagement d'usage non commercial. Ne pas confondre avec OpenEWLD.
- Le [catalogue de départ proposé par PTS](https://musetrainer.github.io/library/) peut aider aux essais d'import ; son référencement ne valide pas les droits de réutilisation de chaque partition.

## Trois contenus à distinguer

1. **Thème et grille** : une mélodie notée et des symboles tels que Dm7, G7, Cmaj7. Le symbole précise la famille harmonique, sans imposer octaves, disposition des mains, omissions ou rythme d'accompagnement. Il n'y a pas nécessairement de voicings à juger ou à corriger.
2. **Arrangement écrit** : des notes d'accompagnement effectivement notées. Elles peuvent être conservées et étudiées si elles conviennent à l'objectif ; leur présence ne garantit pas une qualité musicale ou pianistique particulière.
3. **Exercice généré** : notre moteur produit une partie de piano adaptée à une compétence, à partir de la grille et, selon le mode, de la mélodie.

Pour PTS, produire les notes attendues et leurs durées dans le MusicXML. Les symboles d'accords seuls ne constituent pas la partie de voicings à faire jouer et vérifier.

## Rôle de Tonal

Références : [Voicing](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voicing), [VoiceLeading](https://github.com/tonaljs/tonal/tree/e555422aef910daa87cb924028f71f0a013f3ed7/packages/voice-leading), et [nos références techniques](REFERENCES_MIDI_VOICINGS.md).

Tonal calcule notes, intervalles et transpositions, et recherche les réalisations autorisées par un dictionnaire dans un registre donné. Le choix des familles, des tensions, des mains, du rythme et des contraintes musicales relève de notre moteur pédagogique. Il ne suffit pas de lui transmettre un MusicXML pour obtenir un arrangement adapté.

Notre chaîne à développer : lire la grille et sa chronologie ; définir la consigne et les familles permises ; utiliser Tonal pour les notes et les candidats ; choisir une réalisation selon registre, accessibilité, conduite de toutes les voix et contexte mélodique ; écrire les notes et durées en MusicXML ; vérifier puis jouer.

Deux usages différents de la mélodie : accompagnement sous une mélodie entendue, ou intégration de la mélodie comme note supérieure. Ne pas imposer les mêmes contraintes aux deux.

Les générateurs II–V–I existants utilisent déjà Tonal avec nos propres dictionnaires et règles de choix. L'import et l'arrangement automatique des standards restent à développer.

## Premiers cas pédagogiques proposés

Sélection issue des grilles effectivement lues dans le Treebank ; elle ne garantit pas la présence du même titre dans les deux autres corpus.

| Morceau | Objectif |
| --- | --- |
| Autumn Leaves | Relier les résolutions majeures et mineures dans un même passage. Premier pilote proposé. |
| Blue Bossa | Résolution mineure et passage vers un centre tonal majeur. |
| Satin Doll | Chaînes de II–V et changements à deux accords par mesure. |
| All the Things You Are | Conduite des voix entre plusieurs centres tonals. |

Progression proposée : cadence isolée ; passage contextualisé avec une mesure avant et après ; passage de huit mesures ; jeu avec voicings écrits puis grille seule ; réintégration dans le morceau. Conserver forme, rythme harmonique et variante de la source.

Toute analyse harmonique automatique sera une proposition à vérifier, notamment en cas de modulation ou de lecture ambiguë. Le transfert musical devra être évalué séparément de la seule reconnaissance des bonnes notes.

## Premier pilote sur un MusicXML réel : Blue Bossa

Le [pilote Blue Bossa](BLUE_BOSSA_PILOTE_PEDAGOGIQUE.md) utilise l'[exemple MXL publié par le projet de recherche CLaMP](https://ai-muzic.github.io/clamp/mxls/Blue%20Bossa.mxl), lié depuis sa [page officielle](https://ai-muzic.github.io/clamp/). Les mesures écrites 4 à 19 ont été lues pour extraire la grille et examiner la mélodie. Les variations de grille, les données de mode et un accord de coda incohérent sont documentés dans la fiche.

Le source complet et la mélodie ne sont pas importés dans le dépôt. L'analyse exportée conserve provenance, empreinte, chronologie des accords et statistiques ; trois études originales de grille seule sont proposées en MusicXML. La disponibilité du source ne constitue pas une licence générale de redistribution de Blue Bossa.

