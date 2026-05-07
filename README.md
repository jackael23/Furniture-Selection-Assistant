# Studio Moderne - Vue Configurator

A high-end interior design material configurator built with **Vue.js 3**, **Vite**, and **Tailwind CSS**.

## Technologies Used
- **Vue.js 3**: Progressive JavaScript framework (Composition API).
- **Vite**: Ultra-fast build tool.
- **Tailwind CSS 4**: Modern utility-first styling.
- **Lucide Vue Next**: Multi-platform icon set.
- **Motion for Vue**: Smooth animations and staggered transitions.

## Features
- **Project Archive**: Save and manage multiple design configurations locally with name validation and quick deletion.
- **Room Selection**: Switch between curated environments (Kitchen, Bathroom, etc.) with a mobile-optimized interface.
- **Material Configurator**: Real-time selection of finishes using uniform, local SVG samples for a consistent architectural look.
- **Budget Estimation**: Automatic calculation of materials and furniture costs in the live Spec Sheet.
- **AI Narrative**: A logic engine that evaluates design harmony, cost profiles, and labor intensity.
- **Spec Sheet**: Live generation of technical specifications, sample palettes, and budget breakdowns.

## How to Run Locally
1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open your browser at `http://localhost:3000`.

## Assumptions
- **Mock Data**: All materials, furniture, and pricing are simulated for demonstration purposes.
- **Mock AI**: The "AI Summary" is generated using deterministic rules rather than an external LLM API to ensure performance and focus on UX prototype requirements.
- **Local Storage**: Projects are saved to the browser's local storage for persistence across sessions.

## Testing Instructions
1. **Selection Flow**: Click on a room type (e.g., Kitchen). Select different finishes like "Benchtop" or "Flooring". Observe the live updates in the "Spec Sheet" sidebar and the "Estimated Budget" total.
2. **AI Logic**: 
   - Select "Carrara Marble Tile" and "Matte Navy Flat Panel". Click **Analyze Design**.
   - Observe the warning about Marble maintenance and the characterization of the cost tier.
3. **Project Management**: 
   - Click **Save Design**, try to save with an empty name to see validation, then enter a valid name.
   - Open the **Projects** menu in the header to view, load, or quickly delete designs with a single click.
4. **Responsive Experience**: 
   - Resize to mobile width. Use the horizontal scrolling categories and the sticky primary actions (Analyze/Save) at the bottom.
5. **Clear State**: Use the "Clear Layout" button to reset the current room configuration.

## Limitations & Future Improvements
- **3D Visualization**: Future versions could integrate Three.js for a real-time 3D preview.
- **Real AI**: Integration with Gemini API could provide more nuanced design critiques and mood board suggestions.
- **Exporting**: Adding a PDF export or a "Share Design" feature.
