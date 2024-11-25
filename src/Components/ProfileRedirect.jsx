import React, { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        // If no session exists, user is not logged in; do nothing
        if (sessionError || !session) {
          console.log('No session or user not logged in');
          setLoading(false);
          return;
        }

        const user = session.user;

        // If user ID is missing, handle error
        if (!user?.id) {
          console.error('No user ID found in session.');
          setLoading(false);
          return;
        }

        // Check for an existing profile
        let { data, error: profileError } = await supabase
          .from('UserProfile')
          .select('profile_complete')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Profile not found. Creating default profile:', profileError);

          // Create default profile if none exists
          const { error: insertError } = await supabase.from('UserProfile').insert({
            user_id: user.id,
            profile_complete: false, // Default to incomplete
          });

          if (insertError) {
            console.error('Error creating default profile:', insertError);
            setLoading(false);
            return;
          }

          // Redirect to ProfileManagement after creating profile
          navigate('/profile-management');
          setLoading(false);
          return;
        }

        // Redirect if the profile is incomplete
        if (data.profile_complete === false) {
          navigate('/profile-management');
        }

        setLoading(false);
      } catch (error) {
        console.error('Unexpected error during profile check:', error);
        setLoading(false);
      }
    };

    // Run the profile check on mount
    checkUserProfile();

    // Set up the listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUserProfile();
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe(); // Correctly handle cleanup
    };
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>; // Optional loading indicator
  }

  return null;
};

export default ProfileRedirect;