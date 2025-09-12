export interface PortfolioTemplate {
  id: string;
  name: string;
  category:
    | 'modern'
    | 'creative'
    | 'developer'
    | 'business'
    | 'minimal'
    | 'artistic'
    | 'corporate'
    | 'startup'
    | 'academic'
    | 'futuristic';
  preview: string;
  description: string;
  features: string[];
  technologies: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  layout:
    | 'single-page'
    | 'multi-section'
    | 'parallax'
    | 'grid'
    | 'masonry'
    | 'timeline'
    | 'card-based'
    | 'split-screen';
  animations: string[];
  seoOptimized: boolean;
}

export const portfolioTemplates: PortfolioTemplate[] = [
  // ... existing templates ...

  // ------------------------- Template 4: Modern Minimal -------------------------
  {
    id: 'cyberpunk-nexus',
    name: 'Cyberpunk Nexus',
    category: 'futuristic',
    preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    description: 'Ultra-modern cyberpunk experience with Netflix-style browsing, matrix rain, custom cursors, and cinematic animations at 60fps.',
    features: [
      'Matrix Rain Effect',
      'Custom Cursor Trails', 
      'Netflix-Style Scrolling',
      'Cinematic Modals',
      '60fps Animations',
      'Responsive Touch Controls'
    ],
    technologies: ['HTML5', 'CSS3', 'Vanilla JS', 'WebGL', 'Canvas API'],
    colors: {
      primary: '#00FF87',
      secondary: '#007BFF', 
      accent: '#FF006E',
      background: '#0A0A0A',
      text: '#E0E0E0'
    },
    layout: 'parallax',
    animations: ['Matrix Rain', 'Cursor Trails', 'Particle Systems', 'Smooth Parallax'],
    seoOptimized: true,
  },

  // ------------------------- Template 5: Creative Canvas -------------------------
  {
    id: 'cosmic-odyssey',
    name: 'Cosmic Odyssey', 
    category: 'futuristic',
    preview: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=400&h=300&fit=crop',
    description: 'Space adventure portfolio with floating planet navigation, constellation skills, and RPG-style project exploration.',
    features: [
      'Floating Planet Navigation',
      'Constellation Skills',
      'RPG Adventure Cards', 
      'Particle Systems',
      '3D Transforms',
      'Touch Gestures'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'CSS 3D', 'Intersection Observer'],
    colors: {
      primary: '#8338EC',
      secondary: '#3A86FF',
      accent: '#06FFA5', 
      background: '#1A1A2E',
      text: '#FFFFFF'
    },
    layout: 'grid',
    animations: ['Floating Elements', '3D Rotations', 'Constellation Lines', 'Orbital Motion'],
    seoOptimized: true,
  },

  // ------------------------- Template 6: CodeCraft Developer -------------------------
  {
    id: 'mystic-realm',
    name: 'Mystic Realm',
    category: 'artistic',
    preview: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop',
    description: 'Fantasy storybook portfolio with spell book navigation, magical crystals, and enchanted scroll animations.',
    features: [
      'Spell Book Navigation',
      'Magic Crystal Skills',
      'Adventure Map Projects',
      'Storybook Experience', 
      'Enchanted Animations',
      'Fantasy UI Elements'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'SVG Animations', 'CSS Grid'],
    colors: {
      primary: '#D4AF37',
      secondary: '#9C27B0',
      accent: '#673AB7',
      background: '#2D1B69',
      text: '#F0E6D2'
    },
    layout: 'card-based',
    animations: ['Magic Spells', 'Crystal Rotations', 'Scroll Enchantments', 'Floating Runes'],
    seoOptimized: true,
  },
];

// ------------------------- Utility Functions -------------------------
export const getPortfolioTemplateById = (id: string) => {
  return portfolioTemplates.find((template) => template.id === id);
};

export const getPortfolioTemplatesByCategory = (category: string) => {
  return portfolioTemplates.filter(
    (template) => template.category === category
  );
};
