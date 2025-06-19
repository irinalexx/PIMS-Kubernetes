import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaBuilding, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const DepartmentLogin = () => {
  const navigate = useNavigate();
  const { departmentLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    departmentId: '',
    password: '',
    selectedDepartment: ''
  });

  const departments = [
    'KSEB',
    'Water Authority',
    'Public Works',
    'Forest',
    'Muncipality'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedDepartment) {
      setError('Please select a department');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await departmentLogin(formData.departmentId, formData.password, formData.selectedDepartment);
  
      // Redirect user based on selected department
      switch (formData.selectedDepartment) {
        case 'Public Works':
          navigate('/deptdashboard/PWDDashboard');
          break;
        case 'Water Authority':
          navigate('/deptdashboard/WaterDashboard');
          break;
        case 'KSEB':
          navigate('/deptdashboard/KSEBDashboard');
          break;
        case 'Forest':
          navigate('/deptdashboard/ForestDashboard');
          break;
        case 'Muncipality':
          navigate('/deptdashboard/MuncipalityDashboard');
          break;
        default:
          setError('Invalid department selection');
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      console.error('Department login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-white">
      <div className="fixed inset-0 bg-black/5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        {/* Department Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <FaTools className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-center text-black mb-8">Department Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Selection */}
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="selectedDepartment"
              value={formData.selectedDepartment}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white text-gray-700"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Department ID */}
          <div className="relative">
            <FaTools className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              placeholder="Department ID"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Login"}
          </motion.button>

          {/* Contact Admin Link */}
          <p className="text-center text-sm">
            <button 
              type="button"
              onClick={() => {/* Handle contact admin */}}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              Contact Admin for Support
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default DepartmentLogin;