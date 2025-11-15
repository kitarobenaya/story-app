import { nanoid } from "nanoid";

export function getAnonId() {
    const STORAGE_KEY = 'anonId';
    
    // Check if anonId already exists in localStorage
    let anonId = localStorage.getItem(STORAGE_KEY);
    
    // If it doesn't exist, generate a new one and store it
    if (!anonId) {
      anonId = nanoid();
      localStorage.setItem(STORAGE_KEY, anonId);
    }
    
    return anonId;
  }