import { Link } from 'react-router-dom';
import { FiMail, FiTwitter, FiLinkedin, FiGithub, FiHeart } from 'react-icons/fi';
import { IoBookSharp } from "react-icons/io5";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-accent1 to-accent2 rounded-lg flex items-center justify-center">
                <IoBookSharp className="text-white text-lg" />
              </div>
              <h3 className="text-2xl font-serif font-light text-text">ReadFlow</h3>
            </Link>
            <p className="text-text/70 text-sm leading-relaxed mb-4">
              Transform your reading experience with AI-powered document transformation.
              Where documents become stories.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-text/50 hover:text-accent1 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="text-lg" />
              </a>
              <a
                href="#"
                className="text-text/50 hover:text-accent1 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="text-lg" />
              </a>
              <a
                href="#"
                className="text-text/50 hover:text-accent1 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="text-lg" />
              </a>
              <a
                href="mailto:hello@readflow.com"
                className="text-text/50 hover:text-accent1 transition-colors"
                aria-label="Email"
              >
                <FiMail className="text-lg" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-serif text-lg text-text mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-text/70 hover:text-text transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-text/70 hover:text-text transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/demo" className="text-text/70 hover:text-text transition-colors text-sm">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/integrations" className="text-text/70 hover:text-text transition-colors text-sm">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-serif text-lg text-text mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-text/70 hover:text-text transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-text/70 hover:text-text transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-text/70 hover:text-text transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text/70 hover:text-text transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-serif text-lg text-text mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-text/70 hover:text-text transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-text/70 hover:text-text transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-text/70 hover:text-text transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/status" className="text-text/70 hover:text-text transition-colors text-sm">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="max-w-md mx-auto md:mx-0">
            <h4 className="font-serif text-lg text-text mb-4 text-center md:text-left">
              Stay Updated
            </h4>
            <p className="text-text/70 text-sm mb-4 text-center md:text-left">
              Get the latest updates on new features and reading insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background rounded-xl border border-border focus:border-accent1 focus:ring-2 focus:ring-accent1/20 transition-all outline-none text-sm"
              />
              <button className="bg-gradient-to-r from-accent1 to-accent2 text-text px-6 py-3 rounded-xl hover:shadow-lg transition-all font-medium text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-text/60 text-sm">
              <span>© {currentYear} ReadFlow. Made with</span>
              <FiHeart className="text-accent1" />
              <span>for readers everywhere.</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-text/60">
              <Link to="/privacy" className="hover:text-text transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-text transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-text transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
