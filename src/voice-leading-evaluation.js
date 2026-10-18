// Compare four-register voice motion without changing chord grading.
const pitchClass=n=>((n%12)+12)%12;
export function assessVoiceLeading(previous,current,grade,motion,reference){
 if(!Array.isArray(previous)||!Array.isArray(current)||previous.length!==4||current.length!==4||
  new Set(previous).size!==4||new Set(current).size!==4)
  throw Error("Four distinct notes are required for each chord");
 if(typeof grade?.correct!=="boolean"||!Number.isFinite(motion?.total)||!Number.isFinite(reference?.total))
  throw Error("Complete grade and movement data required");
 const currentMidis=new Set(current),currentPcs=new Set(current.map(pitchClass));
 return {
  harmonicCorrect:grade.correct,
  sharedMidis:previous.filter(n=>currentMidis.has(n)).sort((a,b)=>a-b),
  sharedPitchClasses:[...new Set(previous.map(pitchClass))].filter(pc=>currentPcs.has(pc)).sort((a,b)=>a-b),
  movement:{totalSemitones:motion.total,stationaryVoices:motion.held,
   semitoneMoves:motion.semitone,largeLeaps:motion.leaps},
  comparison:grade.correct?{playedSemitones:motion.total,suggestedSemitones:reference.total,
   excessSemitones:motion.total-reference.total,playedLeaps:motion.leaps,suggestedLeaps:reference.leaps}:null
 };
}
