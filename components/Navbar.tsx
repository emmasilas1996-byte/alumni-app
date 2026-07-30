import Link from "next/link";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/members", label: "Members" },
  { href: "/executive", label: "Executive" },
  { href: "/contributions", label: "Contributions" },
  { href: "/releases", label: "Released Funds" },
  { href: "/dues", label: "Monthly Dues" },
  { href: "/constitution", label: "Constitution" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  return (
    <div className="bg-gradient-to-b from-navy to-navy-deep text-white px-7">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3.5 flex-wrap gap-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4 L42 11 V23 C42 34 34.5 41.5 24 45 C13.5 41.5 6 34 6 23 V11 Z" fill="#c8992e" opacity="0.15"/>
            <path d="M24 4 L42 11 V23 C42 34 34.5 41.5 24 45 C13.5 41.5 6 34 6 23 V11 Z" stroke="#e6c878" strokeWidth="1.5"/>
            <text x="24" y="29" fontFamily="Fraunces, serif" fontSize="14" fontWeight="700" fill="#f7f4ec" textAnchor="middle">N</text>
          </svg>
          <div className="leading-tight">
            <div className="font-display font-bold text-[17px] tracking-wide">NEMSS</div>
            <div className="text-[10.5px] text-gold-light uppercase tracking-wider">Alumni Association</div>
          </div>
        </Link>
        <nav className="flex gap-5 flex-wrap">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-white/70 hover:text-white transition-colors pb-1 border-b-2 border-transparent hover:border-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
