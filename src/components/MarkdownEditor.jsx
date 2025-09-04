import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Eye, Download, Sun, Moon, Sparkles, Zap, Edit, Maximize, Minimize } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor! 🚀

## Features
- **Real-time preview**
- *Italic text*
- ~~Strikethrough~~
- \`Inline code\`

### Code Block
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists
1. First item
2. Second item
   - Nested item
   - Another nested item

### Links & Images
[Visit React](https://reactjs.org/)

### Tables
| Feature | Status |
|---------|--------|
| Editor  | ✅     |
| Preview | ✅     |
| Export  | ✅     |

> This is a blockquote with **bold** text.

---

**Happy writing!** ✨`);
  
  const [darkMode, setDarkMode] = useState(false);
  const [mobileView, setMobileView] = useState('editor');
  const [fullscreenEditor, setFullscreenEditor] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const previewRef = useRef(null);

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  const downloadPDF = async () => {
    try {
      // Import jsPDF dynamically
      const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      
      // Get the rendered HTML content from the preview
      const previewElement = previewRef.current;
      if (!previewElement) return;
      
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up the PDF styling
      pdf.setFont('helvetica');
      
      // Convert HTML content to text and add to PDF
      const textContent = previewElement.innerText || markdown;
      const lines = textContent.split('\n');
      
      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;
      
      lines.forEach((line, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Handle different text types
        if (line.startsWith('# ')) {
          // Main heading
          pdf.setFontSize(20);
          pdf.setTextColor(37, 99, 235); // Blue
          pdf.text(line.substring(2), margin, yPosition);
          yPosition += 12;
        } else if (line.startsWith('## ')) {
          // Subheading
          pdf.setFontSize(16);
          pdf.setTextColor(124, 58, 237); // Purple
          pdf.text(line.substring(3), margin, yPosition);
          yPosition += 10;
        } else if (line.startsWith('### ')) {
          // Sub-subheading
          pdf.setFontSize(14);
          pdf.setTextColor(5, 150, 105); // Green
          pdf.text(line.substring(4), margin, yPosition);
          yPosition += 8;
        } else if (line.startsWith('> ')) {
          // Blockquote
          pdf.setFontSize(11);
          pdf.setTextColor(100, 100, 100);
          const wrappedText = pdf.splitTextToSize(line.substring(2), 160);
          pdf.text(wrappedText, margin + 10, yPosition);
          yPosition += wrappedText.length * lineHeight;
        } else if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
          // List items
          pdf.setFontSize(12);
          pdf.setTextColor(51, 51, 51);
          const wrappedText = pdf.splitTextToSize(line, 160);
          pdf.text(wrappedText, margin + 5, yPosition);
          yPosition += wrappedText.length * lineHeight;
        } else if (line.startsWith('```')) {
          // Code block marker - skip
          return;
        } else if (line.trim() === '---') {
          // Horizontal rule
          pdf.setDrawColor(229, 231, 235);
          pdf.line(margin, yPosition, 190, yPosition);
          yPosition += 8;
        } else if (line.trim() !== '') {
          // Regular paragraph
          pdf.setFontSize(12);
          pdf.setTextColor(51, 51, 51);
          const wrappedText = pdf.splitTextToSize(line, 160);
          pdf.text(wrappedText, margin, yPosition);
          yPosition += Math.max(wrappedText.length * lineHeight, lineHeight);
        } else {
          // Empty line
          yPosition += lineHeight / 2;
        }
      });
      
      // Download the PDF
      pdf.save('markdown-document.pdf');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to the print method if jsPDF fails
      fallbackDownload();
    }
  };

  const fallbackDownload = () => {
    // Fallback method using print dialog
    const printWindow = window.open('', '_blank');
    const previewContent = previewRef.current?.innerHTML || '';
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Markdown Document</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
          }
          h1 { color: #2563eb; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; }
          h2 { color: #7c3aed; }
          h3 { color: #059669; }
          code { background-color: #f3f4f6; color: #dc2626; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
          pre { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 1rem; border-radius: 0.5rem; }
          blockquote { border-left: 4px solid #3b82f6; background-color: #f8fafc; padding: 1rem; margin: 1rem 0; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #d1d5db; padding: 0.5rem 1rem; }
          th { background-color: #f9fafb; font-weight: 600; }
        </style>
      </head>
      <body>${previewContent}</body>
      </html>
    `;
    
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  // Theme classes
  const themeClasses = {
    container: darkMode 
      ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
      : 'bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 text-gray-900',
    toolbar: darkMode
      ? 'bg-slate-800/80 backdrop-blur-xl border-slate-700/50 text-white'
      : 'bg-white/80 backdrop-blur-xl border-orange-200/50 text-gray-900',
    button: darkMode
      ? 'bg-purple-600/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30'
      : 'bg-orange-500/20 hover:bg-orange-400/30 text-orange-700 border border-orange-300/50',
    downloadBtn: darkMode
      ? 'bg-green-600/20 hover:bg-green-500/30 text-green-300 border border-green-500/30'
      : 'bg-pink-500/20 hover:bg-pink-400/30 text-pink-700 border border-pink-300/50',
    panelHeader: darkMode
      ? 'bg-slate-800/50 border-slate-700/30 text-purple-300'
      : 'bg-white/50 border-orange-200/30 text-orange-700',
    textarea: darkMode
      ? 'bg-slate-800/50 border-slate-700/30 text-white placeholder-slate-400'
      : 'bg-white/50 border-orange-200/30 text-gray-900 placeholder-gray-500',
    preview: darkMode
      ? 'bg-slate-800/30 border-slate-700/30'
      : 'bg-white/30 border-orange-200/30',
    mobileToggle: darkMode
      ? 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/10'
      : 'text-gray-600 hover:text-orange-700 hover:bg-orange-100/50',
    activeMobileToggle: darkMode
      ? 'text-purple-300 bg-purple-500/20 border-b-2 border-purple-400'
      : 'text-orange-700 bg-orange-100/50 border-b-2 border-orange-500'
  };

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${darkMode ? '#1e293b' : '#f1f5f9'};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${darkMode ? '#6366f1' : '#f97316'};
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${darkMode ? '#4f46e5' : '#ea580c'};
    }
    
    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(120deg); }
      66% { transform: translateY(-10px) rotate(240deg); }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px ${darkMode ? '#8b5cf6' : '#f97316'}; }
      50% { box-shadow: 0 0 20px ${darkMode ? '#a855f7' : '#fb923c'}, 0 0 30px ${darkMode ? '#8b5cf6' : '#f97316'}; }
    }
    
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-glow {
      animation: glow 2s ease-in-out infinite alternate;
    }
    
    .text-shimmer {
      background: linear-gradient(90deg, ${darkMode ? '#a855f7, #06b6d4, #10b981' : '#f97316, #ec4899, #eab308'});
      background-size: 200% 200%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
    }
    
    .hover-lift {
      transition: transform 0.2s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
    }
    
    .glass-morphism {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    /* Prose styling for markdown */
    .prose-custom h1 {
      color: ${darkMode ? '#a855f7' : '#f97316'};
      border-bottom: 2px solid ${darkMode ? '#8b5cf6' : '#fb923c'};
      padding-bottom: 0.5rem;
    }
    
    .prose-custom h2 {
      color: ${darkMode ? '#06b6d4' : '#ec4899'};
    }
    
    .prose-custom h3 {
      color: ${darkMode ? '#10b981' : '#eab308'};
    }
    
    .prose-custom code {
      background-color: ${darkMode ? '#374151' : '#f3f4f6'};
      color: ${darkMode ? '#fbbf24' : '#dc2626'};
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      font-size: 0.875em;
    }
    
    .prose-custom pre {
      background-color: ${darkMode ? '#1f2937' : '#f9fafb'};
      border: 1px solid ${darkMode ? '#4b5563' : '#e5e7eb'};
      border-radius: 0.5rem;
    }
    
    .prose-custom pre code {
      background-color: transparent;
      color: ${darkMode ? '#f3f4f6' : '#374151'};
    }
    
    .prose-custom blockquote {
      border-left: 4px solid ${darkMode ? '#8b5cf6' : '#f97316'};
      background-color: ${darkMode ? '#1e293b' : '#fff7ed'};
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 0.25rem;
    }
    
    .prose-custom table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
    }
    
    .prose-custom th,
    .prose-custom td {
      border: 1px solid ${darkMode ? '#4b5563' : '#d1d5db'};
      padding: 0.5rem 1rem;
      text-align: left;
    }
    
    .prose-custom th {
      background-color: ${darkMode ? '#374151' : '#f9fafb'};
      font-weight: 600;
    }
  `;

  // Custom markdown components
  const markdownComponents = {
    h1: ({ children }) => (
      <h1 className={`text-3xl font-bold mb-4 pb-2 border-b-2 ${darkMode ? 'text-purple-400 border-purple-500' : 'text-orange-600 border-orange-400'}`}>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className={`text-2xl font-semibold mb-3 mt-6 ${darkMode ? 'text-cyan-400' : 'text-pink-600'}`}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className={`text-xl font-semibold mb-2 mt-4 ${darkMode ? 'text-green-400' : 'text-yellow-600'}`}>
        {children}
      </h3>
    ),
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <pre className={`${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-gray-300'} border rounded-lg p-4 overflow-x-auto my-4`}>
          <code className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} text-sm`} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={`${darkMode ? 'bg-slate-700 text-yellow-300' : 'bg-gray-200 text-red-600'} px-1 py-0.5 rounded text-sm`} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 ${darkMode ? 'border-purple-500 bg-slate-800/50' : 'border-orange-400 bg-orange-50/50'} pl-4 py-2 my-4 italic`}>
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className={`w-full border-collapse border ${darkMode ? 'border-slate-600' : 'border-gray-300'}`}>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className={`border ${darkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-100'} px-4 py-2 text-left font-semibold`}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className={`border ${darkMode ? 'border-slate-600' : 'border-gray-300'} px-4 py-2`}>
        {children}
      </td>
    ),
  };

  return (
    <div className={`h-screen ${themeClasses.container} relative overflow-hidden`}>
      <style>{scrollbarStyles}</style>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${darkMode ? 'bg-purple-500' : 'bg-orange-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float`}></div>
        <div className={`absolute top-3/4 right-1/4 w-64 h-64 ${darkMode ? 'bg-blue-500' : 'bg-pink-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float`} style={{ animationDelay: '2s' }}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-64 h-64 ${darkMode ? 'bg-green-500' : 'bg-yellow-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float`} style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="flex flex-col h-full relative z-10">
        {/* Toolbar */}
        <div className={`flex justify-between items-center px-6 py-4 border-b shadow-sm glass-morphism ${themeClasses.toolbar} hover-lift`}>
          <h1 className={`lg:text-2xl md:text-xl text-lg font-bold tracking-tight text-shimmer flex items-center`}>
            <Edit3 className="w-6 h-6 inline-block mr-3 px-1 py-1 rounded-full text-white bg-cyan-600" />
            <Sparkles className="w-4 h-4 mr-2" />
            Markdown Editor
            <Zap className="w-4 h-4 ml-2" />
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-2 py-2 rounded-full font-medium transition-all duration-300 hover-lift animate-glow ${themeClasses.button}`}
            >
              {darkMode ? <Sun size={18} className="animate-spin stroke-3" style={{ animationDuration: '8s' }} /> : <Moon size={18} className="animate-pulse stroke-3" />}
            </button>
            <button
              onClick={downloadPDF}
              className={`flex items-center gap-2 px-2 py-2 rounded-full font-medium transition-all duration-300 hover-lift animate-glow ${themeClasses.downloadBtn}`}
            >
              <Download size={16} className="animate-bounce font-bold stroke-3" style={{ animationDuration: '2s' }} />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className={`md:hidden flex border-b glass-morphism ${themeClasses.toolbar}`}>
          <button
            onClick={() => setMobileView('editor')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all duration-300 hover-lift ${
              mobileView === 'editor' ? themeClasses.activeMobileToggle : themeClasses.mobileToggle
            }`}
          >
            <Edit size={16} className={mobileView === 'editor' ? 'animate-pulse' : ''} />
            Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all duration-300 hover-lift ${
              mobileView === 'preview' ? themeClasses.activeMobileToggle : themeClasses.mobileToggle
            }`}
          >
            <Eye size={16} className={mobileView === 'preview' ? 'animate-pulse' : ''} />
            Preview
          </button>
        </div>

        {/* Editor + Preview */}
        <div className="flex flex-row flex-1 overflow-hidden relative">
          {/* Left: Markdown Input */}
          <div className={`${fullscreenEditor ? "fixed inset-0 z-20 flex flex-col" : "md:w-1/2 w-full"} h-full ${mobileView === 'preview' ? 'hidden md:block' : ''}`}>
            {fullscreenEditor && (
              <div className={`px-6 py-4 border-b shadow-sm glass-morphism ${themeClasses.toolbar}`}>
                <div className="flex justify-between items-center">
                  <h1 className={`lg:text-2xl md:text-xl text-lg font-mono font-bold tracking-tight text-shimmer`}>
                    Editor View
                  </h1>
                  <button
                    onClick={() => setFullscreenEditor(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${themeClasses.button}`}
                  >
                    <Minimize size={18} />
                  </button>
                </div>
              </div>
            )}
            <div className={`flex-1 flex flex-col ${themeClasses.container}`}>
              {!fullscreenEditor && (
                <div className={`px-4 py-3 flex justify-between items-center border-b glass-morphism hover-lift ${themeClasses.panelHeader}`}>
                  <h2 className={`lg:text-xl md:text-lg text-base font-mono font-semibold flex items-center`}>
                    <Edit3 className="w-4 h-4 mr-2 animate-pulse" />
                    Md-Input
                  </h2>
                  <button
                    onClick={() => setFullscreenEditor(true)}
                    className={`p-2 rounded-full transition-all duration-300 hover-lift hidden md:block ${themeClasses.button}`}
                    title="Fullscreen Editor"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              )}
              <div className="flex-1 p-2">
                <textarea
                  className={`flex-1 w-full h-full resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-4 ${darkMode ? 'focus:ring-purple-500/50' : 'focus:ring-orange-400/50'} ${themeClasses.textarea} custom-scrollbar rounded-xl transition-all duration-300`}
                  style={{
                    padding: '24px',
                    minHeight: 'calc(100vh - 250px)',
                    boxSizing: 'border-box'
                  }}
                  value={markdown}
                  onChange={handleMarkdownChange}
                  placeholder="✨ Write your magical markdown here..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          {!fullscreenEditor && !fullscreenPreview && (
            <div className={`w-px bg-gradient-to-b ${darkMode ? 'from-purple-500/50 via-blue-500/50 to-green-500/50' : 'from-orange-400/50 via-pink-400/50 to-yellow-400/50'} hidden md:block shadow-lg`}></div>
          )}

          {/* Right: Preview */}
          <div className={`${fullscreenPreview ? "fixed inset-0 z-20 flex flex-col" : "md:w-1/2 w-full"} h-full ${fullscreenEditor ? 'hidden' : ''} ${mobileView === 'editor' ? 'hidden md:block' : ''}`}>
            {fullscreenPreview && (
              <div className={`px-6 py-4 border-b shadow-sm glass-morphism ${themeClasses.toolbar}`}>
                <div className="flex justify-between items-center">
                  <h1 className={`lg:text-2xl md:text-xl text-lg font-mono font-bold tracking-tight text-shimmer`}>
                    Preview
                  </h1>
                  <button
                    onClick={() => setFullscreenPreview(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover-lift ${themeClasses.button}`}
                  >
                    <Minimize size={18} />
                  </button>
                </div>
              </div>
            )}
            <div className={`flex-1 flex flex-col ${themeClasses.container}`}>
              {!fullscreenPreview && (
                <div className={`px-4 py-3 flex justify-between items-center border-b glass-morphism hover-lift ${themeClasses.panelHeader}`}>
                  <h2 className={`lg:text-xl font-mono md:text-lg text-base font-semibold flex items-center`}>
                    <Eye className="w-4 h-4 mr-2 animate-pulse" />
                    Preview
                  </h2>
                  <button
                    onClick={() => setFullscreenPreview(true)}
                    className={`p-2 rounded-full transition-all duration-300 hover-lift hidden md:block ${themeClasses.button}`}
                    title="Fullscreen Preview"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              )}
              <div className="flex-1 p-2">
                <div
                  ref={previewRef}
                  className={`flex-1 h-full overflow-y-auto overflow-x-hidden custom-scrollbar ${themeClasses.preview} rounded-xl prose-custom`}
                  style={{
                    padding: '24px',
                    height: 'calc(100vh - 250px)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className="max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={markdownComponents}
                    >
                      {markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;