import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RestaurantDetail from '../pages/RestaurantDetail';
import AtomsPreview from '../pages/AtomsPreview';
import MoleculesPreview from '../pages/MoleculesPreview';
import { Navbar } from '../components';

export default function App() {
  return (
    <div className='min-h-screen bg-white text-neutral-900'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/restaurant/:id' element={<RestaurantDetail />} />
        <Route path='/dev/atoms' element={<AtomsPreview />} />
        <Route path='/dev/molecules' element={<MoleculesPreview />} />
      </Routes>
    </div>
  );
}
