import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * A React context that exposes the current Supabase user and loading state.
 * Components can subscribe to this context to determine whether the user is
 * authenticated.  The provider listens to auth state changes from Supabase
 * and updates subscribers accordingly.
 */
export const AuthContext = createContext({ user: null, loading: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the current session on mount
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Subscribe to auth state changes.  When a user logs in or out the
    // subscription callback will run and update the context state.
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};