'use client';

import { useState, useEffect, useCallback } from 'react';

export type ProfileData = {
  degreeProgram: string;
  year: string;
  interests: string;
};

const initialProfile: ProfileData = {
  degreeProgram: '',
  year: '',
  interests: '',
};

const PROFILE_STORAGE_KEY = 'tigersource_profile';

export function useProfile() {
  const [profile, setProfileState] = useState<ProfileData>(initialProfile);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to load profile from local storage', error);
    } finally {
      setIsProfileLoaded(true);
    }
  }, []);

  const setProfile = useCallback((newProfile: ProfileData) => {
    try {
      setProfileState(newProfile);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error('Failed to save profile to local storage', error);
    }
  }, []);

  return { profile, setProfile, isProfileLoaded };
}
