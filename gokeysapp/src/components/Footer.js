import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa"; 
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Address Section */}
        <div>
          <img
            src="https://gokeysindia.com/uploads/gokeyslogo.png"
            alt="Logo"
            className="mb-4 w-32"
          />
          <p className="text-lg">Near Bus Stand, Haridwar, Uttarakhand, India</p>
          <p className="text-lg">gokeysindia@gmail.com</p>
          <p className="text-lg">+91-7830718687</p>
        </div>

        {/* Core Pages Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-gray-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-gray-400">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/cancellation-policy" className="hover:text-gray-400">
                Cancellation and Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-gray-400">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Options Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
          <p className="text-lg">We accept various payment methods. Please contact us for more details.</p>
        </div>

        {/* Social Media Section */}
      <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <p className="text-lg">Stay connected with us on our social media platforms!</p>
          <ul className="flex space-x-4 mt-4 text-2xl">
            <li>
              <Link href="https://facebook.com" target="_blank" className="hover:text-blue-500">
                <FaFacebookF />
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com" target="_blank" className="hover:text-sky-500">
                <FaTwitter />
              </Link>
            </li>
            <li>
              <Link href="https://instagram.com" target="_blank" className="hover:text-pink-500">
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="bg-gray-900 text-center py-4 mt-10">
        <p>&copy; 2025 Gokeys India. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
