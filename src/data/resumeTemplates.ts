export interface ResumeTemplate {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'creative' | 'executive' | 'technical' | 'minimalist' | 'artistic' | 'corporate' | 'startup' | 'academic';
  atsScore: number;
  preview: string;
  description: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  layout: 'single-column' | 'two-column' | 'three-column' | 'sidebar' | 'header-focus' | 'timeline' | 'grid' | 'asymmetric' | 'modular' | 'circular' | 'zigzag' | 'overlap';
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSize: string;
  };
  overallRating: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  jobMatches: string[];
  skillGaps: string[];
  industryTrends: string[];
  salaryInsights: string;
  keywords: string[];
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'career-catalyst',
    name: 'CareerCatalyst Resume',
    category: 'modern',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Two-column layout with left sidebar for contact and skills, right section for experience in navy blue, light grey, and white accents',
    features: ['Two-Column Layout', 'Sidebar Design', 'Professional Colors', 'ATS Optimized', 'Clean Typography'],
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#10B981',
      text: '#1F2937',
      background: '#F8FAFC'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.8,
    strengths: ['Excellent ATS compatibility', 'Professional appearance', 'Clear information hierarchy', 'Modern design'],
    weaknesses: ['May be too conservative for creative roles'],
    suggestions: ['Perfect for corporate and tech roles', 'Highlight quantifiable achievements'],
    jobMatches: ['Software Engineer', 'Project Manager', 'Business Analyst', 'Consultant'],
    skillGaps: ['Industry-specific certifications', 'Leadership experience'],
    industryTrends: ['Clean professional design', 'ATS-first approach', 'Skills-focused layout'],
    salaryInsights: 'Corporate roles: ₹12-35 LPA depending on experience and location',
    keywords: ['Professional', 'Corporate', 'Technical', 'Modern', 'Clean']
  },
  {
    id: 'nextstep-profile',
    name: 'NextStep Profile',
    category: 'minimalist',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Single-column stacked layout in teal, white, and black text with maximum readability',
    features: ['Single Column', 'Stacked Sections', 'Maximum Readability', 'Teal Accents', 'Minimal Design'],
    colors: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      accent: '#06B6D4',
      text: '#000000',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Poppins',
      fontSize: 'medium'
    },
    overallRating: 9.9,
    strengths: ['Perfect ATS score', 'Universal compatibility', 'Excellent readability', 'Clean structure'],
    weaknesses: ['May lack visual personality for creative fields'],
    suggestions: ['Ideal for any industry', 'Focus on strong content and achievements'],
    jobMatches: ['Any Role', 'Entry Level', 'Mid-Level', 'Senior Positions'],
    skillGaps: ['None - universally applicable'],
    industryTrends: ['Minimalist design', 'Content-first approach', 'Universal appeal'],
    salaryInsights: 'Universal template: ₹8-50 LPA depending on role and experience',
    keywords: ['Universal', 'Clean', 'Professional', 'Readable', 'ATS-Friendly']
  },
  {
    id: 'visionpath-cv',
    name: 'VisionPath CV',
    category: 'executive',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bold header and two-column design in dark green, beige, and white for leadership roles',
    features: ['Bold Header', 'Executive Focus', 'Two-Column Layout', 'Leadership Emphasis', 'Premium Colors'],
    colors: {
      primary: '#064E3B',
      secondary: '#059669',
      accent: '#10B981',
      text: '#1F2937',
      background: '#F5F5DC'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      fontSize: 'large'
    },
    overallRating: 9.6,
    strengths: ['Executive presence', 'Leadership focus', 'Premium appearance', 'Strategic emphasis'],
    weaknesses: ['May be too formal for junior roles', 'Not suitable for creative industries'],
    suggestions: ['Perfect for C-level and VP positions', 'Highlight strategic achievements and leadership impact'],
    jobMatches: ['CEO', 'CTO', 'VP Engineering', 'Director', 'Senior Manager'],
    skillGaps: ['Operational details', 'Technical implementation'],
    industryTrends: ['Executive branding', 'Leadership emphasis', 'Strategic presentation'],
    salaryInsights: 'Executive roles: ₹25-100+ LPA depending on company size and industry',
    keywords: ['Executive', 'Leadership', 'Strategy', 'Vision', 'Management']
  },
  {
    id: 'talentedge-resume',
    name: 'TalentEdge Resume',
    category: 'modern',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Modern card-style boxed layout with royal blue, soft grey, and white for contemporary professionals',
    features: ['Card-Style Layout', 'Boxed Sections', 'Modern Design', 'Royal Blue Theme', 'Contemporary Feel'],
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      text: '#1F2937',
      background: '#F1F5F9'
    },
    layout: 'modular',
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.7,
    strengths: ['Modern professional appearance', 'Excellent structure', 'High ATS compatibility', 'Versatile design'],
    weaknesses: ['May be too structured for creative roles'],
    suggestions: ['Great for tech and business roles', 'Emphasize achievements and metrics'],
    jobMatches: ['Product Manager', 'Software Engineer', 'Data Analyst', 'Marketing Manager'],
    skillGaps: ['Creative presentation', 'Artistic elements'],
    industryTrends: ['Modern professionalism', 'Structured presentation', 'Tech-forward design'],
    salaryInsights: 'Modern professional roles: ₹15-40 LPA in tech and business sectors',
    keywords: ['Modern', 'Professional', 'Structured', 'Tech-Forward', 'Business']
  },
  {
    id: 'futureready-profile',
    name: 'FutureReady Profile',
    category: 'startup',
    atsScore: 94,
    preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Single-column timeline-style design in orange, charcoal grey, and white for innovative professionals',
    features: ['Timeline Design', 'Innovation Focus', 'Single Column', 'Orange Accents', 'Future-Forward'],
    colors: {
      primary: '#EA580C',
      secondary: '#FB923C',
      accent: '#FDBA74',
      text: '#374151',
      background: '#FFFFFF'
    },
    layout: 'timeline',
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.4,
    strengths: ['Innovation-focused design', 'Timeline visualization', 'Modern appeal', 'Startup-friendly'],
    weaknesses: ['May be too casual for traditional industries', 'Timeline may not suit all career paths'],
    suggestions: ['Perfect for startups and tech companies', 'Highlight growth and innovation'],
    jobMatches: ['Startup Founder', 'Product Designer', 'Growth Hacker', 'Innovation Manager'],
    skillGaps: ['Traditional corporate experience', 'Formal business presentation'],
    industryTrends: ['Startup culture', 'Innovation emphasis', 'Growth mindset'],
    salaryInsights: 'Startup roles: ₹12-30 LPA plus equity opportunities',
    keywords: ['Innovation', 'Startup', 'Growth', 'Future', 'Dynamic']
  },
  {
    id: 'projourney-resume',
    name: 'ProJourney Resume',
    category: 'corporate',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean two-column layout with top banner in purple, light lavender, and white for career progression',
    features: ['Top Banner', 'Two-Column Layout', 'Career Progression Focus', 'Purple Theme', 'Professional Journey'],
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#C084FC',
      text: '#1F2937',
      background: '#FAF5FF'
    },
    layout: 'two-column',
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Lato',
      fontSize: 'medium'
    },
    overallRating: 9.8,
    strengths: ['Excellent career progression display', 'Professional corporate appeal', 'High ATS score', 'Clear structure'],
    weaknesses: ['May be too formal for creative startups'],
    suggestions: ['Ideal for corporate advancement', 'Highlight career progression and achievements'],
    jobMatches: ['Senior Manager', 'Director', 'VP', 'Corporate Executive'],
    skillGaps: ['Startup experience', 'Entrepreneurial skills'],
    industryTrends: ['Corporate advancement', 'Professional development', 'Career progression'],
    salaryInsights: 'Corporate progression roles: ₹20-60 LPA depending on level and industry',
    keywords: ['Corporate', 'Progression', 'Management', 'Leadership', 'Professional']
  },
  {
    id: 'skillsphere-cv',
    name: 'SkillSphere CV',
    category: 'technical',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sidebar with skills visualization and main content on the right in cyan, dark navy, and white',
    features: ['Skills Visualization', 'Sidebar Layout', 'Technical Focus', 'Cyan Theme', 'Data Presentation'],
    colors: {
      primary: '#0891B2',
      secondary: '#0E7490',
      accent: '#06B6D4',
      text: '#1E293B',
      background: '#FFFFFF'
    },
    layout: 'sidebar',
    typography: {
      headingFont: 'Exo 2',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.5,
    strengths: ['Excellent skills presentation', 'Technical appeal', 'Data-focused design', 'Modern tech aesthetic'],
    weaknesses: ['Too technical for non-tech roles', 'Complex for simple positions'],
    suggestions: ['Perfect for technical and engineering roles', 'Highlight technical achievements and certifications'],
    jobMatches: ['Software Engineer', 'Data Engineer', 'DevOps Engineer', 'Technical Lead'],
    skillGaps: ['Business communication', 'Non-technical presentation'],
    industryTrends: ['Technical specialization', 'Skills-based hiring', 'Data visualization'],
    salaryInsights: 'Technical roles: ₹18-45 LPA depending on specialization and experience',
    keywords: ['Technical', 'Engineering', 'Data', 'Skills', 'Innovation']
  },
  {
    id: 'opportune-profile',
    name: 'Opportune Profile',
    category: 'minimalist',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Minimal single-column design with section dividers in black, white, and gold accents',
    features: ['Minimal Design', 'Section Dividers', 'Single Column', 'Gold Accents', 'Clean Typography'],
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#F59E0B',
      text: '#000000',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Helvetica',
      bodyFont: 'Helvetica',
      fontSize: 'medium'
    },
    overallRating: 9.9,
    strengths: ['Perfect ATS compatibility', 'Universal appeal', 'Timeless design', 'Maximum readability'],
    weaknesses: ['May lack personality for creative roles'],
    suggestions: ['Ideal for any professional role', 'Focus on strong content and clear achievements'],
    jobMatches: ['Any Professional Role', 'Consultant', 'Analyst', 'Manager'],
    skillGaps: ['Creative expression', 'Visual storytelling'],
    industryTrends: ['Minimalist professionalism', 'Content-first approach', 'Universal design'],
    salaryInsights: 'Universal appeal: ₹10-50 LPA across all industries',
    keywords: ['Universal', 'Professional', 'Clean', 'Timeless', 'Minimal']
  },
  {
    id: 'elevatecareer-resume',
    name: 'ElevateCareer Resume',
    category: 'modern',
    atsScore: 97,
    preview: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Bold header with two-column structure and icons in emerald green, light grey, and white',
    features: ['Bold Header', 'Icon Integration', 'Two-Column Structure', 'Emerald Theme', 'Modern Icons'],
    colors: {
      primary: '#047857',
      secondary: '#059669',
      accent: '#10B981',
      text: '#1F2937',
      background: '#F0FDF4'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.7,
    strengths: ['Strong visual hierarchy', 'Modern professional appeal', 'Icon-enhanced readability', 'Excellent structure'],
    weaknesses: ['Icons may not translate well in all ATS systems'],
    suggestions: ['Great for modern companies', 'Emphasize growth and achievements'],
    jobMatches: ['Marketing Manager', 'Sales Director', 'Business Development', 'Operations Manager'],
    skillGaps: ['Traditional presentation', 'Conservative industry knowledge'],
    industryTrends: ['Modern business presentation', 'Visual enhancement', 'Growth-focused design'],
    salaryInsights: 'Business growth roles: ₹15-40 LPA depending on industry and experience',
    keywords: ['Growth', 'Modern', 'Business', 'Achievement', 'Success']
  },
  {
    id: 'growthtrack-cv',
    name: 'GrowthTrack CV',
    category: 'startup',
    atsScore: 93,
    preview: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Sidebar with vertical name and contact details, content on the right in red, white, and soft black',
    features: ['Vertical Sidebar', 'Growth Metrics', 'Red Theme', 'Dynamic Layout', 'Performance Focus'],
    colors: {
      primary: '#DC2626',
      secondary: '#EF4444',
      accent: '#F87171',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'sidebar',
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.3,
    strengths: ['Dynamic growth presentation', 'Performance-focused design', 'Modern startup appeal', 'Metrics emphasis'],
    weaknesses: ['Too aggressive for conservative industries', 'Red may be overwhelming'],
    suggestions: ['Perfect for sales and growth roles', 'Highlight metrics and performance achievements'],
    jobMatches: ['Sales Manager', 'Growth Hacker', 'Performance Marketer', 'Business Developer'],
    skillGaps: ['Conservative presentation', 'Traditional business approach'],
    industryTrends: ['Performance metrics', 'Growth hacking', 'Results-driven presentation'],
    salaryInsights: 'Growth-focused roles: ₹12-35 LPA plus performance bonuses',
    keywords: ['Growth', 'Performance', 'Sales', 'Results', 'Dynamic']
  },
  {
    id: 'jobquest-profile',
    name: 'JobQuest Profile',
    category: 'classic',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Clean single-column layout with left-aligned headers in sky blue, white, and dark grey',
    features: ['Left-Aligned Headers', 'Single Column', 'Sky Blue Theme', 'Classic Structure', 'Professional Clean'],
    colors: {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      accent: '#7DD3FC',
      text: '#374151',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Lato',
      bodyFont: 'Lato',
      fontSize: 'medium'
    },
    overallRating: 9.9,
    strengths: ['Perfect ATS compatibility', 'Classic professional appeal', 'Excellent readability', 'Industry standard'],
    weaknesses: ['May lack modern appeal for tech startups'],
    suggestions: ['Ideal for traditional industries and established companies', 'Focus on proven experience'],
    jobMatches: ['Business Analyst', 'Operations Manager', 'Finance Professional', 'HR Manager'],
    skillGaps: ['Modern tech presentation', 'Startup experience'],
    industryTrends: ['Classic professionalism', 'Proven experience emphasis', 'Traditional values'],
    salaryInsights: 'Traditional professional roles: ₹12-30 LPA in established companies',
    keywords: ['Classic', 'Professional', 'Traditional', 'Reliable', 'Established']
  },
  {
    id: 'dreamhire-resume',
    name: 'DreamHire Resume',
    category: 'creative',
    atsScore: 91,
    preview: 'https://images.pexels.com/photos/3184421/pexels-photo-3184421.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Creative two-column design with diagonal header in gradient blue-to-purple with white',
    features: ['Diagonal Header', 'Gradient Design', 'Creative Layout', 'Blue-Purple Gradient', 'Artistic Elements'],
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#A855F7',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.1,
    strengths: ['Creative visual appeal', 'Memorable design', 'Modern gradient aesthetics', 'Artistic presentation'],
    weaknesses: ['Lower ATS compatibility due to creative elements', 'Not suitable for conservative industries'],
    suggestions: ['Perfect for creative and design roles', 'Use for portfolio applications'],
    jobMatches: ['UX Designer', 'Creative Director', 'Brand Manager', 'Digital Artist'],
    skillGaps: ['Traditional business presentation', 'Conservative industry knowledge'],
    industryTrends: ['Creative personal branding', 'Visual storytelling', 'Design-forward applications'],
    salaryInsights: 'Creative roles: ₹10-25 LPA depending on portfolio and experience',
    keywords: ['Creative', 'Design', 'Artistic', 'Visual', 'Brand']
  },
  {
    id: 'techpioneer-cv',
    name: 'TechPioneer CV',
    category: 'technical',
    atsScore: 96,
    preview: 'https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Code-inspired layout with terminal aesthetics in dark theme with green accents',
    features: ['Terminal Aesthetics', 'Code-Inspired', 'Dark Theme', 'Green Accents', 'Developer Focus'],
    colors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#4ADE80',
      text: '#E5E7EB',
      background: '#111827'
    },
    layout: 'grid',
    typography: {
      headingFont: 'JetBrains Mono',
      bodyFont: 'JetBrains Mono',
      fontSize: 'small'
    },
    overallRating: 9.6,
    strengths: ['Perfect for developers', 'Code-inspired design', 'Technical appeal', 'Modern developer aesthetic'],
    weaknesses: ['Too technical for non-dev roles', 'Dark theme may not print well'],
    suggestions: ['Ideal for software engineering roles', 'Highlight coding projects and technical achievements'],
    jobMatches: ['Software Developer', 'Full Stack Engineer', 'Backend Developer', 'DevOps Engineer'],
    skillGaps: ['Business communication', 'Non-technical presentation'],
    industryTrends: ['Developer-focused design', 'Technical specialization', 'Code-first approach'],
    salaryInsights: 'Software engineering: ₹15-50 LPA depending on skills and experience',
    keywords: ['Developer', 'Technical', 'Code', 'Engineering', 'Software']
  },
  {
    id: 'innovate-profile',
    name: 'Innovate Profile',
    category: 'modern',
    atsScore: 95,
    preview: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Innovation-focused design with geometric elements in electric blue and white',
    features: ['Geometric Elements', 'Innovation Focus', 'Electric Blue', 'Modern Geometry', 'Future Design'],
    colors: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'modular',
    typography: {
      headingFont: 'Space Grotesk',
      bodyFont: 'Inter',
      fontSize: 'medium'
    },
    overallRating: 9.5,
    strengths: ['Innovation-focused presentation', 'Modern geometric design', 'Tech-forward appeal', 'Strong visual hierarchy'],
    weaknesses: ['May be too modern for traditional roles'],
    suggestions: ['Great for innovation and tech roles', 'Highlight creative problem-solving and innovation'],
    jobMatches: ['Innovation Manager', 'Product Designer', 'Tech Lead', 'R&D Specialist'],
    skillGaps: ['Traditional business experience', 'Conservative presentation'],
    industryTrends: ['Innovation emphasis', 'Geometric design', 'Tech-forward presentation'],
    salaryInsights: 'Innovation roles: ₹18-40 LPA in tech and R&D sectors',
    keywords: ['Innovation', 'Modern', 'Tech', 'Creative', 'Future']
  },
  {
    id: 'executive-platinum',
    name: 'Executive Platinum',
    category: 'executive',
    atsScore: 98,
    preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Premium executive template with platinum accents and luxury design elements',
    features: ['Platinum Accents', 'Luxury Design', 'Executive Focus', 'Premium Elements', 'Leadership Emphasis'],
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#D1D5DB',
      text: '#111827',
      background: '#FFFFFF'
    },
    layout: 'header-focus',
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lato',
      fontSize: 'large'
    },
    overallRating: 9.8,
    strengths: ['Premium executive presence', 'Luxury appeal', 'Leadership focus', 'High-end professional design'],
    weaknesses: ['Too premium for entry-level roles', 'May appear overqualified'],
    suggestions: ['Perfect for C-suite and senior executive positions', 'Highlight strategic leadership and board experience'],
    jobMatches: ['CEO', 'President', 'Board Member', 'Senior Executive'],
    skillGaps: ['Operational experience', 'Hands-on technical skills'],
    industryTrends: ['Executive luxury branding', 'Premium professional presentation', 'Leadership emphasis'],
    salaryInsights: 'Executive positions: ₹50-200+ LPA depending on company size and industry',
    keywords: ['Executive', 'Premium', 'Leadership', 'Strategic', 'Luxury']
  },
  {
    id: 'creative-canvas',
    name: 'Creative Canvas',
    category: 'artistic',
    atsScore: 88,
    preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Artistic canvas-style layout with creative elements and vibrant color palette',
    features: ['Canvas Layout', 'Artistic Elements', 'Vibrant Colors', 'Creative Expression', 'Portfolio Focus'],
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#FBBF24',
      text: '#1F2937',
      background: '#FFFBEB'
    },
    layout: 'asymmetric',
    typography: {
      headingFont: 'Comfortaa',
      bodyFont: 'Nunito',
      fontSize: 'medium'
    },
    overallRating: 8.8,
    strengths: ['Exceptional creative appeal', 'Artistic expression', 'Portfolio-focused design', 'Memorable presentation'],
    weaknesses: ['Poor ATS performance', 'Not suitable for traditional industries'],
    suggestions: ['Use for creative portfolio applications', 'Supplement with traditional resume for ATS'],
    jobMatches: ['Graphic Designer', 'Artist', 'Creative Director', 'Brand Designer'],
    skillGaps: ['Business presentation', 'Corporate communication'],
    industryTrends: ['Creative personal branding', 'Artistic expression', 'Portfolio-first approach'],
    salaryInsights: 'Creative arts: ₹8-20 LPA depending on portfolio and reputation',
    keywords: ['Creative', 'Artistic', 'Design', 'Portfolio', 'Expression']
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    category: 'academic',
    atsScore: 99,
    preview: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Research-focused template with publication emphasis and academic structure',
    features: ['Publication Focus', 'Academic Structure', 'Research Emphasis', 'Scholar Design', 'Citation Ready'],
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#93C5FD',
      text: '#1F2937',
      background: '#FFFFFF'
    },
    layout: 'single-column',
    typography: {
      headingFont: 'Times New Roman',
      bodyFont: 'Times New Roman',
      fontSize: 'medium'
    },
    overallRating: 9.9,
    strengths: ['Perfect for academic applications', 'Research-focused design', 'Publication emphasis', 'Academic standard'],
    weaknesses: ['Too formal for industry roles', 'Limited commercial appeal'],
    suggestions: ['Ideal for academic and research positions', 'Highlight publications and research achievements'],
    jobMatches: ['Professor', 'Research Scientist', 'Academic Researcher', 'Postdoc'],
    skillGaps: ['Industry application', 'Commercial experience'],
    industryTrends: ['Academic research focus', 'Publication emphasis', 'Research impact'],
    salaryInsights: 'Academic positions: ₹8-25 LPA depending on institution and field',
    keywords: ['Academic', 'Research', 'Scholar', 'Publication', 'Science']
  }
];

export const getTemplatesByCategory = (category: string) => {
  return resumeTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return resumeTemplates.find(template => template.id === id);
};

export const getHighestATSTemplates = (limit: number = 10) => {
  return resumeTemplates
    .sort((a, b) => b.atsScore - a.atsScore)
    .slice(0, limit);
};

export const getTemplatesByAtsScore = (minScore: number = 90) => {
  return resumeTemplates.filter(template => template.atsScore >= minScore);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return resumeTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.category.toLowerCase().includes(searchTerm) ||
    template.features.some(feature => feature.toLowerCase().includes(searchTerm))
  );
};
