import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/demo", label: "Demo" },
  { to: "/products", label: "Dashboard" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm tracking-wide">
          <span className="inline-block h-2 w-2 rounded-full bg-verified" />
          DDP&#8209;X
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive ? "text-paper" : "text-paper/50 hover:text-paper/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/products/new"
            className="liquid-glass rounded-full px-4 py-2 font-body text-sm text-paper hover:bg-white/10"
          >
            + New Passport
          </Link>
        </nav>
      </div>
    </header>
  );
}
