import Header from '../components/Header';
import UploadArea from '../components/UploadArea';
import { FiBookOpen} from 'react-icons/fi';
import { FaFeatherAlt } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";

const Landing = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full scroll-snap-y overflow-y-auto">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-accent1/20 text-text px-4 py-2 rounded-full mb-8 border border-accent1/30">
              <LuSparkles className="text-accent1" />
              <span className="text-sm font-medium">Where documents become stories</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-light text-text mb-6 leading-tight">
              Transform Your
              <span className="text-accent1"> Reading</span>
            </h1>

            <p className="text-xl text-text/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Turn static PDFs into dynamic, personalized stories with AI-powered narrative transformation.
              Experience documents like never before.
            </p>

            <UploadArea />
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center justify-center scroll-snap-start px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-text text-center mb-16">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiBookOpen,
                  title: "Smart Processing",
                  description: "AI analyzes document structure and extracts key content automatically"
                },
                {
                  icon: FaFeatherAlt,
                  title: "Story Transformation",
                  description: "Convert technical content into engaging narratives based on your interests"
                },
                {
                  icon: LuSparkles,
                  title: "Dual Mode Reading",
                  description: "Switch between professional Direct Mode and immersive Story Mode"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-border shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-r from-accent1 to-accent2 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="text-white text-3xl" />
                  </div>
                  <h3 className="font-serif text-2xl text-text mb-4">{feature.title}</h3>
                  <p className="text-text/70 text-lg leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
