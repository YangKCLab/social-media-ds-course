# Snowball Sampling Interactive Demo

This folder contains an interactive web application that demonstrates the snowball sampling process for identifying target keywords from social media data. The demo provides a visual and educational way to understand how keyword discovery works in social media research.

## What is Snowball Sampling?

Snowball sampling is a research technique used to discover related keywords iteratively. Starting with a small set of "seed" keywords, researchers search for social media posts containing these terms, then identify additional keywords that frequently co-occur with the original seeds. This process continues in rounds, building a comprehensive network of related terms.

## Demo Features

### 1. Interactive Keyword Management
- Add and remove seed keywords
- Real-time validation and suggestions
- Visual seed keyword display

### 2. Step-by-Step Sampling Process
- Manual progression through sampling rounds
- Auto-play mode for presentations
- Clear round-by-round progression tracking

### 3. Network Visualization
- Interactive network graph showing keyword relationships
- Color-coded nodes by discovery round
- Clickable nodes for detailed keyword information
- Connection strength visualization

### 4. Educational Components
- Step-by-step process explanations
- Real-time metrics and statistics
- Growth rate calculations
- Example social media usage contexts

### 5. Data Export
- Export results as JSON for further analysis
- CSV export for spreadsheet compatibility
- Complete keyword network preservation

## Usage Instructions

### Getting Started
1. Open `index.html` directly in a web browser (no server required)
   - Alternatively, run a local server: `python -m http.server 8000` then visit `http://localhost:8000`
2. The demo starts with default seed keywords: "climate change" and "global warming"
3. You can add your own keywords or modify the existing ones

### Running the Demo
1. **Set Seed Keywords**: Add initial keywords related to your research topic
2. **Start Sampling**: Click "Start Sampling" to begin the discovery process
3. **Progress Through Rounds**: Use "Next Round" to advance step-by-step, or "Auto Play" for automatic progression
4. **Explore Results**: Click on network nodes to see keyword details and relationships

### Understanding the Visualization
- **Blue nodes**: Seed keywords (starting points)
- **Green nodes**: Round 1 discoveries
- **Orange nodes**: Round 2 discoveries
- **Red nodes**: Round 3+ discoveries
- **Lines**: Represent keyword relationships and co-occurrence strength

### Export Options
- **JSON Export**: Complete data structure for programmatic analysis
- **CSV Export**: Tabular format for spreadsheet analysis

## Educational Applications

This demo is designed for:
- **Data Science Courses**: Teaching sampling methodologies
- **Social Media Research**: Understanding keyword discovery techniques
- **Digital Methods**: Demonstrating iterative research approaches
- **Workshop Presentations**: Interactive demonstration of concepts

## Technical Details

The demo uses:
- Pure HTML/CSS/JavaScript (no external dependencies)
- Responsive design for various screen sizes
- Real social media keyword relationships
- Simulated discovery probabilities based on keyword frequency

## Files Structure

```
demos/snowball-sampling/
├── index.html              # Main application
├── styles.css              # Styling and layout
├── script.js               # Core functionality and visualization
├── data/
│   └── sample-keywords.json # Sample keyword relationships
└── README.md               # This documentation
```

## Customization

To use your own keyword data:
1. Modify `data/sample-keywords.json` with your domain-specific keywords
2. Update the `keywordDatabase` object with relevant relationships
3. Adjust discovery probabilities in the `frequency` values

## Browser Compatibility

The demo works in all modern web browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+