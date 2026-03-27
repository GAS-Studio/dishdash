import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from '../lib/supabase';

// Required for web to complete the auth session
if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export function useGoogleAuth() {
  const signInWithGoogle = async () => {
    try {
      // Get the redirect URL based on platform
      const redirectUrl = Platform.OS === 'web'
        ? window.location.origin
        : makeRedirectUri({ scheme: 'dishdash' });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) throw error;

      // On native, open the browser manually
      if (Platform.OS !== 'web' && data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success' && result.url) {
          // Extract the access token and refresh token from the URL
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
          }
        }
      }
      // On web, the redirect happens automatically
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  return { signInWithGoogle };
}
