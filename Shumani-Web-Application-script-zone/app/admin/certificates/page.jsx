"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Download,
  Eye,
  Calendar,
  User,
  Building,
  FileText,
  Star,
  Trophy,
  Medal,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CertificatesPage() {
  const { toast } = useToast()
  const certificateRef = useRef(null)

  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    courseName: "",
    completionDate: new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
    instructorName: "",
    instructorTitle: "",
    organizationName: "Excellence Academy",
    certificateType: "completion",
    description: "",
    grade: "",
    hours: "",
  })

  const [errors, setErrors] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [certificates, setCertificates] = useState([])

  const certificateTypes = [
    {
      value: "completion",
      label: "Certificate of Completion",
      icon: CheckCircle,
      color: "bg-[#0D7FA1] text-white",
    },
    { 
      value: "achievement", 
      label: "Certificate of Achievement", 
      icon: Trophy, 
      color: "bg-[#52C0DB] text-white" 
    },
    {
      value: "participation",
      label: "Certificate of Participation",
      icon: Medal,
      color: "bg-[#FBD311] text-gray-800",
    },
    { 
      value: "excellence", 
      label: "Certificate of Excellence", 
      icon: Star, 
      color: "bg-[#c53030] text-white" 
    },
  ]

  const handleInputChange = (field, value) => {
    setCertificateData((prev) => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!certificateData.recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required'
    }
    
    if (!certificateData.courseName.trim()) {
      newErrors.courseName = 'Course name is required'
    }
    
    if (!certificateData.completionDate) {
      newErrors.completionDate = 'Completion date is required'
    }
    
    if (!certificateData.instructorName.trim()) {
      newErrors.instructorName = 'Instructor name is required'
    }
    
    if (!certificateData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateCertificateCanvas = (data) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set high resolution canvas dimensions
      const scale = 2 // For better quality
      canvas.width = 1600 * scale
      canvas.height = 1200 * scale
      canvas.style.width = '1600px'
      canvas.style.height = '1200px'
      ctx.scale(scale, scale)
      
      // Background with elegant gradient
      const gradient = ctx.createLinearGradient(0, 0, 1600, 1200)
      gradient.addColorStop(0, '#f0f9ff')
      gradient.addColorStop(0.5, '#fffbeb')
      gradient.addColorStop(1, '#f0f9ff')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 1600, 1200)
      
      // Outer decorative border
      ctx.strokeStyle = '#0D7FA1'
      ctx.lineWidth = 12
      ctx.strokeRect(60, 60, 1480, 1080)
      
      // Inner elegant border
      ctx.strokeStyle = '#52C0DB'
      ctx.lineWidth = 4
      ctx.strokeRect(100, 100, 1400, 1000)
      
      // Decorative corner elements
      const drawCornerDecoration = (x, y, flip = 1) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(flip, 1)
        ctx.strokeStyle = '#FBD311'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(80, 0)
        ctx.lineTo(80, 20)
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 80)
        ctx.lineTo(20, 80)
        ctx.stroke()
        ctx.restore()
      }
      
      drawCornerDecoration(120, 120)
      drawCornerDecoration(1480, 120, -1)
      drawCornerDecoration(120, 1060)
      drawCornerDecoration(1480, 1060, -1)
      
      // Certificate title
      ctx.fillStyle = '#0D7FA1'
      ctx.font = 'bold 72px serif'
      ctx.textAlign = 'center'
      
      const selectedType = certificateTypes.find(type => type.value === data.certificateType)
      const headerText = selectedType ? selectedType.label.toUpperCase() : 'CERTIFICATE'
      ctx.fillText(headerText, 800, 280)
      
      // Certificate body text
      ctx.fillStyle = '#2d3748'
      ctx.font = '32px serif'
      ctx.fillText('This is to certify that', 800, 450)
      
      // Recipient name with underline
      ctx.fillStyle = '#0D7FA1'
      ctx.font = 'bold 56px serif'
      const recipientText = data.recipientName || 'Recipient Name'
      ctx.fillText(recipientText, 800, 540)
      
      const nameMetrics = ctx.measureText(recipientText)
      const nameWidth = nameMetrics.width
      ctx.strokeStyle = '#0D7FA1'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo((1600 - nameWidth) / 2, 570)
      ctx.lineTo((1600 + nameWidth) / 2, 570)
      ctx.stroke()
      
      // Course completion text
      ctx.fillStyle = '#2d3748'
      ctx.font = '28px serif'
      ctx.fillText('has successfully completed the course', 800, 650)
      
      // Course name
      ctx.fillStyle = '#FBD311'
      ctx.font = 'bold 44px serif'
      ctx.fillText(data.courseName || 'Course Name', 800, 720)
      
      // Completion date
      ctx.fillStyle = '#2d3748'
      ctx.font = '24px serif'
      const formattedDate = formatDate(data.completionDate)
      ctx.fillText(`on ${formattedDate}`, 800, 780)
      
      // Description (if provided)
      if (data.description) {
        ctx.fillStyle = '#4a5568'
        ctx.font = '20px serif'
        const descLines = data.description.split('\n')
        descLines.forEach((line, i) => {
          ctx.fillText(line, 800, 840 + (i * 30))
        })
      }
      
      // Award seal (decorative circle)
      ctx.beginPath()
      ctx.arc(200, 950, 60, 0, 2 * Math.PI)
      ctx.fillStyle = '#52C0DB'
      ctx.fill()
      ctx.strokeStyle = '#0D7FA1'
      ctx.lineWidth = 4
      ctx.stroke()
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText('AWARD', 200, 960)
      
      // Signatures section
      ctx.fillStyle = '#0D7FA1'
      ctx.font = '22px serif'
      ctx.textAlign = 'left'
      
      // Instructor signature
      ctx.fillText('Instructor:', 300, 950)
      ctx.font = 'italic 28px serif'
      ctx.fillText(data.instructorName || 'Instructor Name', 300, 990)
      ctx.strokeStyle = '#0D7FA1'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(300, 1005)
      ctx.lineTo(650, 1005)
      ctx.stroke()
      
      // Organization signature
      ctx.font = '22px serif'
      ctx.textAlign = 'right'
      ctx.fillText('Organization:', 1300, 950)
      ctx.font = 'italic 28px serif'
      ctx.fillText(data.organizationName, 1300, 990)
      ctx.beginPath()
      ctx.moveTo(950, 1005)
      ctx.lineTo(1300, 1005)
      ctx.stroke()
      
      // Date stamp
      ctx.textAlign = 'center'
      ctx.font = '18px serif'
      ctx.fillStyle = '#4a5568'
      ctx.fillText(`Certificate generated on ${new Date().toLocaleDateString()}`, 800, 1130)
      
      resolve(canvas)
    })
  }

  const downloadCanvasAsPNG = (canvas, filename) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'))
          return
        }

        try {
          // Create download URL
          const url = URL.createObjectURL(blob)
          
          // Create invisible download link
          const link = document.createElement('a')
          link.href = url
          link.download = filename
          link.style.display = 'none'
          
          // Add to DOM, click, and remove
          document.body.appendChild(link)
          link.click()
          
          // Cleanup
          setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            resolve()
          }, 100)
          
        } catch (error) {
          reject(error)
        }
      }, 'image/png', 1.0)
    })
  }

  const generatePDF = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }
    
    setIsGenerating(true)
    
    try {
      // Generate canvas
      const canvas = await generateCertificateCanvas(certificateData)
      
      // Create filename with safe characters
      const safeRecipientName = certificateData.recipientName.replace(/[^a-zA-Z0-9]/g, '_')
      const safeCourseName = certificateData.courseName.replace(/[^a-zA-Z0-9]/g, '_')
      const filename = `Certificate_${safeRecipientName}_${safeCourseName}_${new Date().getFullYear()}.png`
      
      // Download to local file system
      await downloadCanvasAsPNG(canvas, filename)

      // Add to recent certificates
      const newCertificate = {
        id: Date.now(),
        recipientName: certificateData.recipientName,
        courseName: certificateData.courseName,
        type: certificateData.certificateType,
        issueDate: certificateData.issueDate,
        status: "issued",
        data: {...certificateData},
        canvasData: canvas.toDataURL() // Store canvas data for re-download
      }

      setCertificates(prev => [newCertificate, ...prev])
      
      toast({
        title: "Certificate Generated!",
        description: "Your certificate has been downloaded successfully.",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadCertificate = async (certificate) => {
    try {
      // If we have canvas data, use that
      if (certificate.canvasData) {
        const link = document.createElement('a')
        link.href = certificate.canvasData
        link.download = `Certificate_${certificate.recipientName.replace(/[^a-zA-Z0-9]/g, '_')}_${certificate.courseName.replace(/[^a-zA-Z0-9]/g, '_')}.png`
        link.click()
        return
      }

      // Otherwise regenerate the certificate
      const canvas = await generateCertificateCanvas(certificate.data)
      const filename = `Certificate_${certificate.recipientName.replace(/[^a-zA-Z0-9]/g, '_')}_${certificate.courseName.replace(/[^a-zA-Z0-9]/g, '_')}.png`
      await downloadCanvasAsPNG(canvas, filename)
      
      toast({
        title: "Certificate Downloaded!",
        description: "The certificate has been downloaded successfully.",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteCertificate = (id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id))
    toast({
      title: "Certificate Deleted",
      description: "The certificate has been removed from your recent certificates.",
    })
  }

  const getTypeIcon = (type) => {
    const typeConfig = certificateTypes.find((t) => t.value === type)
    return typeConfig ? typeConfig.icon : Award
  }

  const getTypeColor = (type) => {
    const typeConfig = certificateTypes.find((t) => t.value === type)
    return typeConfig ? typeConfig.color : "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #fffbeb 50%, #f0f9ff 100%)'}}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-12 h-12 mr-3 text-[#0D7FA1]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Certificate Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">Create professional certificates with automatic download</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-[#0D7FA1]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-[#52C0DB]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">
                    {certificates.filter(cert => 
                      new Date(cert.issueDate).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-[#FBD311]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Excellence Awards</p>
                  <p className="text-2xl font-bold">
                    {certificates.filter(cert => cert.type === 'excellence').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-[#c53030]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Templates</p>
                  <p className="text-2xl font-bold">{certificateTypes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Generator Form */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#0D7FA1]" />
                Generate New Certificate
              </CardTitle>
              <CardDescription>Fill in the details to create a professional certificate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certificate Type */}
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select
                  value={certificateData.certificateType}
                  onValueChange={(value) => handleInputChange("certificateType", value)}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-[#52C0DB]">
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificateTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className={type.color}>
                        <div className="flex items-center">
                          <type.icon className="mr-2 h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="mr-2 h-4 w-4 text-[#0D7FA1]" />
                  Recipient Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <Input
                    id="recipientName"
                    value={certificateData.recipientName}
                    onChange={(e) => handleInputChange("recipientName", e.target.value)}
                    placeholder="Enter recipient's full name"
                    className={`focus:ring-2 focus:ring-[#52C0DB] ${errors.recipientName ? "border-red-500 bg-red-50" : ""}`}
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.recipientName}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#0D7FA1]" />
                  Course Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name *</Label>
                  <Input
                    id="courseName"
                    value={certificateData.courseName}
                    onChange={(e) => handleInputChange("courseName", e.target.value)}
                    placeholder="Enter course name"
                    className={`focus:ring-2 focus:ring-[#52C0DB] ${errors.courseName ? "border-red-500 bg-red-50" : ""}`}
                  />
                  {errors.courseName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.courseName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={certificateData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the course (optional)"
                    rows={3}
                    className="focus:ring-2 focus:ring-[#52C0DB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Duration (Hours)</Label>
                    <Input
                      id="hours"
                      value={certificateData.hours}
                      onChange={(e) => handleInputChange("hours", e.target.value)}
                      placeholder="e.g., 40"
                      className="focus:ring-2 focus:ring-[#52C0DB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade/Score</Label>
                    <Input
                      id="grade"
                      value={certificateData.grade}
                      onChange={(e) => handleInputChange("grade", e.target.value)}
                      placeholder="e.g., A+ or 95%"
                      className="focus:ring-2 focus:ring-[#52C0DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-[#0D7FA1]" />
                  Dates
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Completion Date *</Label>
                    <Input
                      id="completionDate"
                      type="date"
                      value={certificateData.completionDate}
                      onChange={(e) => handleInputChange("completionDate", e.target.value)}
                      className={`focus:ring-2 focus:ring-[#52C0DB] ${errors.completionDate ? "border-red-500 bg-red-50" : ""}`}
                    />
                    {errors.completionDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.completionDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={certificateData.issueDate}
                      onChange={(e) => handleInputChange("issueDate", e.target.value)}
                      className="focus:ring-2 focus:ring-[#52C0DB]"
                    />
                  </div>
                </div>
              </div>

              {/* Instructor Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="mr-2 h-4 w-4 text-[#0D7FA1]" />
                  Instructor & Organization
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="instructorName">Instructor Name *</Label>
                  <Input
                    id="instructorName"
                    value={certificateData.instructorName}
                    onChange={(e) => handleInputChange("instructorName", e.target.value)}
                    placeholder="Enter instructor's name"
                    className={`focus:ring-2 focus:ring-[#52C0DB] ${errors.instructorName ? "border-red-500 bg-red-50" : ""}`}
                  />
                  {errors.instructorName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.instructorName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructorTitle">Instructor Title</Label>
                  <Input
                    id="instructorTitle"
                    value={certificateData.instructorTitle}
                    onChange={(e) => handleInputChange("instructorTitle", e.target.value)}
                    placeholder="e.g., Senior Developer, Course Director"
                    className="focus:ring-2 focus:ring-[#52C0DB]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={certificateData.organizationName}
                    onChange={(e) => handleInputChange("organizationName", e.target.value)}
                    placeholder="Organization name"
                    className={`focus:ring-2 focus:ring-[#52C0DB] ${errors.organizationName ? "border-red-500 bg-red-50" : ""}`}
                  />
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.organizationName}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={generatePDF}
                  className="flex-1 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50"
                  style={{
                    background: isGenerating 
                      ? '#9CA3AF' 
                      : 'linear-gradient(135deg, #0D7FA1 0%, #52C0DB 50%, #FBD311 100%)',
                    cursor: isGenerating ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isGenerating || !certificateData.recipientName || !certificateData.courseName}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Certificate...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate PNG
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Preview */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5 text-[#0D7FA1]" />
                Certificate Preview
              </CardTitle>
              <CardDescription>Live preview of your certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/3] p-4 relative overflow-hidden" style={{borderColor: '#0D7FA1'}}>
                <div className="border-2 rounded h-full p-4 flex flex-col justify-center text-center relative" style={{borderColor: '#52C0DB'}}>
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2" style={{borderColor: '#FBD311'}}></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2" style={{borderColor: '#FBD311'}}></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2" style={{borderColor: '#FBD311'}}></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2" style={{borderColor: '#FBD311'}}></div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0D7FA1]">
                      {certificateTypes.find(type => type.value === certificateData.certificateType)?.label.toUpperCase() || 'CERTIFICATE'}
                    </h3>
                    <div className="h-0.5 w-16 mx-auto" style={{backgroundColor: '#FBD311'}}></div>
                    
                    <p className="text-xs text-gray-600 mt-3">This is to certify that</p>
                    <p className="text-sm font-bold text-[#0D7FA1] border-b border-gray-400 pb-1 mx-auto inline-block">
                      {certificateData.recipientName || 'Recipient Name'}
                    </p>
                    
                    <p className="text-xs text-gray-600 mt-2">has successfully completed the course</p>
                    <p className="text-sm font-semibold" style={{color: '#FBD311'}}>
                      {certificateData.courseName || 'Course Name'}
                    </p>
                    
                    <p className="text-xs text-gray-600 mt-2">
                      on {formatDate(certificateData.completionDate)}
                    </p>
                    
                    {certificateData.description && (
                      <p className="text-xs text-gray-500 mt-2">
                        {certificateData.description.length > 80
                          ? certificateData.description.substring(0, 80) + "..."
                          : certificateData.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-xs text-gray-700">
                      <div className="text-left">
                        <p className="font-medium">Instructor:</p>
                        <p className="border-b border-gray-400 pb-0.5 italic">
                          {certificateData.instructorName || 'Instructor Name'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Organization:</p>
                        <p className="border-b border-gray-400 pb-0.5 italic">
                          {certificateData.organizationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Award seal */}
                  <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#0D7FA1'}}>
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><strong>💾 Download Location:</strong> Your computer's Downloads folder</p>
                <p><strong>📁 File Format:</strong> High-resolution PNG image</p>
                <p><strong>📐 Dimensions:</strong> 1600x1200 pixels (print-ready)</p>
                <p><strong>💡 Tip:</strong> Check your Downloads folder after generation</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Certificates */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Certificates</CardTitle>
            <CardDescription>Recently generated certificates ({certificates.length})</CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No certificates generated yet. Create your first certificate above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                    <div className="flex items-center space-x-4">
                      {(() => {
                        const TypeIcon = getTypeIcon(cert.type)
                        return <TypeIcon className="h-8 w-8 text-[#0D7FA1]" />
                      })()}
                      <div>
                        <h4 className="font-medium">{cert.recipientName}</h4>
                        <p className="text-sm text-gray-600">{cert.courseName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTypeColor(cert.type)}>
                            {certificateTypes.find((type) => type.value === cert.type)?.label}
                          </Badge>
                          <span className="text-xs text-gray-500">Issued: {formatDate(cert.issueDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => downloadCertificate(cert)}
                        className="hover:bg-[#0D7FA1]/10"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteCertificate(cert.id)}
                        className="hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}