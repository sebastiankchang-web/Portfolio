import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Bookings } from "@/components/home/Bookings";

export default function Book() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Eco-Friendly Bookings</h1>
            <p className="text-neutral-medium">Find and book sustainable accommodations and transportation to reduce your travel footprint.</p>
          </div>
          
          <Bookings />
          
          {/* Booking Benefits */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="font-heading text-2xl font-bold mb-6 text-center">Why Book Eco-Friendly Travel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-leaf text-2xl text-primary-DEFAULT"></i>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Reduce Carbon Footprint</h3>
                <p className="text-neutral-medium text-sm">Our eco-friendly options help minimize your environmental impact while still enjoying incredible travel experiences.</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-heart text-2xl text-primary-DEFAULT"></i>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Support Sustainable Businesses</h3>
                <p className="text-neutral-medium text-sm">By choosing eco-certified accommodations and services, you support businesses committed to environmental responsibility.</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-medal text-2xl text-primary-DEFAULT"></i>
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Earn Eco Rewards</h3>
                <p className="text-neutral-medium text-sm">Accumulate points and unlock special vouchers for future bookings as you make sustainable travel choices.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
