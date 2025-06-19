import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaTools } from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
<div className="flex items-center justify-center min-h-screen w-screen bg-white">
          <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Public Issue Management System
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connecting citizens, local government, and public services for better community management
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Resident Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaUser className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Resident</h2>
            <p className="text-gray-600 text-center mb-8">
              Report and track community issues, participate in discussions, and help improve your neighborhood.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/resident-login')}
              className="w-full py-3 px-4 bg-blue-600 text-black rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Resident
              <span className="ml-2">→</span>
            </motion.button>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaUserShield className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Admin</h2>
            <p className="text-gray-600 text-center mb-8">
              Manage and coordinate issue resolution, oversee departments, and analyze community data.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin-login')}
              className="w-full py-3 px-4 bg-purple-600 text-black rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Admin
              <span className="ml-2">→</span>
            </motion.button>
          </motion.div>

          {/* Department Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FaTools className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Department</h2>
            <p className="text-gray-600 text-center mb-8">
              Execute assigned tasks, update progress, and maintain efficient service delivery.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/worker-login')}
              className="w-full py-3 px-4 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Department
              <span className="ml-2">→</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 