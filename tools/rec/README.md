# Phone recordings of the app

How `media/student-minis-phone.*` was made (the phone hero recordings and `record-hero.cjs` went
with the live heroes on 2026-10-23).
They drive the real app under `/showcase/` in its phone layout with real taps and swipes, capture a
CDP screencast, and turn it into H.264 with ffmpeg. Keep them for the Arabic versions (`lang=ar`).

1. `node tools/serve.cjs 8091` (serves the repo with byte ranges, so the lectures can seek).
2. `node tools/rec/record-minis.cjs`.
   Frames and `marks.json` go to `$REC_OUT/<name>` (default: the system temp folder).
3. `node tools/rec/assemble.cjs <capdir> media/<name>.mp4` prints the cue times; write them into
   `media/<name>.json`. The poster is the first frame, saved as WebP.

The showcase is drawn 1440 wide by its own viewport meta; `lib.cjs` swaps that meta for a phone one
inside the test browser only, which is what a phone-wide iframe gets anyway.
