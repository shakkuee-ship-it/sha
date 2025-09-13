import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, X, Brain, Loader } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface ResumeImporterProps {
  onDataImported: (data: ResumeData) => void;
  onClose: () => void;
}

const ResumeImporter: React.FC<ResumeImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragleave' || e.type === 'dragover') {
      setDragActive(e.type !== 'dragleave');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.txt', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setUploading(true);
    setProcessingStep('Reading file content...');
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setProcessingStep('Extracting text from PDF...');
        text = await extractTextFromPDF(file);
      } else if (file.type.includes('word') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')) {
        setProcessingStep('Processing Word document...');
        text = await extractTextFromWord(file);
      } else {
        setProcessingStep('Reading text file...');
        text = await extractTextFromFile(file);
      }
      
      if (!text || text.trim().length < 50) {
        throw new Error('Unable to extract meaningful text from the file. Please try a different file or use manual input.');
      }
      
      setExtractedText(text);
      setProcessingStep('Analyzing resume content with AI...');
      
      const parsedData = await parseResumeWithAdvancedAI(text);
      setExtractedData(parsedData);
      toast.success('Resume data extracted successfully!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error processing file:', error);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Try multiple PDF extraction methods
    try {
      // Method 1: Try server-side extraction first
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.text && data.text.trim().length > 50) {
          return data.text;
        }
      }
    } catch (error) {
      console.log('Server-side PDF extraction failed, trying client-side...');
    }

    // Method 2: Client-side PDF extraction using pdf-parse alternative
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Simple PDF text extraction (basic implementation)
          const text = await extractPDFTextBasic(uint8Array);
          if (text && text.trim().length > 50) {
            resolve(text);
          } else {
            reject(new Error('Could not extract text from PDF. Please try converting to text format first.'));
          }
        } catch (error) {
          reject(new Error('Failed to process PDF file. Please try a text version.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const extractPDFTextBasic = async (uint8Array: Uint8Array): Promise<string> => {
    // Basic PDF text extraction - looks for text between BT and ET markers
    const decoder = new TextDecoder('utf-8');
    const pdfText = decoder.decode(uint8Array);
    
    // Extract text content using regex patterns
    const textMatches = pdfText.match(/\(([^)]+)\)/g);
    if (textMatches) {
      return textMatches
        .map(match => match.slice(1, -1))
        .join(' ')
        .replace(/\\[rn]/g, '\n')
        .replace(/\\/g, '');
    }
    
    // Fallback: extract readable text
    const readableText = pdfText.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ');
    return readableText;
  };

  const extractTextFromWord = async (file: File): Promise<string> => {
    // For Word documents, we'll read as text and extract what we can
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          // Basic Word document text extraction
          const cleanText = content
            .replace(/<[^>]*>/g, ' ') // Remove HTML tags
            .replace(/[^\x20-\x7E\n]/g, ' ') // Keep only printable ASCII
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          if (cleanText.length > 50) {
            resolve(cleanText);
          } else {
            reject(new Error('Could not extract meaningful text from Word document'));
          }
        } catch (error) {
          reject(new Error('Failed to process Word document'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Word document'));
      reader.readAsText(file);
    });
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text && text.trim().length > 10) {
          resolve(text);
        } else {
          reject(new Error('File appears to be empty or unreadable'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const parseResumeWithAdvancedAI = async (text: string): Promise<ResumeData> => {
    const resumeData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: []
    };

    // Advanced text preprocessing
    const cleanText = text
      .replace(/\s+/g, ' ')
      .replace(/[^\x20-\x7E\n]/g, ' ')
      .trim();
    
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const lowerText = cleanText.toLowerCase();

    // Extract email with multiple patterns
    const emailPatterns = [
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      /email[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi,
      /e-mail[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/gi
    ];
    
    for (const pattern of emailPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        resumeData.personalInfo.email = match[0].replace(/^(email|e-mail)[:\s]*/i, '');
        break;
      }
    }

    // Extract phone with international and Indian patterns
    const phonePatterns = [
      /(\+91[-.\s]?)?[6-9]\d{9}/g,
      /(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
      /phone[:\s]*(\+?\d{1,3}[-.\s]?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4})/gi,
      /mobile[:\s]*(\+?\d{1,3}[-.\s]?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4})/gi,
      /contact[:\s]*(\+?\d{1,3}[-.\s]?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4})/gi
    ];
    
    for (const pattern of phonePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        resumeData.personalInfo.phone = match[0].replace(/^(phone|mobile|contact)[:\s]*/i, '');
        break;
      }
    }

    // Extract LinkedIn with multiple patterns
    const linkedinPatterns = [
      /linkedin\.com\/in\/[\w-]+/gi,
      /linkedin[:\s]*([^\s\n]+)/gi,
      /www\.linkedin\.com\/in\/[\w-]+/gi
    ];
    
    for (const pattern of linkedinPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        let linkedin = match[0].replace(/^linkedin[:\s]*/i, '');
        if (!linkedin.startsWith('http')) {
          linkedin = linkedin.startsWith('www.') ? `https://${linkedin}` : `https://linkedin.com/in/${linkedin.split('/').pop()}`;
        }
        resumeData.personalInfo.linkedin = linkedin;
        break;
      }
    }

    // Extract GitHub
    const githubPatterns = [
      /github\.com\/[\w-]+/gi,
      /github[:\s]*([^\s\n]+)/gi,
      /www\.github\.com\/[\w-]+/gi
    ];
    
    for (const pattern of githubPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        let github = match[0].replace(/^github[:\s]*/i, '');
        if (!github.startsWith('http')) {
          github = github.startsWith('www.') ? `https://${github}` : `https://github.com/${github.split('/').pop()}`;
        }
        resumeData.personalInfo.github = github;
        break;
      }
    }

    // Extract name (improved algorithm)
    const namePatterns = [
      // Look for name at the beginning
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m,
      // Look for name after common prefixes
      /(?:name[:\s]*|candidate[:\s]*|applicant[:\s]*)([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/gi
    ];
    
    for (const pattern of namePatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        const name = match[1] || match[0];
        if (name && !name.includes('@') && !name.match(/\d/) && name.split(' ').length >= 2) {
          resumeData.personalInfo.name = name.trim();
          break;
        }
      }
    }

    // If no name found, try first meaningful line
    if (!resumeData.personalInfo.name) {
      for (const line of lines.slice(0, 5)) {
        if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/) && 
            !line.includes('@') && 
            !line.match(/\d/) && 
            line.split(' ').length >= 2 && 
            line.split(' ').length <= 4) {
          resumeData.personalInfo.name = line;
          break;
        }
      }
    }

    // Extract location
    const locationPatterns = [
      /(?:address|location|city)[:\s]*([^,\n]+(?:,\s*[^,\n]+)*)/gi,
      /([A-Z][a-z]+,\s*[A-Z][a-z]+(?:,\s*\d{5,6})?)/g,
      /(Mumbai|Delhi|Bangalore|Hyderabad|Chennai|Pune|Kolkata|Ahmedabad|Jaipur|Lucknow|Kanpur|Nagpur|Indore|Thane|Bhopal|Visakhapatnam|Pimpri|Patna|Vadodara|Ghaziabad|Ludhiana|Agra|Nashik|Faridabad|Meerut|Rajkot|Kalyan|Vasai|Varanasi|Srinagar|Aurangabad|Dhanbad|Amritsar|Navi Mumbai|Allahabad|Ranchi|Howrah|Coimbatore|Jabalpur|Gwalior|Vijayawada|Jodhpur|Madurai|Raipur|Kota|Guwahati|Chandigarh|Solapur|Hubli|Tiruchirappalli|Bareilly|Mysore|Tiruppur|Gurgaon|Aligarh|Jalandhar|Bhubaneswar|Salem|Warangal|Guntur|Bhiwandi|Saharanpur|Gorakhpur|Bikaner|Amravati|Noida|Jamshedpur|Bhilai|Cuttack|Firozabad|Kochi|Nellore|Bhavnagar|Dehradun|Durgapur|Asansol|Rourkela|Nanded|Kolhapur|Ajmer|Akola|Gulbarga|Jamnagar|Ujjain|Loni|Siliguri|Jhansi|Ulhasnagar|Jammu|Sangli-Miraj|Mangalore|Erode|Belgaum|Ambattur|Tirunelveli|Malegaon|Gaya|Jalgaon|Udaipur|Maheshtala)[,\s]*[A-Za-z\s]*(?:,\s*India)?/gi
    ];
    
    for (const pattern of locationPatterns) {
      const match = cleanText.match(pattern);
      if (match) {
        resumeData.personalInfo.location = match[0].replace(/^(address|location|city)[:\s]*/i, '').trim();
        break;
      }
    }

    // Extract professional summary with advanced patterns
    const summaryPatterns = [
      /(?:summary|objective|profile|about|overview)[:\s]*([^]*?)(?=\n\s*(?:experience|education|skills|employment|work|career|projects)|$)/gi,
      /(?:professional\s+summary|career\s+objective|personal\s+statement)[:\s]*([^]*?)(?=\n\s*(?:experience|education|skills)|$)/gi
    ];
    
    for (const pattern of summaryPatterns) {
      const match = cleanText.match(pattern);
      if (match && match[1]) {
        const summary = match[1].trim().replace(/\s+/g, ' ');
        if (summary.length > 30 && summary.length < 500) {
          resumeData.personalInfo.summary = summary;
          break;
        }
      }
    }

    // Extract skills with comprehensive patterns
    const skillsSection = extractSection(cleanText, ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise']);
    const commonSkills = [
      // Programming Languages
      'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'TypeScript',
      // Web Technologies
      'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS',
      // Databases
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB',
      // Cloud & DevOps
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'CI/CD',
      // Frameworks & Libraries
      'Django', 'Flask', 'Spring', 'Laravel', 'Rails', 'Next.js', 'Nuxt.js', 'Gatsby',
      // Mobile Development
      'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
      // Data & Analytics
      'Machine Learning', 'Deep Learning', 'Data Science', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      // Design & Creative
      'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD', 'InDesign', 'After Effects',
      // Business & Soft Skills
      'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication', 'Problem Solving', 'Team Management',
      // Other Technologies
      'Linux', 'Windows', 'macOS', 'Bash', 'PowerShell', 'REST API', 'GraphQL', 'Microservices'
    ];
    
    const extractedSkills = new Set<string>();
    
    // Check skills section first
    if (skillsSection) {
      for (const skill of commonSkills) {
        if (skillsSection.toLowerCase().includes(skill.toLowerCase())) {
          extractedSkills.add(skill);
        }
      }
    }
    
    // Check entire text for skills
    for (const skill of commonSkills) {
      if (lowerText.includes(skill.toLowerCase())) {
        extractedSkills.add(skill);
      }
    }
    
    // Extract skills from bullet points and lists
    const skillBulletPattern = /[•·▪▫-]\s*([A-Za-z][A-Za-z\s.+#-]+?)(?=\s*[•·▪▫-]|\n|$)/g;
    let match;
    while ((match = skillBulletPattern.exec(skillsSection || cleanText)) !== null) {
      const skill = match[1].trim();
      if (skill.length > 2 && skill.length < 30 && !skill.includes('experience') && !skill.includes('years')) {
        extractedSkills.add(skill);
      }
    }
    
    resumeData.skills = Array.from(extractedSkills).slice(0, 20); // Limit to 20 skills

    // Extract work experience with advanced parsing
    const experienceSection = extractSection(cleanText, ['experience', 'work experience', 'employment', 'career', 'professional experience', 'work history']);
    if (experienceSection) {
      const experiences = parseExperienceSection(experienceSection);
      resumeData.experience = experiences;
    }

    // Extract education with comprehensive patterns
    const educationSection = extractSection(cleanText, ['education', 'academic', 'qualification', 'degree', 'university', 'college']);
    if (educationSection) {
      const educations = parseEducationSection(educationSection);
      resumeData.education = educations;
    }

    // Extract projects
    const projectsSection = extractSection(cleanText, ['projects', 'portfolio', 'work samples', 'achievements']);
    if (projectsSection) {
      const projects = parseProjectsSection(projectsSection);
      resumeData.projects = projects;
    }

    return resumeData;
  };

  const extractSection = (text: string, keywords: string[]): string => {
    for (const keyword of keywords) {
      const pattern = new RegExp(`(${keyword})[:\\s]*([\\s\\S]*?)(?=\\n\\s*(?:experience|education|skills|projects|employment|work|career|qualification|degree|university|college|portfolio|achievements|references|certifications|awards|languages|interests|hobbies)|$)`, 'gi');
      const match = text.match(pattern);
      if (match && match[0]) {
        return match[0];
      }
    }
    return '';
  };

  const parseExperienceSection = (section: string): Array<{title: string; company: string; duration: string; description: string}> => {
    const experiences: Array<{title: string; company: string; duration: string; description: string}> = [];
    
    // Pattern for job entries: Title, Company, Duration, Description
    const jobPatterns = [
      // Pattern 1: Title\nCompany\nDuration\nDescription
      /([A-Za-z\s&,.-]+?)\s*\n\s*([A-Za-z\s&,.-]+?)\s*\n\s*([A-Za-z\s\d\-–—\/]+?)\s*\n\s*([^]*?)(?=\n\s*[A-Z][a-z\s&,.-]+?\s*\n\s*[A-Z][a-z\s&,.-]+?\s*\n|\n\s*$|$)/gi,
      // Pattern 2: Title at Company (Duration)
      /([A-Za-z\s&,.-]+?)\s+at\s+([A-Za-z\s&,.-]+?)\s*\(([^)]+)\)\s*([^]*?)(?=\n\s*[A-Z][a-z\s&,.-]+?\s+at\s+|\n\s*$|$)/gi,
      // Pattern 3: Title | Company | Duration
      /([A-Za-z\s&,.-]+?)\s*\|\s*([A-Za-z\s&,.-]+?)\s*\|\s*([A-Za-z\s\d\-–—\/]+?)\s*\n\s*([^]*?)(?=\n\s*[A-Z][a-z\s&,.-]+?\s*\||\n\s*$|$)/gi
    ];
    
    for (const pattern of jobPatterns) {
      let match;
      while ((match = pattern.exec(section)) !== null) {
        if (match[1] && match[2] && match[3]) {
          experiences.push({
            title: match[1].trim(),
            company: match[2].trim(),
            duration: match[3].trim(),
            description: (match[4] || '').trim().substring(0, 500) // Limit description length
          });
        }
      }
      if (experiences.length > 0) break;
    }
    
    return experiences.slice(0, 5); // Limit to 5 experiences
  };

  const parseEducationSection = (section: string): Array<{degree: string; institution: string; year: string; gpa: string}> => {
    const educations: Array<{degree: string; institution: string; year: string; gpa: string}> = [];
    
    const educationPatterns = [
      // Pattern 1: Degree\nInstitution\nYear
      /((?:bachelor|master|phd|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?tech|m\.?tech|diploma)[^]*?)\n\s*([^]*?(?:university|college|institute|school)[^]*?)\n\s*(\d{4}(?:\s*-\s*\d{4})?)/gi,
      // Pattern 2: Degree from Institution (Year)
      /((?:bachelor|master|phd|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?tech|m\.?tech|diploma)[^]*?)\s+from\s+([^]*?(?:university|college|institute|school)[^]*?)\s*\((\d{4}(?:\s*-\s*\d{4})?)\)/gi,
      // Pattern 3: Degree | Institution | Year
      /((?:bachelor|master|phd|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?tech|m\.?tech|diploma)[^]*?)\s*\|\s*([^]*?(?:university|college|institute|school)[^]*?)\s*\|\s*(\d{4}(?:\s*-\s*\d{4})?)/gi
    ];
    
    for (const pattern of educationPatterns) {
      let match;
      while ((match = pattern.exec(section)) !== null) {
        if (match[1] && match[2] && match[3]) {
          // Extract GPA if present
          const gpaMatch = section.match(/gpa[:\s]*(\d+\.?\d*)/gi);
          const gpa = gpaMatch ? gpaMatch[0].replace(/gpa[:\s]*/gi, '') : '';
          
          educations.push({
            degree: match[1].trim(),
            institution: match[2].trim(),
            year: match[3].trim(),
            gpa: gpa
          });
        }
      }
      if (educations.length > 0) break;
    }
    
    return educations.slice(0, 3); // Limit to 3 education entries
  };

  const parseProjectsSection = (section: string): Array<{name: string; description: string; technologies: string; link: string}> => {
    const projects: Array<{name: string; description: string; technologies: string; link: string}> = [];
    
    const projectPatterns = [
      // Pattern 1: Project Name\nDescription\nTechnologies
      /([A-Za-z\s&,.-]+?)\s*\n\s*([^]*?)(?:\n\s*(?:technologies|tech stack|built with)[:\s]*([^]*?))?(?=\n\s*[A-Z][a-z\s&,.-]+?\s*\n|\n\s*$|$)/gi,
      // Pattern 2: Project: Name - Description
      /project[:\s]*([A-Za-z\s&,.-]+?)\s*-\s*([^]*?)(?=\n\s*project[:\s]*|\n\s*$|$)/gi
    ];
    
    for (const pattern of projectPatterns) {
      let match;
      while ((match = pattern.exec(section)) !== null) {
        if (match[1] && match[2]) {
          // Extract project URL if present
          const urlMatch = match[2].match(/(https?:\/\/[^\s]+)/);
          const url = urlMatch ? urlMatch[0] : '';
          
          projects.push({
            name: match[1].trim(),
            description: match[2].replace(/(https?:\/\/[^\s]+)/g, '').trim().substring(0, 300),
            technologies: (match[3] || '').trim(),
            link: url
          });
        }
      }
      if (projects.length > 0) break;
    }
    
    return projects.slice(0, 5); // Limit to 5 projects
  };

  const handleManualTextProcess = async () => {
    if (!manualText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setUploading(true);
    setProcessingStep('Processing text with AI...');
    
    try {
      setExtractedText(manualText);
      const parsedData = await parseResumeWithAdvancedAI(manualText);
      setExtractedData(parsedData);
      setShowManualInput(false);
      toast.success('Resume data extracted successfully!');
    } catch (error) {
      console.error('Error processing manual text:', error);
      toast.error('Failed to process text. Please try again.');
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  const handleManualEntry = () => {
    const templateData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: ''
      },
      experience: [{
        title: '',
        company: '',
        duration: '',
        description: ''
      }],
      education: [{
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      }],
      skills: [],
      projects: []
    };
    
    onDataImported(templateData);
    toast.success('Manual entry template loaded!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Import Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your existing resume to auto-fill the form with AI extraction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!extractedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="flex flex-col items-center justify-center h-48">
                  <motion.div
                    animate={{ y: uploading ? 0 : [0, -10, 0] }}
                    transition={{ duration: 2, repeat: uploading ? 0 : Infinity }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      {uploading ? (
                        <Loader className="w-8 h-8 text-white animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </motion.div>
                  
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {uploading ? 'Processing Resume...' : 'Drag & Drop or Click to Upload'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    PDF, DOC, DOCX, or TXT files, max 10MB
                  </span>
                  
                  {uploading && (
                    <div className="mt-4 flex flex-col items-center space-y-2">
                      <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{processingStep}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Alternative Options */}
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowManualInput(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Paste Resume Text</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleManualEntry}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Start Fresh</span>
                  </motion.button>
                </div>

                {/* Manual Text Input */}
                {showManualInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                      📋 Paste Your Resume Text:
                    </h4>
                    <textarea
                      value={manualText}
                      onChange={(e) => setManualText(e.target.value)}
                      placeholder="Paste your complete resume text here... Include all sections like experience, education, skills, etc."
                      className="w-full h-40 p-3 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex space-x-3 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleManualTextProcess}
                        disabled={uploading || !manualText.trim()}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm disabled:opacity-50"
                      >
                        <Brain className="w-4 h-4" />
                        <span>{uploading ? 'Processing...' : 'Extract Data'}</span>
                      </motion.button>
                      <button
                        onClick={() => setShowManualInput(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold">Data extracted successfully!</span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Extracted Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.name || 'Not found'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.email || 'Not found'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.phone || 'Not found'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.personalInfo.location || 'Not found'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.skills.length} skills found</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.experience.length} entries</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Education:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.education.length} entries</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Projects:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{extractedData.projects?.length || 0} projects</span>
                    </div>
                  </div>
                </div>

                {/* Preview extracted skills */}
                {extractedData.skills.length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Extracted Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {extractedData.skills.slice(0, 10).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {extractedData.skills.length > 10 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">+{extractedData.skills.length - 10} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDataImported(extractedData);
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Use Extracted Data
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setExtractedData(null)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeImporter;
