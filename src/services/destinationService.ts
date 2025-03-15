import { supabase } from "@/integrations/supabase/client";

export interface Destination {
  id: string;
  city: string;
  country: string;
  clues: string[];
  fun_facts: string[];
  trivia: string[];
}

export const getRandomDestination = async (): Promise<Destination | null> => {
  try {
    // Query to get all destinations IDs
    const { data: destinationIds, error: idsError } = await supabase
      .from("destinations")
      .select("id");

    if (idsError) {
      console.error("Error fetching destination IDs:", idsError);
      return null;
    }

    if (!destinationIds || destinationIds.length === 0) {
      console.error("No destinations found");
      return null;
    }

    // Pick a random ID from the results
    const randomIndex = Math.floor(Math.random() * destinationIds.length);
    const randomId = destinationIds[randomIndex].id;

    // Get the full destination data for the random ID
    const { data: destination, error: destError } = await supabase
      .from("destinations")
      .select("*")
      .eq("id", randomId)
      .single();

    if (destError) {
      console.error("Error fetching random destination:", destError);
      return null;
    }

    return destination as Destination;
  } catch (error) {
    console.error("Unexpected error fetching random destination:", error);
    return null;
  }
};

export const getRandomOptions = async (
  correctAnswer: string,
  count: number = 3
): Promise<string[]> => {
  try {
    // Fetch all cities from the destinations table
    const { data: allCities, error } = await supabase
      .from("destinations")
      .select("city");

    if (error) {
      console.error("Error fetching cities:", error);
      return getRandomOptionsLocal(correctAnswer, count); // Fallback to local option generation
    }

    if (!allCities || allCities.length === 0) {
      console.error("No cities found in the database");
      return getRandomOptionsLocal(correctAnswer, count); // Fallback to local option generation
    }

    const cities = allCities.map((destination) => destination.city);

    const otherCities = cities.filter((city) => city !== correctAnswer);

    const randomCities = otherCities
      .sort(() => 0.5 - Math.random())
      .slice(0, count);

    // Combine the correct answer with the random cities and shuffle
    const allOptions = [...randomCities, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    return allOptions;
  } catch (error) {
    console.error("Unexpected error fetching options:", error);
    return getRandomOptionsLocal(correctAnswer, count); 
  }
};

const getRandomOptionsLocal = (
  correctAnswer: string,
  count: number = 3
): string[] => {
  // Fetch all cities from the dataset (if available) or use a hardcoded list
  const cities = [
    "Paris",
    "Tokyo",
    "New York",
    "Venice",
    "Sydney",
    "London",
    "Cairo",
    "Rome",
    "Rio de Janeiro",
    "Bangkok",
    "Dubai",
    "Berlin",
    "Moscow",
    "Amsterdam",
    "Singapore",
    "Hong Kong",
    "Madrid",
    "Seoul",
    "Toronto",
  ];

  const options = cities
    .filter((city) => city !== correctAnswer)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  return [...options, correctAnswer].sort(() => 0.5 - Math.random());
};
