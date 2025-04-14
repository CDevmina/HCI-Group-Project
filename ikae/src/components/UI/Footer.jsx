import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiYoutube,
  FiSend,
  FiPhone,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

/**
 * Footer component with contact information, newsletter, and navigation links
 */
const Footer = ({
  companyName = "IKAE",
  companyDescription = "Visualize your perfect space with our innovative furniture design tool.",
  contactInfo = {
    address: "123 Main Street, Colpetty\nColombo - 03, Sri Lanka",
    phone: "+94 761823473",
    email: "support@ikae.com",
  },
}) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      // Here you would typically send the email to your backend
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const currentYear = new Date().getFullYear();

  // Social media links data
  const socialLinks = [
    { icon: FiInstagram, url: "https://instagram.com", label: "Instagram" },
    { icon: FiFacebook, url: "https://facebook.com", label: "Facebook" },
    { icon: FiTwitter, url: "https://twitter.com", label: "Twitter" },
    { icon: FiLinkedin, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: FiYoutube, url: "https://youtube.com", label: "YouTube" },
  ];

  // Footer navigation sections
  const navSections = [
    {
      title: "Explore",
      links: [
        { to: "/room-editor", label: "Room Editor" },
        { to: "/gallery", label: "Design Gallery" },
        { to: "/designs", label: "My Designs" },
        { to: "/tutorials", label: "Tutorials" },
      ],
    },
    {
      title: "Furniture",
      links: [
        { to: "/furniture/tables", label: "Tables" },
        { to: "/furniture/chairs", label: "Chairs" },
        { to: "/furniture/sofas", label: "Sofas" },
        { to: "/furniture/storage", label: "Storage" },
      ],
    },
    {
      title: "Company",
      links: [
        { to: "/about", label: "About Us" },
        { to: "/careers", label: "Careers" },
        { to: "/blog", label: "Blog" },
        { to: "/contact", label: "Contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { to: "/help", label: "Help Center" },
        { to: "/faq", label: "FAQs" },
        { to: "/feedback", label: "Give Feedback" },
        { to: "/system-requirements", label: "System Requirements" },
      ],
    },
  ];

  // Legal links
  const legalLinks = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/accessibility", label: "Accessibility" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section with Logo, Newsletter and Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">
                  {companyName.charAt(0)}
                </span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {companyName}
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
              {companyDescription}
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">
                  {contactInfo.address.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < contactInfo.address.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest design tips and product
              updates.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-2"
            >
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-2 w-full rounded-l-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-r-md px-4 transition-colors"
                  aria-label="Subscribe to newsletter"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-green-600 dark:text-green-500 text-sm mt-1">
                  Thank you for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Middle Section with Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section with Copyright and Legal */}
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} {companyName} Furniture Design. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  companyName: PropTypes.string,
  companyDescription: PropTypes.string,
  contactInfo: PropTypes.shape({
    address: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default Footer;
