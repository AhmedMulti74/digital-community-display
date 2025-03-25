
/**
 * Utility to prevent browser refresh or show a confirmation dialog
 */

// Function to prevent refresh completely
export const preventBrowserRefresh = () => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
    return '';
  };

  // Add event listener when called
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return function to remove event listener
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Function to show confirmation dialog on refresh
export const confirmBeforeRefresh = (message: string = 'هل أنت متأكد أنك تريد مغادرة الصفحة؟') => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    // Set custom message (Note: most modern browsers show a generic message instead)
    e.returnValue = message;
    return message;
  };

  // Add event listener when called
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return function to remove event listener
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
