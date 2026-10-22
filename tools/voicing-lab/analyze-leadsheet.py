"""Extract a bounded lead-sheet chord timeline from MusicXML or MXL.

Only written measures are read: repeats and navigation are reported, not unfolded.
The exported summary does not reproduce the melody.
"""
import argparse
import hashlib
import json
from fractions import Fraction
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile, is_zipfile


def analyze(path, start, end, source_url):
    raw = path.read_bytes()
    if is_zipfile(path):
        with ZipFile(path) as archive:
            manifest = ET.fromstring(archive.read("META-INF/container.xml"))
            roots = [e for e in manifest.iter() if e.tag.split("}")[-1] == "rootfile"]
            xml = archive.read(roots[0].attrib["full-path"])
    else:
        xml = raw
    root = ET.fromstring(xml)
    if root.tag != "score-partwise" or len(root.findall("part")) != 1:
        raise ValueError("This pilot requires one part in score-partwise MusicXML")
    part = root.find("part")
    measures = part.findall("measure")
    if not 1 <= start <= end <= len(measures):
        raise ValueError("Measure selection outside the score")
    divisions, active = 1, None
    timeline, navigation = [], []
    pitches, attacks, tied_segments, polyphonic_segments = [], 0, 0, 0
    natural = dict(zip("CDEFGAB", [0, 2, 4, 5, 7, 9, 11]))
    key = None
    for index, measure in enumerate(measures, 1):
        if measure.find("attributes/divisions") is not None:
            divisions = int(measure.findtext("attributes/divisions"))
        if key is None and measure.find("attributes/key") is not None:
            key = {"fifths": int(measure.findtext("attributes/key/fifths")),
                   "modeAsWritten": measure.findtext("attributes/key/mode")}
        cursor, previous, duration = Fraction(0), Fraction(0), Fraction(0)
        events = []
        if active is not None:
            events.append((Fraction(0), dict(active), True))
        for item in measure:
            if item.tag in ("backup", "forward"):
                amount = Fraction(int(item.findtext("duration")), divisions)
                cursor += amount if item.tag == "forward" else -amount
            elif item.tag == "harmony":
                step = item.findtext("root/root-step")
                if step is None:
                    raise ValueError("Rootless harmony symbol not supported in this pilot")
                alter = int(item.findtext("root/root-alter") or 0)
                kind = item.find("kind")
                active = {"root": step + {-2: "bb", -1: "b", 0: "", 1: "#", 2: "##"}[alter],
                          "kind": kind.text, "text": kind.get("text", ""),
                          "degrees": [{"value": int(d.findtext("degree-value")),
                                       "alter": int(d.findtext("degree-alter")),
                                       "type": d.findtext("degree-type")} for d in item.findall("degree")]}
                offset = Fraction(int(item.findtext("offset") or 0), divisions)
                events.append((cursor + offset, dict(active), False))
            elif item.tag == "note":
                chord = item.find("chord") is not None
                at = previous if chord else cursor
                length = Fraction(int(item.findtext("duration") or 0), divisions)
                duration = max(duration, at + length)
                pitch = item.find("pitch")
                if start <= index <= end and pitch is not None:
                    midi = 12 * (int(pitch.findtext("octave")) + 1) + natural[pitch.findtext("step")] + int(pitch.findtext("alter") or 0)
                    pitches.append(midi)
                    stop = any(t.get("type") == "stop" for t in item.findall("tie"))
                    attacks += not stop
                    tied_segments += stop
                    polyphonic_segments += chord
                if not chord:
                    previous = cursor
                    cursor += length
        if start <= index <= end:
            if duration != 4:
                raise ValueError("The pilot expects complete 4/4 measures")
            # An explicit symbol at beat one takes precedence over an inherited one.
            ordered = {}
            for at, harmony, inherited in events:
                ordered[at] = (harmony, inherited)
            if Fraction(0) not in ordered:
                raise ValueError("No harmony available at beginning of selected measure")
            onsets = sorted(ordered)
            for j, at in enumerate(onsets):
                stop = onsets[j + 1] if j + 1 < len(onsets) else duration
                if not 0 <= at < stop <= duration:
                    raise ValueError("Invalid harmony offset")
                harmony, inherited = ordered[at]
                timeline.append({"headMeasure": index - start + 1,
                                 "sourceMeasure": measure.get("number"),
                                 "beat": float(at + 1), "durationQuarters": float(stop - at),
                                 "inherited": inherited, **harmony})
        if measure.findall("barline") or measure.findall("direction"):
            navigation.append({"sourceMeasure": measure.get("number"),
                               "repeats": [r.attrib for r in measure.findall("barline/repeat")],
                               "words": [w.text for w in measure.findall("direction/direction-type/words") if w.text]})
    return {"source": {"url": source_url, "sha256": hashlib.sha256(raw).hexdigest(),
                       "composer": root.findtext("identification/creator"),
                       "sourceMeasureCount": len(measures), "keySignature": key},
            "selection": {"firstWrittenMeasure": start, "lastWrittenMeasure": end,
                          "headMeasures": end - start + 1, "unfoldRepeats": False},
            "timeline": timeline,
            "melodySummary": {"pitchSegments": len(pitches), "attacksExcludingTieStops": attacks,
                              "tieStopSegments": tied_segments, "additionalChordNotes": polyphonic_segments,
                              "lowestMidi": min(pitches), "highestMidi": max(pitches)},
            "navigationAsWritten": navigation}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--start", type=int, required=True)
    parser.add_argument("--end", type=int, required=True)
    parser.add_argument("--source-url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    result = analyze(args.input, args.start, args.end, args.source_url)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(args.output), "measures": result["selection"]["headMeasures"],
                      "harmonyEvents": len(result["timeline"]), "melody": result["melodySummary"]}, ensure_ascii=False))
