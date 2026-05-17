// A comprehensive carbon footprint calculator for travel activities

type TransportMode = 'walking' | 'cycling' | 'car' | 'electric_car' | 'bus' | 'train' | 'domestic_flight' | 'international_flight';
type AccommodationType = 'hotel' | 'eco_hotel' | 'hostel' | 'camping';
type FoodChoice = 'standard' | 'vegetarian' | 'vegan' | 'local_organic';
type ActivityType = 'standard_tourist' | 'eco_tour' | 'nature_conservation' | 'cultural_education';

// CO2 emissions in kg per kilometer for different transport modes
const TRANSPORT_EMISSIONS: Record<TransportMode, number> = {
  walking: 0,
  cycling: 0,
  car: 0.192, // Average petrol car
  electric_car: 0.053, // Electric car
  bus: 0.105, // Public bus
  train: 0.041, // Train
  domestic_flight: 0.255, // Short-haul flight
  international_flight: 0.195 // Long-haul flight (more efficient per km but longer distances)
};

// Average traveler emissions by transport mode (kg CO2 per kilometer)
const AVERAGE_TRAVELER_TRANSPORT: Record<string, number> = {
  car: 0.192, // Most travelers use standard cars
  flight: 0.255, // Many tourists rely on flights
  overall: 0.170 // Weighted average across all modes
};

// CO2 emissions in kg per night for different accommodation types
const ACCOMMODATION_EMISSIONS: Record<AccommodationType, number> = {
  hotel: 15.13, // Standard hotel
  eco_hotel: 8.05, // Eco-certified hotel
  hostel: 5.2, // Hostel
  camping: 2.5 // Camping
};

// Average traveler accommodation emissions
const AVERAGE_TRAVELER_ACCOMMODATION = 18.3; // kg CO2 per night (typically standard hotels)

// CO2 emissions in kg per day for different food choices
const FOOD_EMISSIONS: Record<FoodChoice, number> = {
  standard: 7.2, // Standard diet with meat
  vegetarian: 3.8, // Vegetarian diet
  vegan: 2.5, // Vegan diet
  local_organic: 1.8 // Local & organic plant-based diet
};

// Average traveler food emissions
const AVERAGE_TRAVELER_FOOD = 7.2; // kg CO2 per day (standard diet while traveling)

// CO2 emissions in kg per day for different activity types
const ACTIVITY_EMISSIONS: Record<ActivityType, number> = {
  standard_tourist: 8.5, // Standard tourist activities
  eco_tour: 4.2, // Eco-friendly guided tours
  nature_conservation: 2.8, // Nature conservation activities
  cultural_education: 3.5 // Cultural and educational activities
};

// Average traveler activity emissions
const AVERAGE_TRAVELER_ACTIVITY = 8.5; // kg CO2 per day (standard tourist activities)

/**
 * Calculate carbon emissions for transportation
 * @param mode Transport mode
 * @param distance Distance in kilometers
 * @returns Carbon emissions in kg CO2
 */
export function calculateTransportEmissions(mode: TransportMode, distance: number): number {
  return TRANSPORT_EMISSIONS[mode] * distance;
}

/**
 * Calculate carbon emissions for accommodation
 * @param type Accommodation type
 * @param nights Number of nights
 * @returns Carbon emissions in kg CO2
 */
export function calculateAccommodationEmissions(type: AccommodationType, nights: number): number {
  return ACCOMMODATION_EMISSIONS[type] * nights;
}

/**
 * Calculate carbon emissions for food choices
 * @param choice Food choice
 * @param days Number of days
 * @returns Carbon emissions in kg CO2
 */
export function calculateFoodEmissions(choice: FoodChoice, days: number): number {
  return FOOD_EMISSIONS[choice] * days;
}

/**
 * Calculate carbon emissions for activities
 * @param type Activity type
 * @param days Number of days
 * @returns Carbon emissions in kg CO2
 */
export function calculateActivityEmissions(type: ActivityType, days: number): number {
  return ACTIVITY_EMISSIONS[type] * days;
}

/**
 * Calculate carbon savings compared to standard options
 * @param mode Transport mode used
 * @param standardMode Standard transport mode that would have been used
 * @param distance Distance in kilometers
 * @returns Carbon savings in kg CO2
 */
export function calculateTransportSavings(mode: TransportMode, standardMode: TransportMode, distance: number): number {
  const standardEmissions = TRANSPORT_EMISSIONS[standardMode] * distance;
  const actualEmissions = TRANSPORT_EMISSIONS[mode] * distance;
  return Math.max(0, standardEmissions - actualEmissions);
}

/**
 * Calculate total carbon footprint for a trip
 * @param transport Array of transport segments
 * @param accommodation Array of accommodation stays
 * @param foodChoice Food choice during the trip
 * @param activityType Primary activity type
 * @param days Total trip days
 * @returns Total carbon footprint in kg CO2
 */
export function calculateTripFootprint(
  transport: Array<{ mode: TransportMode; distance: number }>,
  accommodation: Array<{ type: AccommodationType; nights: number }>,
  foodChoice: FoodChoice = 'standard',
  activityType: ActivityType = 'standard_tourist',
  days: number = 0
): number {
  const transportEmissions = transport.reduce(
    (total, { mode, distance }) => total + calculateTransportEmissions(mode, distance),
    0
  );
  
  const accommodationEmissions = accommodation.reduce(
    (total, { type, nights }) => total + calculateAccommodationEmissions(type, nights),
    0
  );

  // If days is not provided, calculate from accommodation nights
  if (days === 0) {
    days = accommodation.reduce((total, { nights }) => total + nights, 0);
  }
  
  const foodEmissions = calculateFoodEmissions(foodChoice, days);
  const activityEmissions = calculateActivityEmissions(activityType, days);
  
  return transportEmissions + accommodationEmissions + foodEmissions + activityEmissions;
}

/**
 * Calculate estimated carbon savings for a trip compared to standard options
 * @param transport Array of transport segments with standard alternatives
 * @param accommodation Array of accommodation stays with standard alternatives
 * @param foodChoice Food choice during the trip
 * @param activityType Primary activity type
 * @param days Total trip days
 * @returns Total carbon savings in kg CO2
 */
export function calculateTripSavings(
  transport: Array<{ mode: TransportMode; standardMode: TransportMode; distance: number }>,
  accommodation: Array<{ type: AccommodationType; standardType: AccommodationType; nights: number }>,
  foodChoice: FoodChoice = 'standard',
  activityType: ActivityType = 'standard_tourist',
  days: number = 0
): number {
  const transportSavings = transport.reduce(
    (total, { mode, standardMode, distance }) => 
      total + calculateTransportSavings(mode, standardMode, distance),
    0
  );
  
  const accommodationSavings = accommodation.reduce(
    (total, { type, standardType, nights }) => {
      const standardEmissions = ACCOMMODATION_EMISSIONS[standardType] * nights;
      const actualEmissions = ACCOMMODATION_EMISSIONS[type] * nights;
      return total + Math.max(0, standardEmissions - actualEmissions);
    },
    0
  );

  // If days is not provided, calculate from accommodation nights
  if (days === 0) {
    days = accommodation.reduce((total, { nights }) => total + nights, 0);
  }
  
  const foodSavings = (FOOD_EMISSIONS['standard'] - FOOD_EMISSIONS[foodChoice]) * days;
  const activitySavings = (ACTIVITY_EMISSIONS['standard_tourist'] - ACTIVITY_EMISSIONS[activityType]) * days;
  
  return transportSavings + accommodationSavings + foodSavings + activitySavings;
}

/**
 * Compare a trip's carbon footprint to an average traveler
 * @param transport Array of transport segments
 * @param accommodation Array of accommodation stays
 * @param foodChoice Food choice during the trip
 * @param activityType Primary activity type
 * @returns Comparison object with user and average footprints, percentage difference
 */
export function compareToAverageTraveler(
  transport: Array<{ mode: TransportMode; distance: number }>,
  accommodation: Array<{ type: AccommodationType; nights: number }>,
  foodChoice: FoodChoice = 'standard',
  activityType: ActivityType = 'standard_tourist'
): {
  userFootprint: number,
  averageTravelerFootprint: number,
  percentageDifference: number,
  breakdown: {
    transport: { user: number, average: number, savings: number },
    accommodation: { user: number, average: number, savings: number },
    food: { user: number, average: number, savings: number },
    activities: { user: number, average: number, savings: number }
  }
} {
  // Calculate total distance and nights
  const totalDistance = transport.reduce((sum, { distance }) => sum + distance, 0);
  const totalNights = accommodation.reduce((sum, { nights }) => sum + nights, 0);
  const days = totalNights > 0 ? totalNights : 1;
  
  // User footprint components
  const userTransport = transport.reduce(
    (total, { mode, distance }) => total + calculateTransportEmissions(mode, distance),
    0
  );
  
  const userAccommodation = accommodation.reduce(
    (total, { type, nights }) => total + calculateAccommodationEmissions(type, nights),
    0
  );
  
  const userFood = calculateFoodEmissions(foodChoice, days);
  const userActivities = calculateActivityEmissions(activityType, days);
  const userFootprint = userTransport + userAccommodation + userFood + userActivities;
  
  // Average traveler footprint components
  const avgTransport = AVERAGE_TRAVELER_TRANSPORT.overall * totalDistance;
  const avgAccommodation = AVERAGE_TRAVELER_ACCOMMODATION * totalNights;
  const avgFood = AVERAGE_TRAVELER_FOOD * days;
  const avgActivities = AVERAGE_TRAVELER_ACTIVITY * days;
  const averageTravelerFootprint = avgTransport + avgAccommodation + avgFood + avgActivities;
  
  // Calculate percentage difference (negative means user is better than average)
  const percentageDifference = 
    averageTravelerFootprint > 0 
      ? ((userFootprint - averageTravelerFootprint) / averageTravelerFootprint) * 100
      : 0;
  
  return {
    userFootprint,
    averageTravelerFootprint,
    percentageDifference,
    breakdown: {
      transport: { 
        user: userTransport, 
        average: avgTransport, 
        savings: avgTransport - userTransport 
      },
      accommodation: { 
        user: userAccommodation, 
        average: avgAccommodation, 
        savings: avgAccommodation - userAccommodation 
      },
      food: { 
        user: userFood, 
        average: avgFood, 
        savings: avgFood - userFood 
      },
      activities: { 
        user: userActivities, 
        average: avgActivities, 
        savings: avgActivities - userActivities 
      }
    }
  };
}

/**
 * Calculate environmental impact equivalents for a given carbon footprint
 * @param carbonAmount Carbon footprint in kg CO2
 * @returns Object with various equivalents
 */
export function getEnvironmentalEquivalents(carbonAmount: number) {
  return {
    treesNeeded: Math.round(carbonAmount / 25), // Trees needed to absorb this CO2 in a year
    carKilometers: Math.round(carbonAmount / 0.12), // Equivalent to this many km in a standard car
    flightHours: Math.round(carbonAmount / 90), // Equivalent to this many hours on a commercial flight
    homeEnergy: Math.round(carbonAmount / 10.5), // Equivalent to this many days of home energy use
    smartphoneCharges: Math.round(carbonAmount * 1000) // Equivalent to this many smartphone charges
  };
}
