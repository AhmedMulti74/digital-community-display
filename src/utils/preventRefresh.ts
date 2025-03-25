
/**
 * Utility to prevent browser refresh or show a confirmation dialog
 */

// Function to prevent refresh completely with a confirmation dialog
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

// Function to silently prevent page refresh without showing any dialog
export const silentlyPreventRefresh = () => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    // This will prevent the page from refreshing without showing any dialog
    e.preventDefault();
    // Setting returnValue to null or undefined prevents the dialog from showing
    e.returnValue = undefined;
  };

  // Add event listener when called
  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return function to remove event listener
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};
