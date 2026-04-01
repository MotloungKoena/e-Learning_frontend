import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMaterialById, markMaterialWatched, getCourseMaterials } from '../../services/courses';
import { ChevronLeft, Play, FileText, CheckCircle, Download } from 'lucide-react';

const MaterialPlayer = () => {
  const { courseId, materialId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [material, setMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId, materialId]);

  const fetchData = async () => {
    try {
      const [materialData, allMaterials] = await Promise.all([
        getMaterialById(materialId),
        getCourseMaterials(courseId)
      ]);
      setMaterial(materialData);
      setMaterials(allMaterials);
    } catch (err) {
      setError('Failed to load material');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkWatched = async () => {
    setMarking(true);
    try {
      await markMaterialWatched(materialId);
      setMaterial({ ...material, watched: true });
    } catch (err) {
      console.error('Failed to mark as watched:', err);
    } finally {
      setMarking(false);
    }
  };

  const handleNext = () => {
    const currentIndex = materials.findIndex(m => m.id === parseInt(materialId));
    if (currentIndex < materials.length - 1) {
      const nextMaterial = materials[currentIndex + 1];
      navigate(`/courses/${courseId}/materials/${nextMaterial.id}`);
    }
  };

  const handlePrevious = () => {
    const currentIndex = materials.findIndex(m => m.id === parseInt(materialId));
    if (currentIndex > 0) {
      const prevMaterial = materials[currentIndex - 1];
      navigate(`/courses/${courseId}/materials/${prevMaterial.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Material not found</h2>
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Course
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Video/PDF Player */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-gray-800">{material.title}</h1>
              {material.description && (
                <p className="text-gray-600 text-sm mt-1">{material.description}</p>
              )}
            </div>

            {/* Player */}
            <div className="aspect-video bg-black">
              {material.fileType === 'VIDEO' && material.fileUrl && (
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={material.fileUrl}
                  onEnded={handleMarkWatched}
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {material.fileType === 'PDF' && material.fileUrl && (
                <iframe
                  src={material.fileUrl}
                  className="w-full h-full"
                  title={material.title}
                />
              )}
              {material.fileType === 'DOCUMENT' && material.fileUrl && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Document preview not available</p>
                    <a
                      href={material.fileUrl}
                      download
                      className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download File
                    </a>
                  </div>
                </div>
              )}
              {!material.fileUrl && (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-gray-500">File not available</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={materials.findIndex(m => m.id === parseInt(materialId)) === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={materials.findIndex(m => m.id === parseInt(materialId)) === materials.length - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
              {!material.watched && (
                <button
                  onClick={handleMarkWatched}
                  disabled={marking}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  {marking ? 'Marking...' : 'Mark as Completed'}
                </button>
              )}
              {material.watched && (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-gray-800 mb-3">Course Content</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {materials.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/courses/${courseId}/materials/${item.id}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition text-left ${
                    parseInt(materialId) === item.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {item.fileType === 'VIDEO' ? (
                    <Play className={`h-5 w-5 ${item.watched ? 'text-green-500' : 'text-gray-400'}`} />
                  ) : (
                    <FileText className={`h-5 w-5 ${item.watched ? 'text-green-500' : 'text-gray-400'}`} />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${parseInt(materialId) === item.id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                      {item.title}
                    </p>
                    {item.duration && (
                      <p className="text-xs text-gray-500">{item.duration} min</p>
                    )}
                  </div>
                  {item.watched && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialPlayer;