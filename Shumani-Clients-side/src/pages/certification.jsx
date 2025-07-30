// import React, { useState } from 'react';
// import { Download, Award, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';

// const CertificateGenerator = () => {
//   const [formData, setFormData] = useState({
//     recipientName: '',
//     courseName: '',
//     completionDate: new Date().toISOString().split('T')[0],
//     instructorName: '',
//     organizationName: 'Excellence Academy'
//   });

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [downloadStatus, setDownloadStatus] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.recipientName.trim()) {
//       newErrors.recipientName = 'Recipient name is required';
//     }
    
//     if (!formData.courseName.trim()) {
//       newErrors.courseName = 'Course name is required';
//     }
    
//     if (!formData.completionDate) {
//       newErrors.completionDate = 'Completion date is required';
//     }
    
//     if (!formData.instructorName.trim()) {
//       newErrors.instructorName = 'Instructor name is required';
//     }
    
//     if (!formData.organizationName.trim()) {
//       newErrors.organizationName = 'Organization name is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const generateCertificateCanvas = () => {
//     return new Promise((resolve) => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
      
//       // Set high resolution canvas dimensions
//       const scale = 2; // For better quality
//       canvas.width = 1600 * scale;
//       canvas.height = 1200 * scale;
//       canvas.style.width = '1600px';
//       canvas.style.height = '1200px';
//       ctx.scale(scale, scale);
      
//       // Background with elegant gradient
//       const gradient = ctx.createLinearGradient(0, 0, 1600, 1200);
//       gradient.addColorStop(0, '#fefefe');
//       gradient.addColorStop(0.5, '#f8f9fa');
//       gradient.addColorStop(1, '#f1f3f4');
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 1600, 1200);
      
//       // Outer decorative border
//       ctx.strokeStyle = '#1a365d';
//       ctx.lineWidth = 12;
//       ctx.strokeRect(60, 60, 1480, 1080);
      
//       // Inner elegant border
//       ctx.strokeStyle = '#2b77ad';
//       ctx.lineWidth = 4;
//       ctx.strokeRect(100, 100, 1400, 1000);
      
//       // Decorative corner elements
//       const drawCornerDecoration = (x, y, flip = 1) => {
//         ctx.save();
//         ctx.translate(x, y);
//         ctx.scale(flip, 1);
//         ctx.strokeStyle = '#c53030';
//         ctx.lineWidth = 3;
//         ctx.beginPath();
//         ctx.moveTo(0, 0);
//         ctx.lineTo(80, 0);
//         ctx.lineTo(80, 20);
//         ctx.moveTo(0, 0);
//         ctx.lineTo(0, 80);
//         ctx.lineTo(20, 80);
//         ctx.stroke();
//         ctx.restore();
//       };
      
//       drawCornerDecoration(120, 120);
//       drawCornerDecoration(1480, 120, -1);
//       drawCornerDecoration(120, 1060);
//       drawCornerDecoration(1480, 1060, -1);
      
//       // Certificate title
//       ctx.fillStyle = '#1a365d';
//       ctx.font = 'bold 72px serif';
//       ctx.textAlign = 'center';
//       ctx.fillText('CERTIFICATE', 800, 280);
      
//       ctx.font = 'bold 48px serif';
//       ctx.fillText('OF COMPLETION', 800, 340);
      
//       // Decorative line under title
//       ctx.strokeStyle = '#c53030';
//       ctx.lineWidth = 4;
//       ctx.beginPath();
//       ctx.moveTo(400, 370);
//       ctx.lineTo(1200, 370);
//       ctx.stroke();
      
//       // Certificate body text
//       ctx.fillStyle = '#2d3748';
//       ctx.font = '32px serif';
//       ctx.fillText('This is to certify that', 800, 450);
      
//       // Recipient name with underline
//       ctx.fillStyle = '#1a365d';
//       ctx.font = 'bold 56px serif';
//       const recipientText = formData.recipientName;
//       ctx.fillText(recipientText, 800, 540);
      
//       const nameMetrics = ctx.measureText(recipientText);
//       const nameWidth = nameMetrics.width;
//       ctx.strokeStyle = '#1a365d';
//       ctx.lineWidth = 3;
//       ctx.beginPath();
//       ctx.moveTo((1600 - nameWidth) / 2, 570);
//       ctx.lineTo((1600 + nameWidth) / 2, 570);
//       ctx.stroke();
      
//       // Course completion text
//       ctx.fillStyle = '#2d3748';
//       ctx.font = '28px serif';
//       ctx.fillText('has successfully completed the course', 800, 650);
      
//       // Course name
//       ctx.fillStyle = '#c53030';
//       ctx.font = 'bold 44px serif';
//       ctx.fillText(formData.courseName, 800, 720);
      
//       // Completion date
//       ctx.fillStyle = '#2d3748';
//       ctx.font = '24px serif';
//       const formattedDate = formatDate(formData.completionDate);
//       ctx.fillText(on ${formattedDate}, 800, 780);
      
//       // Award seal (decorative circle)
//       ctx.beginPath();
//       ctx.arc(200, 950, 60, 0, 2 * Math.PI);
//       ctx.fillStyle = '#c53030';
//       ctx.fill();
//       ctx.strokeStyle = '#1a365d';
//       ctx.lineWidth = 4;
//       ctx.stroke();
      
//       ctx.fillStyle = '#ffffff';
//       ctx.font = 'bold 20px sans-serif';
//       ctx.fillText('AWARD', 200, 960);
      
//       // Signatures section
//       ctx.fillStyle = '#1a365d';
//       ctx.font = '22px serif';
//       ctx.textAlign = 'left';
      
//       // Instructor signature
//       ctx.fillText('Instructor:', 300, 950);
//       ctx.font = 'italic 28px serif';
//       ctx.fillText(formData.instructorName, 300, 990);
//       ctx.strokeStyle = '#1a365d';
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       ctx.moveTo(300, 1005);
//       ctx.lineTo(650, 1005);
//       ctx.stroke();
      
//       // Organization signature
//       ctx.font = '22px serif';
//       ctx.textAlign = 'right';
//       ctx.fillText('Organization:', 1300, 950);
//       ctx.font = 'italic 28px serif';
//       ctx.fillText(formData.organizationName, 1300, 990);
//       ctx.beginPath();
//       ctx.moveTo(950, 1005);
//       ctx.lineTo(1300, 1005);
//       ctx.stroke();
      
//       // Date stamp
//       ctx.textAlign = 'center';
//       ctx.font = '18px serif';
//       ctx.fillStyle = '#4a5568';
//       ctx.fillText(Certificate generated on ${new Date().toLocaleDateString()}, 800, 1130);
      
//       resolve(canvas);
//     });
//   };

//   const downloadCanvasAsPNG = (canvas, filename) => {
//     return new Promise((resolve, reject) => {
//       canvas.toBlob((blob) => {
//         if (!blob) {
//           reject(new Error('Failed to create image blob'));
//           return;
//         }

//         try {
//           // Create download URL
//           const url = URL.createObjectURL(blob);
          
//           // Create invisible download link
//           const link = document.createElement('a');
//           link.href = url;
//           link.download = filename;
//           link.style.display = 'none';
          
//           // Add to DOM, click, and remove
//           document.body.appendChild(link);
          
//           // Trigger download to local file system
//           link.click();
          
//           // Cleanup
//           setTimeout(() => {
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//             resolve();
//           }, 100);
          
//         } catch (error) {
//           reject(error);
//         }
//       }, 'image/png', 1.0);
//     });
//   };

//   const generateCertificate = async () => {
//     if (!validateForm()) {
//       setDownloadStatus('Please fix the errors above');
//       return;
//     }
    
//     setIsGenerating(true);
//     setDownloadStatus('Generating certificate...');
    
//     try {
//       // Generate canvas
//       const canvas = await generateCertificateCanvas();
      
//       // Create filename with safe characters
//       const safeRecipientName = formData.recipientName.replace(/[^a-zA-Z0-9]/g, '_');
//       const safeCourseName = formData.courseName.replace(/[^a-zA-Z0-9]/g, '_');
//       const filename = Certificate_${safeRecipientName}_${safeCourseName}_${new Date().getFullYear()}.png;
      
//       setDownloadStatus('Preparing download to your computer...');
      
//       // Download to local file system
//       await downloadCanvasAsPNG(canvas, filename);
      
//       setDownloadStatus(✅ Certificate saved to Downloads folder as "${filename}");
//       setTimeout(() => setDownloadStatus(''), 5000);
      
//     } catch (error) {
//       console.error('Download error:', error);
//       setDownloadStatus('❌ Download failed. Please check your browser settings and try again.');
//       setTimeout(() => setDownloadStatus(''), 5000);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const previewData = {
//     recipientName: formData.recipientName || 'John Doe',
//     courseName: formData.courseName || 'Web Development Fundamentals',
//     completionDate: formData.completionDate || new Date().toISOString().split('T')[0],
//     instructorName: formData.instructorName || 'Dr. Jane Smith',
//     organizationName: formData.organizationName || 'Excellence Academy'
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <Award className="w-12 h-12 text-blue-600 mr-3" />
//             <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Certificate Generator</h1>
//           </div>
//           <p className="text-gray-600 text-lg">Create professional certificates with automatic PDF download</p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Form Section */}
//           <div className="bg-white rounded-xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
//               <User className="w-6 h-6 mr-2 text-blue-600" />
//               Certificate Details
//             </h2>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Recipient Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="recipientName"
//                   value={formData.recipientName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                     errors.recipientName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter recipient's full name"
//                 />
//                 {errors.recipientName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.recipientName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Course Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="courseName"
//                   value={formData.courseName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                     errors.courseName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter course name"
//                 />
//                 {errors.courseName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.courseName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Calendar className="w-4 h-4 inline mr-1" />
//                   Completion Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="completionDate"
//                   value={formData.completionDate}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                     errors.completionDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.completionDate && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.completionDate}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Instructor Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="instructorName"
//                   value={formData.instructorName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                     errors.instructorName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter instructor's name"
//                 />
//                 {errors.instructorName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.instructorName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Organization Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="organizationName"
//                   value={formData.organizationName}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
//                     errors.organizationName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter organization name"
//                 />
//                 {errors.organizationName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.organizationName}
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={generateCertificate}
//                 disabled={isGenerating}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
//               >
//                 {isGenerating ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Generating Certificate...
//                   </>
//                 ) : (
//                   <>
//                     <Download className="w-5 h-5 mr-2" />
//                     Generate & Download Certificate
//                   </>
//                 )}
//               </button>

//               {/* Status Messages */}
//               {downloadStatus && (
//                 <div className={`p-3 rounded-lg flex items-center ${
//                   downloadStatus.includes('successfully') 
//                     ? 'bg-green-50 text-green-800 border border-green-200' 
//                     : downloadStatus.includes('Error') || downloadStatus.includes('fix')
//                     ? 'bg-red-50 text-red-800 border border-red-200'
//                     : 'bg-blue-50 text-blue-800 border border-blue-200'
//                 }`}>
//                   {downloadStatus.includes('successfully') ? (
//                     <CheckCircle className="w-5 h-5 mr-2" />
//                   ) : downloadStatus.includes('Error') || downloadStatus.includes('fix') ? (
//                     <AlertCircle className="w-5 h-5 mr-2" />
//                   ) : (
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
//                   )}
//                   {downloadStatus}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Preview Section */}
//           <div className="bg-white rounded-xl shadow-xl p-6">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">Live Preview</h2>
            
//             <div className="border-4 border-gray-800 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] p-4 relative overflow-hidden">
//               <div className="border-2 border-blue-500 rounded h-full p-4 flex flex-col justify-center text-center relative">
//                 {/* Corner decorations */}
//                 <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-red-500"></div>
//                 <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-red-500"></div>
//                 <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-red-500"></div>
//                 <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-red-500"></div>
                
//                 <div className="space-y-2">
//                   <h3 className="text-lg font-bold text-gray-800">CERTIFICATE</h3>
//                   <p className="text-sm font-semibold text-gray-800">OF COMPLETION</p>
//                   <div className="h-0.5 bg-red-500 w-16 mx-auto"></div>
                  
//                   <p className="text-xs text-gray-600 mt-3">This is to certify that</p>
//                   <p className="text-sm font-bold text-gray-800 border-b border-gray-400 pb-1 mx-auto inline-block">
//                     {previewData.recipientName}
//                   </p>
                  
//                   <p className="text-xs text-gray-600 mt-2">has successfully completed the course</p>
//                   <p className="text-sm font-semibold text-red-600">
//                     {previewData.courseName}
//                   </p>
                  
//                   <p className="text-xs text-gray-600 mt-2">
//                     on {formatDate(previewData.completionDate)}
//                   </p>
//                 </div>
                
//                 <div className="mt-auto pt-4">
//                   <div className="flex justify-between text-xs text-gray-700">
//                     <div className="text-left">
//                       <p className="font-medium">Instructor:</p>
//                       <p className="border-b border-gray-400 pb-0.5 italic">
//                         {previewData.instructorName}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">Organization:</p>
//                       <p className="border-b border-gray-400 pb-0.5 italic">
//                         {previewData.organizationName}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Award seal */}
//                 <div className="absolute bottom-4 left-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                   <Award className="w-4 h-4 text-white" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="mt-4 space-y-2 text-sm text-gray-600">
//               <p><strong>💾 Download Location:</strong> Your computer's Downloads folder</p>
//               <p><strong>📁 File Format:</strong> High-resolution PNG image</p>
//               <p><strong>📐 Dimensions:</strong> 1600x1200 pixels (print-ready)</p>
//               <p><strong>💡 Tip:</strong> Check your Downloads folder after generation</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificateGenerator;