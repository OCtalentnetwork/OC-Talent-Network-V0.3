import React from 'react';
import { Link } from 'react-router-dom';
import NeoButton from './NeoButton';
import { Users, Hexagon } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-black py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="bg-octn-blue p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
          <Hexagon className="text-white w-8 h-8 fill-current" />
        </div>
        <div className="leading-tight">
          <h1 className="font-bold text-2xl uppercase tracking-tighter">OCTN</h1>
          <span className="text-xs font-bold bg-black text-white px-1">OPEN CONCEPT TALENT</span>
        </div>
      </Link>

      <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide items-center">
        <Link to="/" className="hover:bg-octn-purple hover:text-white px-2 py-1 transition-colors">Agents</Link>
        <Link to="/about" className="hover:bg-octn-purple hover:text-white px-2 py-1 transition-colors">About Us</Link>
        <Link to="/consultation" className="hover:bg-octn-purple hover:text-white px-2 py-1 transition-colors">Services</Link>
      </div>

      <div className="flex gap-4">
         <Link to="/consultation">
          <NeoButton variant="accent" className="text-sm py-2 px-4">
            Book Consult
          </NeoButton>
         </Link>
      </div>
    </nav>
  );
};

export default Navbar;