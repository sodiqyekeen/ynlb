import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from "./button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Link } from 'react-router-dom';

interface NavMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

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
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              Home
            </Button>
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              About YNLB
            </Button>
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start mb-2">
              Contact Us
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default NavMenu;