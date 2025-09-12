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

export const generateResumePDF = (data: ResumeData, templateId: string = 'modern-1'): void => {
  const template = getTemplateById(templateId);
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
    } : { r: 37, g: 99, b: 235 }; // Default blue
  };

  // Helper function to add text with proper word wrapping and spacing
  const addWrappedText = (
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    fontSize: number = 11,
    lineHeight: number = 1.4,
    font: string = 'helvetica',
    style: string = 'normal'
  ): number => {
    if (!text || text.trim() === '') return y;
    
    pdf.setFontSize(fontSize);
    pdf.setFont(font, style);
    const lines = pdf.splitTextToSize(text.trim(), maxWidth);
    const lineSpacing = fontSize * lineHeight;
    
    lines.forEach((line: string, index: number) => {
      pdf.text(line, x, y + (index * lineSpacing));
    });
    
    return y + (lines.length * lineSpacing) + (fontSize * 0.5);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      return margin;
    }
    return yPosition;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, color: any, font: string): number => {
    yPosition = checkPageBreak(60);
    
    // Add some space before section
    yPosition += 20;
    
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(16);
    pdf.setFont(font, 'bold');
    pdf.text(title.toUpperCase(), margin, yPosition);
    
    // Add underline
    pdf.setDrawColor(color.r, color.g, color.b);
    pdf.setLineWidth(2);
    const textWidth = pdf.getTextWidth(title.toUpperCase());
    pdf.line(margin, yPosition + 5, margin + textWidth, yPosition + 5);
    
    return yPosition + 25;
  };

  // Set template colors and fonts
  const primaryColor = template?.colors.primary || '#2563EB';
  const secondaryColor = template?.colors.secondary || '#1E40AF';
  const textColor = template?.colors.text || '#1F2937';
  const backgroundColor = template?.colors.background || '#FFFFFF';
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const textRgb = hexToRgb(textColor);
  const backgroundRgb = hexToRgb(backgroundColor);
  
  // Set background color
  pdf.setFillColor(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Set default text color
  pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  
  // Apply template-specific styling based on layout
  switch (template?.layout) {
    case 'two-column':
      generateTwoColumnLayout();
      break;
    case 'sidebar':
      generateSidebarLayout();
      break;
    case 'header-focus':
      generateHeaderFocusLayout();
      break;
    case 'grid':
      generateGridLayout();
      break;
    default:
      generateSingleColumnLayout();
  }

  function generateSingleColumnLayout() {
    // HEADER SECTION - Name and Title
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setFontSize(28);
    pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
    pdf.text(data.personalInfo.name || 'Your Name', margin, yPosition);
    yPosition += 35;

    // Add professional title if available from experience
    if (data.experience.length > 0) {
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      pdf.text(data.experience[0].title, margin, yPosition);
      yPosition += 20;
    }

    // Add colored separator line
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(3);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 25;

    // CONTACT INFORMATION - Properly formatted
    pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.setFontSize(11);
    pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
    
    const contactItems = [];
    if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
    if (data.personalInfo.location) contactItems.push(`📍 ${data.personalInfo.location}`);
    
    // Display contact info in multiple lines if needed
    if (contactItems.length > 0) {
      const contactLine1 = contactItems.slice(0, 2).join('    ');
      pdf.text(contactLine1, margin, yPosition);
      yPosition += 15;
      
      if (contactItems.length > 2) {
        const contactLine2 = contactItems.slice(2).join('    ');
        pdf.text(contactLine2, margin, yPosition);
        yPosition += 15;
      }
    }

    // Social links on separate line
    const socialItems = [];
    if (data.personalInfo.linkedin) socialItems.push(`💼 ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) socialItems.push(`🔗 ${data.personalInfo.github}`);
    
    if (socialItems.length > 0) {
      const socialLine = socialItems.join('    ');
      pdf.text(socialLine, margin, yPosition);
      yPosition += 25;
    }

    // PROFESSIONAL SUMMARY SECTION
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      yPosition = addSectionHeader('Professional Summary', primaryRgb, template?.typography.headingFont || 'helvetica');
      
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      yPosition = addWrappedText(data.personalInfo.summary, margin, yPosition, contentWidth, 11, 1.5);
      yPosition += 15;
    }

    // WORK EXPERIENCE SECTION
    if (data.experience && data.experience.length > 0) {
      yPosition = addSectionHeader('Work Experience', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.experience.forEach((exp, index) => {
        yPosition = checkPageBreak(80);
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(14);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', margin, yPosition);
        yPosition += 18;

        // Company and duration
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'bold');
        const companyDuration = `${exp.company || 'Company Name'} | ${exp.duration || 'Duration'}`;
        pdf.text(companyDuration, margin, yPosition);
        yPosition += 20;

        // Job description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth, 11, 1.4);
        }
        
        // Add spacing between experience entries
        yPosition += 20;
      });
    }

    // EDUCATION SECTION
    if (data.education && data.education.length > 0) {
      yPosition = addSectionHeader('Education', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.education.forEach((edu, index) => {
        yPosition = checkPageBreak(60);
        
        // Degree
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', margin, yPosition);
        yPosition += 16;

        // Institution and year
        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(11);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
        const institutionInfo = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(institutionInfo, margin, yPosition);
        yPosition += 20;
      });
    }

    // SKILLS SECTION
    if (data.skills && data.skills.length > 0) {
      yPosition = addSectionHeader('Technical Skills', secondaryRgb, template?.typography.headingFont || 'helvetica');

      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      
      // Group skills into lines to prevent overflow
      const skillsPerLine = 6;
      const skillGroups = [];
      for (let i = 0; i < data.skills.length; i += skillsPerLine) {
        skillGroups.push(data.skills.slice(i, i + skillsPerLine));
      }
      
      skillGroups.forEach((group, groupIndex) => {
        const skillsText = group.join(' • ');
        yPosition = addWrappedText(skillsText, margin, yPosition, contentWidth, 11, 1.3);
        if (groupIndex < skillGroups.length - 1) {
          yPosition += 8; // Add spacing between skill groups
        }
      });
      
      yPosition += 15;
    }

    // PROJECTS SECTION
    if (data.projects && data.projects.length > 0) {
      yPosition = addSectionHeader('Projects', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.projects.forEach((project, index) => {
        yPosition = checkPageBreak(100);
        
        // Project name
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(project.name || 'Project Name', margin, yPosition);
        yPosition += 16;

        // Project description
        if (project.description && project.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          yPosition = addWrappedText(project.description, margin, yPosition, contentWidth, 11, 1.4);
        }

        // Technologies used
        if (project.technologies && project.technologies.trim()) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'italic');
          yPosition = addWrappedText(`Technologies: ${project.technologies}`, margin, yPosition + 5, contentWidth, 10, 1.3);
        }

        // Project link
        if (project.link && project.link.trim()) {
          pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          pdf.text(`🔗 ${project.link}`, margin, yPosition + 8);
          yPosition += 15;
        }
        
        // Add spacing between projects
        yPosition += 20;
      });
    }
  }

  function generateTwoColumnLayout() {
    const leftColumnWidth = contentWidth * 0.35;
    const rightColumnWidth = contentWidth * 0.65;
    const rightColumnX = margin + leftColumnWidth + 20;
    let leftY = yPosition;
    let rightY = yPosition;

    // HEADER SECTION - Name and Title (spans both columns)
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setFontSize(28);
    pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
    pdf.text(data.personalInfo.name || 'Your Name', margin, leftY);
    leftY += 35;
    rightY = leftY;

    // Add professional title if available from experience
    if (data.experience.length > 0) {
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      pdf.text(data.experience[0].title, margin, leftY);
      leftY += 20;
      rightY = leftY;
    }

    // Add colored separator line
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(3);
    pdf.line(margin, leftY, pageWidth - margin, leftY);
    leftY += 25;
    rightY = leftY;

    // LEFT COLUMN: Contact info, skills, etc.
    
    // CONTACT INFORMATION
    pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.setFontSize(11);
    pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
    
    if (data.personalInfo.email) {
      pdf.text(`📧 ${data.personalInfo.email}`, margin, leftY);
      leftY += 15;
    }
    
    if (data.personalInfo.phone) {
      pdf.text(`📱 ${data.personalInfo.phone}`, margin, leftY);
      leftY += 15;
    }
    
    if (data.personalInfo.location) {
      pdf.text(`📍 ${data.personalInfo.location}`, margin, leftY);
      leftY += 15;
    }
    
    if (data.personalInfo.linkedin) {
      pdf.text(`💼 ${data.personalInfo.linkedin}`, margin, leftY);
      leftY += 15;
    }
    
    if (data.personalInfo.github) {
      pdf.text(`🔗 ${data.personalInfo.github}`, margin, leftY);
      leftY += 25;
    }

    // SKILLS SECTION (Left column)
    if (data.skills && data.skills.length > 0) {
      leftY = addSectionHeader('Technical Skills', secondaryRgb, template?.typography.headingFont || 'helvetica');

      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      
      data.skills.forEach((skill, index) => {
        pdf.text(`• ${skill}`, margin, leftY);
        leftY += 15;
      });
      
      leftY += 10;
    }

    // RIGHT COLUMN: Summary, experience, education, projects
    
    // PROFESSIONAL SUMMARY SECTION
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      rightY = addSectionHeader('Professional Summary', primaryRgb, template?.typography.headingFont || 'helvetica');
      
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      rightY = addWrappedText(data.personalInfo.summary, rightColumnX, rightY, rightColumnWidth, 11, 1.5);
      rightY += 15;
    }

    // WORK EXPERIENCE SECTION
    if (data.experience && data.experience.length > 0) {
      rightY = addSectionHeader('Work Experience', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.experience.forEach((exp, index) => {
        rightY = checkPageBreak(80);
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(14);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', rightColumnX, rightY);
        rightY += 18;

        // Company and duration
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'bold');
        const companyDuration = `${exp.company || 'Company Name'} | ${exp.duration || 'Duration'}`;
        pdf.text(companyDuration, rightColumnX, rightY);
        rightY += 20;

        // Job description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          rightY = addWrappedText(exp.description, rightColumnX, rightY, rightColumnWidth, 11, 1.4);
        }
        
        // Add spacing between experience entries
        rightY += 20;
      });
    }

    // EDUCATION SECTION
    if (data.education && data.education.length > 0) {
      rightY = addSectionHeader('Education', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.education.forEach((edu, index) => {
        rightY = checkPageBreak(60);
        
        // Degree
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', rightColumnX, rightY);
        rightY += 16;

        // Institution and year
        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(11);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
        const institutionInfo = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(institutionInfo, rightColumnX, rightY);
        rightY += 20;
      });
    }

    // PROJECTS SECTION
    if (data.projects && data.projects.length > 0) {
      rightY = addSectionHeader('Projects', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.projects.forEach((project, index) => {
        rightY = checkPageBreak(100);
        
        // Project name
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(project.name || 'Project Name', rightColumnX, rightY);
        rightY += 16;

        // Project description
        if (project.description && project.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          rightY = addWrappedText(project.description, rightColumnX, rightY, rightColumnWidth, 11, 1.4);
        }

        // Technologies used
        if (project.technologies && project.technologies.trim()) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'italic');
          rightY = addWrappedText(`Technologies: ${project.technologies}`, rightColumnX, rightY + 5, rightColumnWidth, 10, 1.3);
        }

        // Project link
        if (project.link && project.link.trim()) {
          pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          pdf.text(`🔗 ${project.link}`, rightColumnX, rightY + 8);
          rightY += 15;
        }
        
        // Add spacing between projects
        rightY += 20;
      });
    }

    // Update yPosition to the maximum of leftY and rightY
    yPosition = Math.max(leftY, rightY);
  }

  function generateSidebarLayout() {
    // Similar to two-column but with a more distinct sidebar
    generateTwoColumnLayout();
  }

  function generateHeaderFocusLayout() {
    // HEADER SECTION - Name and Title (centered and larger)
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setFontSize(32);
    pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
    const nameWidth = pdf.getTextWidth(data.personalInfo.name || 'Your Name');
    pdf.text(data.personalInfo.name || 'Your Name', (pageWidth - nameWidth) / 2, yPosition);
    yPosition += 40;

    // Add professional title if available from experience
    if (data.experience.length > 0) {
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setFontSize(16);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      const titleWidth = pdf.getTextWidth(data.experience[0].title);
      pdf.text(data.experience[0].title, (pageWidth - titleWidth) / 2, yPosition);
      yPosition += 25;
    }

    // CONTACT INFORMATION - Centered and compact
    pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.setFontSize(10);
    pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
    
    const contactItems = [];
    if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
    if (data.personalInfo.location) contactItems.push(`📍 ${data.personalInfo.location}`);
    if (data.personalInfo.linkedin) contactItems.push(`💼 ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) contactItems.push(`🔗 ${data.personalInfo.github}`);
    
    if (contactItems.length > 0) {
      const contactLine = contactItems.join('   ');
      const contactWidth = pdf.getTextWidth(contactLine);
      pdf.text(contactLine, (pageWidth - contactWidth) / 2, yPosition);
      yPosition += 25;
    }

    // Add colored separator line
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(3);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 30;

    // Continue with single column layout for the rest
    generateSingleColumnLayout();
  }

  function generateGridLayout() {
    // Grid layout with a more structured approach
    const columnCount = 2;
    const columnWidth = contentWidth / columnCount;
    const columnGap = 20;
    
    // HEADER SECTION - Name and Title
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setFontSize(28);
    pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
    pdf.text(data.personalInfo.name || 'Your Name', margin, yPosition);
    yPosition += 35;

    // Add professional title if available from experience
    if (data.experience.length > 0) {
      pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
      pdf.setFontSize(14);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      pdf.text(data.experience[0].title, margin, yPosition);
      yPosition += 20;
    }

    // Add colored separator line
    pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.setLineWidth(3);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 25;

    // CONTACT INFORMATION - Grid format
    pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.setFontSize(10);
    pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
    
    const contactItems = [];
    if (data.personalInfo.email) contactItems.push({icon: '📧', text: data.personalInfo.email});
    if (data.personalInfo.phone) contactItems.push({icon: '📱', text: data.personalInfo.phone});
    if (data.personalInfo.location) contactItems.push({icon: '📍', text: data.personalInfo.location});
    if (data.personalInfo.linkedin) contactItems.push({icon: '💼', text: data.personalInfo.linkedin});
    if (data.personalInfo.github) contactItems.push({icon: '🔗', text: data.personalInfo.github});
    
    if (contactItems.length > 0) {
      const itemsPerRow = 3;
      const itemWidth = contentWidth / itemsPerRow;
      
      for (let i = 0; i < contactItems.length; i++) {
        const col = i % itemsPerRow;
        const row = Math.floor(i / itemsPerRow);
        const x = margin + (col * itemWidth);
        const y = yPosition + (row * 15);
        
        pdf.text(`${contactItems[i].icon} ${contactItems[i].text}`, x, y);
      }
      
      yPosition += (Math.ceil(contactItems.length / itemsPerRow) * 15) + 20;
    }

    // PROFESSIONAL SUMMARY SECTION
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      yPosition = addSectionHeader('Professional Summary', primaryRgb, template?.typography.headingFont || 'helvetica');
      
      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      yPosition = addWrappedText(data.personalInfo.summary, margin, yPosition, contentWidth, 11, 1.5);
      yPosition += 15;
    }

    // Split remaining sections into two columns
    const leftColumnX = margin;
    const rightColumnX = margin + columnWidth + columnGap;
    let leftY = yPosition;
    let rightY = yPosition;

    // WORK EXPERIENCE SECTION (Left column)
    if (data.experience && data.experience.length > 0) {
      leftY = addSectionHeader('Work Experience', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.experience.forEach((exp, index) => {
        leftY = checkPageBreak(80);
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(14);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(exp.title || 'Position Title', leftColumnX, leftY);
        leftY += 18;

        // Company and duration
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'bold');
        const companyDuration = `${exp.company || 'Company Name'} | ${exp.duration || 'Duration'}`;
        pdf.text(companyDuration, leftColumnX, leftY);
        leftY += 20;

        // Job description
        if (exp.description && exp.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          leftY = addWrappedText(exp.description, leftColumnX, leftY, columnWidth, 11, 1.4);
        }
        
        // Add spacing between experience entries
        leftY += 20;
      });
    }

    // RIGHT COLUMN: Education, skills, projects
    
    // EDUCATION SECTION
    if (data.education && data.education.length > 0) {
      rightY = addSectionHeader('Education', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.education.forEach((edu, index) => {
        rightY = checkPageBreak(60);
        
        // Degree
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', rightColumnX, rightY);
        rightY += 16;

        // Institution and year
        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(11);
        pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
        const institutionInfo = `${edu.institution || 'Institution'} | ${edu.year || 'Year'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(institutionInfo, rightColumnX, rightY);
        rightY += 20;
      });
    }

    // SKILLS SECTION
    if (data.skills && data.skills.length > 0) {
      rightY = addSectionHeader('Technical Skills', secondaryRgb, template?.typography.headingFont || 'helvetica');

      pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      pdf.setFontSize(11);
      pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
      
      data.skills.forEach((skill, index) => {
        pdf.text(`• ${skill}`, rightColumnX, rightY);
        rightY += 15;
      });
      
      rightY += 10;
    }

    // PROJECTS SECTION
    if (data.projects && data.projects.length > 0) {
      rightY = addSectionHeader('Projects', secondaryRgb, template?.typography.headingFont || 'helvetica');

      data.projects.forEach((project, index) => {
        rightY = checkPageBreak(100);
        
        // Project name
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont(template?.typography.headingFont || 'helvetica', 'bold');
        pdf.text(project.name || 'Project Name', rightColumnX, rightY);
        rightY += 16;

        // Project description
        if (project.description && project.description.trim()) {
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          rightY = addWrappedText(project.description, rightColumnX, rightY, columnWidth, 11, 1.4);
        }

        // Technologies used
        if (project.technologies && project.technologies.trim()) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'italic');
          rightY = addWrappedText(`Technologies: ${project.technologies}`, rightColumnX, rightY + 5, columnWidth, 10, 1.3);
        }

        // Project link
        if (project.link && project.link.trim()) {
          pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          pdf.setFontSize(10);
          pdf.setFont(template?.typography.bodyFont || 'helvetica', 'normal');
          pdf.text(`🔗 ${project.link}`, rightColumnX, rightY + 8);
          rightY += 15;
        }
        
        // Add spacing between projects
        rightY += 20;
      });
    }

    // Update yPosition to the maximum of leftY and rightY
    yPosition = Math.max(leftY, rightY);
  }

  // FOOTER
  yPosition = checkPageBreak(40);
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.setFont('helvetica', 'normal');
  const footerText = `Generated with CareerPanda - ${template?.name || 'Professional'} Template | ${new Date().toLocaleDateString()}`;
  pdf.text(footerText, margin, pageHeight - 30);

  // Save the PDF with proper filename
  const cleanName = (data.personalInfo.name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  const templateName = (template?.name || 'Professional').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_Resume_${templateName}.pdf`;
  pdf.save(fileName);
};
