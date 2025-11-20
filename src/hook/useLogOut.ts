import { useDispatch } from 'react-redux';
import { clearCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    // Clear Redux state
    dispatch(clearCredentials());
    
    // Clear localStorage]]]]]]]]
  8888
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    
    // Navigate to login
    navigate('/login');
  };

  return logout;
};