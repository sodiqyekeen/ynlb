import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from "./ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/Sheet";
import { Link } from 'react-router-dom';

interface NavMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const NavMenuLink: React.FC<{ to: string; onClick: () => void; label: string }> = ({ to, onClick, label }) => (
  <Link to={to} onClick={onClick}>
    <Button variant="ghost" className="w-full justify-start mb-2">
      {label}
    </Button>
  </Link>
);

const NavMenu: React.FC<NavMenuProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[250px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <NavMenuLink to="/" onClick={() => setIsMenuOpen(false)} label="Home" />
          <NavMenuLink to="/bulk-translation" onClick={() => setIsMenuOpen(false)} label="Bulk Translation" />
          {/* <NavMenuLink to="/editor" onClick={() => setIsMenuOpen(false)} label="Yoruba Text Editor" /> */}
          <NavMenuLink to="/about" onClick={() => setIsMenuOpen(false)} label="About YNLB" />
          <NavMenuLink to="/contact" onClick={() => setIsMenuOpen(false)} label="Contact Us" />
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default NavMenu;