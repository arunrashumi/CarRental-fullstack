// Counterfactual Rental Outcome Engine (CROE)
// Generates explainable "what-if" scenarios for rental outcomes
// Decision intelligence module for comparing actual vs alternative choices

/**
 * Generates counterfactual scenarios for a given booking
 * @param {Object} booking - The actual booking object
 * @param {Array} allCars - List of all available cars for alternatives
 * @param {Array} allLocations - List of all locations for alternatives
 * @returns {Array} Array of counterfactual objects with differences
 */
export const generateCounterfactuals = (booking, allCars, allLocations) => {
  const counterfactuals = [];

  // Counterfactual 1: Different vehicle type (eco alternative)
  if (booking.car.fuel_type.toLowerCase() !== 'electric') {
    const ecoCar = allCars.find(car =>
      car.fuel_type.toLowerCase() === 'electric' &&
      car.category === booking.car.category &&
      car.seating_capacity === booking.car.seating_capacity
    );
    if (ecoCar) {
      const actualEmission = booking.carbonEmission || 0;
      const counterfactualEmission = 0; // electric
      const co2Difference = actualEmission - counterfactualEmission;
      const costDifference = 0; // assume same price
      const onTimeDifference = 5; // % increase for electric reliability

      counterfactuals.push({
        type: 'vehicle',
        description: `If you had chosen an electric ${ecoCar.brand} ${ecoCar.model}`,
        cost: costDifference,
        co2: co2Difference,
        onTime: onTimeDifference
      });
    }
  }

  // Counterfactual 2: Different pickup time (off-peak)
  const pickupHour = new Date(booking.pickupDate).getHours();
  if (pickupHour >= 8 && pickupHour <= 10) { // assume peak
    const costDifference = -booking.price * 0.1; // 10% discount for off-peak
    const co2Difference = 0; // same emissions
    const onTimeDifference = 10; // higher likelihood off-peak

    counterfactuals.push({
      type: 'time',
      description: 'If you had picked up during off-peak hours (e.g., afternoon)',
      cost: costDifference,
      co2: co2Difference,
      onTime: onTimeDifference
    });
  }

  // Counterfactual 3: Different location (nearest alternative)
  const currentLocation = booking.car.location;
  const alternativeLocation = allLocations.find(loc => loc !== currentLocation);
  if (alternativeLocation) {
    const costDifference = 0; // assume same pricing
    const distanceDifference = 50; // assume 50km difference
    const co2Difference = - (distanceDifference / 15) * 2.3; // savings for shorter distance
    const onTimeDifference = -2; // slightly lower due to unfamiliar location

    counterfactuals.push({
      type: 'location',
      description: `If you had picked up from ${alternativeLocation} instead`,
      cost: costDifference,
      co2: co2Difference,
      onTime: onTimeDifference
    });
  }

  return counterfactuals;
};