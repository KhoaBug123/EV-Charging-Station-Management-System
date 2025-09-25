// Image assets management for SkaEV
// This file provides a centralized way to manage all image assets

// Default placeholders - you can replace these with actual images
export const PLACEHOLDER_IMAGES = {
  // User avatars
  AVATAR_DEFAULT: "https://via.placeholder.com/150x150/1379FF/white?text=User",
  AVATAR_ADMIN: "https://via.placeholder.com/150x150/EF4444/white?text=Admin",
  AVATAR_OWNER: "https://via.placeholder.com/150x150/F59E0B/white?text=Owner",
  AVATAR_CUSTOMER:
    "https://via.placeholder.com/150x150/10B981/white?text=Customer",

  // Charging stations
  STATION_DEFAULT:
    "https://via.placeholder.com/400x200/1379FF/white?text=Charging+Station",
  STATION_GREEN_MALL:
    "https://via.placeholder.com/400x200/10B981/white?text=Green+Mall+Hub",
  STATION_TECH_PARK:
    "https://via.placeholder.com/400x200/3B82F6/white?text=Tech+Park+SuperCharger",
  STATION_ECO_PARK:
    "https://via.placeholder.com/400x200/B5FF3D/black?text=EcoPark+Station",

  // Logos and branding
  LOGO_SKAEV: "/assets/images/skaev-logo.png",
  LOGO_ICON: "/assets/images/skaev-icon.png",

  // Hero and marketing images
  HERO_ELECTRIC_CAR:
    "https://via.placeholder.com/800x400/1379FF/white?text=Electric+Vehicle",
  HERO_CHARGING:
    "https://via.placeholder.com/800x400/B5FF3D/black?text=Fast+Charging",

  // Feature illustrations
  FEATURE_FAST_CHARGING:
    "https://via.placeholder.com/300x200/1379FF/white?text=Fast+Charging",
  FEATURE_NETWORK:
    "https://via.placeholder.com/300x200/10B981/white?text=Wide+Network",
  FEATURE_GREEN_ENERGY:
    "https://via.placeholder.com/300x200/B5FF3D/black?text=Green+Energy",
  FEATURE_SECURE:
    "https://via.placeholder.com/300x200/3B82F6/white?text=Secure+Payment",
};

// Image paths for actual assets (when you have real images)
export const IMAGE_PATHS = {
  // User avatars directory
  avatars: {
    admin: {
      sarah: "/assets/avatars/admin-sarah.jpg",
      michael: "/assets/avatars/admin-michael.jpg",
    },
    owner: {
      david: "/assets/avatars/owner-david.jpg",
      linda: "/assets/avatars/owner-linda.jpg",
    },
    customer: {
      john: "/assets/avatars/customer-john.jpg",
      anna: "/assets/avatars/customer-anna.jpg",
    },
  },

  // Station images directory
  stations: {
    greenMall: {
      main: "/assets/stations/green-mall-1.jpg",
      secondary: "/assets/stations/green-mall-2.jpg",
    },
    techPark: {
      main: "/assets/stations/tech-park-1.jpg",
      secondary: "/assets/stations/tech-park-2.jpg",
    },
    ecoPark: {
      main: "/assets/stations/ecopark-1.jpg",
    },
  },

  // Brand assets
  brand: {
    logo: "/assets/images/skaev-logo.png",
    logoWhite: "/assets/images/skaev-logo-white.png",
    icon: "/assets/images/skaev-icon.png",
    favicon: "/assets/images/favicon.ico",
  },

  // Marketing and hero images
  hero: {
    electricCar: "/assets/images/hero-electric-car.jpg",
    chargingStation: "/assets/images/hero-charging-station.jpg",
    cityView: "/assets/images/hero-city-view.jpg",
  },

  // Feature and illustration images
  features: {
    fastCharging: "/assets/images/feature-fast-charging.svg",
    network: "/assets/images/feature-network.svg",
    greenEnergy: "/assets/images/feature-green-energy.svg",
    security: "/assets/images/feature-security.svg",
  },
};

// Helper function to get image with fallback
export const getImageWithFallback = (imagePath, fallbackKey) => {
  // In a real app, you might want to check if the image exists
  // For now, we'll use placeholders as fallbacks
  return (
    imagePath ||
    PLACEHOLDER_IMAGES[fallbackKey] ||
    PLACEHOLDER_IMAGES.STATION_DEFAULT
  );
};

// Helper function to get user avatar
export const getUserAvatar = (user) => {
  if (!user) return PLACEHOLDER_IMAGES.AVATAR_DEFAULT;

  // If user has custom avatar, use it
  if (user.profile?.avatar && !user.profile.avatar.includes("placeholder")) {
    return user.profile.avatar;
  }

  // Otherwise use role-based placeholder
  switch (user.role) {
    case "admin":
      return PLACEHOLDER_IMAGES.AVATAR_ADMIN;
    case "owner":
      return PLACEHOLDER_IMAGES.AVATAR_OWNER;
    case "customer":
      return PLACEHOLDER_IMAGES.AVATAR_CUSTOMER;
    default:
      return PLACEHOLDER_IMAGES.AVATAR_DEFAULT;
  }
};

// Helper function to get station image
export const getStationImage = (station, imageIndex = 0) => {
  if (!station) return PLACEHOLDER_IMAGES.STATION_DEFAULT;

  // If station has images array, use it
  if (station.images && station.images[imageIndex]) {
    const imagePath = station.images[imageIndex];
    // If it's not a placeholder URL, return the actual path
    if (!imagePath.includes("placeholder")) {
      return imagePath;
    }
  }

  // Use station-specific placeholder based on ID
  switch (station.id) {
    case "station-001":
      return PLACEHOLDER_IMAGES.STATION_GREEN_MALL;
    case "station-002":
      return PLACEHOLDER_IMAGES.STATION_TECH_PARK;
    case "station-003":
      return PLACEHOLDER_IMAGES.STATION_ECO_PARK;
    default:
      return PLACEHOLDER_IMAGES.STATION_DEFAULT;
  }
};

// Image optimization helpers
export const getOptimizedImageUrl = (url, width, height, quality = 80) => {
  // In a real app, you might use a service like Cloudinary or ImageKit
  // For now, just return the original URL
  return url;
};

// Generate responsive image srcSet
export const generateSrcSet = (baseUrl, sizes = [400, 800, 1200]) => {
  return sizes
    .map((size) => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(", ");
};

export default {
  PLACEHOLDER_IMAGES,
  IMAGE_PATHS,
  getImageWithFallback,
  getUserAvatar,
  getStationImage,
  getOptimizedImageUrl,
  generateSrcSet,
};
