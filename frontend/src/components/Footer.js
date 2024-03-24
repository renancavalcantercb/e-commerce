import React from 'react';
import visaIcon from '../assets/visa_icon.png';
import mastercardIcon from '../assets/mastercard_icon.png';
import americanExpressIcon from '../assets/american_express_icon.png';
import pixIcon from '../assets/pix_icon.png';

const Footer = () => {
  return (
    <footer className="bg-white rounded-lg shadow mt-8">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment methods</h2>
            <div className="flex justify-center md:justify-start gap-4">
              <img src={visaIcon} alt="Visa" style={{ height: '36px' }} />
              <img src={mastercardIcon} alt="Mastercard" style={{ height: '36px' }} />
              <img src={americanExpressIcon} alt="American Express" style={{ height: '36px' }} />
              <img src={pixIcon} alt="Pix" style={{ height: '36px' }} />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Service</h2>
            <ul>
              <li><a href="#" className="block hover:underline">Contact us</a></li>
              <li><a href="#" className="block hover:underline">FAQ's</a></li>
              <li><a href="#" className="block hover:underline">Orders and delivery</a></li>
              <li><a href="#" className="block hover:underline">Returns and refunds</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">About us</h2>
            <ul>
              <li><a href="#" className="block hover:underline">Our story</a></li>
              <li><a href="#" className="block hover:underline">Careers</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Discounts and membership</h2>
            <ul>
              <li><a href="#" className="block hover:underline">Affiliate program</a></li>
              <li><a href="#" className="block hover:underline">Refer a friend</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-4">
          <ul className="flex flex-wrap justify-center items-center gap-4">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Accessibility</a></li>
            <li><a href="#" className="hover:underline">Sitemap</a></li>
            <li><a href="#" className="hover:underline">Protection of Intellectual Property</a></li>
          </ul>
          <p className="text-center text-sm mt-4">
            © 2024 <a href="https://yourwebsite.com" className="hover:underline">E-commerce</a>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
