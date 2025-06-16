
// Helper function to get proper image paths for GitHub Pages deployment
export const getImagePath = (imageName: string) => {
  // Check for deployment on GitHub Pages
  const isGitHubPages = window.location.pathname.startsWith("/la-posh-hotel");
  // Also check for Vite's production flag for Netlify/static hosting too
  const isProduction = import.meta.env.PROD;
  // Prefer GitHub Pages detection if possible, fallback to PROD for Netlify/etc.
  if (isGitHubPages || isProduction) {
    return `/la-posh-hotel/lovable-uploads/${imageName}`;
  }
  return `/lovable-uploads/${imageName}`;
};

// Process image URL to use getImagePath if it's a local upload
export const processImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '/placeholder.svg';
  
  // If it's a lovable-uploads image, extract filename and use getImagePath
  if (imageUrl.includes('lovable-uploads/')) {
    const fileName = imageUrl.split('lovable-uploads/').pop();
    return fileName ? getImagePath(fileName) : '/placeholder.svg';
  }
  
  // If it's already a full URL (external or processed), use as is
  return imageUrl;
};
