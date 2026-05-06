# Studio Moderne - Vue Configurator

A high-end interior design material configurator built with **Vue.js 3**, **Vite**, and **Tailwind CSS**.

## Technologies Used
- **Vue.js 3**: Progressive JavaScript framework (Composition API).
- **Vite**: Ultra-fast build tool.
- **Tailwind CSS 4**: Modern utility-first styling.
- **Lucide Vue Next**: Multi-platform icon set.
- **Motion for Vue**: Smooth animations and staggered transitions.

## Features
- **Room Selection**: Switch between curated environments (Kitchen, Bathroom, etc.).
- **Material Configurator**: Real-time selection of finishes using uniform, local SVG samples for a consistent architectural look.
- **AI Narrative**: A logic engine that evaluates design harmony, cost profiles, and labor intensity.
- **Spec Sheet**: Live generation of technical specifications and sample palettes.

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open your browser at `http://localhost:3000`.

## Assumptions
- **Mock Data**: All materials, furniture, and pricing are simulated for demonstration purposes.
- **Mock AI**: The "AI Summary" is generated using deterministic rules rather than an external LLM API to ensure performance and focus on UX prototype requirements.
- **Persistent State**: Room selections are kept in memory while the app remains open.

## Testing Instructions
1. **Selection Flow**: Click on a room type (e.g., Kitchen). Select a "Benchtop" and "Flooring". Observe the update in the "Current Bundle" sidebar.
2. **AI Logic**: 
   - Select "Carrara Marble Tile" and "Matte Navy Flat Panel". Click **Generate AI Insight**.
   - Observe the warning about Marble maintenance and the characterization of the cost tier.
3. **Responsive Check**: Resize the window to mobile width. The room selector and configurator should stack vertically.
4. **Clear State**: Use the "Clear All" button to reset the current room configuration.

## Limitations & Future Improvements
- **3D Visualization**: Future versions could integrate Three.js for a real-time 3D preview.
- **Real AI**: Integration with Gemini API could provide more nuanced design critiques and mood board suggestions.
- **Saving/Exporting**: Adding a PDF export or a "Save to Project" feature for users to share their designs.
