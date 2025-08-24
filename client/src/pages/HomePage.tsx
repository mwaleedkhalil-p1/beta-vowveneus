import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Calendar, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Easy Search",
      description: "Find your perfect wedding venue with our advanced search and filtering system"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Availability Check",
      description: "Check real-time availability and book your preferred date instantly"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Curated Venues",
      description: "Handpicked selection of the most beautiful and reliable wedding venues"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location Services",
      description: "Get directions and explore venues in your preferred location"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        >
          <img
            src="/banner.png"
            alt="Wedding Venue"
            className="w-full h-full object-cover brightness-50"
          />
        </motion.div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Your Perfect Wedding Venue Awaits
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover and book the most beautiful wedding venues for your special day. 
              Start your journey to finding the perfect venue with us.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {user ? (
                <Link href="/venues">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Explore Venues <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Sign In to Explore Venues <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              )} 

              <Link href="/about">
                <Button 
                  size="lg" 
                  className="bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 transition-transform"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Vow Venues?
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Find Your Dream Venue?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Join thousands of couples who have found their perfect wedding venue through our platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {user ? (
              <Link href="/venues">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                >
                  Start Your Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                >
                  Sign In to Start
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
