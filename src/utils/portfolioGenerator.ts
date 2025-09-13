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

export const downloadPortfolio = (data: PortfolioData, template: string = 'cyberpunk') => {
  const htmlContent = generateGitHubPages(data, template);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${data.personalInfo.name || 'portfolio'}_${template}.html`);
};

export const generateGitHubPages = (data: PortfolioData, template: string = 'cyberpunk'): string => {
  switch (template) {
    case 'cyberpunk':
      return generateCyberpunkTemplate(data);
    case 'holographic':
      return generateHolographicTemplate(data);
    case 'quantum':
      return generateQuantumTemplate(data);
    default:
      return generateCyberpunkTemplate(data);
  }
};

const generateCyberpunkTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Cyberpunk Nexus</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', monospace;
            background: #0a0a0a;
            color: #00ff87;
            overflow-x: hidden;
            cursor: none;
        }
        
        /* Custom Cursor */
        .cursor {
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
            width: 4px;
            height: 4px;
            background: #00ff87;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.7;
        }
        
        /* Matrix Rain */
        .matrix-rain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.1;
        }
        
        /* Main Container */
        .container {
            position: relative;
            z-index: 10;
            min-height: 100vh;
            padding: 20px;
        }
        
        /* Header */
        .header {
            text-align: center;
            padding: 60px 0;
            background: linear-gradient(45deg, #001122, #003344);
            border: 2px solid #00ff87;
            border-radius: 20px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, #00ff87, transparent);
            animation: scan 3s linear infinite;
            opacity: 0.1;
        }
        
        .name {
            font-size: 3.5rem;
            font-weight: bold;
            text-shadow: 0 0 20px #00ff87;
            margin-bottom: 10px;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        .title {
            font-size: 1.5rem;
            color: #007bff;
            margin-bottom: 20px;
        }
        
        .contact {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .contact-item {
            background: rgba(0, 255, 135, 0.1);
            padding: 10px 20px;
            border: 1px solid #00ff87;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        
        .contact-item:hover {
            background: rgba(0, 255, 135, 0.2);
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(0, 255, 135, 0.5);
        }
        
        /* Sections */
        .section {
            background: linear-gradient(135deg, #001122, #002244);
            border: 1px solid #00ff87;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 135, 0.1), transparent);
            animation: slide 2s ease-in-out infinite;
        }
        
        .section-title {
            font-size: 2rem;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 0 0 10px #00ff87;
            position: relative;
            z-index: 2;
        }
        
        /* Skills Grid */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .skill-item {
            background: linear-gradient(45deg, #003366, #004488);
            border: 1px solid #007bff;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .skill-item:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 123, 255, 0.3);
            border-color: #00ff87;
        }
        
        .skill-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(0, 255, 135, 0.1), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }
        
        .skill-item:hover::before {
            transform: translateX(100%);
        }
        
        /* Experience Timeline */
        .experience-timeline {
            position: relative;
            padding-left: 30px;
        }
        
        .experience-timeline::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, #00ff87, #007bff);
        }
        
        .experience-item {
            position: relative;
            background: rgba(0, 123, 255, 0.1);
            border: 1px solid #007bff;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            margin-left: 20px;
            transition: all 0.3s ease;
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            left: -35px;
            top: 20px;
            width: 10px;
            height: 10px;
            background: #00ff87;
            border-radius: 50%;
            box-shadow: 0 0 10px #00ff87;
        }
        
        .experience-item:hover {
            transform: translateX(10px);
            background: rgba(0, 255, 135, 0.1);
            border-color: #00ff87;
        }
        
        /* Projects Grid */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .project-card {
            background: linear-gradient(135deg, #001133, #002255);
            border: 1px solid #007bff;
            border-radius: 15px;
            padding: 25px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .project-card:hover {
            transform: translateY(-10px) rotateX(5deg);
            box-shadow: 0 20px 40px rgba(0, 255, 135, 0.2);
            border-color: #00ff87;
        }
        
        .project-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(0, 255, 135, 0.1), transparent);
            transform: scale(0);
            transition: transform 0.6s ease;
        }
        
        .project-card:hover::before {
            transform: scale(1);
        }
        
        /* Animations */
        @keyframes glow {
            from { text-shadow: 0 0 20px #00ff87; }
            to { text-shadow: 0 0 30px #00ff87, 0 0 40px #007bff; }
        }
        
        @keyframes scan {
            0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
            100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes slide {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        @keyframes matrix {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
        }
        
        /* Footer */
        .footer {
            background: linear-gradient(45deg, #001122, #003344);
            border: 2px solid #00ff87;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            margin-top: 60px;
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(0, 255, 135, 0.1), transparent);
            animation: slide 3s ease-in-out infinite;
        }
        
        .footer-content {
            position: relative;
            z-index: 2;
        }
        
        .footer-title {
            font-size: 2rem;
            margin-bottom: 20px;
            text-shadow: 0 0 15px #00ff87;
        }
        
        .footer-links {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        
        .footer-link {
            color: #007bff;
            text-decoration: none;
            padding: 10px 20px;
            border: 1px solid #007bff;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        
        .footer-link:hover {
            color: #00ff87;
            border-color: #00ff87;
            box-shadow: 0 0 20px rgba(0, 255, 135, 0.5);
            transform: scale(1.05);
        }
        
        .copyright {
            margin-top: 30px;
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .name { font-size: 2.5rem; }
            .contact { flex-direction: column; align-items: center; }
            .skills-grid { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }
            .projects-grid { grid-template-columns: 1fr; }
            .footer-links { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="cursor"></div>
    <canvas class="matrix-rain"></canvas>
    
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1 class="name">${data.personalInfo.name || 'Your Name'}</h1>
            <p class="title">Cyberpunk Developer</p>
            <div class="contact">
                ${data.personalInfo.email ? `<div class="contact-item">📧 ${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div class="contact-item">📱 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-item">📍 ${data.personalInfo.location}</div>` : ''}
            </div>
        </header>
        
        <!-- About Section -->
        ${data.personalInfo.summary ? `
        <section class="section">
            <h2 class="section-title">// ABOUT_ME</h2>
            <p style="font-size: 1.1rem; line-height: 1.6; text-align: center;">${data.personalInfo.summary}</p>
        </section>
        ` : ''}
        
        <!-- Skills Section -->
        ${data.skills.length > 0 ? `
        <section class="section">
            <h2 class="section-title">// NEURAL_SKILLS</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `
                    <div class="skill-item">
                        <div style="font-weight: bold; margin-bottom: 5px;">${skill}</div>
                        <div style="font-size: 0.8rem; color: #007bff;">LOADED</div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Experience Section -->
        ${data.experience.length > 0 ? `
        <section class="section">
            <h2 class="section-title">// WORK_HISTORY</h2>
            <div class="experience-timeline">
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <h3 style="color: #00ff87; font-size: 1.3rem; margin-bottom: 5px;">${exp.title}</h3>
                        <p style="color: #007bff; font-weight: bold; margin-bottom: 10px;">${exp.company} | ${exp.duration}</p>
                        <p style="line-height: 1.5;">${exp.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Projects Section -->
        ${data.projects.length > 0 ? `
        <section class="section">
            <h2 class="section-title">// PROJECT_MATRIX</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                    <div class="project-card">
                        <h3 style="color: #00ff87; font-size: 1.4rem; margin-bottom: 15px;">${project.name}</h3>
                        <p style="margin-bottom: 15px; line-height: 1.5;">${project.description}</p>
                        <p style="color: #007bff; font-size: 0.9rem; margin-bottom: 10px;">TECH: ${project.technologies}</p>
                        ${project.link ? `<a href="${project.link}" style="color: #00ff87; text-decoration: none; border: 1px solid #00ff87; padding: 8px 16px; border-radius: 20px; display: inline-block; transition: all 0.3s ease;">ACCESS_PROJECT</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Education Section -->
        ${data.education.length > 0 ? `
        <section class="section">
            <h2 class="section-title">// EDUCATION_LOG</h2>
            <div style="display: grid; gap: 20px;">
                ${data.education.map(edu => `
                    <div style="background: rgba(0, 123, 255, 0.1); border: 1px solid #007bff; border-radius: 10px; padding: 20px;">
                        <h3 style="color: #00ff87; font-size: 1.2rem; margin-bottom: 5px;">${edu.degree}</h3>
                        <p style="color: #007bff; margin-bottom: 5px;">${edu.institution}</p>
                        <p style="font-size: 0.9rem;">${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Animated Footer -->
        <footer class="footer">
            <div class="footer-content">
                <h3 class="footer-title">// CONNECT_TO_MATRIX</h3>
                <p style="margin-bottom: 20px; font-size: 1.1rem;">Ready to jack into the digital realm?</p>
                <div class="footer-links">
                    ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" class="footer-link" target="_blank">LINKEDIN_NODE</a>` : ''}
                    ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" class="footer-link" target="_blank">GITHUB_REPOSITORY</a>` : ''}
                    ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link">EMAIL_PROTOCOL</a>` : ''}
                </div>
                <div class="copyright">
                    <p>© 2025 ${data.personalInfo.name || 'Portfolio'} | Powered by CareerPanda Cyberpunk Engine</p>
                    <p style="margin-top: 10px; font-size: 0.8rem; color: #007bff;">
                        "In the matrix of possibilities, your code is the key to infinite realities."
                    </p>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const trails = [];
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Create trail
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            document.body.appendChild(trail);
            
            trails.push(trail);
            
            setTimeout(() => {
                trail.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(trail);
                    trails.splice(trails.indexOf(trail), 1);
                }, 300);
            }, 100);
        });
        
        // Matrix Rain Effect
        const canvas = document.querySelector('.matrix-rain');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        
        const drops = [];
        for(let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff87';
            ctx.font = fontSize + 'px monospace';
            
            for(let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        setInterval(drawMatrix, 35);
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.6s ease';
            observer.observe(section);
        });
    </script>
</body>
</html>`;
};

const generateHolographicTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Cosmic Odyssey</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #ffffff;
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        /* Floating Particles */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: #8338ec;
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        /* Main Container */
        .container {
            position: relative;
            z-index: 10;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* Header */
        .header {
            text-align: center;
            padding: 80px 0;
            background: linear-gradient(135deg, rgba(131, 56, 236, 0.2), rgba(58, 134, 255, 0.2));
            border: 2px solid #8338ec;
            border-radius: 30px;
            margin-bottom: 50px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg, transparent, #8338ec, transparent);
            animation: rotate 4s linear infinite;
            opacity: 0.3;
        }
        
        .name {
            font-size: 4rem;
            font-weight: bold;
            background: linear-gradient(45deg, #8338ec, #3a86ff, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
        }
        
        .subtitle {
            font-size: 1.8rem;
            color: #06ffa5;
            margin-bottom: 30px;
            position: relative;
            z-index: 2;
        }
        
        .contact-cosmic {
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
        }
        
        .contact-planet {
            background: rgba(131, 56, 236, 0.3);
            border: 2px solid #8338ec;
            border-radius: 50px;
            padding: 15px 30px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .contact-planet:hover {
            transform: scale(1.1) rotateY(15deg);
            box-shadow: 0 0 30px rgba(131, 56, 236, 0.6);
            background: rgba(6, 255, 165, 0.2);
            border-color: #06ffa5;
        }
        
        /* Sections */
        .cosmic-section {
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8));
            border: 1px solid #3a86ff;
            border-radius: 25px;
            padding: 40px;
            margin-bottom: 40px;
            position: relative;
            backdrop-filter: blur(10px);
        }
        
        .cosmic-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(131, 56, 236, 0.1), transparent);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        .section-title-cosmic {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #8338ec, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            z-index: 2;
        }
        
        /* Skills Constellation */
        .skills-constellation {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 25px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        .skill-star {
            background: radial-gradient(circle, rgba(131, 56, 236, 0.3), rgba(58, 134, 255, 0.2));
            border: 2px solid #3a86ff;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .skill-star:hover {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 15px 40px rgba(58, 134, 255, 0.4);
            border-color: #06ffa5;
        }
        
        .skill-star::before {
            content: '✦';
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            color: #06ffa5;
            animation: twinkle 2s ease-in-out infinite;
        }
        
        /* Projects Galaxy */
        .projects-galaxy {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        .project-planet {
            background: linear-gradient(135deg, rgba(131, 56, 236, 0.2), rgba(58, 134, 255, 0.2));
            border: 2px solid #3a86ff;
            border-radius: 20px;
            padding: 30px;
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
        }
        
        .project-planet:hover {
            transform: translateY(-15px) rotateX(10deg);
            box-shadow: 0 25px 50px rgba(131, 56, 236, 0.3);
            border-color: #06ffa5;
        }
        
        .project-planet::before {
            content: '';
            position: absolute;
            top: -100%;
            left: -100%;
            width: 300%;
            height: 300%;
            background: radial-gradient(circle, rgba(6, 255, 165, 0.1), transparent);
            animation: orbit 8s linear infinite;
        }
        
        /* Footer */
        .cosmic-footer {
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9));
            border: 2px solid #8338ec;
            border-radius: 30px;
            padding: 50px;
            text-align: center;
            margin-top: 80px;
            position: relative;
            overflow: hidden;
        }
        
        .cosmic-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: conic-gradient(from 0deg, transparent, rgba(131, 56, 236, 0.2), transparent);
            animation: rotate 6s linear infinite;
        }
        
        .footer-content-cosmic {
            position: relative;
            z-index: 2;
        }
        
        .footer-title-cosmic {
            font-size: 2.5rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #8338ec, #06ffa5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .footer-subtitle {
            font-size: 1.2rem;
            color: #3a86ff;
            margin-bottom: 30px;
        }
        
        .footer-links-cosmic {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        
        .footer-link-cosmic {
            background: rgba(131, 56, 236, 0.3);
            color: #ffffff;
            text-decoration: none;
            padding: 15px 30px;
            border: 2px solid #8338ec;
            border-radius: 50px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .footer-link-cosmic:hover {
            transform: scale(1.1);
            background: rgba(6, 255, 165, 0.3);
            border-color: #06ffa5;
            box-shadow: 0 0 30px rgba(6, 255, 165, 0.5);
        }
        
        .footer-link-cosmic::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(6, 255, 165, 0.3), transparent);
            transition: all 0.4s ease;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        
        .footer-link-cosmic:hover::before {
            width: 200px;
            height: 200px;
        }
        
        .copyright-cosmic {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(131, 56, 236, 0.3);
            font-size: 1rem;
            opacity: 0.8;
        }
        
        .cosmic-quote {
            margin-top: 15px;
            font-style: italic;
            color: #06ffa5;
            font-size: 0.9rem;
        }
        
        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .name { font-size: 2.8rem; }
            .contact-cosmic { flex-direction: column; align-items: center; }
            .skills-constellation { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
            .projects-galaxy { grid-template-columns: 1fr; }
            .footer-links-cosmic { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="particles"></div>
    
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1 class="name">${data.personalInfo.name || 'Cosmic Explorer'}</h1>
            <p class="subtitle">Space Odyssey Developer</p>
            <div class="contact-cosmic">
                ${data.personalInfo.email ? `<div class="contact-planet">🌌 ${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div class="contact-planet">🚀 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-planet">🪐 ${data.personalInfo.location}</div>` : ''}
            </div>
        </header>
        
        <!-- About Section -->
        ${data.personalInfo.summary ? `
        <section class="cosmic-section">
            <h2 class="section-title-cosmic">Mission Statement</h2>
            <p style="font-size: 1.2rem; line-height: 1.8; text-align: center; position: relative; z-index: 2;">${data.personalInfo.summary}</p>
        </section>
        ` : ''}
        
        <!-- Skills Constellation -->
        ${data.skills.length > 0 ? `
        <section class="cosmic-section">
            <h2 class="section-title-cosmic">Skills Constellation</h2>
            <div class="skills-constellation">
                ${data.skills.map(skill => `
                    <div class="skill-star">
                        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 8px; color: #06ffa5;">${skill}</div>
                        <div style="font-size: 0.9rem; color: #3a86ff;">MASTERED</div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Experience Nebula -->
        ${data.experience.length > 0 ? `
        <section class="cosmic-section">
            <h2 class="section-title-cosmic">Experience Nebula</h2>
            <div style="position: relative; z-index: 2;">
                ${data.experience.map((exp, index) => `
                    <div style="background: rgba(58, 134, 255, 0.2); border: 1px solid #3a86ff; border-radius: 20px; padding: 30px; margin-bottom: 25px; transition: all 0.4s ease;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 15px 40px rgba(58, 134, 255, 0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                        <h3 style="color: #06ffa5; font-size: 1.5rem; margin-bottom: 8px;">${exp.title}</h3>
                        <p style="color: #8338ec; font-weight: bold; margin-bottom: 15px; font-size: 1.1rem;">${exp.company} | ${exp.duration}</p>
                        <p style="line-height: 1.6; font-size: 1rem;">${exp.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Projects Galaxy -->
        ${data.projects.length > 0 ? `
        <section class="cosmic-section">
            <h2 class="section-title-cosmic">Projects Galaxy</h2>
            <div class="projects-galaxy">
                ${data.projects.map(project => `
                    <div class="project-planet">
                        <h3 style="color: #06ffa5; font-size: 1.6rem; margin-bottom: 15px; position: relative; z-index: 2;">${project.name}</h3>
                        <p style="margin-bottom: 15px; line-height: 1.6; position: relative; z-index: 2;">${project.description}</p>
                        <p style="color: #8338ec; font-size: 1rem; margin-bottom: 15px; position: relative; z-index: 2;">Tech Stack: ${project.technologies}</p>
                        ${project.link ? `<a href="${project.link}" style="color: #06ffa5; text-decoration: none; border: 2px solid #06ffa5; padding: 10px 20px; border-radius: 30px; display: inline-block; transition: all 0.3s ease; position: relative; z-index: 2;" onmouseover="this.style.background='rgba(6, 255, 165, 0.2)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">Explore Project</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Education Sector -->
        ${data.education.length > 0 ? `
        <section class="cosmic-section">
            <h2 class="section-title-cosmic">Education Sector</h2>
            <div style="display: grid; gap: 25px; position: relative; z-index: 2;">
                ${data.education.map(edu => `
                    <div style="background: rgba(131, 56, 236, 0.2); border: 1px solid #8338ec; border-radius: 15px; padding: 25px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateX(10px)'; this.style.borderColor='#06ffa5'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='#8338ec'">
                        <h3 style="color: #06ffa5; font-size: 1.3rem; margin-bottom: 8px;">${edu.degree}</h3>
                        <p style="color: #3a86ff; margin-bottom: 5px; font-size: 1.1rem;">${edu.institution}</p>
                        <p style="font-size: 1rem;">${edu.year}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Animated Footer -->
        <footer class="cosmic-footer">
            <div class="footer-content-cosmic">
                <h3 class="footer-title-cosmic">Join the Cosmic Journey</h3>
                <p class="footer-subtitle">Ready to explore the universe of possibilities?</p>
                <div class="footer-links-cosmic">
                    ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" class="footer-link-cosmic" target="_blank">🌌 LinkedIn Galaxy</a>` : ''}
                    ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" class="footer-link-cosmic" target="_blank">🚀 GitHub Universe</a>` : ''}
                    ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link-cosmic">📡 Contact Station</a>` : ''}
                </div>
                <div class="copyright-cosmic">
                    <p>© 2025 ${data.personalInfo.name || 'Cosmic Explorer'} | Powered by CareerPanda Cosmic Engine</p>
                    <p class="cosmic-quote">"In the vast cosmos of code, every star tells a story of innovation."</p>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // Create floating particles
        function createParticles() {
            const particlesContainer = document.querySelector('.particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        createParticles();
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.cosmic-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    </script>
</body>
</html>`;
};

const generateQuantumTemplate = (data: PortfolioData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo.name || 'Portfolio'} - Mystic Realm</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #2d1b69 0%, #11001c 50%, #1a0033 100%);
            color: #f0e6d2;
            overflow-x: hidden;
            min-height: 100vh;
        }
        
        /* Floating Runes */
        .runes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        
        .rune {
            position: absolute;
            font-size: 20px;
            color: #d4af37;
            opacity: 0.3;
            animation: float-rune 8s ease-in-out infinite;
        }
        
        /* Main Container */
        .container {
            position: relative;
            z-index: 10;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        /* Header */
        .header {
            text-align: center;
            padding: 80px 0;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(103, 58, 183, 0.2));
            border: 3px solid #d4af37;
            border-radius: 25px;
            margin-bottom: 50px;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.1), transparent);
            animation: pulse-magic 4s ease-in-out infinite;
        }
        
        .name {
            font-size: 4rem;
            font-weight: bold;
            background: linear-gradient(45deg, #d4af37, #9c27b0, #673ab7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
        }
        
        .subtitle {
            font-size: 1.8rem;
            color: #d4af37;
            margin-bottom: 30px;
            position: relative;
            z-index: 2;
        }
        
        .contact-mystical {
            display: flex;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
        }
        
        .contact-crystal {
            background: rgba(212, 175, 55, 0.2);
            border: 2px solid #d4af37;
            border-radius: 15px;
            padding: 15px 30px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .contact-crystal:hover {
            transform: scale(1.1) rotateZ(5deg);
            box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
            background: rgba(156, 39, 176, 0.2);
            border-color: #9c27b0;
        }
        
        /* Sections */
        .mystical-section {
            background: linear-gradient(135deg, rgba(45, 27, 105, 0.8), rgba(17, 0, 28, 0.8));
            border: 2px solid #673ab7;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 40px;
            position: relative;
            backdrop-filter: blur(10px);
        }
        
        .mystical-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
            animation: enchant 4s ease-in-out infinite;
        }
        
        .section-title-mystical {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(45deg, #d4af37, #9c27b0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            position: relative;
            z-index: 2;
        }
        
        /* Skills Crystals */
        .skills-crystals {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 25px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        .skill-crystal {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(103, 58, 183, 0.2));
            border: 2px solid #673ab7;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .skill-crystal:hover {
            transform: translateY(-10px) rotateY(15deg);
            box-shadow: 0 15px 40px rgba(103, 58, 183, 0.4);
            border-color: #d4af37;
        }
        
        .skill-crystal::before {
            content: '💎';
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 1.5rem;
            animation: sparkle 2s ease-in-out infinite;
        }
        
        /* Projects Spellbook */
        .projects-spellbook {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 30px;
            position: relative;
            z-index: 2;
        }
        
        .project-spell {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(156, 39, 176, 0.2));
            border: 2px solid #9c27b0;
            border-radius: 20px;
            padding: 30px;
            transition: all 0.5s ease;
            position: relative;
            overflow: hidden;
        }
        
        .project-spell:hover {
            transform: translateY(-15px) scale(1.02);
            box-shadow: 0 25px 50px rgba(212, 175, 55, 0.3);
            border-color: #d4af37;
        }
        
        .project-spell::before {
            content: '';
            position: absolute;
            top: -100%;
            left: -100%;
            width: 300%;
            height: 300%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.1), transparent);
            animation: magic-circle 6s linear infinite;
        }
        
        /* Footer */
        .mystical-footer {
            background: linear-gradient(135deg, rgba(45, 27, 105, 0.9), rgba(17, 0, 28, 0.9));
            border: 3px solid #d4af37;
            border-radius: 25px;
            padding: 50px;
            text-align: center;
            margin-top: 80px;
            position: relative;
            overflow: hidden;
        }
        
        .mystical-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: conic-gradient(from 0deg, transparent, rgba(212, 175, 55, 0.2), transparent);
            animation: rotate-magic 8s linear infinite;
        }
        
        .footer-content-mystical {
            position: relative;
            z-index: 2;
        }
        
        .footer-title-mystical {
            font-size: 2.8rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #d4af37, #9c27b0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }
        
        .footer-subtitle-mystical {
            font-size: 1.3rem;
            color: #673ab7;
            margin-bottom: 30px;
            font-style: italic;
        }
        
        .footer-links-mystical {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .footer-link-mystical {
            background: rgba(212, 175, 55, 0.3);
            color: #f0e6d2;
            text-decoration: none;
            padding: 15px 30px;
            border: 2px solid #d4af37;
            border-radius: 15px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
            font-weight: bold;
        }
        
        .footer-link-mystical:hover {
            transform: scale(1.1) rotateZ(-5deg);
            background: rgba(156, 39, 176, 0.3);
            border-color: #9c27b0;
            box-shadow: 0 0 30px rgba(156, 39, 176, 0.5);
        }
        
        .footer-link-mystical::before {
            content: '✨';
            position: absolute;
            top: 5px;
            right: 10px;
            font-size: 1.2rem;
            animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .copyright-mystical {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid rgba(212, 175, 55, 0.3);
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .mystical-quote {
            margin-top: 15px;
            font-style: italic;
            color: #d4af37;
            font-size: 1rem;
        }
        
        /* Animations */
        @keyframes float-rune {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes pulse-magic {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.2; }
        }
        
        @keyframes enchant {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(100%) skewX(-15deg); }
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.5; transform: scale(1.3) rotate(180deg); }
        }
        
        @keyframes magic-circle {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes rotate-magic {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .name { font-size: 2.8rem; }
            .contact-mystical { flex-direction: column; align-items: center; }
            .skills-crystals { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
            .projects-spellbook { grid-template-columns: 1fr; }
            .footer-links-mystical { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="runes"></div>
    
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1 class="name">${data.personalInfo.name || 'Mystic Sage'}</h1>
            <p class="subtitle">Realm Guardian & Code Wizard</p>
            <div class="contact-mystical">
                ${data.personalInfo.email ? `<div class="contact-crystal">🔮 ${data.personalInfo.email}</div>` : ''}
                ${data.personalInfo.phone ? `<div class="contact-crystal">📜 ${data.personalInfo.phone}</div>` : ''}
                ${data.personalInfo.location ? `<div class="contact-crystal">🏰 ${data.personalInfo.location}</div>` : ''}
            </div>
        </header>
        
        <!-- About Section -->
        ${data.personalInfo.summary ? `
        <section class="mystical-section">
            <h2 class="section-title-mystical">The Prophecy</h2>
            <p style="font-size: 1.2rem; line-height: 1.8; text-align: center; position: relative; z-index: 2; font-style: italic;">${data.personalInfo.summary}</p>
        </section>
        ` : ''}
        
        <!-- Skills Crystals -->
        ${data.skills.length > 0 ? `
        <section class="mystical-section">
            <h2 class="section-title-mystical">Magical Crystals</h2>
            <div class="skills-crystals">
                ${data.skills.map(skill => `
                    <div class="skill-crystal">
                        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 8px; color: #d4af37;">${skill}</div>
                        <div style="font-size: 0.9rem; color: #9c27b0;">ENCHANTED</div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Experience Scrolls -->
        ${data.experience.length > 0 ? `
        <section class="mystical-section">
            <h2 class="section-title-mystical">Ancient Scrolls</h2>
            <div style="position: relative; z-index: 2;">
                ${data.experience.map(exp => `
                    <div style="background: rgba(156, 39, 176, 0.2); border: 2px solid #9c27b0; border-radius: 15px; padding: 30px; margin-bottom: 25px; transition: all 0.4s ease; position: relative;" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 15px 40px rgba(156, 39, 176, 0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none'">
                        <h3 style="color: #d4af37; font-size: 1.5rem; margin-bottom: 8px;">${exp.title}</h3>
                        <p style="color: #673ab7; font-weight: bold; margin-bottom: 15px; font-size: 1.1rem;">${exp.company} | ${exp.duration}</p>
                        <p style="line-height: 1.6; font-size: 1rem;">${exp.description}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Projects Spellbook -->
        ${data.projects.length > 0 ? `
        <section class="mystical-section">
            <h2 class="section-title-mystical">Spellbook of Creations</h2>
            <div class="projects-spellbook">
                ${data.projects.map(project => `
                    <div class="project-spell">
                        <h3 style="color: #d4af37; font-size: 1.6rem; margin-bottom: 15px; position: relative; z-index: 2;">${project.name}</h3>
                        <p style="margin-bottom: 15px; line-height: 1.6; position: relative; z-index: 2;">${project.description}</p>
                        <p style="color: #9c27b0; font-size: 1rem; margin-bottom: 15px; position: relative; z-index: 2;">Enchantments: ${project.technologies}</p>
                        ${project.link ? `<a href="${project.link}" style="color: #d4af37; text-decoration: none; border: 2px solid #d4af37; padding: 12px 25px; border-radius: 15px; display: inline-block; transition: all 0.3s ease; position: relative; z-index: 2;" onmouseover="this.style.background='rgba(212, 175, 55, 0.2)'; this.style.transform='scale(1.05)'" onmouseout="this.style.background='transparent'; this.style.transform='scale(1)'">Cast Spell</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Education Academy -->
        ${data.education.length > 0 ? `
        <section class="mystical-section">
            <h2 class="section-title-mystical">Academy of Wisdom</h2>
            <div style="display: grid; gap: 25px; position: relative; z-index: 2;">
                ${data.education.map(edu => `
                    <div style="background: rgba(212, 175, 55, 0.2); border: 2px solid #d4af37; border-radius: 15px; padding: 25px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateX(10px)'; this.style.borderColor='#9c27b0'" onmouseout="this.style.transform='translateX(0)'; this.style.borderColor='#d4af37'">
                        <h3 style="color: #d4af37; font-size: 1.3rem; margin-bottom: 8px;">${edu.degree}</h3>
                        <p style="color: #673ab7; margin-bottom: 5px; font-size: 1.1rem;">${edu.institution}</p>
                        <p style="font-size: 1rem;">${edu.year}${edu.gpa ? ` | Wisdom Level: ${edu.gpa}` : ''}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
        
        <!-- Animated Footer -->
        <footer class="mystical-footer">
            <div class="footer-content-mystical">
                <h3 class="footer-title-mystical">Enter the Mystic Realm</h3>
                <p class="footer-subtitle-mystical">Where magic meets technology</p>
                <div class="footer-links-mystical">
                    ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}" class="footer-link-mystical" target="_blank">🔗 LinkedIn Portal</a>` : ''}
                    ${data.personalInfo.github ? `<a href="${data.personalInfo.github}" class="footer-link-mystical" target="_blank">📚 GitHub Grimoire</a>` : ''}
                    ${data.personalInfo.email ? `<a href="mailto:${data.personalInfo.email}" class="footer-link-mystical">📧 Mystic Messages</a>` : ''}
                </div>
                <div class="copyright-mystical">
                    <p>© 2025 ${data.personalInfo.name || 'Mystic Sage'} | Powered by CareerPanda Mystical Engine</p>
                    <p class="mystical-quote">"In the realm of endless possibilities, every spell cast creates new realities."</p>
                </div>
            </div>
        </footer>
    </div>
    
    <script>
        // Create floating runes
        function createRunes() {
            const runesContainer = document.querySelector('.runes');
            const runeSymbols = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ'];
            
            for (let i = 0; i < 20; i++) {
                const rune = document.createElement('div');
                rune.className = 'rune';
                rune.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];
                rune.style.left = Math.random() * 100 + '%';
                rune.style.top = Math.random() * 100 + '%';
                rune.style.animationDelay = Math.random() * 8 + 's';
                rune.style.animationDuration = (Math.random() * 6 + 6) + 's';
                runesContainer.appendChild(rune);
            }
        }
        
        createRunes();
        
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Intersection Observer for animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.mystical-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
        
        // Magic sparkle effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            document.querySelector('.runes').style.transform = `translateY(${parallax}px)`;
        });
    </script>
</body>
</html>`;
};