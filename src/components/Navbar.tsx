import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-2xl py-md border-b border-neutral-200 bg-white">
      <Link to="/" className="font-extrabold">Foody</Link>
      <div className="flex items-center gap-md">
        <Link to="/cart" className="text-neutral-900">Cart</Link>
        <Link to="/profile" className="text-neutral-900">Profile</Link>
      </div>
    </nav>
  )
}
