
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
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient();

// More efficient storage bucket check function
const checkStorageBucket = async () => {
  try {
    // Try to get objects from the bucket to test if it exists
    const { error } = await supabase.storage.from('avatars').list();
    
    if (error) {
      console.error('Error accessing avatars bucket:', error);
    } else {
      console.log('Avatars bucket exists and is accessible');
    }
  } catch (err) {
    console.error('Error in checkStorageBucket:', err);
  }
};

const App = () => {
  useEffect(() => {
    // Check if avatars bucket exists and is accessible
    checkStorageBucket();
  }, []);

  return (
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
              <Route path="/community" element={<Community />} />
              <Route path="/community/:tab" element={<Community />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
