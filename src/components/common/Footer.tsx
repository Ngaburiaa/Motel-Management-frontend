import { Facebook, Twitter, Instagram, Globe } from "lucide-react";
import { hotelContact, hotelName, supportEmail } from "../../constants/constants";
import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{hotelName}</h2>
          <p className="text-sm">
            Your trusted hotel booking partner. Discover, compare, and book the
            best stays across the globe.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h6 className="text-lg font-semibold mb-4">Navigation</h6>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="hover:text-white transition" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition" to="/hotels">
                Hotels
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition" to="/rooms">
                Rooms
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition" to="/about">
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition" to="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h6 className="text-lg font-semibold mb-4">Follow Us</h6>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Website"
              className="hover:text-white transition"
            >
              <Globe className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h6 className="text-lg font-semibold mb-4">Contact</h6>
          <p className="text-sm">
            Email: {supportEmail}
            <br />
            Phone: {hotelContact}
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-neutral-content border-t border-neutral pt-6">
        &copy; {new Date().getFullYear()} {hotelName}. All rights reserved.
      </div>
    </footer>
  );
};
