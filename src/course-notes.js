// Original teaching notes. Structure inspired by public course syllabus, not paid materials.
export const chapterCourses={
  "1": {
    "title": "Fondations et positions",
    "why": "Comprendre le son d’un accord avant de chercher une touche au hasard.",
    "body": "Une tétrade se construit avec une fondamentale, une tierce, une quinte et une septième. La tierce indique majeur ou mineur ; la septième précise la couleur et souvent la fonction. Un renversement change la note à la basse. Une disposition garde éventuellement la même basse mais modifie l’ordre ou l’espacement des autres voix. Compare les notes graves, les notes aiguës et le timbre plutôt que d'apprendre un dessin par cœur.",
    "goal": "Reconnaître, construire, renverser et transposer des tétrades ; entendre la différence entre positions serrées et ouvertes."
  },
  "2": {
    "title": "Conduite des voix",
    "why": "Enchaîner des accords peut devenir fluide sans déplacer toutes les mains.",
    "body": "La conduite des voix suit chaque note d’un accord vers la suivante. Les tierces et septièmes sont des notes-guides : leur mouvement indique la fonction et la résolution. Une note commune peut rester en place, tandis qu’une autre avance d’un demi-ton. Le II–V–I majeur ou mineur est un bon laboratoire d’écoute. Sus4 et altérations enrichissent ces attractions sans supprimer le rôle des dominantes.",
    "goal": "Suivre visuellement les voix, écouter les mouvements économes et justifier une résolution."
  },
  "3": {
    "title": "Harmonie jazz et enrichissements",
    "why": "Choisir une couleur harmonique au lieu d’empiler des notes mécaniquement.",
    "body": "La neuvième et la treizième prolongent la structure de septième. Dans un voicing jazz, certaines notes peuvent être omises si la basse et le contexte en précisent la fonction. Les dominantes secondaires, substitutions tritoniques et notes-guide permettent de préparer d’autres destinations. Les tonalités changent régulièrement : travailler les touches noires évite de mémoriser un seul accord en Do.",
    "goal": "Construire des extensions et des substitutions, puis transposer et réharmoniser des enchaînements."
  },
  "4": {
    "title": "Mise en pratique",
    "why": "Faire des choix d’harmonisation en autonomie et les expliquer.",
    "body": "Une collection de sept sons n’est pas automatiquement un accord à jouer en bloc. Le registre, la basse, les tensions et la mélodie dictent les choix utiles. Avant de sélectionner les touches, précise la fonction de chaque accord ; après la correction, explique une note-guide ou une résolution chromatique. Le jeu libre ne doit pas être évalué comme une position strictement imposée.",
    "goal": "Assembler des progressions originales, écouter le résultat et expliquer ses décisions."
  }
};
export const lessonCourses={
  "tetrades": {
    "why": "Une même tétrade existe dans plusieurs renversements, chacun facilitant certains enchaînements.",
    "concept": "Cmaj7 contient Do–Mi–Sol–Si : 1–3–5–7. À l’état fondamental Do est à la basse. Au premier renversement, Mi est à la basse et Do remonte au-dessus : Mi–Sol–Si–Do. Au deuxième, Sol devient basse ; au troisième, Si devient basse. Les quatre classes de notes restent identiques.",
    "example": "Compare Do3–Mi3–Sol3–Si3 avec Mi3–Sol3–Si3–Do4. La basse change, pas la qualité de Cmaj7. Sur Ré majeur, la tierce du premier renversement est Fa♯.",
    "listen": [
      48,
      52,
      55,
      59
    ],
    "compare": [
      52,
      55,
      59,
      60
    ],
    "question": "Quel élément change pour obtenir un véritable renversement ?",
    "answer": "La note de basse ; les quatre notes de l’accord restent présentes."
  },
  "position-1375": {
    "why": "Changer le soprano change la couleur ressentie, même avec la même basse.",
    "concept": "Dans 1–3–7–5, la fondamentale demeure à la basse. La septième vient avant la quinte dans l’ordre grave–aigu ; on ne parle pas de renversement, puisque la basse est inchangée. Sur Cmaj7, Do–Mi–Si–Sol donne la quinte au soprano.",
    "example": "C3–E3–B3–G4 conserve la basse C3 ; E3–G3–B3–C4, lui, est un vrai premier renversement. Écoute la différence.",
    "listen": [
      48,
      52,
      59,
      67
    ],
    "compare": [
      52,
      55,
      59,
      60
    ],
    "question": "Dans 1–3–7–5, quelle voix porte la quinte ?",
    "answer": "Le soprano, la note la plus aiguë."
  },
  "position-1573": {
    "why": "Une quinte basse et une tierce aiguë créent une répartition ouverte très reconnaissable.",
    "concept": "La formule 1–5–7–3 garde la fondamentale au grave, puis fait entendre la quinte, la septième et enfin la tierce au soprano. La tierce indique la qualité, et son exposition change le timbre. Cette formule n’est pas le premier renversement.",
    "example": "C3–G3–B3–E4 donne Cmaj7 avec Mi en haut. Compare avec C3–E3–G3–B3, plus serré.",
    "listen": [
      48,
      55,
      59,
      64
    ],
    "compare": [
      48,
      52,
      55,
      59
    ],
    "question": "Si la basse reste Do, est-ce un renversement de Cmaj7 ?",
    "answer": "Non : c’est une autre position du même état fondamental."
  },
  "position-1537": {
    "why": "L’espacement entre les voix évite un son systématiquement compact.",
    "concept": "Dans 1–5–3–7, la septième est au soprano. Tu peux conserver les quatre notes tout en faisant monter la tierce et la septième d’une octave. Une consigne de position précise impose ces octaves ; une consigne d’accord libre ne devrait pas les imposer.",
    "example": "C3–G3–E4–B4 ; remarque l’ouverture entre Sol3 et Mi4 et le Si4 qui colore le haut.",
    "listen": [
      48,
      55,
      64,
      71
    ],
    "compare": [
      48,
      52,
      55,
      59
    ],
    "question": "La septième est-elle une nouvelle fondamentale ?",
    "answer": "Non, elle ajoute une couleur et se trouve ici à la voix aiguë."
  },
  "position-1735": {
    "why": "Une septième près de la basse permet de traiter les voix intérieures autrement.",
    "concept": "La disposition 1–7–3–5 place immédiatement la septième après la fondamentale. Cela peut créer un large intervalle entre la basse et la deuxième voix. La tierce reste une note-guide essentielle ; changer son registre ne change pas sa fonction.",
    "example": "C3–B3–E4–G4 forme Cmaj7 ; compare avec C3–E3–G3–B3.",
    "listen": [
      48,
      59,
      64,
      67
    ],
    "compare": [
      48,
      52,
      55,
      59
    ],
    "question": "Dans cette position, quelle note suit directement la fondamentale ?",
    "answer": "La septième : Si pour Cmaj7."
  },
  "position-1753": {
    "why": "Une disposition très ouverte doit être entendue et non seulement dessinée.",
    "concept": "La formule 1–7–5–3 place la tierce tout en haut. Plus les voix s’éloignent, plus la couleur change : il faut donc considérer le registre et l’ergonomie. Ce n’est pas une exigence générale de tous les voicings, mais une position à explorer.",
    "example": "C3–B3–G4–E5 est une ouverture de Cmaj7 ; compare avec la même tétrade serrée.",
    "listen": [
      48,
      59,
      67,
      76
    ],
    "compare": [
      48,
      52,
      55,
      59
    ],
    "question": "Quelle fonction prend la note aiguë de 1–7–5–3 ?",
    "answer": "La tierce de l’accord."
  },
  "sixte": {
    "why": "Une sixte apporte une couleur stable qui n’est pas celle de la septième.",
    "concept": "C6 rassemble Do–Mi–Sol–La, alors que Cmaj7 rassemble Do–Mi–Sol–Si. Cm6 conserve la tierce mineure Mi♭ mais utilise La naturel : une sixte majeure. N’en déduis pas qu’un accord mineur contient forcément une sixte abaissée.",
    "example": "Écoute C6 puis Cm6 : seul Mi devient Mi♭. Ensuite transpose sur Ré : Dm6 = Ré–Fa–La–Si.",
    "listen": [
      48,
      52,
      55,
      57
    ],
    "compare": [
      48,
      51,
      55,
      57
    ],
    "question": "Dans Cm6, la sixte est-elle La♭ ?",
    "answer": "Non : c’est La naturel, sixte majeure sur Do."
  },
  "guides": {
    "why": "Avec seulement deux notes, on peut déjà entendre beaucoup de la fonction harmonique.",
    "concept": "La tierce et la septième forment les notes-guides. Sur G7, Si est la tierce et Fa est la septième mineure ; leur triton donne une forte tension. Sur Cmaj7, Mi et Si définissent la couleur de la tonique. La conduite de ces notes compte davantage que leur position dans la main.",
    "example": "Écoute Fa3–Si3, puis Mi3–Do4 : Fa peut descendre à Mi pendant que Si monte à Do.",
    "listen": [
      53,
      59
    ],
    "compare": [
      52,
      60
    ],
    "question": "Quelle paire définit particulièrement G7 ?",
    "answer": "La tierce Si et la septième Fa."
  },
  "cadence-majeure": {
    "why": "Les mouvements d’un demi-ton rendent une cadence plus convaincante.",
    "concept": "En Do majeur, le II est Dm7, le V est G7 et le I est Cmaj7. Sur G7, Fa descend vers Mi tandis que Si peut monter vers Do. Les voix communes peuvent rester immobiles. Une cadence n’est pas qu’une liste de symboles : elle raconte une attraction sonore.",
    "example": "Dm7 → G7 → Cmaj7. Isole les notes Fa–Si de G7 et fais-les résoudre vers Mi–Do.",
    "listen": [
      53,
      59
    ],
    "compare": [
      52,
      60
    ],
    "question": "Vers quelle note peut descendre la septième de G7 ?",
    "answer": "Vers Mi, tierce de Cmaj7."
  },
  "sus4": {
    "why": "Une suspension retarde la résolution de la tierce et crée une attente.",
    "concept": "G7sus4 remplace la tierce Si par la quarte Do, sans retirer la septième Fa. La quarte peut ensuite descendre vers la tierce dans G7. Les notes de la dominante restent reliées à une fonction de résolution.",
    "example": "Compare G–C–D–F avec G–B–D–F : Do descend vers Si d’un demi-ton.",
    "listen": [
      55,
      60,
      62,
      65
    ],
    "compare": [
      55,
      59,
      62,
      65
    ],
    "question": "Quelle note remplace la tierce dans G7sus4 ?",
    "answer": "Do, la quarte suspendue."
  },
  "cadence-mineure": {
    "why": "La dominante mineure introduit une sensible plus forte que la gamme naturelle.",
    "concept": "Pour atteindre Mi mineur, prépare F♯m7♭5 → B7 → Em7. Le II possède une quinte diminuée. La tierce de B7 est Ré♯ : elle veut monter vers Mi. Ce Ré♯ vient de la couleur de la mineure harmonique.",
    "example": "Écoute Ré♯4 puis Mi4, résolution d’un demi-ton. Sur B7, la septième La peut aussi descendre vers Sol.",
    "listen": [
      54,
      57,
      59,
      63
    ],
    "compare": [
      55,
      59,
      62,
      64
    ],
    "question": "Pourquoi joue-t-on Ré♯ plutôt que Ré naturel dans B7 ?",
    "answer": "Ré♯ est la tierce majeure de la dominante et la sensible de Mi."
  },
  "sus-b9": {
    "why": "Une quarte suspendue et une neuvième abaissée créent une couleur de dominante mineure.",
    "concept": "G7sus4(♭9) contient Sol–Do–Ré–Fa–La♭. Do est la quarte suspendue ; La♭ est la neuvième mineure. Ces deux tensions ont des fonctions différentes. La notation précise doit empêcher de confondre neuvième abaissée et septième.",
    "example": "Sur Sol, compare G7sus4 à G7sus4(♭9) en ajoutant La♭ au-dessus de Sol.",
    "listen": [
      55,
      60,
      62,
      65
    ],
    "compare": [
      55,
      60,
      62,
      65,
      68
    ],
    "question": "La♭ est quel degré au-dessus de Sol ?",
    "answer": "Une neuvième mineure (♭9)."
  },
  "renversement-guides": {
    "why": "Le chemin des tierces et septièmes est souvent plus important que la fondamentale.",
    "concept": "Sur G7, Fa et Si forment le triton. En résolvant vers Cmaj7, Fa peut descendre à Mi et Si monter à Do. Ces mouvements contraires rendent la résolution claire. Le terme renversement ici concerne la disposition des deux guides et non forcément un renversement complet de tétrade.",
    "example": "Écoute Fa3–Si3, puis Mi3–Do4 ; deux petits mouvements opposés.",
    "listen": [
      53,
      59
    ],
    "compare": [
      52,
      60
    ],
    "question": "Combien de demi-tons chaque guide parcourt-il dans cet exemple ?",
    "answer": "Un demi-ton chacune."
  },
  "extensions-9": {
    "why": "La neuvième enrichit une couleur existante sans changer la fondamentale.",
    "concept": "Une neuvième est une seconde placée à l’octave supérieure dans la définition théorique. Dm9 ajoute Mi à Ré–Fa–La–Do. Une réalisation jazz peut réorganiser ou omettre des notes selon le contexte, mais un exercice d’empilement complet exige les notes indiquées.",
    "example": "Dm7 = Ré–Fa–La–Do ; Dm9 ajoute Mi. Écoute la couleur supplémentaire de Mi.",
    "listen": [
      50,
      53,
      57,
      60
    ],
    "compare": [
      50,
      53,
      57,
      60,
      64
    ],
    "question": "Quelle note est la neuvième de Ré ?",
    "answer": "Mi."
  },
  "extensions-13": {
    "why": "La treizième donne une couleur sophistiquée à une dominante.",
    "concept": "G13 ajoute Mi comme treizième à l’accord de dominante G7 ; La est sa neuvième. Dans un voicing usuel, la onzième Do peut être omise car elle frotte avec la tierce Si. La consigne doit préciser si on construit un empilement complet ou une réalisation libre.",
    "example": "G9 = Sol–Si–Ré–Fa–La ; G13 ajoute Mi. Écoute les deux couleurs dans le même registre.",
    "listen": [
      55,
      59,
      62,
      65,
      69
    ],
    "compare": [
      55,
      59,
      62,
      65,
      69,
      76
    ],
    "question": "Quelle note est la treizième de Sol ?",
    "answer": "Mi."
  },
  "transposer": {
    "why": "Pouvoir transposer évite de dépendre uniquement de Do majeur.",
    "concept": "Transposer conserve les intervalles et fonctions, mais change la fondamentale et l’armure. Cmaj7 devient Dmaj7 : Ré–Fa♯–La–Do♯. Deux touches noires sont donc indispensables. Les noms enharmoniques doivent suivre la tonalité : Ré♭ n’est pas le nom fonctionnel de la sensible de Ré.",
    "example": "Compare Cmaj7 (Do–Mi–Sol–Si) et Dmaj7 (Ré–Fa♯–La–Do♯). La structure 1–3–5–7 ne change pas.",
    "listen": [
      48,
      52,
      55,
      59
    ],
    "compare": [
      50,
      54,
      57,
      61
    ],
    "question": "Quelle note est la septième majeure de Ré ?",
    "answer": "Do♯, pas Do naturel."
  },
  "cadences-secondaires": {
    "why": "Une dominante secondaire prépare un accord qui n’est pas la tonique principale.",
    "concept": "Pour rejoindre Sol majeur dans un contexte de Do, le II–V–I local est Am7–D7–Gmaj7. La tierce Fa♯ de D7 prépare Sol. Vers un mineur, le II est souvent demi-diminué : F♯m7♭5–B7–Em7.",
    "example": "Écoute Am7 → D7 → Gmaj7 et repère Fa♯ de D7, sensible locale de Sol.",
    "listen": [
      50,
      54,
      57,
      60
    ],
    "compare": [
      55,
      59,
      62,
      66
    ],
    "question": "Quel accord domine Gmaj7 dans cette cadence ?",
    "answer": "D7, dont la tierce Fa♯ attire vers Sol."
  },
  "substitutions": {
    "why": "La substitution tritonique relie deux dominantes ayant les mêmes notes-guides.",
    "concept": "G7 contient Si et Fa. D♭7 contient Fa et Do♭ (en tempérament égal, même touche que Si). Ce partage de triton rend possible le remplacement de G7 par D♭7 vers Do. La basse Ré♭ peut descendre chromatiquement vers Do.",
    "example": "Compare G7 et D♭7, puis fais descendre Ré♭ vers Do dans la basse.",
    "listen": [
      55,
      59,
      62,
      65
    ],
    "compare": [
      49,
      53,
      56,
      59
    ],
    "question": "Quel intervalle sépare les fondamentales G et D♭ ?",
    "answer": "Un triton."
  },
  "rootless": {
    "why": "Au piano jazz, la basse peut porter la fondamentale pendant que la main réalise les couleurs.",
    "concept": "Un voicing « rootless » omet volontairement la fondamentale de la main : le bassiste ou la basse instrumentale l’indique. Dm9 peut alors se jouer Fa–La–Do–Mi, correspondant aux 3, 5, ♭7 et 9. Ne pas sanctionner cette omission dans un exercice explicitement rootless.",
    "example": "Écoute Fa–La–Do–Mi seul, puis imagine une basse Ré sous cette couleur.",
    "listen": [
      53,
      57,
      60,
      64
    ],
    "compare": [
      50,
      53,
      57,
      60,
      64
    ],
    "question": "Pourquoi un voicing Dm9 peut-il ne contenir aucun Ré ?",
    "answer": "Parce que la fondamentale est portée par la basse ou connue par le contexte."
  },
  "sept-sons": {
    "why": "Les collections complètes ouvrent des couleurs mais posent la question de la densité.",
    "concept": "Une gamme fournit sept sons, sans imposer de les empiler simultanément comme un accord classique. Le registre et la répartition entre les mains sont importants. La collection de Do majeur contient Do, Ré, Mi, Fa, Sol, La, Si ; elle peut être répartie de manière plus aérée.",
    "example": "Écoute un empilement de sept sons puis ne garde que des notes-guides et deux couleurs utiles.",
    "listen": [
      48,
      52,
      55,
      59,
      62,
      65,
      69
    ],
    "compare": [
      52,
      55,
      59,
      62
    ],
    "question": "Les sept notes d’une gamme forment-elles obligatoirement un voicing efficace ?",
    "answer": "Non : leur emploi dépend du registre, de la fonction et de la mélodie."
  },
  "atelier": {
    "why": "Harmoniser signifie faire un choix musical, et pas seulement recopier un chiffrage.",
    "concept": "Commence par choisir une destination, puis une dominante qui y mène. E7 conduit naturellement vers Am grâce au Sol♯ qui monte à La. Ensuite, choisis les renversements qui évitent les mouvements inutiles des voix. Plusieurs réalisations justes sont possibles.",
    "example": "Fmaj7 → E7 → Am7 : écoute Sol♯ de E7 devenir La dans la résolution.",
    "listen": [
      52,
      56,
      59,
      62
    ],
    "compare": [
      57,
      60,
      64,
      67
    ],
    "question": "Quelle note de E7 attire vers La dans Am ?",
    "answer": "Sol♯, la tierce majeure de E7."
  }
};
export function validateCourseNotes(lessons){
 return lessons.every(lesson=>{
  const t=lessonCourses[lesson.id];return t&&[t.why,t.concept,t.example,t.question,t.answer].every(s=>typeof s==="string"&&s.length>20)&&
   Array.isArray(t.listen)&&Array.isArray(t.compare)&&[...t.listen,...t.compare].every(n=>Number.isInteger(n)&&n>=48&&n<=83)
 })&&[1,2,3,4].every(id=>chapterCourses[id]?.body?.length>100);
}
