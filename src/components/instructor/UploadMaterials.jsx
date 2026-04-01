import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseById, uploadMaterial, getCourseMaterials } from '../../services/courses';
import { ChevronLeft, Upload, FileText, Video, X, Trash2 } from 'lucide-react';

const UploadMaterials = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    orderIndex: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      const [courseData, materialsData] = await Promise.all([
        getCourseById(courseId),
        getCourseMaterials(courseId).catch(() => [])
      ]);
      setCourse(courseData);
      setMaterials(materialsData);
    } catch (err) {
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Determine file type
      if (file.type.startsWith('video/')) {
        setFileType('VIDEO');
      } else if (file.type === 'application/pdf') {
        setFileType('PDF');
      } else {
        setFileType('DOCUMENT');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const uploadFormData = new FormData();
    uploadFormData.append('file', selectedFile);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('duration', formData.duration);
    uploadFormData.append('orderIndex', formData.orderIndex);

    try {
      await uploadMaterial(courseId, uploadFormData);
      setSuccess('Material uploaded successfully!');
      setFormData({ title: '', description: '', duration: '', orderIndex: 0 });
      setSelectedFile(null);
      fetchData(); // Refresh materials list
    } catch (err) {
      setError(err.response?.data || 'Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/instructor/dashboard')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Course Materials: {course?.title}
      </h1>
      <p className="text-gray-600 mb-8">
        Upload videos, PDFs, and other learning materials for your students.
      </p>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Material</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
              <input
                type="file"
                accept="video/*,application/pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {selectedFile ? (
                  <>
                    <FileText className="h-12 w-12 text-blue-500 mb-2" />
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="mt-2 text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      MP4, PDF, DOC, DOCX, TXT (Max 100MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Introduction to Java"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What will students learn from this material?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="For videos"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1, 2, 3..."
                value={formData.orderIndex}
                onChange={(e) => setFormData({...formData, orderIndex: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Material'}
          </button>
        </form>
      </div>

      {/* Existing Materials */}
      {materials.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Existing Materials ({materials.length})
          </h2>
          <div className="space-y-3">
            {materials.map(material => (
              <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {material.fileType === 'VIDEO' ? (
                    <Video className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{material.title}</p>
                    <p className="text-sm text-gray-500">
                      {material.fileType} • {material.duration ? `${material.duration} min` : 'No duration'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {material.fileUrl}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMaterials;