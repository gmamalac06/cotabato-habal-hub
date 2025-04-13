
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, CreditCard, ShieldCheck, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#1E6FD9] text-white py-16 md:py-24 text-center">
        <div className="habal-container">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Your Trusted Habal-Habal Transportation Partner
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-10">
            Experience safe and convenient motorcycle taxi services in Cotabato City
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-[#1E6FD9] hover:bg-white/90">
              <Link to="/register">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/register?role=driver">
                Become a Driver
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="habal-container">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-[#1E6FD9]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Book your ride with just a few taps</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-[#1E6FD9]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Know exactly when your ride will arrive</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-[#1E6FD9]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Drivers</h3>
              <p className="text-gray-600">All our drivers are thoroughly vetted</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-[#1E6FD9]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options available</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="habal-container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#1E6FD9] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Book Your Ride</h3>
              <p className="text-gray-600">Enter your pickup and drop-off locations</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-[#1E6FD9] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Get Matched</h3>
              <p className="text-gray-600">We'll connect you with a nearby driver</p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-[#1E6FD9] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy Your Trip</h3>
              <p className="text-gray-600">Track your ride and pay securely</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#1E6FD9] text-white">
        <div className="habal-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Try Habal Hub?</h2>
            <p className="text-lg opacity-90 mb-8">
              Join thousands of satisfied users in Cotabato City
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-white text-[#1E6FD9] hover:bg-white/90">
                <Link to="/register">
                  Sign Up Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/login">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
