import jsPDF from 'jspdf';
import { getTemplateById, ResumeTemplate } from '../data/resumeTemplates';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string;
    github?: string;
  };
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
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }>;
}

export const generateResumePDF = (data: ResumeData, templateId: string = 'career-catalyst'): void => {
  const template = getTemplateById(templateId);
  if (!template) {
    console.error('Template not found');
    return;
  }

  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 37, g: 99, b: 235 };
  };

  // Helper function to add text with proper word wrapping
  const addWrappedText = (
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    fontSize: number = 11,
    lineHeight: number = 1.4,
    fontStyle: string = 'normal',
    textColor: {r: number, g: number, b: number} = {r: 0, g: 0, b: 0}
  ): number => {
    if (!text || text.trim() === '') return y;
    
    pdf.setFontSize(fontSize);
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
    pdf.setFont('helvetica', fontStyle);
    const lines = pdf.splitTextToSize(text.trim(), maxWidth);
    const lineSpacing = fontSize * lineHeight;
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineSpacing));
    });
    
    return y + (lines.length * lineSpacing) + (fontSize * 0.3);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin - 50) {
      pdf.addPage();
      return margin + 20;
    }
    return yPosition;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, color: any, fontSize: number = 16): number => {
    yPosition = checkPageBreak(50);
    yPosition += 15;
    
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title.toUpperCase(), margin, yPosition);
    
    // Add underline
    pdf.setDrawColor(color.r, color.g, color.b);
    pdf.setLineWidth(1.5);
    const textWidth = pdf.getTextWidth(title.toUpperCase());
    pdf.line(margin, yPosition + 3, margin + Math.min(textWidth, contentWidth), yPosition + 3);
    
    return yPosition + 25;
  };

  // Set template colors
  const primaryRgb = hexToRgb(template.colors.primary);
  const secondaryRgb = hexToRgb(template.colors.secondary);
  const accentRgb = hexToRgb(template.colors.accent);
  const textRgb = hexToRgb(template.colors.text);
  const backgroundRgb = hexToRgb(template.colors.background);

  // Set background color if not white
  if (template.colors.background !== '#FFFFFF') {
    pdf.setFillColor(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  // Generate PDF based on template layout
  switch (template.layout) {
    case 'two-column':
      generateTwoColumnLayout(template);
      break;
    case 'sidebar':
      generateSidebarLayout(template);
      break;
    case 'header-focus':
      generateHeaderFocusLayout(template);
      break;
    case 'single-column':
    default:
      generateSingleColumnLayout(template);
  }

  function generateSingleColumnLayout(template: ResumeTemplate) {
    // HEADER - Name and Contact
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.personalInfo.name || 'Your Name', margin, yPosition);
    yPosition += 40;

    // Contact information in a clean line
    pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const contactItems = [];
    if (data.personalInfo.email) contactItems.push(data.personalInfo.email);
    if (data.personalInfo.phone) contactItems.push(data.personalInfo.phone);
    if (data.personalInfo.location) contactItems.push(data.personalInfo.location);
    
    if (contactItems.length > 0) {
      pdf.text(contactItems.join(' • '), margin, yPosition);
      yPosition += 15;
    }

    // Social links
    const socialItems = [];
    if (data.personalInfo.linkedin) socialItems.push(`LinkedIn: ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) socialItems.push(`GitHub: ${data.personalInfo.github}`);
    
    if (socialItems.length > 0) {
      pdf.text(socialItems.join(' • '), margin, yPosition);
      yPosition += 20;
    }

    // Separator line
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(2);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 25;

    // PROFESSIONAL SUMMARY
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      yPosition = addSectionHeader('Professional Summary', primaryRgb, 14);
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      yPosition = addWrappedText(data.personalInfo.summary, margin, yPosition, contentWidth, 11, 1.5);
      yPosition += 10;
    }

    // WORK EXPERIENCE
    if (data.experience && data.experience.length > 0) {
      yPosition = addSectionHeader('Work Experience', primaryRgb, 14);

      data.experience.forEach((exp) => {
        yPosition = checkPageBreak(80);
        
        // Job title and company
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', margin, yPosition);
        
        // Duration on the right
        if (exp.duration) {
          const durationWidth = pdf.getTextWidth(exp.duration);
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.text(exp.duration, pageWidth - margin - durationWidth, yPosition);
        }
        
        yPosition += 18;

        // Company
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.company || 'Company Name', margin, yPosition);
        yPosition += 18;

        // Description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth, 10, 1.4);
        }
        
        yPosition += 15;
      });
    }

    // EDUCATION
    if (data.education && data.education.length > 0) {
      yPosition = addSectionHeader('Education', primaryRgb, 14);

      data.education.forEach((edu) => {
        yPosition = checkPageBreak(60);
        
        // Degree
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', margin, yPosition);
        yPosition += 16;

        // Institution and details
        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const eduDetails = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(eduDetails, margin, yPosition);
        yPosition += 20;
      });
    }

    // SKILLS
    if (data.skills && data.skills.length > 0) {
      yPosition = addSectionHeader('Technical Skills', primaryRgb, 14);

      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Create skill groups for better formatting
      const skillsText = data.skills.join(' • ');
      yPosition = addWrappedText(skillsText, margin, yPosition, contentWidth, 11, 1.4);
      yPosition += 10;
    }

    // PROJECTS
    if (data.projects && data.projects.length > 0) {
      yPosition = addSectionHeader('Projects', primaryRgb, 14);

      data.projects.forEach((project) => {
        yPosition = checkPageBreak(80);
        
        // Project name
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.name || 'Project Name', margin, yPosition);
        yPosition += 16;

        // Description
        if (project.description && project.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          yPosition = addWrappedText(project.description, margin, yPosition, contentWidth, 10, 1.4);
        }

        // Technologies
        if (project.technologies && project.technologies.trim()) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          yPosition = addWrappedText(`Technologies: ${project.technologies}`, margin, yPosition + 5, contentWidth, 9, 1.3);
        }

        // Project link
        if (project.link && project.link.trim()) {
          pdf.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Link: ${project.link}`, margin, yPosition + 8);
          yPosition += 12;
        }
        
        yPosition += 15;
      });
    }
  }

  function generateTwoColumnLayout(template: ResumeTemplate) {
    const leftColumnWidth = 200;
    const rightColumnWidth = contentWidth - leftColumnWidth - 20;
    const rightColumnX = margin + leftColumnWidth + 20;

    // LEFT COLUMN - Header with name
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, leftColumnWidth + margin, pageHeight, 'F');

    // Name in left column
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const nameLines = pdf.splitTextToSize(data.personalInfo.name || 'Your Name', leftColumnWidth - 20);
    let leftY = 60;
    nameLines.forEach((line: string, index: number) => {
      pdf.text(line, 20, leftY + (index * 30));
    });
    leftY += nameLines.length * 30 + 20;

    // Contact info in left column
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (data.personalInfo.email) {
      pdf.text('EMAIL', 20, leftY);
      leftY += 12;
      pdf.text(data.personalInfo.email, 20, leftY);
      leftY += 25;
    }
    
    if (data.personalInfo.phone) {
      pdf.text('PHONE', 20, leftY);
      leftY += 12;
      pdf.text(data.personalInfo.phone, 20, leftY);
      leftY += 25;
    }
    
    if (data.personalInfo.location) {
      pdf.text('LOCATION', 20, leftY);
      leftY += 12;
      leftY = addWrappedText(data.personalInfo.location, 20, leftY, leftColumnWidth - 40, 10, 1.3);
      leftY += 15;
    }

    // Social links in left column
    if (data.personalInfo.linkedin || data.personalInfo.github) {
      pdf.text('SOCIAL', 20, leftY);
      leftY += 12;
      
      if (data.personalInfo.linkedin) {
        pdf.text(`LinkedIn: ${data.personalInfo.linkedin}`, 20, leftY);
        leftY += 15;
      }
      
      if (data.personalInfo.github) {
        pdf.text(`GitHub: ${data.personalInfo.github}`, 20, leftY);
        leftY += 15;
      }
      
      leftY += 10;
    }

    // Skills in left column
    if (data.skills && data.skills.length > 0) {
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SKILLS', 20, leftY);
      leftY += 20;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      data.skills.forEach(skill => {
        leftY = checkPageBreak(15);
        if (leftY < 60) leftY = 60; // Reset if new page
        pdf.text(`• ${skill}`, 20, leftY);
        leftY += 12;
      });
    }

    // RIGHT COLUMN - Main content
    let rightY = 60;

    // Professional Summary
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFESSIONAL SUMMARY', rightColumnX, rightY);
      rightY += 20;
      
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      rightY = addWrappedText(data.personalInfo.summary, rightColumnX, rightY, rightColumnWidth, 10, 1.5);
      rightY += 20;
    }

    // Work Experience
    if (data.experience && data.experience.length > 0) {
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WORK EXPERIENCE', rightColumnX, rightY);
      rightY += 25;

      data.experience.forEach((exp) => {
        rightY = checkPageBreak(80);
        if (rightY < 60) rightY = 60;
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', rightColumnX, rightY);
        rightY += 15;

        // Company and duration
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.company || 'Company Name', rightColumnX, rightY);
        
        if (exp.duration) {
          const durationWidth = pdf.getTextWidth(exp.duration);
          pdf.text(exp.duration, pageWidth - margin - durationWidth, rightY);
        }
        rightY += 15;

        // Description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          rightY = addWrappedText(exp.description, rightColumnX, rightY, rightColumnWidth, 9, 1.4);
        }
        
        rightY += 15;
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      rightY = checkPageBreak(60);
      if (rightY < 60) rightY = 60;
      
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EDUCATION', rightColumnX, rightY);
      rightY += 25;

      data.education.forEach((edu) => {
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', rightColumnX, rightY);
        rightY += 15;

        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const eduDetails = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(eduDetails, rightColumnX, rightY);
        rightY += 20;
      });
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      rightY = checkPageBreak(60);
      if (rightY < 60) rightY = 60;
      
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECTS', rightColumnX, rightY);
      rightY += 25;

      data.projects.forEach((project) => {
        rightY = checkPageBreak(60);
        if (rightY < 60) rightY = 60;
        
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.name || 'Project Name', rightColumnX, rightY);
        rightY += 15;

        if (project.description) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          rightY = addWrappedText(project.description, rightColumnX, rightY, rightColumnWidth, 9, 1.4);
        }

        if (project.technologies) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'italic');
          rightY = addWrappedText(`Technologies: ${project.technologies}`, rightColumnX, rightY + 3, rightColumnWidth, 8, 1.3);
        }
        
        rightY += 15;
      });
    }
  }

  function generateSidebarLayout(template: ResumeTemplate) {
    const leftWidth = 200;
    const rightWidth = contentWidth - leftWidth - 20;
    const rightX = margin + leftWidth + 20;

    // LEFT SIDEBAR with background color
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, leftWidth + margin, pageHeight, 'F');

    // Name in sidebar
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const nameLines = pdf.splitTextToSize(data.personalInfo.name || 'Your Name', leftWidth - 20);
    let leftY = 60;
    nameLines.forEach((line: string, index: number) => {
      pdf.text(line, 20, leftY + (index * 30));
    });
    leftY += nameLines.length * 30 + 30;

    // Contact info in sidebar
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (data.personalInfo.email) {
      pdf.text('EMAIL', 20, leftY);
      leftY += 12;
      pdf.text(data.personalInfo.email, 20, leftY);
      leftY += 25;
    }
    
    if (data.personalInfo.phone) {
      pdf.text('PHONE', 20, leftY);
      leftY += 12;
      pdf.text(data.personalInfo.phone, 20, leftY);
      leftY += 25;
    }
    
    if (data.personalInfo.location) {
      pdf.text('LOCATION', 20, leftY);
      leftY += 12;
      leftY = addWrappedText(data.personalInfo.location, 20, leftY, leftWidth - 40, 10, 1.3);
      leftY += 15;
    }

    // Skills in sidebar
    if (data.skills && data.skills.length > 0) {
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SKILLS', 20, leftY);
      leftY += 20;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      data.skills.forEach(skill => {
        leftY = checkPageBreak(15);
        if (leftY < 60) leftY = 60;
        pdf.text(`• ${skill}`, 20, leftY);
        leftY += 12;
      });
      leftY += 20;
    }

    // RIGHT COLUMN - Main content
    let rightY = 60;

    // Professional Summary
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFESSIONAL SUMMARY', rightX, rightY);
      rightY += 20;
      
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      rightY = addWrappedText(data.personalInfo.summary, rightX, rightY, rightWidth, 10, 1.5);
      rightY += 20;
    }

    // Work Experience
    if (data.experience && data.experience.length > 0) {
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WORK EXPERIENCE', rightX, rightY);
      rightY += 25;

      data.experience.forEach((exp) => {
        rightY = checkPageBreak(80);
        if (rightY < 60) rightY = 60;
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', rightX, rightY);
        rightY += 15;

        // Company and duration
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${exp.company || 'Company'} | ${exp.duration || 'Duration'}`, rightX, rightY);
        rightY += 15;

        // Description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          rightY = addWrappedText(exp.description, rightX, rightY, rightWidth, 9, 1.4);
        }
        
        rightY += 20;
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      rightY = checkPageBreak(60);
      if (rightY < 60) rightY = 60;
      
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EDUCATION', rightX, rightY);
      rightY += 25;

      data.education.forEach((edu) => {
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', rightX, rightY);
        rightY += 15;

        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const eduDetails = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(eduDetails, rightX, rightY);
        rightY += 20;
      });
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      rightY = checkPageBreak(60);
      if (rightY < 60) rightY = 60;
      
      pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJECTS', rightX, rightY);
      rightY += 25;

      data.projects.forEach((project) => {
        rightY = checkPageBreak(60);
        if (rightY < 60) rightY = 60;
        
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.name || 'Project Name', rightX, rightY);
        rightY += 15;

        if (project.description) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          rightY = addWrappedText(project.description, rightX, rightY, rightWidth, 9, 1.4);
        }
        
        rightY += 15;
      });
    }
  }

  function generateHeaderFocusLayout(template: ResumeTemplate) {
    // Large header section
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, pageWidth, 120, 'F');

    // Name in header
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.personalInfo.name || 'Your Name', margin, 50);

    // Contact in header
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const headerContact = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location]
      .filter(Boolean).join(' • ');
    if (headerContact) {
      pdf.text(headerContact, margin, 80);
    }

    yPosition = 140;
    generateSingleColumnLayout(template);
  }

  // Save the PDF
  const cleanName = (data.personalInfo.name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  const templateName = template.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_Resume_${templateName}.pdf`;
  pdf.save(fileName);
};
