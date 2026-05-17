import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertTripSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Image, Calculator } from "lucide-react";
import { calculateTripSavings } from "@/lib/carbonCalculator";

// Extend the trip schema with validation
const tripFormSchema = insertTripSchema.extend({
  startDate: z.date({
    required_error: "A start date is required",
  }),
  endDate: z.date({
    required_error: "An end date is required",
  }).refine(date => date > new Date(), {
    message: "End date must be in the future",
  }),
  // Make description required for form validation
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters",
  }),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"], 
});

type TripFormValues = z.infer<typeof tripFormSchema>;

export default function AddTrip() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [transportMode, setTransportMode] = useState<string>("train");

  // Create form
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week trip
      imageUrl: "",
      carbonSaved: 0,
      isCompleted: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: TripFormValues) => {
      // Calculate carbon saved based on transport mode
      let carbonSaved = 0;
      if (transportMode === "train") {
        carbonSaved = calculateTripSavings(
          [{ mode: 'train', standardMode: 'car', distance: 500 }],
          [{ type: 'eco_hotel', standardType: 'hotel', nights: 5 }]
        );
      } else if (transportMode === "bus") {
        carbonSaved = calculateTripSavings(
          [{ mode: 'bus', standardMode: 'car', distance: 300 }],
          [{ type: 'eco_hotel', standardType: 'hotel', nights: 5 }]
        );
      } else if (transportMode === "electric_car") {
        carbonSaved = calculateTripSavings(
          [{ mode: 'electric_car', standardMode: 'car', distance: 400 }],
          [{ type: 'eco_hotel', standardType: 'hotel', nights: 5 }]
        );
      }

      // Update form values with calculated carbon savings
      values.carbonSaved = Math.round(carbonSaved);
      
      // Make API call
      const response = await apiRequest("POST", "/api/trips", values);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trip created successfully",
        description: "Your eco-friendly trip has been added",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/trips/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/trips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to create trip",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: TripFormValues) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    mutation.mutate(values);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("imageUrl", url);
    setImagePreview(url);
  };

  const handleTransportChange = (mode: string) => {
    setTransportMode(mode);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated && !authLoading) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Plan Your Eco-Friendly Trip</h1>
            <p className="text-neutral-medium">Create a sustainable travel plan and track your environmental impact.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Title</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Weekend Hiking Trip - Mt. Rainier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-medium" />
                          <Input className="pl-10" placeholder="City, National Park, or Region" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your eco-friendly travel plans, activities, and sustainable choices..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Image className="absolute left-3 top-3 h-4 w-4 text-neutral-medium" />
                          <Input 
                            className="pl-10" 
                            placeholder="Paste image URL here" 
                            {...field} 
                            onChange={handleImageChange}
                          />
                        </div>
                      </FormControl>
                      {imagePreview && (
                        <div className="mt-2 rounded-md overflow-hidden h-40">
                          <img 
                            src={imagePreview} 
                            alt="Trip preview" 
                            className="w-full h-full object-cover"
                            onError={() => setImagePreview(null)}
                          />
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Transportation Mode</FormLabel>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <Button 
                      type="button"
                      variant={transportMode === "train" ? "default" : "outline"}
                      className={transportMode === "train" ? "bg-primary-DEFAULT" : ""}
                      onClick={() => handleTransportChange("train")}
                    >
                      <i className="fas fa-train mr-2"></i>
                      Train
                    </Button>
                    <Button 
                      type="button"
                      variant={transportMode === "bus" ? "default" : "outline"}
                      className={transportMode === "bus" ? "bg-primary-DEFAULT" : ""}
                      onClick={() => handleTransportChange("bus")}
                    >
                      <i className="fas fa-bus mr-2"></i>
                      Bus
                    </Button>
                    <Button 
                      type="button"
                      variant={transportMode === "electric_car" ? "default" : "outline"}
                      className={transportMode === "electric_car" ? "bg-primary-DEFAULT" : ""}
                      onClick={() => handleTransportChange("electric_car")}
                    >
                      <i className="fas fa-car mr-2"></i>
                      Electric Car
                    </Button>
                  </div>
                </div>
                
                <div className="bg-primary-light/10 p-4 rounded-lg flex items-center">
                  <Calculator className="text-primary-DEFAULT h-8 w-8 mr-3" />
                  <div>
                    <h3 className="font-medium text-primary-DEFAULT">Estimated Carbon Savings</h3>
                    <p className="text-sm text-neutral-dark">By choosing sustainable transport, you'll save approximately:</p>
                    <p className="font-bold text-success mt-1">
                      {transportMode === "train" ? "25" : transportMode === "bus" ? "18" : "15"} kg CO₂
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary-DEFAULT hover:bg-primary-dark"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Creating..." : "Create Trip"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
