import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../pages/Home';
import Restaurants from '../pages/Restaurants';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import RestaurantDetail from '../pages/RestaurantDetail';
import AtomsPreview from '../pages/AtomsPreview';
import MoleculesPreview from '../pages/MoleculesPreview';
import HeaderPreview from '../pages/HeaderPreview';
import MyOrders from '../pages/MyOrders';
import MyReviews from '../pages/MyReviews';
import UpdateOrderStatus from '../pages/UpdateOrderStatus';
import Checkout from '../pages/Checkout';
import Success from '../pages/Success';
import DeliveryAddress from '../pages/DeliveryAddress';
import { Navbar, Footer } from '../components';

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  const isHome = location.pathname === '/';
  useEffect(() => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);
  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex flex-col'>
      {hideNav ? null : (
        <Navbar mode={location.pathname === '/' ? undefined : 'scrolled'} />
      )}
      <main
        className={
          hideNav ? 'flex-1' : isHome ? 'flex-1' : 'pt-16 md:pt-20 flex-1'
        }
      >
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/restaurants' element={<Restaurants />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/success' element={<Success />} />
          <Route path='/address' element={<DeliveryAddress />} />
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/orders/update-status' element={<UpdateOrderStatus />} />
          <Route path='/my-reviews' element={<MyReviews />} />
          <Route path='/restaurant/:id' element={<RestaurantDetail />} />
          <Route path='/dev/atoms' element={<AtomsPreview />} />
          <Route path='/dev/molecules' element={<MoleculesPreview />} />
          <Route path='/dev/header' element={<HeaderPreview />} />
        </Routes>
      </main>
      {hideNav ? null : <Footer />}
    </div>
  );
}
