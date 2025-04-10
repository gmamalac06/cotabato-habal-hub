
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, MotorcycleIcon, MapPin, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

const features = [
  {
    icon: MapPin,
    title: "Easy Booking",
    description: "Book a habal-habal ride with just a few taps. Specify your pickup and drop-off locations quickly.",
  },
  {
    icon: MotorcycleIcon,
    title: "Verified Drivers",
    description: "All our drivers are verified and trained to ensure your safety and comfort during rides.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Options",
    description: "Pay with GCash, PayMaya, or cash. Choose what works best for you.",
  },
  {
    icon: Star,
    title: "Rate Your Experience",
    description: "Provide feedback after each ride to help us maintain high-quality service.",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Regular Passenger",
    content: "Habal Hub has made traveling around Cotabato City so much easier. The drivers are punctual and respectful.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Juan Dela Cruz",
    role: "Business Owner",
    content: "As someone who needs to move around the city for meetings, this app is a lifesaver. Reliable and convenient!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Pedro Penduko",
    role: "Habal-Habal Driver",
    content: "Since joining as a driver, my daily income has increased significantly. The platform is easy to use!",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-habal-700 text-white py-16 md:py-24">
        <div className="habal-container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Convenient Habal-Habal Rides in Cotabato City
              </h1>
              <p className="text-lg opacity-90">
                Quick, affordable, and reliable motorcycle taxi service at your fingertips. Book your ride now!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1770&auto=format&fit=crop" 
                alt="Motorcycle taxi" 
                className="rounded-lg shadow-xl object-cover h-96 w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="habal-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Habal Hub?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're transforming transportation in Cotabato City with our easy-to-use platform connecting riders and drivers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="dashboard-card">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-secondary">
        <div className="habal-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting a ride with Habal Hub is simple and straightforward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="dashboard-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up as a rider or driver with your basic information.
              </p>
            </div>
            
            <div className="dashboard-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Book a Ride</h3>
              <p className="text-muted-foreground">
                Specify your pickup and destination, then confirm your booking.
              </p>
            </div>
            
            <div className="dashboard-card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy Your Ride</h3>
              <p className="text-muted-foreground">
                Once matched with a driver, track their arrival and enjoy your trip.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="habal-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What People Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from our satisfied users across Cotabato City.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="dashboard-card">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-habal-500 text-white">
        <div className="habal-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Try Habal Hub?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of satisfied users and experience convenient transportation in Cotabato City.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
                <Link to="/register">
                  Sign Up Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="habal-container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MotorcycleIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-heading text-lg font-bold">Habal Hub</span>
              </div>
              <p className="text-sm text-gray-300">
                The most convenient way to get around Cotabato City.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <p className="text-sm text-gray-300 mb-2">
                Cotabato City, Philippines
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Email: support@habalhub.com
              </p>
              <p className="text-sm text-gray-300">
                Phone: +63 917 123 4567
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; {new Date().getFullYear()} Habal Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
