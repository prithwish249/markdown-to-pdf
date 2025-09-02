import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sun, Moon, Download, Maximize, Minimize, Edit3 } from "lucide-react";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

## Features
- Live preview
- Dark/Light mode with custom colors
- PDF export with exact preview styling
- GitHub Flavored Markdown support

### Sample Content
Here's some **bold text** and *italic text*.

\`\`\`javascript
const hello = () => {
  console.log("Hello World!");
};
\`\`\`

> This is a blockquote

- [ ] Todo item 1
- [x] Completed item
- [ ] Todo item 2

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
| Data 3   | Data 4   |
`);

  const [darkMode, setDarkMode] = useState(false);
  const [fullscreenEditor, setFullscreenEditor] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const previewRef = useRef(null);

  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
  };

  // Simple PDF download function using browser's print functionality
  const downloadPDF = () => {
    if (!previewRef.current) return;

    try {
      // Create a new window with the preview content
      const printWindow = window.open('', '_blank');
      const previewContent = previewRef.current.innerHTML;

      const styles = `
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          pre { 
            background: #f5f5f5;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
          }
          code { 
            background: #f5f5f5;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
          blockquote {
            border-left: 4px solid #ddd;
            margin: 16px 0;
            padding-left: 16px;
            color: #666;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background: #f5f5f5;
            font-weight: bold;
          }
        </style>
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Markdown Export</title>
          ${styles}
        </head>
        <body>
          ${previewContent}
        </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const themeClasses = darkMode
    ? {
      container: "bg-gray-900 text-green-400",
      toolbar: "bg-gray-800 border-gray-700",
      textarea: "bg-gray-800 border-gray-600 text-green-300 placeholder-green-600",
      preview: "bg-gray-800 text-green-400",
      button: "bg-gray-700 hover:bg-gray-600 text-green-400 border border-gray-600",
      downloadBtn: "bg-green-600 hover:bg-green-700 text-gray-900 border border-green-500",
      scrollbar: "scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-700",
      panelHeader: "bg-gray-750 border-b border-gray-600"
    }
    : {
      container: "bg-white text-orange-900",
      toolbar: "bg-orange-50 border-orange-200",
      textarea: "bg-white text-black placeholder-gray-400 ",
      preview: "bg-white text-gray-900",
      button: "bg-orange-200 hover:bg-orange-300 text-gray-900 border border-orange-300",
      downloadBtn: "bg-orange-500 hover:bg-orange-600 text-white border border-orange-400",
      scrollbar: "scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-orange-200",
      panelHeader: "bg-orange-100 border-b border-orange-200"
    };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { 
      width: 12px; 
    } 
    .custom-scrollbar::-webkit-scrollbar-thumb { 
      background: ${darkMode ? '#4CAF50' : '#FFA500'}; 
      border-radius: 6px; 
      border: 2px solid ${darkMode ? '#2f2f2f' : '#FFF3E0'};
    } 
    .custom-scrollbar::-webkit-scrollbar-track { 
      background: ${darkMode ? '#2f2f2f' : '#FFF3E0'}; 
      border-radius: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${darkMode ? '#66BB6A' : '#FF8F00'};
    }
    textarea.custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${darkMode ? '#4CAF50' : '#FFA500'};
      border: 2px solid ${darkMode ? '#374151' : '#ffffff'};
    }
    textarea.custom-scrollbar::-webkit-scrollbar-track {
      background: ${darkMode ? '#374151' : '#ffffff'};
    }
  `;

  return (
    <div className={`h-screen ${themeClasses.container} relative`}>
      <style>{scrollbarStyles}</style>
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className={`flex justify-between items-center px-6 py-4 border-b shadow-sm ${themeClasses.toolbar}`}>


          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-green-300' : 'text-orange-700'}`}>
            <Edit3 className="w-6 h-6 inline-block mr-2" /> {/* Icon with some margin to the right */}
            Markdown Editor
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${themeClasses.button}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={downloadPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${themeClasses.downloadBtn}`}
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>

        </div>

        {/* Editor + Preview */}
        <div className="flex flex-row flex-1 overflow-hidden relative">
          {/* Left: Markdown Input */}
          <div className={`${fullscreenEditor ? "fixed inset-0 z-20 flex flex-col" : "w-1/2"} h-full`}>
            {fullscreenEditor && (
              <div className={`px-6 py-4 border-b shadow-sm ${themeClasses.toolbar}`}>
                <div className="flex justify-between items-center">
                  <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-green-300' : 'text-orange-700'}`}>
                    Markdown Editor - Editor View
                  </h1>
                  <button
                    onClick={() => setFullscreenEditor(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${themeClasses.button}`}
                  >
                    <Minimize size={18} />
                    Exit Fullscreen
                  </button>
                </div>
              </div>
            )}
            <div className={`flex-1 flex flex-col ${themeClasses.container}`}>
              {!fullscreenEditor && (
                <div className={`px-4 py-3 flex justify-between items-center border-b ${themeClasses.panelHeader}`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-green-300' : 'text-orange-800'}`}>
                    Markdown Input
                  </h2>
                  <button
                    onClick={() => setFullscreenEditor(true)}
                    className={`p-2 rounded-md transition-colors ${themeClasses.button}`}
                    title="Fullscreen Editor"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              )}
              <textarea
                className={`flex-1 w-full resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-green-500' : 'focus:ring-orange-400'} ${themeClasses.textarea} custom-scrollbar`}
                style={{
                  padding: '20px',
                  minHeight: 'calc(100vh - 200px)',
                  height: 'calc(100vh - 200px)',
                  boxSizing: 'border-box'
                }}
                value={markdown}
                onChange={handleMarkdownChange}
                placeholder="Write your markdown here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Vertical Divider */}
          {!fullscreenEditor && !fullscreenPreview && (
            <div className={`w-px ${darkMode ? 'bg-gray-700' : 'bg-orange-200'}`}></div>
          )}

          {/* Right: Preview */}
          <div className={`${fullscreenPreview ? "fixed inset-0 z-20 flex flex-col" : "w-1/2"} h-full ${fullscreenEditor ? 'hidden' : ''}`}>
            {fullscreenPreview && (
              <div className={`px-6 py-4 border-b shadow-sm ${themeClasses.toolbar}`}>
                <div className="flex justify-between items-center">
                  <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-green-300' : 'text-orange-700'}`}>
                    Markdown Editor - Preview
                  </h1>
                  <button
                    onClick={() => setFullscreenPreview(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md ${themeClasses.button}`}
                  >
                    <Minimize size={18} />
                    Exit Fullscreen
                  </button>
                </div>
              </div>
            )}
            <div className={`flex-1 flex flex-col ${themeClasses.container}`}>
              {!fullscreenPreview && (
                <div className={`px-4 py-3 flex justify-between items-center border-b ${themeClasses.panelHeader}`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-green-300' : 'text-orange-800'}`}>
                    Preview
                  </h2>
                  <button
                    onClick={() => setFullscreenPreview(true)}
                    className={`p-2 rounded-md transition-colors ${themeClasses.button}`}
                    title="Fullscreen Preview"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              )}
              <div
                ref={previewRef}
                className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${themeClasses.preview}`}
                style={{
                  padding: '20px',
                  minHeight: 'calc(100vh - 200px)',
                  height: 'calc(100vh - 200px)',
                  boxSizing: 'border-box',
                  maxHeight: 'calc(100vh - 200px)'
                }}
              >
                <div className={`prose max-w-none ${darkMode ? "prose-cyan prose-invert" : "prose-orange"}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({ node, inline, className, children, ...props }) => {
                        if (inline) {
                          return (
                            <code
                              className={`px-2 py-1 rounded text-sm font-mono ${darkMode ? "bg-cyan-700 text-cyan-200 border border-cyan-400" : "bg-blue-100 text-blue-800 border border-blue-300"}`}
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre
                            className={`p-4 rounded-lg overflow-x-auto ${darkMode ? "bg-cyan-700 text-cyan-200 border border-cyan-400" : "bg-blue-50 text-blue-900 border border-blue-200"}`}
                          >
                            <code className="font-mono text-sm" {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                      blockquote: ({ children }) => (
                        <blockquote
                          className={`border-l-4 pl-4 py-2 my-4 italic ${darkMode ? "border-violet-200 bg-violet-700/40" : "border-orange-500 bg-orange-50"}`}
                        >
                          {children}
                        </blockquote>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className={`min-w-full border-collapse border ${darkMode ? "border-violet-200 shadow-md" : "border-indigo-400 shadow-md"}`}>
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th
                          className={`border px-4 py-3 text-left font-semibold ${darkMode ? "border-violet-200 bg-violet-600 text-violet-100" : "border-indigo-400 bg-indigo-100 text-indigo-900"}`}
                        >
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td
                          className={`border px-4 py-3 ${darkMode ? "border-violet-200 bg-violet-600/30 text-violet-100" : "border-indigo-400 bg-indigo-50 text-indigo-800"}`}
                        >
                          {children}
                        </td>
                      ),
                    }}
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
  );
};

export default MarkdownEditor;