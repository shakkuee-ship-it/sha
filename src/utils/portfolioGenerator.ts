import { saveAs } from 'file-saver';

export interface PortfolioData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin: string;
    github: string;
  };
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa: string;
  }>;
}

export const generateGitHubPages = (data: PortfolioData, template: string = 'cyberpunk'): string => {
  const templates = {
    cyberpunk: generateCyberpunkNexusTemplate(data),
    holographic: generateCosmicOdysseyTemplate(data),
    quantum: generateMysticRealmTemplate(data)
  };

  return templates[template as keyof typeof templates] || templates.cyberpunk;
};

export const downloadPortfolio = (data: PortfolioData, template: string = 'cyberpunk'): void => {
  const htmlContent = generateGitHubPages(data, template);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const fileName = `${(data.personalInfo.name || 'portfolio').replace(/\s+/g, '_').toLowerCase()}_${template}_portfolio.html`;
  saveAs(blob, fileName);
};

// PORTFOLIO 1: CYBERPUNK NEXUS - Futuristic Tech Theme
const generateCyberpunkNexusTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Cyberpunk Nexus</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <meta name="keywords" content="${data.skills.join(', ')}, portfolio, developer, ${data.personalInfo.name}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;600&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Rajdhani', sans-serif;
            background: #0a0a0a;
            color: #00ff87;
            overflow-x: hidden;
            cursor: none;
            scroll-behavior: smooth;
        }

        /* LOADING SCREEN */
        .loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 1s ease, visibility 1s ease;
        }

        .loading-screen.hidden {
            opacity: 0;
            visibility: hidden;
        }

        .cyber-logo {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            color: #00ff87;
            text-shadow: 0 0 30px #00ff87, 0 0 60px #00ff87;
            margin-bottom: 30px;
            animation: cyberPulse 2s ease-in-out infinite;
        }

        .loading-bar {
            width: 300px;
            height: 4px;
            background: rgba(0, 255, 135, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 20px;
        }

        .loading-progress {
            height: 100%;
            background: linear-gradient(90deg, #00ff87, #007bff, #ff006e);
            border-radius: 2px;
            animation: loadingProgress 3s ease-in-out forwards;
        }

        .loading-text {
            font-family: 'JetBrains Mono', monospace;
            color: #007bff;
            font-size: 1.2rem;
            animation: typewriter 2s steps(20) infinite;
        }

        @keyframes cyberPulse {
            0%, 100% { transform: scale(1); text-shadow: 0 0 30px #00ff87; }
            50% { transform: scale(1.05); text-shadow: 0 0 50px #00ff87, 0 0 80px #00ff87; }
        }

        @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }

        @keyframes typewriter {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
        
        /* CUSTOM CURSOR */
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00ff87, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
        }

        .cursor-trail {
            position: fixed;
            width: 6px;
            height: 6px;
            background: #00ff87;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.6;
            transition: all 0.3s ease;
        }
        
        /* MATRIX BACKGROUND */
        .matrix-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.1;
        }
        
        .matrix-char {
            position: absolute;
            color: #00ff87;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            animation: matrix 15s linear infinite;
            opacity: 0.3;
        }
        
        @keyframes matrix {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
        
        /* MAIN LAYOUT */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 1;
        }
        
        /* NAVIGATION */
        .nav-bar {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid #00ff87;
            border-radius: 50px;
            padding: 15px 30px;
            z-index: 1000;
            display: flex;
            gap: 30px;
            transition: all 0.3s ease;
        }

        .nav-item {
            color: #00ff87;
            text-decoration: none;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .nav-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 135, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .nav-item:hover::before {
            left: 100%;
        }

        .nav-item:hover {
            background: rgba(0, 255, 135, 0.1);
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 255, 135, 0.3);
        }
        
        /* HEADER SECTION */
        .header {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            background: radial-gradient(ellipse at center, rgba(0, 255, 135, 0.1) 0%, transparent 70%);
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%2300ff87" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.1;
            animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(10px, 10px); }
        }
        
        .name {
            font-family: 'Orbitron', monospace;
            font-size: 6rem;
            font-weight: 900;
            text-shadow: 0 0 20px #00ff87, 0 0 40px #00ff87, 0 0 60px #00ff87;
            margin-bottom: 20px;
            animation: cyberGlow 3s ease-in-out infinite alternate;
            background: linear-gradient(45deg, #00ff87, #007bff, #ff006e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .title {
            font-size: 2rem;
            color: #007bff;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 4px;
            animation: typewriter 4s steps(20) infinite;
        }

        @keyframes typewriter {
            0%, 90% { width: 0; }
            100% { width: 100%; }
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 40px;
        }
        
        .contact-item {
            background: rgba(0, 255, 135, 0.1);
            padding: 15px 25px;
            border: 2px solid #00ff87;
            border-radius: 30px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .contact-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 135, 0.3), transparent);
            transition: left 0.6s ease;
        }

        .contact-item:hover::before {
            left: 100%;
        }
        
        .contact-item:hover {
            background: rgba(0, 255, 135, 0.2);
            transform: scale(1.1) translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 255, 135, 0.4);
        }

        /* SCROLL INDICATOR */
        .scroll-indicator {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: #00ff87;
            animation: bounce 2s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
        }
        
        /* SECTION STYLES */
        .section {
            min-height: 100vh;
            padding: 100px 0;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-content {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .cyber-card {
            background: rgba(0, 20, 40, 0.9);
            backdrop-filter: blur(20px);
            border: 2px solid #00ff87;
            border-radius: 20px;
            padding: 50px;
            margin: 30px 0;
            position: relative;
            overflow: hidden;
            transition: all 0.5s ease;
            transform-style: preserve-3d;
        }

        .cyber-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, #00ff87, transparent);
            animation: scanLine 3s linear infinite;
        }

        .cyber-card::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 135, 0.05), transparent);
            animation: rotate 8s linear infinite;
            pointer-events: none;
        }

        @keyframes scanLine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .cyber-card:hover {
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 0 25px 50px rgba(0, 255, 135, 0.3);
            border-color: #ff006e;
        }
        
        .section-title {
            font-family: 'Orbitron', monospace;
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 50px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 3px;
            position: relative;
            background: linear-gradient(45deg, #00ff87, #007bff, #ff006e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: titleGlow 2s ease-in-out infinite alternate;
        }

        @keyframes titleGlow {
            from { filter: brightness(1); }
            to { filter: brightness(1.3); }
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            height: 4px;
            background: linear-gradient(90deg, transparent, #00ff87, transparent);
            animation: underlineGlow 2s ease-in-out infinite;
        }

        @keyframes underlineGlow {
            0%, 100% { box-shadow: 0 0 10px #00ff87; }
            50% { box-shadow: 0 0 20px #00ff87, 0 0 30px #00ff87; }
        }
        
        /* NETFLIX-STYLE HORIZONTAL SCROLL */
        .netflix-container {
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            padding: 20px 0;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        .netflix-container::-webkit-scrollbar {
            display: none;
        }

        .netflix-row {
            display: inline-flex;
            gap: 30px;
            padding: 0 20px;
        }

        .netflix-card {
            min-width: 350px;
            height: 200px;
            background: linear-gradient(135deg, rgba(0, 255, 135, 0.1), rgba(0, 123, 255, 0.1));
            border: 2px solid #00ff87;
            border-radius: 15px;
            padding: 30px;
            position: relative;
            transition: all 0.4s ease;
            cursor: pointer;
            overflow: hidden;
        }

        .netflix-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.6s ease;
        }

        .netflix-card:hover::before {
            left: 100%;
        }

        .netflix-card:hover {
            transform: scale(1.05) translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 255, 135, 0.3);
            border-color: #ff006e;
        }
        
        /* SKILLS ORBS */
        .skills-galaxy {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        
        .skill-orb {
            width: 200px;
            height: 200px;
            background: radial-gradient(circle at 30% 30%, rgba(0, 255, 135, 0.3), rgba(0, 123, 255, 0.1));
            border: 3px solid #00ff87;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.1rem;
            text-align: center;
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            margin: 0 auto;
        }

        .skill-orb::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent);
            border-radius: 50%;
            transition: all 0.5s ease;
            transform: translate(-50%, -50%);
        }

        .skill-orb:hover::before {
            width: 300px;
            height: 300px;
        }
        
        .skill-orb:hover {
            transform: scale(1.2) rotate(10deg);
            box-shadow: 0 0 50px rgba(0, 255, 135, 0.6);
            border-color: #ff006e;
        }

        .skill-progress {
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 6px;
            background: rgba(0, 255, 135, 0.3);
            border-radius: 3px;
            overflow: hidden;
        }

        .skill-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #00ff87, #007bff);
            border-radius: 3px;
            animation: skillProgress 2s ease-in-out forwards;
        }

        @keyframes skillProgress {
            from { width: 0%; }
            to { width: var(--progress, 85%); }
        }
        
        /* PROJECT CARDS */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }
        
        .project-card {
            background: rgba(0, 40, 80, 0.8);
            border: 2px solid #007bff;
            border-radius: 20px;
            padding: 40px;
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            transform-style: preserve-3d;
        }

        .project-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0, 255, 135, 0.05), rgba(255, 0, 110, 0.05));
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .project-card:hover::before {
            opacity: 1;
        }
        
        .project-card:hover {
            transform: translateY(-15px) rotateX(10deg) rotateY(5deg);
            border-color: #00ff87;
            box-shadow: 0 30px 60px rgba(0, 123, 255, 0.4);
        }
        
        .project-title {
            font-family: 'Orbitron', monospace;
            font-size: 2rem;
            font-weight: 700;
            color: #00ff87;
            margin-bottom: 15px;
            position: relative;
        }
        
        .project-description {
            line-height: 1.8;
            color: #e0e0e0;
            font-size: 1.2rem;
            margin-bottom: 20px;
        }
        
        .tech-stack {
            margin-top: 20px;
            font-style: italic;
            color: #007bff;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .project-link {
            display: inline-block;
            margin-top: 20px;
            color: #ff006e;
            text-decoration: none;
            border: 2px solid #ff006e;
            padding: 12px 25px;
            border-radius: 30px;
            transition: all 0.4s ease;
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }

        .project-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: #ff006e;
            transition: left 0.4s ease;
            z-index: -1;
        }

        .project-link:hover::before {
            left: 0;
        }
        
        .project-link:hover {
            color: #000;
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(255, 0, 110, 0.5);
        }

        /* EXPERIENCE TIMELINE */
        .timeline {
            position: relative;
            margin: 50px 0;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #00ff87, #007bff, #ff006e);
            transform: translateX(-50%);
            animation: timelineGlow 3s ease-in-out infinite;
        }

        @keyframes timelineGlow {
            0%, 100% { box-shadow: 0 0 10px #00ff87; }
            50% { box-shadow: 0 0 20px #00ff87, 0 0 30px #007bff; }
        }

        .timeline-item {
            position: relative;
            margin: 60px 0;
            width: 45%;
        }

        .timeline-item:nth-child(odd) {
            left: 0;
            text-align: right;
        }

        .timeline-item:nth-child(even) {
            left: 55%;
            text-align: left;
        }

        .timeline-content {
            background: rgba(0, 40, 80, 0.9);
            border: 2px solid #007bff;
            border-radius: 20px;
            padding: 30px;
            position: relative;
            transition: all 0.5s ease;
        }

        .timeline-content:hover {
            transform: scale(1.05);
            border-color: #00ff87;
            box-shadow: 0 20px 40px rgba(0, 123, 255, 0.3);
        }

        .timeline-dot {
            position: absolute;
            top: 50%;
            width: 20px;
            height: 20px;
            background: #00ff87;
            border: 4px solid #0a0a0a;
            border-radius: 50%;
            transform: translateY(-50%);
            animation: dotPulse 2s ease-in-out infinite;
        }

        .timeline-item:nth-child(odd) .timeline-dot {
            right: -60px;
        }

        .timeline-item:nth-child(even) .timeline-dot {
            left: -60px;
        }

        @keyframes dotPulse {
            0%, 100% { transform: translateY(-50%) scale(1); box-shadow: 0 0 10px #00ff87; }
            50% { transform: translateY(-50%) scale(1.2); box-shadow: 0 0 20px #00ff87; }
        }

        /* FLOATING PARTICLES */
        .particle {
            position: absolute;
            background: #00ff87;
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle 8s linear infinite;
        }

        @keyframes floatParticle {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
            .name { font-size: 3.5rem; }
            .section-title { font-size: 2.5rem; }
            .contact-info { flex-direction: column; align-items: center; }
            .skills-galaxy { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
            .projects-grid { grid-template-columns: 1fr; }
            .nav-bar { 
                position: relative; 
                top: 0; 
                left: 0; 
                transform: none; 
                margin-bottom: 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            .timeline::before { left: 30px; }
            .timeline-item { width: calc(100% - 80px); left: 80px !important; text-align: left !important; }
            .timeline-dot { left: -60px !important; }
            .skill-orb { width: 150px; height: 150px; font-size: 0.9rem; }
        }

        @keyframes cyberGlow {
            from { filter: brightness(1) hue-rotate(0deg); }
            to { filter: brightness(1.2) hue-rotate(10deg); }
        }
    </style>
</head>
<body>
    <!-- LOADING SCREEN -->
    <div class="loading-screen" id="loadingScreen">
        <div class="cyber-logo">NEXUS</div>
        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
        <div class="loading-text">INITIALIZING CYBERPUNK NEXUS...</div>
    </div>

    <!-- CUSTOM CURSOR -->
    <div class="custom-cursor" id="cursor"></div>
    
    <!-- MATRIX BACKGROUND -->
    <div class="matrix-bg" id="matrixBg"></div>
    
    <!-- NAVIGATION -->
    <nav class="nav-bar">
        <a href="#home" class="nav-item">HOME</a>
        <a href="#about" class="nav-item">ABOUT</a>
        <a href="#skills" class="nav-item">SKILLS</a>
        <a href="#projects" class="nav-item">PROJECTS</a>
        <a href="#experience" class="nav-item">EXPERIENCE</a>
        <a href="#contact" class="nav-item">CONTACT</a>
    </nav>
    
    <div class="container">
        <!-- HEADER SECTION -->
        <section id="home" class="header">
            <div>
                <h1 class="name">${data.personalInfo.name || 'CYBER NEXUS'}</h1>
                <p class="title">${data.experience[0]?.title || 'QUANTUM DEVELOPER'}</p>
                <div class="contact-info">
                    ${data.personalInfo.email ? `<div class="contact-item">📧 ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo.location ? `<div class="contact-item">📍 ${data.personalInfo.location}</div>` : ''}
                    ${data.personalInfo.linkedin ? `<div class="contact-item"><a href="${data.personalInfo.linkedin}" target="_blank" style="color: inherit; text-decoration: none;">💼 LINKEDIN</a></div>` : ''}
                    ${data.personalInfo.github ? `<div class="contact-item"><a href="${data.personalInfo.github}" target="_blank" style="color: inherit; text-decoration: none;">🔗 GITHUB</a></div>` : ''}
                </div>
            </div>
            <div class="scroll-indicator">
                <div style="font-size: 2rem;">⬇</div>
                <div style="font-size: 0.9rem; margin-top: 10px;">SCROLL TO EXPLORE</div>
            </div>
        </section>
        
        <!-- ABOUT SECTION -->
        ${data.personalInfo.summary ? `
        <section id="about" class="section">
            <div class="section-content">
                <div class="cyber-card">
                    <h2 class="section-title">SYSTEM OVERVIEW</h2>
                    <p style="font-size: 1.5rem; line-height: 1.8; text-align: center; color: #e0e0e0; max-width: 800px; margin: 0 auto;">${data.personalInfo.summary}</p>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- SKILLS SECTION -->
        ${data.skills.length > 0 ? `
        <section id="skills" class="section">
            <div class="section-content">
                <div class="cyber-card">
                    <h2 class="section-title">QUANTUM ABILITIES</h2>
                    <div class="skills-galaxy">
                        ${data.skills.map((skill, index) => `
                            <div class="skill-orb" style="animation-delay: ${index * 0.1}s;">
                                <span>${skill}</span>
                                <div class="skill-progress">
                                    <div class="skill-progress-bar" style="--progress: ${85 + Math.random() * 15}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- PROJECTS SECTION -->
        ${data.projects && data.projects.length > 0 ? `
        <section id="projects" class="section">
            <div class="section-content">
                <h2 class="section-title">PROJECT ARCHIVES</h2>
                <div class="netflix-container">
                    <div class="netflix-row">
                        ${data.projects.map(project => `
                            <div class="netflix-card" onclick="openProjectModal('${project.name}', '${project.description}', '${project.technologies}', '${project.link}')">
                                <h3 style="font-family: 'Orbitron', monospace; font-size: 1.5rem; color: #00ff87; margin-bottom: 15px;">${project.name}</h3>
                                <p style="color: #e0e0e0; line-height: 1.6; font-size: 1rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">${project.description}</p>
                                ${project.technologies ? `<p style="color: #007bff; font-style: italic; margin-top: 15px; font-size: 0.9rem;">Tech: ${project.technologies}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- EXPERIENCE SECTION -->
        ${data.experience.length > 0 ? `
        <section id="experience" class="section">
            <div class="section-content">
                <h2 class="section-title">MISSION HISTORY</h2>
                <div class="timeline">
                    ${data.experience.map((exp, index) => `
                        <div class="timeline-item">
                            <div class="timeline-content">
                                <h3 style="font-family: 'Orbitron', monospace; font-size: 1.8rem; color: #00ff87; margin-bottom: 10px;">${exp.title}</h3>
                                <p style="font-size: 1.3rem; color: #007bff; margin-bottom: 15px; font-weight: 600;">${exp.company} | ${exp.duration}</p>
                                <p style="color: #e0e0e0; line-height: 1.6; font-size: 1.1rem;">${exp.description}</p>
                            </div>
                            <div class="timeline-dot"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- EDUCATION SECTION -->
        ${data.education.length > 0 ? `
        <section id="education" class="section">
            <div class="section-content">
                <div class="cyber-card">
                    <h2 class="section-title">KNOWLEDGE MATRIX</h2>
                    <div class="projects-grid">
                        ${data.education.map(edu => `
                            <div class="project-card">
                                <h3 style="font-family: 'Orbitron', monospace; font-size: 1.8rem; color: #00ff87; margin-bottom: 15px;">${edu.degree}</h3>
                                <p style="color: #007bff; font-size: 1.3rem; margin-bottom: 10px; font-weight: 600;">${edu.institution}</p>
                                <p style="color: #e0e0e0; font-size: 1.1rem;">${edu.year}${edu.gpa ? ` | Performance Index: ${edu.gpa}` : ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        ` : ''}
    </div>

    <!-- PROJECT MODAL -->
    <div id="projectModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; backdrop-filter: blur(10px);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 40, 80, 0.95); border: 2px solid #00ff87; border-radius: 20px; padding: 50px; max-width: 600px; width: 90%;">
            <button onclick="closeProjectModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: 2px solid #ff006e; color: #ff006e; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.5rem;">×</button>
            <div id="modalContent"></div>
        </div>
    </div>
    
    <script>
        // LOADING SCREEN
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
            }, 3000);
        });

        // CUSTOM CURSOR
        const cursor = document.getElementById('cursor');
        const trails = [];
        
        // Create cursor trails
        for (let i = 0; i < 5; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trails.push(trail);
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            // Animate trails
            trails.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = mouseX + 'px';
                    trail.style.top = mouseY + 'px';
                }, index * 50);
            });
        });
        
        // MATRIX RAIN EFFECT
        function createMatrixRain() {
            const matrixBg = document.getElementById('matrixBg');
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            
            for (let i = 0; i < 100; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDelay = Math.random() * 15 + 's';
                char.style.animationDuration = (Math.random() * 10 + 10) + 's';
                matrixBg.appendChild(char);
            }
        }
        
        createMatrixRain();

        // FLOATING PARTICLES
        function createFloatingParticles() {
            setInterval(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.width = particle.style.height = Math.random() * 4 + 2 + 'px';
                particle.style.animationDuration = Math.random() * 3 + 5 + 's';
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 8000);
            }, 500);
        }
        
        createFloatingParticles();
        
        // SMOOTH SCROLLING
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // INTERSECTION OBSERVER FOR ANIMATIONS
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.cyber-card, .netflix-card, .project-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px) scale(0.9)';
            element.style.transition = 'all 1s ease';
            observer.observe(element);
        });

        // PROJECT MODAL FUNCTIONS
        function openProjectModal(name, description, technologies, link) {
            const modal = document.getElementById('projectModal');
            const content = document.getElementById('modalContent');
            
            content.innerHTML = \`
                <h3 style="font-family: 'Orbitron', monospace; font-size: 2.5rem; color: #00ff87; margin-bottom: 20px;">\${name}</h3>
                <p style="color: #e0e0e0; line-height: 1.8; font-size: 1.2rem; margin-bottom: 25px;">\${description}</p>
                \${technologies ? \`<p style="color: #007bff; font-style: italic; margin-bottom: 25px; font-size: 1.1rem;">Technologies: \${technologies}</p>\` : ''}
                \${link ? \`<a href="\${link}" target="_blank" style="color: #ff006e; text-decoration: none; border: 2px solid #ff006e; padding: 15px 30px; border-radius: 30px; display: inline-block; transition: all 0.3s ease; font-weight: 600;">🚀 LAUNCH PROJECT</a>\` : ''}
            \`;
            
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }

        function closeProjectModal() {
            const modal = document.getElementById('projectModal');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        // KEYBOARD NAVIGATION
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProjectModal();
            }
        });

        // PARALLAX EFFECT
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.matrix-bg');
            const speed = scrolled * 0.5;
            parallax.style.transform = \`translateY(\${speed}px)\`;
        });

        // NETFLIX-STYLE HORIZONTAL SCROLL
        document.querySelectorAll('.netflix-container').forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
                container.style.cursor = 'grabbing';
            });

            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mouseup', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        });
    </script>
</body>
</html>`;
};

// PORTFOLIO 2: COSMIC ODYSSEY - Space Adventure Theme
const generateCosmicOdysseyTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Cosmic Odyssey</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Space+Grotesk:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #ffffff;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* LOADING SCREEN */
        .cosmic-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, #2d1b69 0%, #11052c 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: all 1.5s ease;
        }

        .cosmic-loading.hidden {
            opacity: 0;
            visibility: hidden;
            transform: scale(1.1);
        }

        .cosmic-logo {
            font-family: 'Exo 2', sans-serif;
            font-size: 5rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 40px;
            animation: cosmicPulse 2s ease-in-out infinite;
        }

        .cosmic-orbit {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 30px;
        }

        .orbit-ring {
            position: absolute;
            border: 2px solid;
            border-radius: 50%;
            animation: rotate 4s linear infinite;
        }

        .orbit-ring:nth-child(1) {
            width: 60px;
            height: 60px;
            top: 70px;
            left: 70px;
            border-color: #ff006e;
            animation-duration: 2s;
        }

        .orbit-ring:nth-child(2) {
            width: 100px;
            height: 100px;
            top: 50px;
            left: 50px;
            border-color: #8338ec;
            animation-duration: 3s;
        }

        .orbit-ring:nth-child(3) {
            width: 140px;
            height: 140px;
            top: 30px;
            left: 30px;
            border-color: #3a86ff;
            animation-duration: 4s;
        }

        .cosmic-planet {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            background: radial-gradient(circle at 30% 30%, #06ffa5, #3a86ff);
            border-radius: 50%;
            box-shadow: 0 0 30px #06ffa5;
            animation: planetPulse 2s ease-in-out infinite;
        }

        .cosmic-loading-text {
            font-family: 'Exo 2', sans-serif;
            color: #8338ec;
            font-size: 1.5rem;
            font-weight: 600;
            animation: textGlow 2s ease-in-out infinite alternate;
        }

        @keyframes cosmicPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.05); filter: brightness(1.2); }
        }

        @keyframes planetPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        @keyframes textGlow {
            from { text-shadow: 0 0 10px #8338ec; }
            to { text-shadow: 0 0 20px #8338ec, 0 0 30px #8338ec; }
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* STARFIELD BACKGROUND */
        .starfield {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .star {
            position: absolute;
            background: #ffffff;
            border-radius: 50%;
            animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }

        /* FLOATING ISLANDS NAVIGATION */
        .floating-nav {
            position: fixed;
            top: 50%;
            right: 30px;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .nav-planet {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, var(--planet-color), var(--planet-dark));
            border: 3px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .nav-planet::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.6s ease;
        }

        .nav-planet:hover::before {
            left: 100%;
        }

        .nav-planet:hover {
            transform: scale(1.2);
            box-shadow: 0 0 30px var(--planet-glow);
        }

        .nav-planet[data-section="home"] { --planet-color: #ff006e; --planet-dark: #8b0040; --planet-glow: rgba(255, 0, 110, 0.6); }
        .nav-planet[data-section="about"] { --planet-color: #8338ec; --planet-dark: #4c1d95; --planet-glow: rgba(131, 56, 236, 0.6); }
        .nav-planet[data-section="skills"] { --planet-color: #3a86ff; --planet-dark: #1e40af; --planet-glow: rgba(58, 134, 255, 0.6); }
        .nav-planet[data-section="projects"] { --planet-color: #06ffa5; --planet-dark: #059669; --planet-glow: rgba(6, 255, 165, 0.6); }
        .nav-planet[data-section="experience"] { --planet-color: #ffbe0b; --planet-dark: #d97706; --planet-glow: rgba(255, 190, 11, 0.6); }
        .nav-planet[data-section="contact"] { --planet-color: #fb5607; --planet-dark: #dc2626; --planet-glow: rgba(251, 86, 7, 0.6); }

        /* MAIN SECTIONS */
        .cosmic-section {
            min-height: 100vh;
            padding: 100px 0;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-content {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 2;
        }

        /* HEADER */
        .cosmic-header {
            text-align: center;
            position: relative;
            background: radial-gradient(ellipse at center, rgba(255, 0, 110, 0.1) 0%, transparent 70%);
        }

        .cosmic-name {
            font-family: 'Exo 2', sans-serif;
            font-size: 6rem;
            font-weight: 900;
            background: linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 30px;
            animation: cosmicGlow 4s ease-in-out infinite;
            position: relative;
        }

        .cosmic-name::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes cosmicGlow {
            0%, 100% { filter: hue-rotate(0deg) brightness(1); }
            25% { filter: hue-rotate(90deg) brightness(1.1); }
            50% { filter: hue-rotate(180deg) brightness(1.2); }
            75% { filter: hue-rotate(270deg) brightness(1.1); }
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
        }

        /* HOLOGRAPHIC CARDS */
        .holographic-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 25px;
            padding: 50px;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
            transition: all 0.6s ease;
            transform-style: preserve-3d;
        }

        .holographic-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, rgba(255, 0, 110, 0.1), transparent, rgba(58, 134, 255, 0.1), transparent);
            animation: holographicRotate 8s linear infinite;
            pointer-events: none;
        }

        @keyframes holographicRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .holographic-card:hover {
            transform: translateY(-20px) rotateX(10deg) rotateY(5deg);
            box-shadow: 0 30px 60px rgba(131, 56, 236, 0.4);
            border-color: rgba(255, 255, 255, 0.3);
        }

        /* SKILLS CONSTELLATION */
        .skills-constellation {
            position: relative;
            min-height: 600px;
            margin: 50px 0;
        }

        .constellation-skill {
            position: absolute;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle at 30% 30%, var(--skill-color), var(--skill-dark));
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.9rem;
            text-align: center;
            transition: all 0.5s ease;
            cursor: pointer;
            animation: float 6s ease-in-out infinite;
        }

        .constellation-skill:hover {
            transform: scale(1.3);
            box-shadow: 0 0 40px var(--skill-glow);
            z-index: 10;
        }

        .constellation-line {
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform-origin: left center;
            animation: lineGlow 4s ease-in-out infinite;
        }

        @keyframes lineGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(5px) rotate(-1deg); }
        }

        /* RPG-STYLE PROJECT CARDS */
        .rpg-projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }

        .rpg-card {
            background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(131, 56, 236, 0.1));
            border: 3px solid #8338ec;
            border-radius: 20px;
            padding: 40px;
            position: relative;
            transition: all 0.6s ease;
            cursor: pointer;
            overflow: hidden;
            transform-style: preserve-3d;
        }

        .rpg-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(-100%) skewX(-15deg);
            transition: transform 0.8s ease;
        }

        .rpg-card:hover::before {
            transform: translateX(200%) skewX(-15deg);
        }

        .rpg-card:hover {
            transform: translateY(-20px) scale(1.05);
            border-color: #06ffa5;
            box-shadow: 0 25px 50px rgba(131, 56, 236, 0.4);
        }

        .rpg-badge {
            position: absolute;
            top: -15px;
            right: 20px;
            background: linear-gradient(45deg, #ff006e, #8338ec);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            box-shadow: 0 5px 15px rgba(255, 0, 110, 0.3);
        }

        /* STORYBOOK EXPERIENCE */
        .storybook-container {
            perspective: 1000px;
            margin: 50px 0;
        }

        .storybook-page {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 40px;
            margin: 30px 0;
            position: relative;
            transition: all 0.6s ease;
            transform-style: preserve-3d;
        }

        .storybook-page:hover {
            transform: rotateY(5deg) translateZ(20px);
            box-shadow: -20px 20px 40px rgba(0, 0, 0, 0.3);
        }

        .page-number {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(58, 134, 255, 0.8);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
        }

        /* PARTICLE SYSTEMS */
        .particle-system {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .cosmic-particle {
            position: absolute;
            background: radial-gradient(circle, var(--particle-color), transparent);
            border-radius: 50%;
            animation: cosmicFloat 8s linear infinite;
        }

        @keyframes cosmicFloat {
            0% { 
                transform: translateY(100vh) translateX(0) scale(0); 
                opacity: 0; 
            }
            10% { 
                opacity: 1; 
                transform: translateY(90vh) translateX(10px) scale(1); 
            }
            90% { 
                opacity: 1; 
                transform: translateY(10vh) translateX(-10px) scale(1); 
            }
            100% { 
                transform: translateY(-10vh) translateX(0) scale(0); 
                opacity: 0; 
            }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
            .cosmic-name { font-size: 3.5rem; }
            .cosmic-logo { font-size: 3rem; }
            .floating-nav { right: 15px; }
            .nav-planet { width: 50px; height: 50px; }
            .constellation-skill { width: 100px; height: 100px; font-size: 0.8rem; }
            .rpg-projects { grid-template-columns: 1fr; }
            .storybook-page { padding: 25px; }
        }

        /* SECTION TITLES */
        .cosmic-title {
            font-family: 'Exo 2', sans-serif;
            font-size: 4rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 50px;
            background: linear-gradient(45deg, #8338ec, #3a86ff, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            animation: titleFloat 3s ease-in-out infinite;
        }

        @keyframes titleFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .cosmic-title::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 4px;
            background: linear-gradient(90deg, transparent, #8338ec, transparent);
            animation: underlineExpand 2s ease-in-out infinite;
        }

        @keyframes underlineExpand {
            0%, 100% { width: 100px; opacity: 0.5; }
            50% { width: 200px; opacity: 1; }
        }
    </style>
</head>
<body>
    <!-- LOADING SCREEN -->
    <div class="cosmic-loading" id="cosmicLoading">
        <div class="cosmic-logo">COSMIC ODYSSEY</div>
        <div class="cosmic-orbit">
            <div class="orbit-ring"></div>
            <div class="orbit-ring"></div>
            <div class="orbit-ring"></div>
            <div class="cosmic-planet"></div>
        </div>
        <div class="cosmic-loading-text">Exploring the Digital Universe...</div>
    </div>

    <!-- STARFIELD BACKGROUND -->
    <div class="starfield" id="starfield"></div>

    <!-- FLOATING NAVIGATION -->
    <nav class="floating-nav">
        <div class="nav-planet" data-section="home" onclick="navigateToSection('home')" title="Home Planet">🏠</div>
        <div class="nav-planet" data-section="about" onclick="navigateToSection('about')" title="About Nebula">👤</div>
        <div class="nav-planet" data-section="skills" onclick="navigateToSection('skills')" title="Skills Galaxy">⚡</div>
        <div class="nav-planet" data-section="projects" onclick="navigateToSection('projects')" title="Project Cosmos">🚀</div>
        <div class="nav-planet" data-section="experience" onclick="navigateToSection('experience')" title="Experience Dimension">💼</div>
        <div class="nav-planet" data-section="contact" onclick="navigateToSection('contact')" title="Contact Portal">📡</div>
    </nav>

    <!-- PARTICLE SYSTEM -->
    <div class="particle-system" id="particleSystem"></div>
    
    <div class="container">
        <!-- HOME SECTION -->
        <section id="home" class="cosmic-section cosmic-header">
            <div class="section-content">
                <h1 class="cosmic-name">${data.personalInfo.name || 'COSMIC EXPLORER'}</h1>
                <p style="font-size: 2rem; color: #8338ec; margin-bottom: 40px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${data.experience[0]?.title || 'Digital Universe Navigator'}</p>
                <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 50px;">
                    ${data.personalInfo.email ? `<div style="background: rgba(255, 0, 110, 0.2); padding: 20px 30px; border: 2px solid #ff006e; border-radius: 30px; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 15px 30px rgba(255, 0, 110, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">📧 ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo.phone ? `<div style="background: rgba(131, 56, 236, 0.2); padding: 20px 30px; border: 2px solid #8338ec; border-radius: 30px; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 15px 30px rgba(131, 56, 236, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">📱 ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo.location ? `<div style="background: rgba(58, 134, 255, 0.2); padding: 20px 30px; border: 2px solid #3a86ff; border-radius: 30px; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 15px 30px rgba(58, 134, 255, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">📍 ${data.personalInfo.location}</div>` : ''}
                </div>
            </div>
        </section>
        
        <!-- ABOUT SECTION -->
        ${data.personalInfo.summary ? `
        <section id="about" class="cosmic-section">
            <div class="section-content">
                <div class="holographic-card">
                    <h2 class="cosmic-title">COSMIC ORIGIN</h2>
                    <p style="font-size: 1.6rem; line-height: 1.8; text-align: center; color: #e0e0e0; max-width: 900px; margin: 0 auto;">${data.personalInfo.summary}</p>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- SKILLS SECTION -->
        ${data.skills.length > 0 ? `
        <section id="skills" class="cosmic-section">
            <div class="section-content">
                <h2 class="cosmic-title">SKILL CONSTELLATION</h2>
                <div class="skills-constellation">
                    ${data.skills.map((skill, index) => {
                        const colors = [
                            { color: '#ff006e', dark: '#8b0040', glow: 'rgba(255, 0, 110, 0.6)' },
                            { color: '#8338ec', dark: '#4c1d95', glow: 'rgba(131, 56, 236, 0.6)' },
                            { color: '#3a86ff', dark: '#1e40af', glow: 'rgba(58, 134, 255, 0.6)' },
                            { color: '#06ffa5', dark: '#059669', glow: 'rgba(6, 255, 165, 0.6)' },
                            { color: '#ffbe0b', dark: '#d97706', glow: 'rgba(255, 190, 11, 0.6)' },
                            { color: '#fb5607', dark: '#dc2626', glow: 'rgba(251, 86, 7, 0.6)' }
                        ];
                        const colorSet = colors[index % colors.length];
                        const angle = (index * 360 / data.skills.length) * Math.PI / 180;
                        const radius = 200;
                        const x = Math.cos(angle) * radius + 50;
                        const y = Math.sin(angle) * radius + 50;
                        
                        return `
                            <div class="constellation-skill" 
                                 style="--skill-color: ${colorSet.color}; --skill-dark: ${colorSet.dark}; --skill-glow: ${colorSet.glow}; 
                                        left: calc(${x}% - 60px); top: calc(${y}% - 60px); 
                                        animation-delay: ${index * 0.2}s;"
                                 onmouseover="showSkillTooltip(this, '${skill}')"
                                 onmouseout="hideSkillTooltip()">
                                ${skill}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- PROJECTS SECTION -->
        ${data.projects && data.projects.length > 0 ? `
        <section id="projects" class="cosmic-section">
            <div class="section-content">
                <h2 class="cosmic-title">PROJECT COSMOS</h2>
                <div class="rpg-projects">
                    ${data.projects.map((project, index) => `
                        <div class="rpg-card" onclick="openCosmicModal('${project.name}', '${project.description}', '${project.technologies}', '${project.link}')">
                            <div class="rpg-badge">EPIC</div>
                            <h3 style="font-family: 'Exo 2', sans-serif; font-size: 2rem; color: #06ffa5; margin-bottom: 20px; font-weight: 700;">${project.name}</h3>
                            <p style="color: #e0e0e0; line-height: 1.7; margin-bottom: 25px; font-size: 1.1rem;">${project.description}</p>
                            ${project.technologies ? `<p style="color: #8338ec; font-style: italic; margin-bottom: 20px; font-weight: 600;">Technologies: ${project.technologies}</p>` : ''}
                            <div style="display: flex; gap: 15px; margin-top: 25px;">
                                <div style="background: rgba(6, 255, 165, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; color: #06ffa5;">⭐ Featured</div>
                                <div style="background: rgba(58, 134, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 0.9rem; color: #3a86ff;">🚀 Live</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- EXPERIENCE SECTION -->
        ${data.experience.length > 0 ? `
        <section id="experience" class="cosmic-section">
            <div class="section-content">
                <h2 class="cosmic-title">JOURNEY THROUGH SPACE</h2>
                <div class="storybook-container">
                    ${data.experience.map((exp, index) => `
                        <div class="storybook-page">
                            <div class="page-number">${index + 1}</div>
                            <h3 style="font-family: 'Exo 2', sans-serif; font-size: 2.2rem; color: #ff006e; margin-bottom: 15px; font-weight: 700;">${exp.title}</h3>
                            <p style="font-size: 1.5rem; color: #8338ec; margin-bottom: 20px; font-weight: 600;">${exp.company} | ${exp.duration}</p>
                            <p style="color: #e0e0e0; line-height: 1.8; font-size: 1.2rem;">${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- CONTACT SECTION -->
        <section id="contact" class="cosmic-section">
            <div class="section-content">
                <div class="holographic-card">
                    <h2 class="cosmic-title">CONTACT PORTAL</h2>
                    <div style="text-align: center; font-size: 1.5rem; color: #e0e0e0; margin-bottom: 40px;">
                        Ready to embark on a cosmic journey together?
                    </div>
                    <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
                        ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" style="background: linear-gradient(45deg, #ff006e, #8338ec); color: white; padding: 20px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; transition: all 0.4s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(255, 0, 110, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">📧 Send Message</a>` : ''}
                        ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank" style="background: linear-gradient(45deg, #3a86ff, #06ffa5); color: white; padding: 20px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; transition: all 0.4s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(58, 134, 255, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">💼 LinkedIn</a>` : ''}
                        ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank" style="background: linear-gradient(45deg, #06ffa5, #ffbe0b); color: white; padding: 20px 40px; border-radius: 30px; text-decoration: none; font-weight: 700; transition: all 0.4s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.transform='scale(1.1) translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(6, 255, 165, 0.4)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='none'">🔗 GitHub</a>` : ''}
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- COSMIC MODAL -->
    <div id="cosmicModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; backdrop-filter: blur(15px);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(131, 56, 236, 0.1)); border: 3px solid #8338ec; border-radius: 25px; padding: 60px; max-width: 700px; width: 90%; backdrop-filter: blur(20px);">
            <button onclick="closeCosmicModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: 3px solid #ff006e; color: #ff006e; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 1.8rem; transition: all 0.3s ease;" onmouseover="this.style.background='#ff006e'; this.style.color='white'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='none'; this.style.color='#ff006e'; this.style.transform='scale(1)'">×</button>
            <div id="cosmicModalContent"></div>
        </div>
    </div>

    <!-- SKILL TOOLTIP -->
    <div id="skillTooltip" style="position: fixed; background: rgba(0, 0, 0, 0.9); color: white; padding: 10px 15px; border-radius: 10px; font-size: 0.9rem; pointer-events: none; z-index: 10001; opacity: 0; transition: all 0.3s ease; border: 1px solid #8338ec;"></div>
    
    <script>
        // LOADING SCREEN
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('cosmicLoading').classList.add('hidden');
            }, 4000);
        });

        // CREATE STARFIELD
        function createStarfield() {
            const starfield = document.getElementById('starfield');
            for (let i = 0; i < 200; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.width = star.style.height = Math.random() * 3 + 1 + 'px';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = Math.random() * 3 + 2 + 's';
                starfield.appendChild(star);
            }
        }

        createStarfield();

        // CREATE PARTICLE SYSTEM
        function createParticleSystem() {
            const particleSystem = document.getElementById('particleSystem');
            const colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b'];
            
            setInterval(() => {
                const particle = document.createElement('div');
                particle.className = 'cosmic-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.width = particle.style.height = Math.random() * 6 + 2 + 'px';
                particle.style.setProperty('--particle-color', colors[Math.floor(Math.random() * colors.length)]);
                particle.style.animationDuration = Math.random() * 4 + 6 + 's';
                particleSystem.appendChild(particle);
                
                setTimeout(() => {
                    particle.remove();
                }, 10000);
            }, 300);
        }

        createParticleSystem();

        // NAVIGATION
        function navigateToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // MODAL FUNCTIONS
        function openCosmicModal(name, description, technologies, link) {
            const modal = document.getElementById('cosmicModal');
            const content = document.getElementById('cosmicModalContent');
            
            content.innerHTML = \`
                <h3 style="font-family: 'Exo 2', sans-serif; font-size: 3rem; color: #06ffa5; margin-bottom: 25px; font-weight: 700;">\${name}</h3>
                <p style="color: #e0e0e0; line-height: 1.8; font-size: 1.3rem; margin-bottom: 30px;">\${description}</p>
                \${technologies ? \`<p style="color: #8338ec; font-style: italic; margin-bottom: 30px; font-size: 1.2rem; font-weight: 600;">Technologies: \${technologies}</p>\` : ''}
                \${link ? \`<a href="\${link}" target="_blank" style="background: linear-gradient(45deg, #ff006e, #8338ec); color: white; padding: 18px 35px; border-radius: 30px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 10px; transition: all 0.4s ease; font-size: 1.1rem;" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 15px 30px rgba(255, 0, 110, 0.4)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">🚀 EXPLORE PROJECT</a>\` : ''}
            \`;
            
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }

        function closeCosmicModal() {
            const modal = document.getElementById('cosmicModal');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        // SKILL TOOLTIP
        function showSkillTooltip(element, skill) {
            const tooltip = document.getElementById('skillTooltip');
            const rect = element.getBoundingClientRect();
            tooltip.textContent = \`Mastery Level: \${85 + Math.floor(Math.random() * 15)}% | \${skill}\`;
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - 50 + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.opacity = '1';
        }

        function hideSkillTooltip() {
            document.getElementById('skillTooltip').style.opacity = '0';
        }

        // INTERSECTION OBSERVER
        const cosmicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
        
        document.querySelectorAll('.holographic-card, .rpg-card, .storybook-page').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(80px) scale(0.9)';
            element.style.transition = 'all 1.2s ease';
            cosmicObserver.observe(element);
        });

        // KEYBOARD CONTROLS
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeCosmicModal();
            if (e.key === 'ArrowDown') window.scrollBy(0, 100);
            if (e.key === 'ArrowUp') window.scrollBy(0, -100);
        });

        // TOUCH GESTURES FOR MOBILE
        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Swipe up - next section
                    const currentSection = getCurrentSection();
                    const nextSection = getNextSection(currentSection);
                    if (nextSection) navigateToSection(nextSection);
                } else {
                    // Swipe down - previous section
                    const currentSection = getCurrentSection();
                    const prevSection = getPrevSection(currentSection);
                    if (prevSection) navigateToSection(prevSection);
                }
            }
        });

        function getCurrentSection() {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            for (let section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    const elementBottom = elementTop + rect.height;
                    
                    if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
                        return section;
                    }
                }
            }
            return 'home';
        }

        function getNextSection(current) {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const currentIndex = sections.indexOf(current);
            return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
        }

        function getPrevSection(current) {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const currentIndex = sections.indexOf(current);
            return currentIndex > 0 ? sections[currentIndex - 1] : null;
        }
    </script>
</body>
</html>`;
};

// PORTFOLIO 3: MYSTIC REALM - Fantasy Adventure Theme
const generateMysticRealmTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Mystic Realm</title>
    <meta name="description" content="Professional portfolio of ${data.personalInfo.name || 'Developer'} - ${data.personalInfo.summary || 'Software Developer'}">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:wght@300;400;600;700&family=Uncial+Antiqua&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cormorant Garamond', serif;
            background: linear-gradient(135deg, #2d1b69 0%, #11052c 50%, #0f0f23 100%);
            color: #f0e6d2;
            overflow-x: hidden;
            scroll-behavior: smooth;
        }

        /* LOADING SCREEN */
        .mystic-loading {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, #4a148c 0%, #1a0033 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: all 2s ease;
        }

        .mystic-loading.hidden {
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8);
        }

        .mystic-logo {
            font-family: 'Uncial Antiqua', cursive;
            font-size: 4rem;
            color: #d4af37;
            text-shadow: 0 0 30px #d4af37, 0 0 60px #d4af37;
            margin-bottom: 40px;
            animation: mysticGlow 3s ease-in-out infinite;
        }

        .magic-circle {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 30px;
        }

        .circle-ring {
            position: absolute;
            border: 3px solid;
            border-radius: 50%;
            animation: magicRotate 6s linear infinite;
        }

        .circle-ring:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 60px;
            left: 60px;
            border-color: #d4af37;
            animation-direction: normal;
        }

        .circle-ring:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 40px;
            left: 40px;
            border-color: #9c27b0;
            animation-direction: reverse;
            animation-duration: 4s;
        }

        .circle-ring:nth-child(3) {
            width: 160px;
            height: 160px;
            top: 20px;
            left: 20px;
            border-color: #673ab7;
            animation-duration: 8s;
        }

        .magic-orb {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: radial-gradient(circle at 30% 30%, #d4af37, #9c27b0);
            border-radius: 50%;
            box-shadow: 0 0 40px #d4af37;
            animation: orbPulse 2s ease-in-out infinite;
        }

        .mystic-loading-text {
            font-family: 'Cinzel', serif;
            color: #9c27b0;
            font-size: 1.4rem;
            font-weight: 600;
            animation: textShimmer 2s ease-in-out infinite;
        }

        @keyframes mysticGlow {
            0%, 100% { text-shadow: 0 0 30px #d4af37; }
            50% { text-shadow: 0 0 50px #d4af37, 0 0 80px #d4af37; }
        }

        @keyframes magicRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes orbPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.3); }
        }

        @keyframes textShimmer {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; text-shadow: 0 0 20px #9c27b0; }
        }

        /* ENCHANTED BACKGROUND */
        .enchanted-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="sparkle"><stop offset="0%" stop-color="%23d4af37" stop-opacity="0.8"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="20" cy="30" r="1" fill="url(%23sparkle)"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle><circle cx="80" cy="20" r="1.5" fill="url(%23sparkle)"><animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite"/></circle><circle cx="60" cy="70" r="1" fill="url(%23sparkle)"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"/></circle></svg>') repeat;
            animation: sparkleMove 20s linear infinite;
        }

        @keyframes sparkleMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(100px, 100px); }
        }

        /* FLOATING SPELL BOOK NAVIGATION */
        .spell-book-nav {
            position: fixed;
            top: 50%;
            left: 30px;
            transform: translateY(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .spell-page {
            width: 80px;
            height: 60px;
            background: linear-gradient(135deg, #d4af37, #b8860b);
            border: 2px solid #8b6914;
            border-radius: 5px 15px 15px 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s ease;
            position: relative;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
            font-size: 1.5rem;
        }

        .spell-page::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%) skewX(-15deg);
            transition: transform 0.6s ease;
        }

        .spell-page:hover::before {
            transform: translateX(200%) skewX(-15deg);
        }

        .spell-page:hover {
            transform: scale(1.2) translateX(10px);
            box-shadow: 10px 10px 25px rgba(212, 175, 55, 0.4);
        }

        /* MAIN SECTIONS */
        .realm-section {
            min-height: 100vh;
            padding: 100px 0;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-content {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 2;
        }

        /* ENCHANTED CARDS */
        .enchanted-scroll {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(156, 39, 176, 0.1));
            border: 3px solid #d4af37;
            border-radius: 20px;
            padding: 50px;
            margin: 40px 0;
            position: relative;
            overflow: hidden;
            transition: all 0.8s ease;
            transform-style: preserve-3d;
        }

        .enchanted-scroll::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212, 175, 55, 0.1), transparent 50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .enchanted-scroll:hover::before {
            opacity: 1;
        }

        .enchanted-scroll:hover {
            transform: translateY(-15px) rotateX(5deg);
            box-shadow: 0 30px 60px rgba(212, 175, 55, 0.3);
            border-color: #9c27b0;
        }

        /* HEADER */
        .mystic-header {
            text-align: center;
            position: relative;
            background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
        }

        .mystic-name {
            font-family: 'Uncial Antiqua', cursive;
            font-size: 6rem;
            color: #d4af37;
            text-shadow: 0 0 30px #d4af37, 0 0 60px #d4af37;
            margin-bottom: 30px;
            animation: nameGlow 4s ease-in-out infinite;
            position: relative;
        }

        .mystic-name::after {
            content: '✨';
            position: absolute;
            top: -20px;
            right: -30px;
            font-size: 2rem;
            animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes nameGlow {
            0%, 100% { filter: brightness(1) hue-rotate(0deg); }
            50% { filter: brightness(1.3) hue-rotate(20deg); }
        }

        @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        }

        /* MAGICAL SKILLS GRID */
        .magic-skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }

        .magic-crystal {
            width: 180px;
            height: 180px;
            background: linear-gradient(135deg, var(--crystal-color), var(--crystal-dark));
            border: 4px solid #d4af37;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1rem;
            text-align: center;
            transition: all 0.6s ease;
            position: relative;
            cursor: pointer;
            margin: 0 auto;
            transform: rotate(45deg);
            overflow: hidden;
        }

        .magic-crystal::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            animation: crystalRotate 4s linear infinite;
        }

        .crystal-content {
            transform: rotate(-45deg);
            z-index: 2;
            position: relative;
        }

        @keyframes crystalRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .magic-crystal:hover {
            transform: rotate(45deg) scale(1.2) translateY(-10px);
            box-shadow: 0 20px 40px var(--crystal-glow);
        }

        /* ADVENTURE MAP PROJECTS */
        .adventure-map {
            position: relative;
            min-height: 600px;
            background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1), transparent);
            border-radius: 30px;
            margin: 50px 0;
            overflow: hidden;
        }

        .map-location {
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle at 30% 30%, var(--location-color), var(--location-dark));
            border: 4px solid #d4af37;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.5s ease;
            font-size: 2rem;
            animation: mapFloat 4s ease-in-out infinite;
        }

        .map-location:hover {
            transform: scale(1.3);
            box-shadow: 0 0 50px var(--location-glow);
            z-index: 10;
        }

        @keyframes mapFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        .map-path {
            position: absolute;
            height: 4px;
            background: linear-gradient(90deg, transparent, #d4af37, transparent);
            animation: pathGlow 3s ease-in-out infinite;
        }

        @keyframes pathGlow {
            0%, 100% { opacity: 0.5; box-shadow: 0 0 10px #d4af37; }
            50% { opacity: 1; box-shadow: 0 0 20px #d4af37; }
        }

        /* STORYBOOK EXPERIENCE */
        .storybook-experience {
            perspective: 1200px;
            margin: 50px 0;
        }

        .story-page {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(156, 39, 176, 0.1));
            border: 3px solid #d4af37;
            border-radius: 20px;
            padding: 50px;
            margin: 40px 0;
            position: relative;
            transition: all 0.8s ease;
            transform-style: preserve-3d;
            cursor: pointer;
        }

        .story-page::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 2px solid rgba(212, 175, 55, 0.3);
            border-radius: 15px;
            transition: all 0.5s ease;
        }

        .story-page:hover {
            transform: rotateY(-10deg) translateZ(30px);
            box-shadow: 20px 20px 40px rgba(0, 0, 0, 0.4);
        }

        .story-page:hover::before {
            border-color: #9c27b0;
            box-shadow: inset 0 0 30px rgba(156, 39, 176, 0.2);
        }

        .chapter-number {
            position: absolute;
            top: -20px;
            left: 30px;
            background: linear-gradient(45deg, #d4af37, #9c27b0);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 1.5rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        /* FLOATING ELEMENTS */
        .floating-rune {
            position: absolute;
            font-size: 2rem;
            color: #d4af37;
            opacity: 0.6;
            animation: runeFloat 8s ease-in-out infinite;
            pointer-events: none;
        }

        @keyframes runeFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
            25% { transform: translateY(-20px) rotate(90deg); opacity: 0.8; }
            50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
            75% { transform: translateY(-30px) rotate(270deg); opacity: 0.8; }
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
            .mystic-name { font-size: 3.5rem; }
            .mystic-logo { font-size: 2.5rem; }
            .spell-book-nav { left: 15px; }
            .spell-page { width: 60px; height: 45px; font-size: 1.2rem; }
            .magic-crystal { width: 140px; height: 140px; font-size: 0.9rem; }
            .map-location { width: 80px; height: 80px; font-size: 1.5rem; }
            .story-page { padding: 30px; }
        }

        /* SECTION TITLES */
        .realm-title {
            font-family: 'Uncial Antiqua', cursive;
            font-size: 4rem;
            text-align: center;
            margin-bottom: 50px;
            color: #d4af37;
            text-shadow: 0 0 30px #d4af37;
            position: relative;
            animation: titleMagic 3s ease-in-out infinite;
        }

        @keyframes titleMagic {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.05); filter: brightness(1.2); }
        }

        .realm-title::before {
            content: '🔮';
            position: absolute;
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 2rem;
            animation: orbSpin 4s linear infinite;
        }

        .realm-title::after {
            content: '✨';
            position: absolute;
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 2rem;
            animation: sparkleRotate 3s ease-in-out infinite;
        }

        @keyframes orbSpin {
            from { transform: translateY(-50%) rotate(0deg); }
            to { transform: translateY(-50%) rotate(360deg); }
        }

        @keyframes sparkleRotate {
            0%, 100% { transform: translateY(-50%) scale(1) rotate(0deg); }
            50% { transform: translateY(-50%) scale(1.2) rotate(180deg); }
        }
    </style>
</head>
<body>
    <!-- LOADING SCREEN -->
    <div class="mystic-loading" id="mysticLoading">
        <div class="mystic-logo">MYSTIC REALM</div>
        <div class="magic-circle">
            <div class="circle-ring"></div>
            <div class="circle-ring"></div>
            <div class="circle-ring"></div>
            <div class="magic-orb"></div>
        </div>
        <div class="mystic-loading-text">Conjuring Digital Magic...</div>
    </div>

    <!-- ENCHANTED BACKGROUND -->
    <div class="enchanted-bg"></div>

    <!-- SPELL BOOK NAVIGATION -->
    <nav class="spell-book-nav">
        <div class="spell-page" onclick="navigateToRealm('home')" title="Home Realm">🏰</div>
        <div class="spell-page" onclick="navigateToRealm('about')" title="Origin Story">📜</div>
        <div class="spell-page" onclick="navigateToRealm('skills')" title="Magic Abilities">⚡</div>
        <div class="spell-page" onclick="navigateToRealm('projects')" title="Quest Adventures">🗺️</div>
        <div class="spell-page" onclick="navigateToRealm('experience')" title="Epic Journey">⚔️</div>
        <div class="spell-page" onclick="navigateToRealm('contact')" title="Communication Portal">🔮</div>
    </nav>

    <!-- FLOATING RUNES -->
    <div class="floating-rune" style="top: 10%; left: 10%; animation-delay: 0s;">🔮</div>
    <div class="floating-rune" style="top: 20%; right: 15%; animation-delay: 1s;">✨</div>
    <div class="floating-rune" style="top: 60%; left: 5%; animation-delay: 2s;">🌟</div>
    <div class="floating-rune" style="bottom: 20%; right: 10%; animation-delay: 3s;">💫</div>
    <div class="floating-rune" style="bottom: 40%; left: 20%; animation-delay: 4s;">🔥</div>
    
    <div class="container">
        <!-- HOME SECTION -->
        <section id="home" class="realm-section mystic-header">
            <div class="section-content">
                <h1 class="mystic-name">${data.personalInfo.name || 'MYSTIC SAGE'}</h1>
                <p style="font-family: 'Cinzel', serif; font-size: 2.2rem; color: #9c27b0; margin-bottom: 50px; font-weight: 600; text-shadow: 0 0 20px #9c27b0;">${data.experience[0]?.title || 'Digital Realm Guardian'}</p>
                <div style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; margin-top: 60px;">
                    ${data.personalInfo.email ? `<div style="background: linear-gradient(45deg, #d4af37, #b8860b); padding: 20px 35px; border: 3px solid #8b6914; border-radius: 25px; transition: all 0.5s ease; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 20px 40px rgba(212, 175, 55, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 10px 20px rgba(212, 175, 55, 0.3)'">📧 ${data.personalInfo.email}</div>` : ''}
                    ${data.personalInfo.phone ? `<div style="background: linear-gradient(45deg, #9c27b0, #673ab7); padding: 20px 35px; border: 3px solid #4a148c; border-radius: 25px; transition: all 0.5s ease; box-shadow: 0 10px 20px rgba(156, 39, 176, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 20px 40px rgba(156, 39, 176, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 10px 20px rgba(156, 39, 176, 0.3)'">📱 ${data.personalInfo.phone}</div>` : ''}
                    ${data.personalInfo.location ? `<div style="background: linear-gradient(45deg, #673ab7, #3f51b5); padding: 20px 35px; border: 3px solid #311b92; border-radius: 25px; transition: all 0.5s ease; box-shadow: 0 10px 20px rgba(103, 58, 183, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 20px 40px rgba(103, 58, 183, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 10px 20px rgba(103, 58, 183, 0.3)'">📍 ${data.personalInfo.location}</div>` : ''}
                </div>
            </div>
        </section>
        
        <!-- ABOUT SECTION -->
        ${data.personalInfo.summary ? `
        <section id="about" class="realm-section">
            <div class="section-content">
                <div class="enchanted-scroll">
                    <h2 class="realm-title">ORIGIN CHRONICLE</h2>
                    <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; line-height: 1.8; text-align: center; color: #f0e6d2; max-width: 900px; margin: 0 auto; font-weight: 400;">${data.personalInfo.summary}</p>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- SKILLS SECTION -->
        ${data.skills.length > 0 ? `
        <section id="skills" class="realm-section">
            <div class="section-content">
                <h2 class="realm-title">MAGICAL ABILITIES</h2>
                <div class="magic-skills-grid">
                    ${data.skills.map((skill, index) => {
                        const colors = [
                            { color: '#d4af37', dark: '#b8860b', glow: 'rgba(212, 175, 55, 0.6)' },
                            { color: '#9c27b0', dark: '#673ab7', glow: 'rgba(156, 39, 176, 0.6)' },
                            { color: '#673ab7', dark: '#3f51b5', glow: 'rgba(103, 58, 183, 0.6)' },
                            { color: '#3f51b5', dark: '#1976d2', glow: 'rgba(63, 81, 181, 0.6)' },
                            { color: '#1976d2', dark: '#0277bd', glow: 'rgba(25, 118, 210, 0.6)' },
                            { color: '#0277bd', dark: '#0288d1', glow: 'rgba(2, 119, 189, 0.6)' }
                        ];
                        const colorSet = colors[index % colors.length];
                        
                        return `
                            <div class="magic-crystal" 
                                 style="--crystal-color: ${colorSet.color}; --crystal-dark: ${colorSet.dark}; --crystal-glow: ${colorSet.glow}; 
                                        animation-delay: ${index * 0.3}s;"
                                 onclick="castSkillSpell('${skill}')">
                                <div class="crystal-content">${skill}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- PROJECTS SECTION -->
        ${data.projects && data.projects.length > 0 ? `
        <section id="projects" class="realm-section">
            <div class="section-content">
                <h2 class="realm-title">QUEST ADVENTURES</h2>
                <div class="adventure-map">
                    ${data.projects.map((project, index) => {
                        const positions = [
                            { left: '20%', top: '30%' },
                            { left: '70%', top: '20%' },
                            { left: '50%', top: '60%' },
                            { left: '15%', top: '70%' },
                            { left: '80%', top: '65%' }
                        ];
                        const colors = [
                            { color: '#d4af37', dark: '#b8860b', glow: 'rgba(212, 175, 55, 0.8)' },
                            { color: '#9c27b0', dark: '#673ab7', glow: 'rgba(156, 39, 176, 0.8)' },
                            { color: '#673ab7', dark: '#3f51b5', glow: 'rgba(103, 58, 183, 0.8)' },
                            { color: '#3f51b5', dark: '#1976d2', glow: 'rgba(63, 81, 181, 0.8)' },
                            { color: '#1976d2', dark: '#0277bd', glow: 'rgba(25, 118, 210, 0.8)' }
                        ];
                        const position = positions[index % positions.length];
                        const colorSet = colors[index % colors.length];
                        
                        return `
                            <div class="map-location" 
                                 style="--location-color: ${colorSet.color}; --location-dark: ${colorSet.dark}; --location-glow: ${colorSet.glow}; 
                                        left: ${position.left}; top: ${position.top}; 
                                        animation-delay: ${index * 0.5}s;"
                                 onclick="openQuestModal('${project.name}', '${project.description}', '${project.technologies}', '${project.link}')"
                                 title="${project.name}">
                                🏰
                            </div>
                        `;
                    }).join('')}
                    
                    <!-- MAP PATHS -->
                    <div class="map-path" style="left: 25%; top: 35%; width: 40%; transform: rotate(15deg);"></div>
                    <div class="map-path" style="left: 55%; top: 25%; width: 30%; transform: rotate(-20deg);"></div>
                    <div class="map-path" style="left: 45%; top: 45%; width: 35%; transform: rotate(45deg);"></div>
                </div>
            </div>
        </section>
        ` : ''}
        
        <!-- EXPERIENCE SECTION -->
        ${data.experience.length > 0 ? `
        <section id="experience" class="realm-section">
            <div class="section-content">
                <h2 class="realm-title">EPIC CHRONICLES</h2>
                <div class="storybook-experience">
                    ${data.experience.map((exp, index) => `
                        <div class="story-page">
                            <div class="chapter-number">${index + 1}</div>
                            <h3 style="font-family: 'Cinzel', serif; font-size: 2.5rem; color: #d4af37; margin-bottom: 20px; font-weight: 700;">${exp.title}</h3>
                            <p style="font-size: 1.6rem; color: #9c27b0; margin-bottom: 25px; font-weight: 600;">${exp.company} | ${exp.duration}</p>
                            <p style="color: #f0e6d2; line-height: 1.8; font-size: 1.3rem;">${exp.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- EDUCATION SECTION -->
        ${data.education.length > 0 ? `
        <section id="education" class="realm-section">
            <div class="section-content">
                <div class="enchanted-scroll">
                    <h2 class="realm-title">WISDOM SCROLLS</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px; margin-top: 50px;">
                        ${data.education.map((edu, index) => `
                            <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(156, 39, 176, 0.1)); border: 3px solid #d4af37; border-radius: 20px; padding: 40px; transition: all 0.6s ease; cursor: pointer;" onmouseover="this.style.transform='scale(1.05) translateY(-10px)'; this.style.borderColor='#9c27b0'; this.style.boxShadow='0 25px 50px rgba(212, 175, 55, 0.3)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.borderColor='#d4af37'; this.style.boxShadow='none'">
                                <h3 style="font-family: 'Cinzel', serif; font-size: 2rem; color: #d4af37; margin-bottom: 15px; font-weight: 700;">${edu.degree}</h3>
                                <p style="color: #9c27b0; font-size: 1.4rem; margin-bottom: 10px; font-weight: 600;">${edu.institution}</p>
                                <p style="color: #f0e6d2; font-size: 1.2rem;">${edu.year}${edu.gpa ? ` | Wisdom Level: ${edu.gpa}` : ''}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </section>
        ` : ''}

        <!-- CONTACT SECTION -->
        <section id="contact" class="realm-section">
            <div class="section-content">
                <div class="enchanted-scroll">
                    <h2 class="realm-title">COMMUNICATION PORTAL</h2>
                    <div style="text-align: center; font-size: 1.6rem; color: #f0e6d2; margin-bottom: 50px; font-family: 'Cormorant Garamond', serif;">
                        Ready to embark on a magical journey together?
                    </div>
                    <div style="display: flex; justify-content: center; gap: 50px; flex-wrap: wrap;">
                        ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" style="background: linear-gradient(45deg, #d4af37, #9c27b0); color: white; padding: 25px 45px; border-radius: 30px; text-decoration: none; font-family: 'Cinzel', serif; font-weight: 700; font-size: 1.2rem; transition: all 0.5s ease; display: flex; align-items: center; gap: 15px; box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 25px 50px rgba(212, 175, 55, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 15px 30px rgba(212, 175, 55, 0.3)'">📧 Send Scroll</a>` : ''}
                        ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" target="_blank" style="background: linear-gradient(45deg, #9c27b0, #673ab7); color: white; padding: 25px 45px; border-radius: 30px; text-decoration: none; font-family: 'Cinzel', serif; font-weight: 700; font-size: 1.2rem; transition: all 0.5s ease; display: flex; align-items: center; gap: 15px; box-shadow: 0 15px 30px rgba(156, 39, 176, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 25px 50px rgba(156, 39, 176, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 15px 30px rgba(156, 39, 176, 0.3)'">💼 Professional Guild</a>` : ''}
                        ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" target="_blank" style="background: linear-gradient(45deg, #673ab7, #3f51b5); color: white; padding: 25px 45px; border-radius: 30px; text-decoration: none; font-family: 'Cinzel', serif; font-weight: 700; font-size: 1.2rem; transition: all 0.5s ease; display: flex; align-items: center; gap: 15px; box-shadow: 0 15px 30px rgba(103, 58, 183, 0.3);" onmouseover="this.style.transform='scale(1.1) translateY(-8px)'; this.style.boxShadow='0 25px 50px rgba(103, 58, 183, 0.5)'" onmouseout="this.style.transform='scale(1) translateY(0)'; this.style.boxShadow='0 15px 30px rgba(103, 58, 183, 0.3)'">🔗 Code Grimoire</a>` : ''}
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- QUEST MODAL -->
    <div id="questModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 10000; backdrop-filter: blur(15px);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(156, 39, 176, 0.1)); border: 4px solid #d4af37; border-radius: 25px; padding: 60px; max-width: 700px; width: 90%; backdrop-filter: blur(20px);">
            <button onclick="closeQuestModal()" style="position: absolute; top: 20px; right: 20px; background: none; border: 3px solid #9c27b0; color: #9c27b0; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; font-size: 2rem; transition: all 0.4s ease;" onmouseover="this.style.background='#9c27b0'; this.style.color='white'; this.style.transform='scale(1.1) rotate(90deg)'" onmouseout="this.style.background='none'; this.style.color='#9c27b0'; this.style.transform='scale(1) rotate(0deg)'">×</button>
            <div id="questModalContent"></div>
        </div>
    </div>

    <!-- SKILL SPELL EFFECT -->
    <div id="skillSpell" style="position: fixed; pointer-events: none; z-index: 10001; opacity: 0; transition: all 0.5s ease;">
        <div style="background: radial-gradient(circle, #d4af37, transparent); width: 100px; height: 100px; border-radius: 50%; animation: spellCast 1s ease-out;"></div>
    </div>
    
    <script>
        // LOADING SCREEN
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('mysticLoading').classList.add('hidden');
            }, 4500);
        });

        // NAVIGATION
        function navigateToRealm(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // QUEST MODAL
        function openQuestModal(name, description, technologies, link) {
            const modal = document.getElementById('questModal');
            const content = document.getElementById('questModalContent');
            
            content.innerHTML = \`
                <h3 style="font-family: 'Uncial Antiqua', cursive; font-size: 3rem; color: #d4af37; margin-bottom: 30px; text-shadow: 0 0 20px #d4af37;">\${name}</h3>
                <p style="color: #f0e6d2; line-height: 1.8; font-size: 1.4rem; margin-bottom: 35px; font-family: 'Cormorant Garamond', serif;">\${description}</p>
                \${technologies ? \`<p style="color: #9c27b0; font-style: italic; margin-bottom: 35px; font-size: 1.3rem; font-weight: 600;">Magical Tools: \${technologies}</p>\` : ''}
                \${link ? \`<a href="\${link}" target="_blank" style="background: linear-gradient(45deg, #d4af37, #9c27b0); color: white; padding: 20px 40px; border-radius: 30px; text-decoration: none; font-family: 'Cinzel', serif; font-weight: 700; display: inline-flex; align-items: center; gap: 15px; transition: all 0.5s ease; font-size: 1.2rem; box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 20px 40px rgba(212, 175, 55, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 15px 30px rgba(212, 175, 55, 0.4)'">🗡️ EMBARK ON QUEST</a>\` : ''}
            \`;
            
            modal.style.display = 'block';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }

        function closeQuestModal() {
            const modal = document.getElementById('questModal');
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }

        // SKILL SPELL EFFECT
        function castSkillSpell(skill) {
            const spell = document.getElementById('skillSpell');
            const rect = event.target.getBoundingClientRect();
            
            spell.style.left = rect.left + rect.width / 2 - 50 + 'px';
            spell.style.top = rect.top + rect.height / 2 - 50 + 'px';
            spell.style.opacity = '1';
            
            setTimeout(() => {
                spell.style.opacity = '0';
            }, 1000);
            
            // Show skill notification
            showMagicNotification(\`✨ \${skill} spell activated! ✨\`);
        }

        function showMagicNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = \`
                position: fixed;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #d4af37, #9c27b0);
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                font-family: 'Cinzel', serif;
                font-weight: 600;
                z-index: 10002;
                box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
                animation: notificationSlide 3s ease-in-out forwards;
            \`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // MOUSE TRACKING FOR ENCHANTED CARDS
        document.querySelectorAll('.enchanted-scroll').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });

        // INTERSECTION OBSERVER
        const realmObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
        
        document.querySelectorAll('.enchanted-scroll, .story-page, .magic-crystal').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(100px) scale(0.8)';
            element.style.transition = 'all 1.5s ease';
            realmObserver.observe(element);
        });

        // KEYBOARD SPELLS
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeQuestModal();
            if (e.key === 'ArrowDown') window.scrollBy({ top: 100, behavior: 'smooth' });
            if (e.key === 'ArrowUp') window.scrollBy({ top: -100, behavior: 'smooth' });
            if (e.key === ' ') {
                e.preventDefault();
                window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            }
        });

        // ADD CUSTOM CSS ANIMATIONS
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes spellCast {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(2) rotate(360deg); opacity: 0; }
            }
            
            @keyframes notificationSlide {
                0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                10% { transform: translateX(-50%) translateY(0); opacity: 1; }
                90% { transform: translateX(-50%) translateY(0); opacity: 1; }
                100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
            }
        \`;
        document.head.appendChild(style);

        // PARALLAX SCROLLING
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.enchanted-bg');
            if (parallax) {
                parallax.style.transform = \`translateY(\${scrolled * 0.3}px)\`;
            }
            
            // Animate floating runes based on scroll
            document.querySelectorAll('.floating-rune').forEach((rune, index) => {
                const speed = 0.1 + (index * 0.05);
                rune.style.transform = \`translateY(\${scrolled * speed}px) rotate(\${scrolled * 0.1}deg)\`;
            });
        });
    </script>
</body>
</html>`;
};
