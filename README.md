# LUXORA — Private Resort & Retreat

A premium, responsive luxury-resort concept website built with React, TypeScript and Vite for GenZ Developers.

## Run locally
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Included
- Cinematic responsive landing page and resort storytelling
- Accommodation cards with a switchable room detail panel
- Experiences, enquiry form validation and clear demo-only submission state
- Interactive 360° panorama viewer powered by Photo Sphere Viewer (drag, touch, zoom and fullscreen)
- Responsive navigation, motion details, semantic sections and reduced-motion support

## Important demo limitations
LUXORA is a fictional resort concept. Room prices, property imagery and contact details are illustrative. The enquiry form validates in the browser but does not transmit, store or book anything.

The virtual-tour controls render an actual equirectangular sample panorama from the Photo Sphere Viewer demo asset. The eight scene labels are a navigation concept and currently share this sample panorama; they are **not** eight photographs of real LUXORA spaces. Before using this as a real property tour, replace `demoPanorama` in `src/App.tsx` with eight original 2:1 equirectangular 360° captures, one per scene. Use HTTPS image hosting with CORS enabled. The scene configuration is deliberately centralised for easy replacement.

## Image credits
Editorial resort imagery is loaded from Unsplash image CDN URLs and is used as illustrative visual content. Replace with property-owned images and confirm image licensing/usage before commercial publication. The panorama sample is provided by the Photo Sphere Viewer demo asset host.

## Deployment
Configured for a standard Vercel Vite build: `npm run build`, output directory `dist`.
