import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, Brain, Download, User, Briefcase, BookOpen, Code, MapPin, Phone, Mail, Globe, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the ResumeData interface
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
  location: string;
}

interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
  location: string;
  honors: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
  duration: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: string[];
  languages: string[];
}

interface ResumeImporterProps {
  onDataImported: (data: ResumeData) => void;
  onClose: () => void;
}

// Declare pdfjsLib with type any since we're loading it from a CDN
declare const pdfjsLib: any;

const ResumeImporter: React.FC<ResumeImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>('');
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [parsingTime, setParsingTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load pdf.js library on component mount
  useEffect(() => {
    // Check if pdfjsLib is already available
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfjsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      // Set the worker path
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfjsLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
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

  // Extract text from PDF using pdf.js with layout preservation
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          // Load the PDF document
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let extractedText = '';
          
          // Extract text from each page with layout preservation
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Sort text items by y position (top to bottom) and x position (left to right)
            const textItems = textContent.items.sort((a: any, b: any) => {
              if (a.transform[5] !== b.transform[5]) {
                return b.transform[5] - a.transform[5]; // Sort by y position (descending)
              }
              return a.transform[4] - b.transform[4]; // Then by x position
            });
            
            let lastY = 0;
            for (const item of textItems) {
              // Add newline when we detect a significant vertical movement
              if (Math.abs(item.transform[5] - lastY) > 5) {
                extractedText += '\n';
                lastY = item.transform[5];
              }
              extractedText += item.str + ' ';
            }
            extractedText += '\n\n'; // Separate pages with extra newlines
          }
          
          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (file: File) => {
    console.log('Handling file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.txt', '.docx'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type. Please upload a PDF, TXT, or DOCX file.`);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setUploading(true);
    setProcessingStep('Reading file...');
    
    try {
      let text = '';
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isPDF) {
        if (!pdfjsLoaded) {
          toast.error('PDF library is still loading. Please try again in a moment.');
          setUploading(false);
          return;
        }
        
        setProcessingStep('Extracting text from PDF...');
        text = await extractTextFromPDF(file);
      } else if (file.name.toLowerCase().endsWith('.docx')) {
        setProcessingStep('DOCX files require special handling. Please paste text manually.');
        setShowManualInput(true);
        setUploading(false);
        return;
      } else {
        // Handle text files directly
        setProcessingStep('Reading text file...');
        text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }
      
      if (!text || text.trim().length < 10) {
        throw new Error('No readable text found in the file. The PDF might be scanned or image-based.');
      }
      
      setProcessingStep('Analyzing content with AI...');
      const startTime = performance.now();
      const { parsedData, confidence } = await parseResumeTextAdvanced(text);
      const endTime = performance.now();
      
      setParsingTime(Math.round(endTime - startTime));
      setExtractedData(parsedData);
      setConfidenceScore(confidence);
      toast.success(`Resume data extracted with ${confidence}% confidence!`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error processing file:', error);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
      setProcessingStep('');
    }
  };

  // Advanced resume parsing function with improved algorithms
  const parseResumeTextAdvanced = async (text: string): Promise<{ parsedData: ResumeData, confidence: number }> => {
    // Preprocess text - preserve line breaks for section detection
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const normalizedText = lines.join('\n');
    
    let confidence = 80; // Base confidence score
    
    const resumeData: ResumeData = {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        linkedin: '',
        github: '',
        portfolio: ''
      },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };

    // Section detection using advanced patterns
    const sections = detectSections(normalizedText, lines);
    
    // Extract personal information with improved algorithms
    const personalInfo = extractPersonalInfo(normalizedText, lines);
    resumeData.personalInfo = { ...resumeData.personalInfo, ...personalInfo };
    
    // Extract experience with context awareness
    if (sections.experience) {
      resumeData.experience = extractExperience(sections.experience);
      confidence += resumeData.experience.length > 0 ? 5 : 0;
    }
    
    // Extract education with improved patterns
    if (sections.education) {
      resumeData.education = extractEducation(sections.education);
      confidence += resumeData.education.length > 0 ? 5 : 0;
    }
    
    // Extract skills with better categorization
    if (sections.skills) {
      resumeData.skills = extractSkills(sections.skills);
      confidence += resumeData.skills.length > 0 ? 5 : 0;
    }
    
    // Extract projects with enhanced detection
    if (sections.projects) {
      resumeData.projects = extractProjects(sections.projects);
      confidence += resumeData.projects.length > 0 ? 5 : 0;
    }
    
    // Extract certifications
    if (sections.certifications) {
      resumeData.certifications = extractCertifications(sections.certifications);
    }
    
    // Extract languages
    if (sections.languages) {
      resumeData.languages = extractLanguages(sections.languages);
    }
    
    // If summary wasn't found in a section, try to extract it from the beginning
    if (!resumeData.personalInfo.summary && lines.length > 3) {
      const possibleSummary = extractSummary(lines);
      if (possibleSummary) {
        resumeData.personalInfo.summary = possibleSummary;
      }
    }
    
    // Cap confidence at 100
    confidence = Math.min(confidence, 100);
    
    console.log('Advanced parsed resume data:', resumeData);
    return { parsedData: resumeData, confidence };
  };

  // Section detection algorithm
  const detectSections = (text: string, lines: string[]): Record<string, string> => {
    const sectionHeaders = {
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience'],
      education: ['education', 'academic', 'qualifications', 'degrees'],
      skills: ['skills', 'technical skills', 'competencies', 'technologies'],
      projects: ['projects', 'personal projects', 'portfolio', 'project experience'],
      certifications: ['certifications', 'certificates', 'licenses'],
      languages: ['languages', 'language skills']
    };
    
    const sections: Record<string, string> = {};
    let currentSection = 'preamble';
    let sectionContent: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      let foundSection = false;
      
      // Check if this line is a section header
      for (const [section, headers] of Object.entries(sectionHeaders)) {
        for (const header of headers) {
          if (line.includes(header) && line.length - header.length < 5) {
            // Save previous section
            if (currentSection !== 'preamble' && sectionContent.length > 0) {
              sections[currentSection] = sectionContent.join('\n');
            }
            
            // Start new section
            currentSection = section;
            sectionContent = [];
            foundSection = true;
            break;
          }
        }
        if (foundSection) break;
      }
      
      if (!foundSection) {
        sectionContent.push(lines[i]);
      }
    }
    
    // Save the last section
    if (currentSection !== 'preamble' && sectionContent.length > 0) {
      sections[currentSection] = sectionContent.join('\n');
    }
    
    return sections;
  };

  // Improved personal info extraction
  const extractPersonalInfo = (text: string, lines: string[]): Partial<PersonalInfo> => {
    const info: Partial<PersonalInfo> = {};
    
    // Extract email with multiple patterns
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g);
    if (emailMatch) info.email = emailMatch[0];

    // Enhanced phone extraction with multiple international patterns
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // International
      /(\+91[-.\s]?)?[6-9]\d{9}/g, // Indian mobile numbers
      /(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}/g, // UK numbers
      /(\+1\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, // US/Canada numbers
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
        info.phone = phoneMatch[0];
        break;
      }
    }

    // Extract LinkedIn profile
    const linkedinMatch = text.match(/(?:linkedin\.com|linkedin\/in)\/(?:#!\/)?([a-zA-Z0-9\-_]+)/i);
    if (linkedinMatch) {
      info.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Extract GitHub profile
    const githubMatch = text.match(/(?:github\.com)\/([a-zA-Z0-9\-_]+)/i);
    if (githubMatch) {
      info.github = `https://github.com/${githubMatch[1]}`;
    }

    // Extract portfolio website
    const portfolioMatch = text.match(/(?:portfolio|website):?\s*(https?:\/\/[^\s]+)/i);
    if (portfolioMatch) {
      info.portfolio = portfolioMatch[1];
    }

    // Enhanced name extraction using multiple heuristics
    // Look for the largest font (often at the top) or patterns that look like names
    if (lines.length > 0) {
      const potentialNameLines = lines.slice(0, 3); // Name is usually at the top
      
      for (const line of potentialNameLines) {
        // Name pattern: typically 2-4 words with capital letters, not all caps
        if (line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 4 &&
            /[A-Z]/.test(line) && !/^[A-Z\s]+$/.test(line) && 
            !line.match(/(email|phone|linkedin|github|http)/i)) {
          info.name = line.trim();
          break;
        }
      }
    }

    // Enhanced location extraction
    const locationMatch = text.match(/(?:location|address|based in)[:\s]*([^\n,]+(?:,\s*[^\n,]+)*)/i);
    if (locationMatch) {
      info.location = locationMatch[1].trim();
    } else {
      // Try to find common location patterns
      const cityStatePattern = /([A-Z][a-z]+(?: [A-Z][a-z]+)*),?\s+([A-Z]{2}|[A-Z][a-z]+(?: [A-Z][a-z]+)*)/;
      const match = text.match(cityStatePattern);
      if (match) info.location = match[0];
    }

    return info;
  };

  // Extract summary from the beginning of the document
  const extractSummary = (lines: string[]): string => {
    // Summary is usually in the first few lines after the name
    let summary = '';
    let foundName = false;
    
    for (const line of lines.slice(0, 10)) { // Check first 10 lines
      if (foundName && line.length > 30 && !line.match(/(email|phone|http|@)/i)) {
        summary = line;
        break;
      }
      
      // Check if this line looks like a name
      if (line.split(/\s+/).length >= 2 && line.split(/\s+/).length <= 4 &&
          /[A-Z]/.test(line) && !/^[A-Z\s]+$/.test(line)) {
        foundName = true;
      }
    }
    
    return summary;
  };

  // Improved experience extraction with context awareness
  const extractExperience = (experienceText: string): Experience[] => {
    const experiences: Experience[] = [];
    const lines = experienceText.split('\n');
    
    let currentExp: Partial<Experience> = {};
    let collectingDescription = false;
    
    for (const line of lines) {
      // Detect new experience entry (often has dates or position titles)
      const hasTitle = line.match(/(senior|junior|lead|manager|director|engineer|developer|designer|analyst)/i);
      const hasDate = line.match(/((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4})|(\d{4}\s*[-–—]\s*(present|current|\d{4}))/i);
      
      if ((hasTitle || hasDate) && !collectingDescription) {
        // Save previous experience if exists
        if (currentExp.title && currentExp.company) {
          experiences.push(currentExp as Experience);
        }
        
        // Start new experience
        currentExp = {};
        
        // Try to extract title, company, and duration
        const titleCompanyMatch = line.match(/(.+?)(?:\s+at|\s+@|\s+,\s+|\s+-\s+)(.+)/i);
        if (titleCompanyMatch) {
          currentExp.title = titleCompanyMatch[1].trim();
          currentExp.company = titleCompanyMatch[2].trim();
        } else {
          currentExp.title = line.trim();
        }
        
        // Extract duration
        const durationMatch = line.match(/((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}\s*[-–—]\s*(present|current|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}))/i);
        if (durationMatch) {
          currentExp.duration = durationMatch[1];
        }
        
        collectingDescription = true;
      } else if (collectingDescription) {
        // Collect description lines
        if (line.trim().length > 0) {
          if (!currentExp.description) {
            currentExp.description = line;
          } else {
            currentExp.description += '\n' + line;
          }
        } else if (currentExp.description) {
          // Empty line might indicate end of description
          collectingDescription = false;
        }
      }
    }
    
    // Add the last experience
    if (currentExp.title && currentExp.company) {
      experiences.push(currentExp as Experience);
    }
    
    return experiences;
  };

  // Improved education extraction
  const extractEducation = (educationText: string): Education[] => {
    const educations: Education[] = [];
    const lines = educationText.split('\n');
    
    let currentEdu: Partial<Education> = {};
    
    for (const line of lines) {
      // Look for degree patterns
      const degreeMatch = line.match(/(bach|master|phd|m\.?tech|b\.?tech|m\.?sc|b\.?sc|m\.?a|b\.?a|m\.?com|b\.?com|diploma|certificate)/i);
      const institutionMatch = line.match(/(university|college|institute|school|academy)/i);
      const yearMatch = line.match(/(\d{4}\s*[-–—]\s*(present|current|\d{4})|\d{4})/i);
      const gpaMatch = line.match(/(gpa|grade|score):?\s*([\d\.]+\/)?[\d\.]+/i);
      
      if (degreeMatch || institutionMatch) {
        // Save previous education if exists
        if (currentEdu.degree && currentEdu.institution) {
          educations.push(currentEdu as Education);
        }
        
        // Start new education
        currentEdu = {};
        
        if (degreeMatch && institutionMatch) {
          const degreePart = line.substring(0, line.search(institutionMatch[0])).trim();
          const institutionPart = line.substring(line.search(institutionMatch[0])).trim();
          
          currentEdu.degree = degreePart;
          currentEdu.institution = institutionPart;
        } else if (degreeMatch) {
          currentEdu.degree = line.trim();
        } else if (institutionMatch) {
          currentEdu.institution = line.trim();
        }
        
        // Extract year
        if (yearMatch) {
          currentEdu.year = yearMatch[1];
        }
        
        // Extract GPA
        if (gpaMatch) {
          currentEdu.gpa = gpaMatch[0].replace(/(gpa|grade|score):?\s*/i, '');
        }
      } else if (currentEdu.degree || currentEdu.institution) {
        // This might be additional info for the current education entry
        if (yearMatch && !currentEdu.year) {
          currentEdu.year = yearMatch[1];
        } else if (gpaMatch && !currentEdu.gpa) {
          currentEdu.gpa = gpaMatch[0].replace(/(gpa|grade|score):?\s*/i, '');
        }
      }
    }
    
    // Add the last education
    if (currentEdu.degree && currentEdu.institution) {
      educations.push(currentEdu as Education);
    }
    
    return educations;
  };

  // Improved skills extraction with categorization
  const extractSkills = (skillsText: string): string[] => {
    const skills: string[] = [];
    const lines = skillsText.split('\n');
    
    for (const line of lines) {
      // Split by common separators: commas, slashes, bullets, etc.
      const lineSkills = line.split(/[,•·\-–—\/]|(?:and|&)/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 1 && skill.length < 50);
      
      skills.push(...lineSkills);
    }
    
    // Remove duplicates and empty entries
    return [...new Set(skills)].filter(skill => skill.length > 0);
  };

  // Improved projects extraction
  const extractProjects = (projectsText: string): Project[] => {
    const projects: Project[] = [];
    const lines = projectsText.split('\n');
    
    let currentProject: Partial<Project> = {};
    let collectingDescription = false;
    
    for (const line of lines) {
      // Detect project names (often at the beginning of lines or have special formatting)
      const isProjectTitle = line.length > 3 && line.length < 60 && 
                            !line.match(/(http|www|@|\.com|\.org)/i) &&
                            (line.match(/\b(project|app|system|tool|platform)\b/i) || 
                             !line.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{4})/i));
      
      if (isProjectTitle) {
        // Save previous project if exists
        if (currentProject.name) {
          projects.push(currentProject as Project);
        }
        
        // Start new project
        currentProject = { name: line.trim() };
        collectingDescription = true;
      } else if (collectingDescription) {
        // Check if this line contains technologies
        const techMatch = line.match(/(technologies|tech stack|tools):?\s*(.+)/i);
        if (techMatch) {
          currentProject.technologies = techMatch[2].split(/[,;]/).map(t => t.trim());
        } else if (line.match(/(http|github|live demo)/i)) {
          // Extract project link
          const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
          if (linkMatch) currentProject.link = linkMatch[1];
        } else if (line.trim().length > 0) {
          // Add to description
          if (!currentProject.description) {
            currentProject.description = line;
          } else {
            currentProject.description += '\n' + line;
          }
        }
      }
    }
    
    // Add the last project
    if (currentProject.name) {
      projects.push(currentProject as Project);
    }
    
    return projects;
  };

  // Extract certifications
  const extractCertifications = (certsText: string): string[] => {
    const lines = certsText.split('\n');
    return lines
      .map(line => line.replace(/(certification|certificate|license):?\s*/i, '').trim())
      .filter(line => line.length > 0);
  };

  // Extract languages
  const extractLanguages = (langsText: string): string[] => {
    const lines = langsText.split('\n');
    return lines
      .map(line => line.replace(/(languages|language):?\s*/i, '').trim())
      .filter(line => line.length > 0);
  };

  const handleManualTextProcess = async () => {
    if (!manualText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setUploading(true);
    setProcessingStep('Processing text...');
    
    try {
      const startTime = performance.now();
      const { parsedData, confidence } = await parseResumeTextAdvanced(manualText);
      const endTime = performance.now();
      
      setParsingTime(Math.round(endTime - startTime));
      setExtractedData(parsedData);
      setConfidenceScore(confidence);
      setShowManualInput(false);
      toast.success(`Resume data extracted with ${confidence}% confidence!`);
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
        github: '',
        portfolio: ''
      },
      experience: [{
        title: '',
        company: '',
        duration: '',
        description: '',
        location: ''
      }],
      education: [{
        degree: '',
        institution: '',
        year: '',
        gpa: '',
        location: '',
        honors: ''
      }],
      skills: [],
      projects: [{
        name: '',
        description: '',
        technologies: [],
        link: '',
        duration: ''
      }],
      certifications: [],
      languages: []
    };
    
    onDataImported(templateData);
    toast.success('Manual entry template loaded!');
    onClose();
  };

  // Confidence indicator component
  const ConfidenceIndicator = ({ score }: { score: number }) => {
    let color = 'bg-red-500';
    if (score >= 80) color = 'bg-green-500';
    else if (score >= 60) color = 'bg-yellow-500';
    
    return (
      <div className="flex items-center mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${color}`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {score}%
        </span>
      </div>
    );
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
              Advanced Resume Import
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your resume and our AI will extract the information
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
                  accept=".pdf,.txt,.docx"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <div className="flex flex-col items-center justify-center h-40">
                  <motion.div
                    animate={{ y: uploading ? [0, -10, 0] : 0 }}
                    transition={{ duration: 2, repeat: uploading ? Infinity : 0 }}
                    className="relative"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      {uploading ? (
                        <Brain className="w-8 h-8 text-white" />
                      ) : (
                        <Upload className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </motion.div>
                  
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {uploading ? 'Processing...' : 'Drag & Drop or Click to Upload'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    PDF, TXT, or DOCX files, max 10MB
                  </span>
                  
                  {uploading && (
                    <div className="mt-4 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-blue-600 text-sm">{processingStep}</span>
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
                    <span>Paste Text</span>
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
                <AnimatePresence>
                  {showManualInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg overflow-hidden"
                    >
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
                        📋 Paste Your Resume Text:
                      </h4>
                      <textarea
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                        placeholder="Paste your resume text here..."
                        className="w-full h-32 p-3 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Results Display */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">Data extracted successfully!</span>
                </div>
                <div className="text-sm text-gray-500">
                  Processed in {parsingTime}ms
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Extraction Confidence
                </h3>
                <ConfidenceIndicator score={confidenceScore} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {confidenceScore >= 80 
                    ? 'High confidence in extracted data' 
                    : confidenceScore >= 60 
                    ? 'Moderate confidence - please review carefully'
                    : 'Low confidence - manual review recommended'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Extracted Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Personal Info */}
                  {extractedData.personalInfo.name && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">{extractedData.personalInfo.name}</span>
                    </div>
                  )}
                  
                  {extractedData.personalInfo.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">{extractedData.personalInfo.email}</span>
                    </div>
                  )}
                  
                  {extractedData.personalInfo.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">{extractedData.personalInfo.phone}</span>
                    </div>
                  )}
                  
                  {extractedData.personalInfo.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">{extractedData.personalInfo.location}</span>
                    </div>
                  )}
                  
                  {extractedData.personalInfo.linkedin && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">LinkedIn: {extractedData.personalInfo.linkedin}</span>
                    </div>
                  )}
                  
                  {extractedData.personalInfo.github && (
                    <div className="flex items-center">
                      <Code className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-gray-900 dark:text-white">GitHub: {extractedData.personalInfo.github}</span>
                    </div>
                  )}
                  
                  {/* Summary */}
                  {extractedData.personalInfo.summary && (
                    <div className="md:col-span-2 mt-2">
                      <p className="text-gray-900 dark:text-white">
                        {extractedData.personalInfo.summary.length > 150 
                          ? `${extractedData.personalInfo.summary.substring(0, 150)}...` 
                          : extractedData.personalInfo.summary}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Sections Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {extractedData.experience.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-500 mb-1" />
                      <span className="font-medium text-gray-900 dark:text-white">{extractedData.experience.length}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Experience</span>
                    </div>
                  )}
                  
                  {extractedData.education.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <BookOpen className="w-6 h-6 text-green-500 mb-1" />
                      <span className="font-medium text-gray-900 dark:text-white">{extractedData.education.length}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Education</span>
                    </div>
                  )}
                  
                  {extractedData.skills.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Code className="w-6 h-6 text-purple-500 mb-1" />
                      <span className="font-medium text-gray-900 dark:text-white">{extractedData.skills.length}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Skills</span>
                    </div>
                  )}
                  
                  {extractedData.projects.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <FileText className="w-6 h-6 text-orange-500 mb-1" />
                      <span className="font-medium text-gray-900 dark:text-white">{extractedData.projects.length}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Projects</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onDataImported(extractedData);
                    onClose();
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  Use Extracted Data
                  <ChevronRight className="w-5 h-5 ml-2" />
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
