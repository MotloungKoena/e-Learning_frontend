import { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, XCircle, UserX } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/all');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const approveInstructor = async (userId) => {
    try {
      await api.put(`/users/${userId}/approve`);
      setSuccess('Instructor approved successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to approve instructor');
    }
  };

  const blockUser = async (userId) => {
    try {
      await api.put(`/users/${userId}/block`);
      setSuccess('User blocked successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to block user');
    }
  };

  const unblockUser = async (userId) => {
    try {
      await api.put(`/users/${userId}/unblock`);
      setSuccess('User unblocked successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to unblock user');
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
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>
      
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

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {user.role === 'INSTRUCTOR' && user.status === 'PENDING' && (
                    <button
                      onClick={() => approveInstructor(user.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Approve Instructor"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                    <button
                      onClick={() => blockUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Block User"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  )}
                  {user.status === 'BLOCKED' && (
                    <button
                      onClick={() => unblockUser(user.id)}
                      className="text-green-600 hover:text-green-800"
                      title="Unblock User"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;