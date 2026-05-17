import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-dark text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">About EcoTravel</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-light hover:text-white">Our Mission</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Sustainability Commitment</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">How It Works</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Carbon Calculation</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Help Center</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-light hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Contact Support</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Booking Terms</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Cancellation Policy</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Safety Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Destinations</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-light hover:text-white">Eco-friendly Cities</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">National Parks</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Conservation Areas</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Sustainable Resorts</a></li>
              <li><a href="#" className="text-neutral-light hover:text-white">Cultural Experiences</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Stay Connected</h3>
            <p className="text-neutral-light mb-4">Subscribe to our newsletter for sustainable travel tips and exclusive offers.</p>
            <div className="flex mb-4">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg bg-neutral-lightest focus:outline-none flex-grow"
              />
              <Button className="bg-primary-DEFAULT hover:bg-primary-dark text-white px-4 py-2 rounded-r-lg transition">
                Subscribe
              </Button>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-light"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white hover:text-primary-light"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white hover:text-primary-light"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white hover:text-primary-light"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-medium/30 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Leaf className="text-primary-light text-xl mr-2" />
            <h2 className="font-heading font-bold text-lg">EcoTravel</h2>
          </div>
          <p className="text-neutral-light text-sm">© {new Date().getFullYear()} EcoTravel. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-light hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-light hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-light hover:text-white text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
