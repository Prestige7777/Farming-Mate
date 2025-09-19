// src/pages/admin/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, updateUser, deleteUser, getProductsByFarmerId, createUser } from '../../utils/api';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserProducts, setSelectedUserProducts] = useState([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'consumer',
  });

  const filteredUsers = users.filter(user => {
    if (filterRole === 'all') {
      return true;
    }
    return user.role === filterRole;
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('사용자 정보를 불러오는 데 실패했습니다.');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId, currentStatus, userName) => {
    if (currentStatus) {
      if (window.confirm(`정말로 ${userName} 사용자의 인증을 해제하시겠습니까? 이 사용자의 역할이 소비자로 변경됩니다.`)) {
        try {
          await updateUser(userId, { isVerified: false, role: 'consumer' });
          alert(`${userName} 사용자의 인증이 해제되었고, 역할이 소비자로 변경되었습니다.`);
          fetchUsers();
        } catch (err) {
          console.error('Failed to unverify user:', err);
          alert('사용자 인증 해제에 실패했습니다.');
        }
      }
    } else {
      if (window.confirm(`정말로 ${userName} 사용자를 인증하시겠습니까?`)) {
        try {
          await updateUser(userId, { isVerified: true });
          alert(`${userName} 사용자가 성공적으로 인증되었습니다.`);
          fetchUsers();
        } catch (err) {
          console.error('Failed to verify user:', err);
          alert('사용자 인증에 실패했습니다.');
        }
      }
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`정말로 ${userName} 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await deleteUser(userId);
        alert(`${userName} 사용자가 성공적으로 삭제되었습니다.`);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleShowUserDetails = async (user) => {
    setSelectedUser(user);
    if (user.role === 'farmer') {
      try {
        const products = await getProductsByFarmerId(user.id);
        setSelectedUserProducts(products);
      } catch (err) {
        console.error('Failed to fetch farmer products:', err);
        setSelectedUserProducts([]);
      }
    } else {
      setSelectedUserProducts([]);
    }
    setShowUserDetailsModal(true);
  };

  const handleCloseUserDetailsModal = () => {
    setShowUserDetailsModal(false);
    setSelectedUser(null);
    setSelectedUserProducts([]);
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(newUserData);
      alert('새 사용자가 성공적으로 생성되었습니다.');
      fetchUsers();
      setShowCreateUserModal(false);
      setNewUserData({ email: '', password: '', name: '', role: 'consumer' });
    } catch (err) {
      console.error('Failed to create user:', err);
      alert('사용자 생성에 실패했습니다.');
    }
  };

  const handleSaveUserDetails = async (updatedUser) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      fetchUsers();
      handleCloseUserDetailsModal();
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('사용자 정보 업데이트에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="admin-content">로딩 중...</div>;
  }

  if (error) {
    return <div className="admin-content error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <AdminSidebar />
      <div className="admin-content user-management">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>사용자 관리</h2>
          <div className="filter-buttons">
            <Button onClick={() => setFilterRole('all')} className={filterRole === 'all' ? 'active' : ''}>전체</Button>
            <Button onClick={() => setFilterRole('farmer')} className={filterRole === 'farmer' ? 'active' : ''}>농부</Button>
            <Button onClick={() => setFilterRole('consumer')} className={filterRole === 'consumer' ? 'active' : ''}>소비자</Button>
            <Button onClick={() => setFilterRole('admin')} className={filterRole === 'admin' ? 'active' : ''}>관리자</Button>
          </div>
        </div>
        <Button onClick={() => setShowCreateUserModal(true)} className="admin-action-button">새 회원 추가</Button>
        <div className="user-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>인증 여부</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.role === 'farmer' ? (
                      <Link to={`/farmers/${user.id}/public`}>{user.name}</Link>
                    ) : (
                      user.name
                    )}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isVerified ? '예' : '아니오'}</td>
                  <td>
                    <Button onClick={() => handleShowUserDetails(user)} className="small-button">상세</Button>
                    <Button onClick={() => handleToggleVerification(user.id, user.isVerified, user.name)} className="small-button">
                      {user.isVerified ? '인증 해제' : '인증'}
                    </Button>
                    <Button onClick={() => handleDeleteUser(user.id, user.name)} className="small-button delete-button">삭제</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showUserDetailsModal && (
          <UserDetailsModal
            user={selectedUser}
            products={selectedUserProducts}
            onClose={handleCloseUserDetailsModal}
            onSave={handleSaveUserDetails}
          />
        )}

        {showCreateUserModal && (
          <Modal isOpen={showCreateUserModal} onClose={() => setShowCreateUserModal(false)} title="새 사용자 생성">
            <form onSubmit={handleCreateUserSubmit} className="create-user-form">
              <div className="form-group">
                <label htmlFor="email">이메일:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">비밀번호:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">이름:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUserData.name}
                  onChange={handleNewUserChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">역할:</label>
                <select id="role" name="role" value={newUserData.role} onChange={handleNewUserChange}>
                  <option value="consumer">소비자</option>
                  <option value="farmer">농부</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              <Button type="submit" className="submit-button">생성</Button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserManagement;