import { Button } from "@/components/ui/button";

export function PremiumFeature() {
  return (
    <div className="bg-gradient-to-r from-secondary-dark to-primary-dark text-white rounded-xl overflow-hidden shadow-lg mb-8">
      <div className="px-6 py-8 md:flex items-center justify-between">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <span className="inline-block bg-white text-primary-DEFAULT text-xs font-bold px-3 py-1 rounded-full mb-4">PREMIUM FEATURE</span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Connect with Eco-Travelers Nearby</h2>
          <p className="mb-6 text-white/80">Find like-minded travelers in your area, join sustainable group activities, and make new friends who share your passion for green travel.</p>
          <div className="flex space-x-4">
            <Button className="bg-white text-primary-DEFAULT hover:bg-neutral-lightest font-bold py-2 px-6 rounded-full transition shadow-md">
              Upgrade Now
            </Button>
            <Button variant="outline" className="border border-white text-white hover:bg-white/10 font-medium py-2 px-6 rounded-full transition">
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end">
          <img 
            src="https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
            alt="Group of travelers connecting" 
            className="rounded-lg shadow-lg max-w-full h-auto" 
          />
        </div>
      </div>
    </div>
  );
}
