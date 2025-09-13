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

  // Create PDF with A4 size
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
    
    return y + (lines.length * lineSpacing) + (fontSize * 0.5);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - margin - 60) {
      pdf.addPage();
      return margin + 20;
    }
    return yPosition;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, color: any, fontSize: number = 14): number => {
    yPosition = checkPageBreak(40);
    yPosition += 20;
    
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title.toUpperCase(), margin, yPosition);
    
    // Add underline
    pdf.setDrawColor(color.r, color.g, color.b);
    pdf.setLineWidth(1.5);
    const textWidth = pdf.getTextWidth(title.toUpperCase());
    pdf.line(margin, yPosition + 3, margin + Math.min(textWidth, contentWidth), yPosition + 3);
    
    return yPosition + 20;
  };

  // Set template colors
  const primaryRgb = hexToRgb(template.colors.primary);
  const secondaryRgb = hexToRgb(template.colors.secondary);
  const accentRgb = hexToRgb(template.colors.accent);
  const textRgb = hexToRgb(template.colors.text);

  // Generate PDF content exactly matching preview
  generateResumeContent();

  function generateResumeContent() {
    // HEADER - Name and Contact (exactly as in preview)
    pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
    pdf.rect(0, 0, pageWidth, 100, 'F');
    
    // Name in header
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    const nameText = data.personalInfo.name || 'Your Name';
    const nameWidth = pdf.getTextWidth(nameText);
    pdf.text(nameText, (pageWidth - nameWidth) / 2, 45);

    // Contact information centered
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const contactItems = [];
    if (data.personalInfo.email) contactItems.push(`📧 ${data.personalInfo.email}`);
    if (data.personalInfo.phone) contactItems.push(`📱 ${data.personalInfo.phone}`);
    if (data.personalInfo.location) contactItems.push(`📍 ${data.personalInfo.location}`);
    
    if (contactItems.length > 0) {
      const contactText = contactItems.join('  •  ');
      const contactWidth = pdf.getTextWidth(contactText);
      pdf.text(contactText, (pageWidth - contactWidth) / 2, 70);
    }

    // Social links
    const socialItems = [];
    if (data.personalInfo.linkedin) socialItems.push(`🔗 ${data.personalInfo.linkedin}`);
    if (data.personalInfo.github) socialItems.push(`💻 ${data.personalInfo.github}`);
    
    if (socialItems.length > 0) {
      const socialText = socialItems.join('  •  ');
      const socialWidth = pdf.getTextWidth(socialText);
      pdf.text(socialText, (pageWidth - socialWidth) / 2, 85);
    }

    yPosition = 120;

    // PROFESSIONAL SUMMARY
    if (data.personalInfo.summary && data.personalInfo.summary.trim()) {
      yPosition = addSectionHeader('Professional Summary', primaryRgb, 16);
      yPosition = addWrappedText(data.personalInfo.summary, margin, yPosition, contentWidth, 11, 1.5, 'normal', textRgb);
      yPosition += 15;
    }

    // WORK EXPERIENCE
    if (data.experience && data.experience.length > 0) {
      yPosition = addSectionHeader('Work Experience', primaryRgb, 16);

      data.experience.forEach((exp, index) => {
        yPosition = checkPageBreak(100);
        
        // Job title
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(14);
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
        
        yPosition += 20;

        // Company
        pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.company || 'Company Name', margin, yPosition);
        yPosition += 18;

        // Description
        if (exp.description && exp.description.trim()) {
          yPosition = addWrappedText(exp.description, margin, yPosition, contentWidth, 10, 1.4, 'normal', textRgb);
        }
        
        yPosition += 20;
      });
    }

    // EDUCATION
    if (data.education && data.education.length > 0) {
      yPosition = addSectionHeader('Education', primaryRgb, 16);

      data.education.forEach((edu) => {
        yPosition = checkPageBreak(80);
        
        // Degree
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(edu.degree || 'Degree', margin, yPosition);
        
        // Year on the right
        if (edu.year) {
          const yearWidth = pdf.getTextWidth(edu.year);
          pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          pdf.text(edu.year, pageWidth - margin - yearWidth, yPosition);
        }
        
        yPosition += 18;

        // Institution and GPA
        pdf.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const eduDetails = `${edu.institution || 'Institution'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`;
        pdf.text(eduDetails, margin, yPosition);
        yPosition += 25;
      });
    }

    // SKILLS
    if (data.skills && data.skills.length > 0) {
      yPosition = addSectionHeader('Technical Skills', primaryRgb, 16);

      // Create skill badges layout
      const skillsPerRow = 4;
      const skillWidth = (contentWidth - 30) / skillsPerRow;
      let currentRow = 0;
      let currentCol = 0;

      data.skills.forEach((skill, index) => {
        if (currentCol >= skillsPerRow) {
          currentCol = 0;
          currentRow++;
        }

        const x = margin + (currentCol * skillWidth);
        const y = yPosition + (currentRow * 25);

        // Check for page break
        if (y > pageHeight - margin - 60) {
          pdf.addPage();
          yPosition = margin + 20;
          currentRow = 0;
        }

        // Skill background
        pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.roundedRect(x, y - 12, skillWidth - 10, 18, 3, 3, 'F');
        
        // Skill text
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const skillText = skill.length > 12 ? skill.substring(0, 12) + '...' : skill;
        const textWidth = pdf.getTextWidth(skillText);
        pdf.text(skillText, x + (skillWidth - 10 - textWidth) / 2, y);

        currentCol++;
      });

      yPosition += (currentRow + 1) * 25 + 15;
    }

    // PROJECTS
    if (data.projects && data.projects.length > 0) {
      yPosition = addSectionHeader('Projects', primaryRgb, 16);

      data.projects.forEach((project) => {
        yPosition = checkPageBreak(120);
        
        // Project name
        pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.text(project.name || 'Project Name', margin, yPosition);
        yPosition += 18;

        // Description
        if (project.description && project.description.trim()) {
          yPosition = addWrappedText(project.description, margin, yPosition, contentWidth, 10, 1.4, 'normal', textRgb);
        }

        // Technologies
        if (project.technologies && project.technologies.trim()) {
          pdf.setTextColor(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          yPosition = addWrappedText(`Technologies: ${project.technologies}`, margin, yPosition + 5, contentWidth, 9, 1.3, 'italic', secondaryRgb);
        }

        // Project link
        if (project.link && project.link.trim()) {
          pdf.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`🔗 ${project.link}`, margin, yPosition + 8);
          yPosition += 12;
        }
        
        yPosition += 20;
      });
    }
  }

  // Save the PDF with proper filename
  const cleanName = (data.personalInfo.name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${cleanName}_Resume.pdf`;
  pdf.save(fileName);
};