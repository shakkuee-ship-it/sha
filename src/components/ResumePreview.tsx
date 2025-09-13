import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { ResumeData } from '../utils/pdfGenerator';
import { getTemplateById } from '../data/resumeTemplates';
import { generateResumePDF } from '../utils/pdfGenerator';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string;
  onDownload: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
  onDownload
}) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const template = getTemplateById(templateId);

  if (!isOpen || !template) return null;

  const getPreviewClasses = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-[600px]';
      case 'tablet':
        return 'w-96 h-[500px]';
      default:
        return 'w-full max-w-4xl h-[700px]';
    }
  };

  const handleDownloadResume = () => {
    generateResumePDF(resumeData, templateId);
  };
  const handleDownloadReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80);
    doc.text('AI Resume Analysis', 15, 20);

    doc.setFontSize(14);
    doc.setTextColor(39, 174, 96);
    doc.text(`ATS Score: ${template.atsScore}`, 15, 35);
    doc.setTextColor(241, 196, 15);
    doc.text(`Overall Rating: ${template.overallRating}/10`, 80, 35);

    let y = 50;
    doc.setFontSize(12);
    doc.setTextColor(41, 128, 185);
    doc.text('Strengths:', 15, y);
    y += 7;
    template.strengths.forEach((s) => {
      doc.setTextColor(39, 174, 96);
      doc.text(`• ${s}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(231, 76, 60);
    doc.text('Areas for Improvement:', 15, y);
    y += 7;
    template.weaknesses.forEach((w) => {
      doc.setTextColor(231, 76, 60);
      doc.text(`• ${w}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(155, 89, 182);
    doc.text('Actionable Suggestions:', 15, y);
    y += 7;
    template.suggestions.forEach((s) => {
      doc.setTextColor(155, 89, 182);
      doc.text(`• ${s}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(41, 128, 185);
    doc.text('Job Matches:', 15, y);
    y += 7;
    template.jobMatches.forEach((j) => {
      doc.setTextColor(41, 128, 185);
      doc.text(`• ${j}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(243, 156, 18);
    doc.text('Skill Gaps:', 15, y);
    y += 7;
    template.skillGaps.forEach((g) => {
      doc.setTextColor(243, 156, 18);
      doc.text(`• ${g}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(52, 73, 94);
    doc.text('Industry Trends:', 15, y);
    y += 7;
    template.industryTrends.forEach((t) => {
      doc.setTextColor(52, 73, 94);
      doc.text(`• ${t}`, 20, y);
      y += 7;
    });
    y += 3;
    doc.setTextColor(39, 174, 96);
    doc.text('Salary Insights:', 15, y);
    y += 7;
    doc.setTextColor(39, 174, 96);
    doc.text(template.salaryInsights, 20, y);
    y += 10;
    doc.setTextColor(231, 76, 60);
    doc.text('Recommended Keywords:', 15, y);
    y += 7;
    template.keywords.forEach((k) => {
      doc.setTextColor(231, 76, 60);
      doc.text(`• ${k}`, 20, y);
      y += 7;
    });
    doc.save('AI_Resume_Report.pdf');
  };

  // Generate preview HTML that matches the PDF output
  const generatePreviewHTML = () => {
    const primaryColor = template.colors.primary;
    const secondaryColor = template.colors.secondary;
    const textColor = template.colors.text;
    
    return `
      <div style="font-family: 'Inter', sans-serif; background: white; color: ${textColor}; padding: 40px; max-width: 800px; margin: 0 auto;">
        <!-- Header with gradient background -->
        <div style="background: ${primaryColor}; color: white; padding: 40px; text-align: center; border-radius: 0; margin: -40px -40px 30px -40px;">
          <h1 style="font-size: 2.5rem; font-weight: bold; margin: 0 0 10px 0;">${resumeData.personalInfo.name || 'Your Name'}</h1>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 0.9rem; margin-top: 15px;">
            ${resumeData.personalInfo.email ? `<span>📧 ${resumeData.personalInfo.email}</span>` : ''}
            ${resumeData.personalInfo.phone ? `<span>📱 ${resumeData.personalInfo.phone}</span>` : ''}
            ${resumeData.personalInfo.location ? `<span>📍 ${resumeData.personalInfo.location}</span>` : ''}
          </div>
          ${resumeData.personalInfo.linkedin || resumeData.personalInfo.github ? `
          <div style="display: flex; justify-content: center; gap: 20px; margin-top: 10px; font-size: 0.9rem;">
            ${resumeData.personalInfo.linkedin ? `<span>🔗 ${resumeData.personalInfo.linkedin}</span>` : ''}
            ${resumeData.personalInfo.github ? `<span>💻 ${resumeData.personalInfo.github}</span>` : ''}
          </div>
          ` : ''}
        </div>
        
        ${resumeData.personalInfo.summary ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: ${primaryColor}; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px;">Professional Summary</h2>
          <p style="line-height: 1.6; font-size: 0.95rem;">${resumeData.personalInfo.summary}</p>
        </section>
        ` : ''}
        
        ${resumeData.experience.length > 0 ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: ${primaryColor}; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px;">Work Experience</h2>
          ${resumeData.experience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="color: ${primaryColor}; font-size: 1.1rem; font-weight: bold; margin: 0;">${exp.title}</h3>
                <span style="font-size: 0.9rem; color: ${textColor};">${exp.duration}</span>
              </div>
              <p style="color: ${secondaryColor}; font-weight: bold; margin: 0 0 8px 0; font-size: 1rem;">${exp.company}</p>
              <p style="line-height: 1.5; font-size: 0.9rem; margin: 0;">${exp.description}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}
        
        ${resumeData.education.length > 0 ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: ${primaryColor}; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px;">Education</h2>
          ${resumeData.education.map(edu => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h3 style="color: ${primaryColor}; font-size: 1rem; font-weight: bold; margin: 0;">${edu.degree}</h3>
                <span style="font-size: 0.9rem; color: ${textColor};">${edu.year}</span>
              </div>
              <p style="font-size: 0.95rem; margin: 0; color: ${textColor};">${edu.institution}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
            </div>
          `).join('')}
        </section>
        ` : ''}
        
        ${resumeData.skills.length > 0 ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: ${primaryColor}; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px;">Technical Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${resumeData.skills.map(skill => `
              <span style="background: ${primaryColor}; color: white; padding: 6px 12px; border-radius: 15px; font-size: 0.8rem; font-weight: bold;">${skill}</span>
            `).join('')}
          </div>
        </section>
        ` : ''}
        
        ${resumeData.projects && resumeData.projects.length > 0 ? `
        <section style="margin-bottom: 30px;">
          <h2 style="color: ${primaryColor}; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid ${primaryColor}; padding-bottom: 5px;">Projects</h2>
          ${resumeData.projects.map(project => `
            <div style="margin-bottom: 20px;">
              <h3 style="color: ${primaryColor}; font-size: 1rem; font-weight: bold; margin: 0 0 5px 0;">${project.name}</h3>
              <p style="line-height: 1.5; font-size: 0.9rem; margin: 0 0 5px 0;">${project.description}</p>
              ${project.technologies ? `<p style="color: ${secondaryColor}; font-size: 0.8rem; font-style: italic; margin: 0;">Technologies: ${project.technologies}</p>` : ''}
              ${project.link ? `<p style="color: ${primaryColor}; font-size: 0.8rem; margin: 5px 0 0 0;">🔗 ${project.link}</p>` : ''}
            </div>
          `).join('')}
        </section>
        ` : ''}
      </div>
    `;
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume Preview
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {template.name} Template • ATS Score: {template.atsScore}%
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Selector */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {[
                { mode: 'desktop' as const, icon: Monitor },
                { mode: 'tablet' as const, icon: Tablet },
                { mode: 'mobile' as const, icon: Smartphone }
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  aria-label={`Switch to ${mode} view`}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            {/* Actions */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadResume}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Resume</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>AI Report</span>
            </motion.button>
            <button
              aria-label="Close preview"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-center">
            <div className={`${getPreviewClasses()} bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300`}>
              <div className="w-full h-full overflow-auto">
                <div 
                  dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: template.colors.primary }}
              />
              <span>{template.category} Template</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Press ESC to close
          </div>
        </div>

        {/* AI Report Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-lg p-4 sm:p-8 mb-8 border border-blue-200 dark:border-blue-700 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-950">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl shadow-lg">🤖</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight">AI Resume Analysis</h2>
            </div>
            <button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-colors text-base sm:text-lg"
            >
              <span className="mr-2">⬇️</span> Download PDF
            </button>
          </div>
          {/* AI Report Content - use creative, colorful, modern layout with icons and badges */}
          <div className="space-y-6">
            {/* Example: ATS Score */}
            <div className="flex items-center gap-3">
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-lg shadow">{template.atsScore} ATS</span>
              <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-lg shadow">{template.overallRating}/10 ⭐</span>
            </div>
            {/* Strengths */}
            <div>
              <h3 className="font-bold text-blue-600 mb-1 flex items-center gap-2"><span>💪</span> Strengths</h3>
              <ul className="list-disc ml-6 text-green-700">
                {template.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            {/* Areas for Improvement */}
            <div>
              <h3 className="font-bold text-pink-600 mb-1 flex items-center gap-2"><span>⚡</span> Areas for Improvement</h3>
              <ul className="list-disc ml-6 text-pink-700">
                {template.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
            {/* Suggestions */}
            <div>
              <h3 className="font-bold text-purple-600 mb-1 flex items-center gap-2"><span>💡</span> Actionable Suggestions</h3>
              <ul className="list-disc ml-6 text-purple-700">
                {template.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            {/* Job Matches, Skill Gaps, Industry Trends, Salary Insights, Keywords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <h4 className="font-bold text-blue-500 mb-2 flex items-center gap-2"><span>🔎</span> Job Matches</h4>
                <ul className="list-disc ml-6 text-blue-700">
                  {template.jobMatches.map((j, i) => <li key={i}>{j}</li>)}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <h4 className="font-bold text-orange-500 mb-2 flex items-center gap-2"><span>🧩</span> Skill Gaps</h4>
                <ul className="list-disc ml-6 text-orange-700">
                  {template.skillGaps.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <h4 className="font-bold text-indigo-500 mb-2 flex items-center gap-2"><span>🌐</span> Industry Trends</h4>
                <ul className="list-disc ml-6 text-indigo-700">
                  {template.industryTrends.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
                <h4 className="font-bold text-green-500 mb-2 flex items-center gap-2"><span>💰</span> Salary Insights</h4>
                <p className="text-green-700">{template.salaryInsights}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow col-span-1 sm:col-span-2">
                <h4 className="font-bold text-pink-500 mb-2 flex items-center gap-2"><span>🏷️</span> Recommended Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {template.keywords.map((k, i) => <span key={i} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-semibold">{k}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
};

export default ResumePreview;