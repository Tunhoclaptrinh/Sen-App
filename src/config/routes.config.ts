/**
 * Routes Configuration
 * Centralized route definitions for the app
 */

export type RouteParams = {
  // Auth Stack
  Login: undefined;
  Register: undefined;

  // Main Stack - Home
  HomeScreen: undefined;
  RestaurantDetail: {restaurantId: number}; // Keeping for now if referenced elsewhere, but can remove later
  ProductDetail: {productId: number}; // Keeping for now if referenced elsewhere, but can remove later

  // Main Stack - Profile
  ProfileScreen: undefined;
  EditProfile: undefined;
  
  // Common
  Notifications: undefined;
  Settings: undefined;
};

export const ROUTE_NAMES = {
  // Auth
  AUTH: {
    LOGIN: "Login",
    REGISTER: "Register",
  },

  // Main Tabs
  TABS: {
    HOME: "Home",
    PROFILE: "Profile",
    GAME: "Game",
  },

  // Home Stack
  HOME: {
    SCREEN: "HomeScreen",
    HERITAGE_DETAIL: "HeritageDetail",
    // RESTAURANT_DETAIL: "RestaurantDetail", // Commenting out until deleted fully
    // PRODUCT_DETAIL: "ProductDetail",
  },

  // Profile Stack
  PROFILE: {
    SCREEN: "ProfileScreen",
    EDIT_PROFILE: "EditProfile",
  },

  // Common
  COMMON: {
    NOTIFICATIONS: "Notifications",
    SETTINGS: "Settings",
    AI_CHAT: "AIChat",
  },
} as const;

export const SCREEN_OPTIONS = {
  // Common header styles
  DEFAULT_HEADER: {
    headerShown: true,
    headerStyle: {
      backgroundColor: "#FFFFFF",
    },
    headerTintColor: "#FF6B6B",
    headerTitleStyle: {
      fontWeight: "700" as const,
    },
  },

  // Modal presentation
  MODAL: {
    presentation: "modal" as const,
  },

  // No header
  NO_HEADER: {
    headerShown: false,
  },

  // Tab bar icons
  TAB_ICONS: {
    HOME: {focused: "home", unfocused: "home-outline"},
    PROFILE: {focused: "person", unfocused: "person-outline"},
  },
} as const;

// Navigation helper types
export type RootStackParamList = RouteParams;
export type TabParamList = Pick<
  RouteParams,
  "HomeScreen" | "ProfileScreen"
>;
