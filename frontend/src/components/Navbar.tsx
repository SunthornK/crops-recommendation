import { Link, useLocation } from "react-router-dom";
import { Leaf, BarChart2, Home, Menu, Compass, Wand2, ChartLine } from "lucide-react";

const Navbar = () => {
  const location = useLocation();


  const links = [
    { path: "/", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { path: "/historical", label: "Historical Data", icon: <ChartLine className="h-4 w-4" /> },
    { path: "/location", label: "Location Weather", icon: <Compass className="h-4 w-4" /> },
    { path: "/predictions", label: "Predictions", icon: <Wand2 className="h-4 w-4" /> },
    { path: "/statistics", label:"Statistics", icon: <BarChart2 className="h-4 w-4" /> },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Crop Reccomendation</span>
            </Link>
          </div>
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm flex items-center ${
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
