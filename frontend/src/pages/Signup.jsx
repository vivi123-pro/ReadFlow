import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import Header from '../components/Header';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validation
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordReqs = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!Object.values(passwordReqs).every(Boolean)) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      console.log('Signup attempt:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, accept any valid form data
      // In real app, this would be an API call to your backend
      navigate('/onboarding');
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordReqs = validatePassword(formData.password);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-text mb-2">Join ReadFlow</h1>
            <p className="text-text/70">Start your personalized reading journey</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text/70 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1 text-sm" />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-background rounded-xl border focus:ring-2 focus:ring-accent1/20 transition-all outline-none text-sm ${
                        errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent1'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text/70 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1 text-sm" />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-background rounded-xl border focus:ring-2 focus:ring-accent1/20 transition-all outline-none text-sm ${
                        errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent1'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text/70 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-background rounded-2xl border focus:ring-2 focus:ring-accent1/20 transition-all outline-none ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent1'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-background rounded-2xl border focus:ring-2 focus:ring-accent1/20 transition-all outline-none ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent1'
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text/70 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center space-x-2 text-xs ${passwordReqs.length ? 'text-green-600' : 'text-text/50'}`}>
                    <FiCheck className={`text-xs ${passwordReqs.length ? 'opacity-100' : 'opacity-0'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${passwordReqs.uppercase ? 'text-green-600' : 'text-text/50'}`}>
                    <FiCheck className={`text-xs ${passwordReqs.uppercase ? 'opacity-100' : 'opacity-0'}`} />
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${passwordReqs.lowercase ? 'text-green-600' : 'text-text/50'}`}>
                    <FiCheck className={`text-xs ${passwordReqs.lowercase ? 'opacity-100' : 'opacity-0'}`} />
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-xs ${passwordReqs.number ? 'text-green-600' : 'text-text/50'}`}>
                    <FiCheck className={`text-xs ${passwordReqs.number ? 'opacity-100' : 'opacity-0'}`} />
                    <span>One number</span>
                  </div>
                </div>

                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text/70 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent1" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-background rounded-2xl border focus:ring-2 focus:ring-accent1/20 transition-all outline-none ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-border focus:border-accent1'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-text/70 transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-accent1 bg-background border-border rounded focus:ring-accent1/20 focus:ring-2"
                  />
                  <span className="text-sm text-text/70">
                    I agree to the{' '}
                    <Link to="/terms" className="text-accent1 hover:text-accent2 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-accent1 hover:text-accent2 transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-accent1 to-accent2 text-text py-4 rounded-2xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-text/30 border-t-text rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-text/70">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-accent1 hover:text-accent2 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
