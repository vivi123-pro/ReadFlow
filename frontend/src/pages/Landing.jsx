import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadArea from '../components/UploadArea';
import { FiBookOpen, FiUsers, FiTrendingUp, FiShield, FiStar, FiArrowRight } from 'react-icons/fi';
import { FaFeatherAlt } from "react-icons/fa";
import { LuSparkles, LuZap, LuHeart } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full scroll-snap-y overflow-y-auto">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-accent1/10 text-accent1 px-4 py-2 rounded-full mb-8 border border-accent1/30">
              <LuSparkles className="text-accent1" />
              <span className="text-sm font-medium">Where documents become stories</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-light text-text mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-accent1 to-accent2 bg-clip-text text-transparent"> Reading</span>
            </h1>

            <p className="text-xl text-text/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Turn static PDFs into dynamic, personalized stories with AI-powered narrative transformation.
              Experience documents like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-accent1 to-accent2 text-text px-8 py-4 rounded-2xl hover:shadow-lg transition-all font-medium flex items-center space-x-2"
              >
                <span>Start Your Journey</span>
                <FiArrowRight className="text-lg" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-text/70 hover:text-text transition-colors font-medium"
              >
                Already have an account? Sign in
              </button>
            </div>

            <UploadArea />
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light text-text mb-6">
                How It Works
              </h2>
              <p className="text-xl text-text/70 max-w-2xl mx-auto">
                Our AI-powered platform transforms the way you read and understand documents
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: FiBookOpen,
                  title: "Smart Processing",
                  description: "AI analyzes document structure and extracts key content automatically, understanding context and relationships."
                },
                {
                  icon: FaFeatherAlt,
                  title: "Story Transformation",
                  description: "Convert technical content into engaging narratives based on your interests and reading preferences."
                },
                {
                  icon: LuSparkles,
                  title: "Dual Mode Reading",
                  description: "Switch between professional Direct Mode and immersive Story Mode for different reading experiences."
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-border shadow-sm hover:shadow-lg transition-all">
                  <div className="w-20 h-20 bg-gradient-to-r from-accent1 to-accent2 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="font-serif text-2xl text-text mb-4">{feature.title}</h3>
                  <p className="text-text/70 text-lg leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-8 mb-20">
              {[
                { number: "10K+", label: "Documents Processed" },
                { number: "5K+", label: "Happy Readers" },
                { number: "95%", label: "Satisfaction Rate" },
                { number: "24/7", label: "AI Processing" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-border">
                  <div className="text-3xl font-serif font-light text-black mb-2">{stat.number}</div>
                  <div className="text-text/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light text-text mb-6">
                Why Choose Narrate?
              </h2>
              <p className="text-xl text-text/70 max-w-2xl mx-auto">
                Experience the future of document reading with our innovative AI-powered platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: LuZap,
                  title: "Lightning Fast",
                  description: "Process documents in seconds with our advanced AI algorithms and cloud infrastructure."
                },
                {
                  icon: FiShield,
                  title: "Secure & Private",
                  description: "Your documents are encrypted and processed securely. We never store your personal data."
                },
                {
                  icon: FiUsers,
                  title: "Personalized Experience",
                  description: "AI learns your preferences and adapts content to match your reading style and interests."
                },
                {
                  icon: FiTrendingUp,
                  title: "Track Progress",
                  description: "Monitor your reading habits and get insights into your document consumption patterns."
                },
                {
                  icon: LuHeart,
                  title: "Engaging Stories",
                  description: "Transform boring documents into captivating narratives that keep you engaged."
                },
                {
                  icon: FiStar,
                  title: "Premium Quality",
                  description: "Experience the highest quality document processing with our state-of-the-art AI models."
                }
              ].map((benefit, index) => (
                <div key={index} className="p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-border hover:border-accent1/50 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent1 to-accent2 rounded-2xl flex items-center justify-center mb-4">
                    <benefit.icon className="text-white text-xl" />
                  </div>
                  <h3 className="font-serif text-xl text-text mb-3">{benefit.title}</h3>
                  <p className="text-text/70 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-text mb-6">
              Ready to Transform Your Reading?
            </h2>
            <p className="text-xl text-text/70 mb-12 max-w-2xl mx-auto">
              Join thousands of readers who have discovered a new way to experience documents.
              Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-accent1 to-accent2 text-text px-8 py-4 rounded-2xl hover:shadow-lg transition-all font-medium text-lg flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="text-lg" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-text/70 hover:text-text transition-colors font-medium text-lg"
              >
                Sign In to Your Account
              </button>
            </div>

            <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-border">
              <p className="text-text/70 text-sm">
                ✨ No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
