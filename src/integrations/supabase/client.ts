import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Functions for user profiles
export async function getUserProfile(username: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function createUserProfile(username: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([{ username, score: 0 }])
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    return null;
  }

  return data;
}

export async function updateUserScore(username: string, score: number) {
  const { error } = await supabase
    .from("user_profiles")
    .update({ score })
    .eq("username", username);

  if (error) {
    console.error("Error updating user score:", error);
    return false;
  }

  return true;
}

// Functions for leaderboard
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data;
}

export async function resetAllProfiles() {
  const { error } = await supabase
    .from("user_profiles")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // This ensures we delete all records

  if (error) {
    console.error("Error resetting profiles:", error);
    return false;
  }

  console.log("All profiles have been reset successfully");
  return true;
}
