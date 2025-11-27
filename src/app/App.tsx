import { Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import RestaurantDetail from '../pages/RestaurantDetail';
import AtomsPreview from '../pages/AtomsPreview';
import MoleculesPreview from '../pages/MoleculesPreview';
import HeaderPreview from '../pages/HeaderPreview';
import { Navbar, Footer } from '../components';

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  return (
    <div className='min-h-screen bg-white text-neutral-900'>
      {hideNav ? null : <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/restaurant/:id' element={<RestaurantDetail />} />
        <Route path='/dev/atoms' element={<AtomsPreview />} />
        <Route path='/dev/molecules' element={<MoleculesPreview />} />
        <Route path='/dev/header' element={<HeaderPreview />} />
      </Routes>
      {hideNav ? null : <Footer />}
    </div>
  );
}
