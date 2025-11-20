// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { persistCredentials } from '../features/auth/authSlice';

// export const useAuthInit = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       dispatch(persistCredentials({
//         token,
//         firstName: localStorage.getItem('firstName') || '',
//         email: localStorage.getItem('email') || '',
//         userId: localStorage.getItem('userId') || '',
//         userType: localStorage.getItem('userType') || 'user',
//         isAuthenticated: true
//       }));
//     }
//   }, [dispatch]);
// };