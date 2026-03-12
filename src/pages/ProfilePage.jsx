import { motion } from 'framer-motion';
import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-light text-white mb-8 flex items-center gap-3"
        >
          <User className="w-8 h-8 text-indigo-400" />
          My Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8">
            {/* Avatar placeholder */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center border-2 border-indigo-500">
                <User className="w-12 h-12 text-indigo-400" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-400">Full Name</p>
                  <p className="text-white font-medium">{user?.name || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-400">Email Address</p>
                  <p className="text-white font-medium">{user?.email || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-700/50 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-white font-medium capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;