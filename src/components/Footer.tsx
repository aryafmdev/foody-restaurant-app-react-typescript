export default function Footer() {
  return (
    <footer className="px-2xl py-2xl bg-neutral-900 text-white">
      <div className=" mx-auto grid grid-cols-1 md:grid-cols-3 gap-2xl">
        <div>
          <div className="font-extrabold">Foody</div>
          <div className="mt-sm text-sm text-neutral-400">The ultimate restaurant app</div>
        </div>
        <div className="text-sm">
          <div>Menu</div>
          <div className="mt-xs">Orders</div>
          <div className="mt-xs">Profile</div>
        </div>
        <div className="text-sm">
          <div>Contact</div>
          <div className="mt-xs">Support</div>
        </div>
      </div>
    </footer>
  )
}
