import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Activity, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              HomeoSync Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/patients" className="text-foreground/80 hover:text-primary transition-smooth">
                  Patients
                </Link>
                <Link to="/case-taking" className="text-foreground/80 hover:text-primary transition-smooth">
                  Case Taking
                </Link>
                <Link to="/repertory" className="text-foreground/80 hover:text-primary transition-smooth">
                  Repertory
                </Link>
                <Link to="/prescriptions" className="text-foreground/80 hover:text-primary transition-smooth">
                  Prescriptions
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth/login">
                <Button variant="default" className="bg-gradient-primary hover:opacity-90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            {user ? (
              <>
                <Link
                  to="/patients"
                  className="block py-2 text-foreground/80 hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Patients
                </Link>
                <Link
                  to="/case-taking"
                  className="block py-2 text-foreground/80 hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Case Taking
                </Link>
                <Link
                  to="/repertory"
                  className="block py-2 text-foreground/80 hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Repertory
                </Link>
                <Link
                  to="/prescriptions"
                  className="block py-2 text-foreground/80 hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Prescriptions
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-foreground/80 hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full bg-gradient-primary hover:opacity-90">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
