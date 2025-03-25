
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import CreateCommunity from "./pages/CreateCommunity";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient();

// Check if storage bucket exists and create it if it doesn't
const checkStorageBucket = async () => {
  try {
    // Try to get bucket information to see if it exists
    const { data: bucket, error } = await supabase.storage.getBucket('avatars');
    
    if (error && error.message.includes('does not exist')) {
      // Bucket doesn't exist, create it
      const { data, error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error('Error creating avatars bucket:', createError);
      } else {
        console.log('Created avatars bucket:', data);
      }
    } else if (error) {
      console.error('Error checking avatars bucket:', error);
    } else {
      console.log('Avatars bucket exists:', bucket);
    }
    
    // Removed the setPublic call as it's not available in the current SDK version
  } catch (err) {
    console.error('Error in checkStorageBucket:', err);
  }
};

const App = () => {
  useEffect(() => {
    checkStorageBucket();
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-community" element={<CreateCommunity />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
