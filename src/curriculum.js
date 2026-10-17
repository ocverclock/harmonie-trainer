import {appendTonalityExercises} from "./tonality-variants.js";
/* Exercices et explications originaux, inspirés uniquement du programme public de Piano Jazz Concept. */
export const lessons=[
  {
    "id": "tetrades",
    "part": 1,
    "title": "Tétrades : comprendre les quatre sons",
    "summary": "Identifier fondamentale, tierce, quinte et septième.",
    "principle": "Un accord à quatre sons peut conserver ses fonctions même si les notes changent de registre.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·3·5·7",
        "midis": [
          48,
          52,
          55,
          59
        ],
        "mode": "exact",
        "task": "Pose les degrés 1, 3, 5 et 7 de Cmaj7, du grave à l’aigu.",
        "why": "La septième B crée la couleur majeure de Cmaj7."
      },
      {
        "name": "G7 — 1·3·5·♭7",
        "midis": [
          55,
          59,
          62,
          65
        ],
        "mode": "exact",
        "task": "Construis G7 à l’état fondamental dans le même registre.",
        "why": "B est la tierce et F la septième mineure : elles orientent sa résolution."
      },
      {
        "name": "Am7 — 1·♭3·5·♭7",
        "midis": [
          57,
          60,
          64,
          67
        ],
        "mode": "free",
        "task": "Trouve quatre notes de Am7 ; le renversement est libre.",
        "why": "Am7 contient A, C, E et G : la tierce mineure définit sa couleur."
      }
    ]
  },
  {
    "id": "position-1375",
    "part": 1,
    "title": "Position 1·3·7·5",
    "summary": "Échanger les deux voix supérieures.",
    "principle": "La disposition importe autant que les noms d’accords. Ici la quinte prend le soprano.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·3·7·5",
        "midis": [
          48,
          52,
          59,
          67
        ],
        "mode": "exact",
        "task": "Construis la position 1·3·7·5 de Cmaj7.",
        "why": "La septième monte au-dessus de la tierce et la quinte termine le voicing."
      },
      {
        "name": "Fmaj7 — 1·3·7·5",
        "midis": [
          53,
          57,
          64,
          72
        ],
        "mode": "exact",
        "task": "Transpose la même position sur Fmaj7.",
        "why": "La structure se déplace avec les intervalles ; E est la septième de F."
      }
    ]
  },
  {
    "id": "position-1573",
    "part": 1,
    "title": "Positions 1·5·7·3",
    "summary": "Écarter les voix sans perdre leur fonction.",
    "principle": "Le soprano porte ici la tierce : une note particulièrement expressive.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·5·7·3",
        "midis": [
          48,
          55,
          59,
          64
        ],
        "mode": "exact",
        "task": "Construis Cmaj7 dans l’ordre 1·5·7·3.",
        "why": "La tierce E4 est au-dessus de la septième B3."
      },
      {
        "name": "Fmaj7 — 1·5·7·3",
        "midis": [
          53,
          60,
          64,
          69
        ],
        "mode": "exact",
        "task": "Transpose l’espacement sur Fmaj7.",
        "why": "F3, C4, E4, A4 : la tierce majeure est au soprano."
      }
    ]
  },
  {
    "id": "position-1537",
    "part": 1,
    "title": "Positions 1·5·3·7",
    "summary": "Contrôler les écarts d’une position ouverte.",
    "principle": "Le soprano porte la septième, alors que la tierce se situe sous elle.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·5·3·7",
        "midis": [
          48,
          55,
          64,
          71
        ],
        "mode": "exact",
        "task": "Construis Cmaj7 1·5·3·7.",
        "why": "Le B4 au soprano souligne la couleur majeure."
      },
      {
        "name": "Dm7 — 1·5·♭3·♭7",
        "midis": [
          50,
          57,
          65,
          72
        ],
        "mode": "exact",
        "task": "Applique la même logique à Dm7.",
        "why": "La tierce F et la septième C restent mineures malgré l’espacement."
      }
    ]
  },
  {
    "id": "position-1735",
    "part": 1,
    "title": "Positions 1·7·3·5",
    "summary": "Déplacer la septième près de la basse.",
    "principle": "La septième interne crée une autre sensation de densité et de tension.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·7·3·5",
        "midis": [
          48,
          59,
          64,
          67
        ],
        "mode": "exact",
        "task": "Construis Cmaj7 en position 1·7·3·5.",
        "why": "Le B3 est placé avant E4 et G4."
      },
      {
        "name": "Fmaj7 — 1·7·3·5",
        "midis": [
          53,
          64,
          69,
          72
        ],
        "mode": "exact",
        "task": "Applique 1·7·3·5 à Fmaj7.",
        "why": "Le E4 conserve son rôle de septième majeure."
      }
    ]
  },
  {
    "id": "position-1753",
    "part": 1,
    "title": "Positions 1·7·5·3",
    "summary": "Placer la tierce tout en haut.",
    "principle": "Ce grand intervalle est musicalement possible mais doit être écouté et contrôlé.",
    "exercises": [
      {
        "name": "Cmaj7 — 1·7·5·3",
        "midis": [
          48,
          59,
          67,
          76
        ],
        "mode": "exact",
        "task": "Construis Cmaj7 en position 1·7·5·3.",
        "why": "Le E5 au soprano donne une large ouverture."
      },
      {
        "name": "G7 — 1·♭7·5·3",
        "midis": [
          55,
          65,
          74,
          83
        ],
        "mode": "exact",
        "task": "Construis G7 en position très ouverte.",
        "why": "Le F4 reste sa septième, B5 reste sa tierce."
      }
    ]
  },
  {
    "id": "sixte",
    "part": 1,
    "title": "Accords majeurs 6 et mineurs 6",
    "summary": "Distinguer sixte et septième.",
    "principle": "La sixte remplace la septième dans ces tétrades ; m6 garde sa tierce mineure et une sixte majeure.",
    "exercises": [
      {
        "name": "C6",
        "midis": [
          48,
          52,
          55,
          57
        ],
        "mode": "free",
        "task": "Choisis C, E, G et A, dans les octaves de ton choix.",
        "why": "C6 = C E G A."
      },
      {
        "name": "Cm6",
        "midis": [
          48,
          51,
          55,
          57
        ],
        "mode": "free",
        "task": "Construis Cm6 sans confondre A et A♭.",
        "why": "Cm6 = C E♭ G A : la sixte est majeure."
      },
      {
        "name": "Dm6",
        "midis": [
          50,
          53,
          57,
          59
        ],
        "mode": "free",
        "task": "Transpose l’accord mineur 6 sur D.",
        "why": "Dm6 = D F A B."
      }
    ]
  },
  {
    "id": "guides",
    "part": 2,
    "title": "Notes-guides et limites d’intervalles",
    "summary": "Écouter tierces, septièmes et espacements.",
    "principle": "Les notes-guides 3 et 7 signalent la fonction. Un voicing peut être juste théoriquement mais peu commode pianístiquement.",
    "exercises": [
      {
        "name": "Dm7 — 3 et ♭7",
        "midis": [
          53,
          60
        ],
        "mode": "free",
        "task": "Joue seulement la tierce et la septième de Dm7.",
        "why": "F et C révèlent la qualité mineure."
      },
      {
        "name": "G7 — 3 et ♭7",
        "midis": [
          53,
          59
        ],
        "mode": "free",
        "task": "Joue seulement la septième et la tierce de G7.",
        "why": "F et B forment un triton qui cherche la résolution."
      },
      {
        "name": "Cmaj7 — 3 et 7",
        "midis": [
          52,
          59
        ],
        "mode": "free",
        "task": "Joue les notes-guides de Cmaj7.",
        "why": "E et B fixent la couleur majeure."
      }
    ]
  },
  {
    "id": "cadence-majeure",
    "part": 2,
    "title": "Enchaîner les voix en majeur",
    "summary": "II–V–I majeur : observer les demi-tons.",
    "principle": "L'objectif n'est pas seulement de trouver les notes, mais de limiter les déplacements inutiles.",
    "exercises": [
      {
        "name": "Dm7, II de C",
        "midis": [
          53,
          57,
          60,
          62
        ],
        "mode": "exact",
        "task": "Construis le II de Do majeur dans la position proposée.",
        "why": "C est la septième de Dm7."
      },
      {
        "name": "G7, V de C",
        "midis": [
          53,
          55,
          59,
          62
        ],
        "mode": "exact",
        "task": "Passe à G7 en préservant les notes communes.",
        "why": "C descend vers B d'un demi-ton."
      },
      {
        "name": "Cmaj7, I de C",
        "midis": [
          52,
          55,
          59,
          60
        ],
        "mode": "exact",
        "task": "Résous vers Cmaj7.",
        "why": "F descend vers E d'un demi-ton."
      }
    ]
  },
  {
    "id": "sus4",
    "part": 2,
    "title": "Dominantes sus4",
    "summary": "Suspendre la tierce par la quarte.",
    "principle": "La sus4 retarde la tierce : G7sus4 contient C plutôt que B.",
    "exercises": [
      {
        "name": "G7sus4",
        "midis": [
          55,
          60,
          62,
          65
        ],
        "mode": "free",
        "task": "Trouve les quatre notes de G7sus4.",
        "why": "G C D F : quarte juste et septième mineure."
      },
      {
        "name": "C7sus4",
        "midis": [
          48,
          53,
          55,
          58
        ],
        "mode": "free",
        "task": "Transpose l’accord sus4 sur C.",
        "why": "C F G B♭ : la note E est suspendue par F."
      }
    ]
  },
  {
    "id": "cadence-mineure",
    "part": 2,
    "title": "Enchaîner les voix en mineur",
    "summary": "IIø–V–i : sensible de la mineure harmonique.",
    "principle": "La tierce majeure de la dominante introduit la sensible avant la résolution mineure.",
    "exercises": [
      {
        "name": "F♯m7♭5 — II de E mineur",
        "midis": [
          54,
          57,
          60,
          64
        ],
        "mode": "exact",
        "task": "Construis le II demi-diminué de Mi mineur.",
        "why": "F♯ A C E : la quinte diminuée est C."
      },
      {
        "name": "B7 — V de E mineur",
        "midis": [
          54,
          57,
          59,
          63
        ],
        "mode": "exact",
        "task": "Construit B7 avec sa tierce D♯.",
        "why": "Le D♯ attire l'oreille vers E."
      },
      {
        "name": "Em7 — i de E mineur",
        "midis": [
          55,
          59,
          62,
          64
        ],
        "mode": "exact",
        "task": "Résous vers Em7.",
        "why": "La sensible D♯ monte vers E ; des notes communes restent proches."
      }
    ]
  },
  {
    "id": "sus-b9",
    "part": 2,
    "title": "Sus4(♭9) et couleur mineure",
    "summary": "Combiner quarte suspendue et neuvième abaissée.",
    "principle": "Un sus4(♭9) à cinq sons n’impose pas une tierce majeure dans l’empilement.",
    "exercises": [
      {
        "name": "G7sus4(♭9)",
        "midis": [
          55,
          60,
          62,
          65,
          68
        ],
        "mode": "free",
        "task": "Construis G C D F A♭.",
        "why": "A♭ est la neuvième mineure de G, pas une septième."
      },
      {
        "name": "A7sus4(♭9)",
        "midis": [
          57,
          62,
          64,
          67,
          70
        ],
        "mode": "free",
        "task": "Transpose cette formule sur A.",
        "why": "A D E G B♭."
      }
    ]
  },
  {
    "id": "renversement-guides",
    "part": 2,
    "title": "Renverser les notes-guides",
    "summary": "Réaliser les mouvements 3→7 et 7→3.",
    "principle": "Cherche l’attraction d’un demi-ton entre la septième de dominante et la tierce de tonique.",
    "exercises": [
      {
        "name": "G7 — notes-guides",
        "midis": [
          53,
          59
        ],
        "mode": "exact",
        "task": "Place F3 et B3 : la septième et la tierce de G7.",
        "why": "Ce triton résout vers E et C dans la tonique."
      },
      {
        "name": "Cmaj7 — résolution des guides",
        "midis": [
          52,
          60
        ],
        "mode": "exact",
        "task": "Résous ces deux voix vers E3 et C4.",
        "why": "F3→E3 descend ; B3→C4 monte, chacun d’un demi-ton."
      }
    ]
  },
  {
    "id": "extensions-9",
    "part": 3,
    "title": "Neuvièmes et enrichissements",
    "summary": "Lire 9 comme une note, pas comme une nouvelle fondamentale.",
    "principle": "La 9e est la seconde à l’octave supérieure ; certaines positions peuvent omettre une autre note selon le contexte, ici la consigne précise les cinq sons.",
    "exercises": [
      {
        "name": "Dm9",
        "midis": [
          50,
          53,
          57,
          60,
          64
        ],
        "mode": "free",
        "task": "Trouve cinq sons : D F A C E.",
        "why": "E est la neuvième de Dm."
      },
      {
        "name": "G9",
        "midis": [
          55,
          59,
          62,
          65,
          69
        ],
        "mode": "free",
        "task": "Trouve G B D F A.",
        "why": "A est la neuvième de G7."
      },
      {
        "name": "Cmaj9",
        "midis": [
          48,
          52,
          55,
          59,
          62
        ],
        "mode": "free",
        "task": "Trouve C E G B D.",
        "why": "D ajoute la neuvième à Cmaj7."
      }
    ]
  },
  {
    "id": "extensions-13",
    "part": 3,
    "title": "Treizièmes et voicings étendus",
    "summary": "Construire une treizième de dominante.",
    "principle": "Dans G13, E est la treizième ; la quarte 11 est souvent écartée pour éviter le conflit avec B.",
    "exercises": [
      {
        "name": "G13 (sans 11)",
        "midis": [
          55,
          59,
          62,
          65,
          69,
          76
        ],
        "mode": "free",
        "task": "Construis six sons : G B D F A E.",
        "why": "G13 associe la septième F, la neuvième A et la treizième E."
      },
      {
        "name": "Cmaj13 (sans 11)",
        "midis": [
          48,
          52,
          55,
          59,
          62,
          69
        ],
        "mode": "free",
        "task": "Construis six sons : C E G B D A.",
        "why": "La treizième A enrichit l'accord de tonique."
      }
    ]
  },
  {
    "id": "transposer",
    "part": 3,
    "title": "Transposition dans plusieurs tonalités",
    "summary": "Décoder une formule plutôt que mémoriser une touche.",
    "principle": "Choisis des octaves libres : seules les fonctions harmoniques des sons comptent.",
    "exercises": [
      {
        "name": "E♭maj7",
        "midis": [
          51,
          55,
          58,
          62
        ],
        "mode": "free",
        "task": "Transpose Cmaj7 d’une tierce mineure au-dessus.",
        "why": "E♭ G B♭ D."
      },
      {
        "name": "A♭maj7",
        "midis": [
          56,
          60,
          63,
          67
        ],
        "mode": "free",
        "task": "Transpose Cmaj7 sur A♭.",
        "why": "A♭ C E♭ G."
      },
      {
        "name": "B♭7",
        "midis": [
          58,
          62,
          65,
          68
        ],
        "mode": "free",
        "task": "Transpose G7 sur B♭.",
        "why": "B♭ D F A♭."
      }
    ]
  },
  {
    "id": "cadences-secondaires",
    "part": 3,
    "title": "II–V–I secondaires",
    "summary": "Toniciser temporairement un autre degré.",
    "principle": "À destination de G, la cadence locale est Am7→D7→Gmaj7. Les cadences mineures emploient souvent un IIø.",
    "exercises": [
      {
        "name": "Am7 — II de G",
        "midis": [
          57,
          60,
          64,
          67
        ],
        "mode": "free",
        "task": "Construis le II de Sol majeur.",
        "why": "A C E G."
      },
      {
        "name": "D7 — V de G",
        "midis": [
          50,
          54,
          57,
          60
        ],
        "mode": "free",
        "task": "Construis le V de Sol majeur.",
        "why": "D F♯ A C : F♯ agit comme sensible de G."
      },
      {
        "name": "Gmaj7 — I de G",
        "midis": [
          55,
          59,
          62,
          66
        ],
        "mode": "free",
        "task": "Construis la résolution sur Sol majeur.",
        "why": "G B D F♯."
      }
    ]
  },
  {
    "id": "substitutions",
    "part": 3,
    "title": "Substitutions de dominante",
    "summary": "Reconnaître les notes-guides communes à deux dominantes distantes d’un triton.",
    "principle": "La dominante G7 et sa substitution D♭7 contiennent le couple B/F, écrit C♭/F dans D♭7.",
    "exercises": [
      {
        "name": "G7",
        "midis": [
          55,
          59,
          62,
          65
        ],
        "mode": "free",
        "task": "Construis la dominante habituelle vers C.",
        "why": "La tierce B et la septième F forment le triton."
      },
      {
        "name": "D♭7 (substitution)",
        "midis": [
          49,
          53,
          56,
          59
        ],
        "mode": "free",
        "task": "Substitue D♭7 à G7.",
        "why": "D♭ F A♭ C♭(B) ; F et C♭ conservent le triton."
      },
      {
        "name": "Cmaj7",
        "midis": [
          52,
          55,
          59,
          60
        ],
        "mode": "free",
        "task": "Résous ensuite vers Cmaj7.",
        "why": "La basse D♭→C offre une résolution chromatique."
      }
    ]
  },
  {
    "id": "rootless",
    "part": 3,
    "title": "Voicings sans fondamentale",
    "summary": "Construire en contexte avec notes-guides et tensions.",
    "principle": "La basse peut fournir la fondamentale ; cette position de Dm9 emploie F A C E et ne contient pas D.",
    "exercises": [
      {
        "name": "Dm9 sans fondamentale",
        "midis": [
          53,
          57,
          60,
          64
        ],
        "mode": "free",
        "task": "Choisis F, A, C, E : pas de D.",
        "why": "La qualité m9 est identifiable malgré l'absence de fondamentale."
      },
      {
        "name": "G13 sans fondamentale",
        "midis": [
          53,
          59,
          64,
          69
        ],
        "mode": "free",
        "task": "Choisis F B E A : 7, 3, 13, 9 de G.",
        "why": "Le contexte harmonique ou la basse indique G comme fondamentale."
      }
    ]
  },
  {
    "id": "sept-sons",
    "part": 4,
    "title": "Accords de sept sons et pandiatonisme",
    "summary": "Manipuler une collection de sept notes simultanément.",
    "principle": "Les sept notes diatoniques sont employées comme réservoir de couleurs, avec attention à la densité et au registre.",
    "exercises": [
      {
        "name": "Collection diatonique de Do",
        "midis": [
          48,
          52,
          55,
          59,
          62,
          65,
          69
        ],
        "mode": "free",
        "task": "Construis C D E F G A B en sept hauteurs.",
        "why": "Collection diatonique complète, pas un voicing imposé de Cmaj7."
      },
      {
        "name": "Collection de Ré dorien",
        "midis": [
          50,
          52,
          53,
          55,
          57,
          59,
          60
        ],
        "mode": "free",
        "task": "Construis D E F G A B C.",
        "why": "Le mode dorien emploie la sixte majeure B."
      }
    ]
  },
  {
    "id": "atelier",
    "part": 4,
    "title": "Atelier d’harmonisation autonome",
    "summary": "Relier fonctions et couleurs dans une courte phrase originale.",
    "principle": "La dominante secondaire E7 peut préparer Am7 à partir d’une autre fonction. Écoute le déplacement G♯→A.",
    "exercises": [
      {
        "name": "Fmaj7 — couleur initiale",
        "midis": [
          53,
          57,
          60,
          64
        ],
        "mode": "free",
        "task": "Construis Fmaj7.",
        "why": "F A C E : accord de départ."
      },
      {
        "name": "E7 — dominante secondaire",
        "midis": [
          52,
          56,
          59,
          62
        ],
        "mode": "free",
        "task": "Construis E7 vers Am.",
        "why": "E G♯ B D : la sensible G♯ attire vers A."
      },
      {
        "name": "Am7 — résolution",
        "midis": [
          57,
          60,
          64,
          67
        ],
        "mode": "free",
        "task": "Construis Am7.",
        "why": "A C E G : une autre zone tonale devient la destination."
      }
    ]
  }
];
export function midiName(n){const names=["C","C♯","D","E♭","E","F","F♯","G","A♭","A","B♭","B"];return names[((n%12)+12)%12]+(Math.floor(n/12)-1)}
export function checkExercise(exercise,chosen){
 const submitted=[...new Set(chosen)];
 const target=exercise.midis;
 const key=n=>exercise.mode==="free"?((n%12)+12)%12:n;
 const expected=new Set(target.map(key)),actual=new Set(submitted.map(key));
 const missing=target.filter(n=>!actual.has(key(n)));
 const extra=submitted.filter(n=>!expected.has(key(n)));
 const repeatedPitchClasses=exercise.mode==="free"&&new Set(submitted.map(n=>n%12)).size!==submitted.length;
 return {correct:submitted.length===target.length&&!repeatedPitchClasses&&missing.length===0&&extra.length===0,
         missing,extra,repeatedPitchClasses,expected:target};
}
appendTonalityExercises(lessons);
export const TOTAL_EXERCISES=lessons.reduce((sum,l)=>sum+l.exercises.length,0);
