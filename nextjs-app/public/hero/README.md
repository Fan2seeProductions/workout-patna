# Hero film asset slot

`CinematicHero.tsx` scrubs `/public/hero/hero.mp4` on scroll and shows
`/public/hero/poster.jpg` as its poster. Neither file is required — until a
film ships here, the component renders a pure-CSS black/red energy backdrop
and everything (scrub, chapters, CTAs, reduced-motion path) works unchanged.

## Film spec (drop-in, no code change)
- `hero.mp4` — 16:9, ~7s, **muted**, H.264, ≤ ~12 MB (1080p delivery)
- `poster.jpg` — first frame, 1920×1080
- Narrative: macro muscle fiber → body-interior flythrough → futuristic AI
  training studio with floating dashboards → athletic silhouette. Pure black
  with #dc1616 red accents. No text/logos (the overlay supplies the words).

## Generating it
The Higgsfield MCP is wired and the prompt is proven, but the connected
workspace is on the free plan (0.4 credits) and the cinematic models require
Pro/Ultimate. Top up or upgrade the Higgsfield workspace, then regenerate
with model `cinematic_studio_video_v2` (or `seedance_2_0`/`kling3_0` on Pro).
