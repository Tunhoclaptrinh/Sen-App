import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Ionicons} from "@expo/vector-icons";
import {Image, View, Text, TouchableOpacity} from "react-native";

import {ROUTE_NAMES, SCREEN_OPTIONS} from "@/src/config/routes.config";
import {COLORS} from "@/src/styles/colors";

// Screens
import HomeScreen from "@/src/screens/home/HomeScreen";
import HeritageDetailScreen from "@screens/heritage/HeritageDetailScreen";
import ProfileScreen from "@screens/profile/ProfileScreen";
import EditProfileScreen from "@screens/profile/EditProfileScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ==============================
   GLOBAL HEADER
   ==============================*/

const HeaderLogo = () => (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      <Text style={{color: COLORS.WHITE, fontWeight: "bold", fontSize: 18}}>SEN</Text>
    </View>
);

const GLOBAL_HEADER_OPTIONS = {
    ...SCREEN_OPTIONS.DEFAULT_HEADER,
    headerStyle: {backgroundColor: COLORS.PRIMARY},
    headerTintColor: COLORS.WHITE,
    headerRight: () => <HeaderLogo />,
};

const CustomBackHeader = (navigation: any, title?: string) => ({
    headerBackVisible: false,
    headerTitle: title,
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: "row", alignItems: "center", paddingRight: 16}}>
        <Ionicons name="arrow-back" size={24} color={COLORS.WHITE} />
      </TouchableOpacity>
    ),
});

/* ==============================
   HOME STACK
   ==============================*/
const HomeStack = () => (
  <Stack.Navigator screenOptions={GLOBAL_HEADER_OPTIONS}>
    <Stack.Screen
      name={ROUTE_NAMES.HOME.SCREEN}
      component={HomeScreen}
      options={{title: "Di sản", headerBackVisible: false}}
    />
    <Stack.Screen
      name={ROUTE_NAMES.HOME.HERITAGE_DETAIL}
      component={HeritageDetailScreen}
      options={({navigation}: any) => CustomBackHeader(navigation, "Chi tiết di sản")}
    />
     <Stack.Screen
      name={ROUTE_NAMES.COMMON.NOTIFICATIONS}
      component={NotificationsScreen}
      options={({navigation}: any) => CustomBackHeader(navigation, "Thông báo")}
    />
     <Stack.Screen
      name={ROUTE_NAMES.COMMON.AI_CHAT}
      component={AIChatScreen}
      options={{headerShown: false, presentation: 'modal'}}
    />
  </Stack.Navigator>
);

/* ==============================
   PROFILE STACK
   ==============================*/
const ProfileStack = () => (
  <Stack.Navigator screenOptions={GLOBAL_HEADER_OPTIONS}>
    <Stack.Screen
      name={ROUTE_NAMES.PROFILE.SCREEN}
      component={ProfileScreen}
      options={{title: "Hồ sơ", headerBackVisible: false}}
    />
    <Stack.Screen
      name={ROUTE_NAMES.PROFILE.EDIT_PROFILE}
      component={EditProfileScreen}
      options={({navigation}: any) => CustomBackHeader(navigation, "Chỉnh sửa hồ sơ")}
    />
     <Stack.Screen
      name={ROUTE_NAMES.COMMON.SETTINGS}
      component={SettingsScreen}
      options={({navigation}: any) => CustomBackHeader(navigation, "Cài đặt")}
    />
  </Stack.Navigator>
);

/* ==============================
   MAIN TAB NAVIGATOR
   ==============================*/
/* ==============================
   GAME STACK
   ==============================*/
/* ==============================
   GAME STACK
   ==============================*/
import GameHomeScreen from "@/src/screens/game/GameHomeScreen";
import AIChatScreen from "@/src/screens/ai/AIChatScreen";

const GameStack = () => (
  <Stack.Navigator screenOptions={GLOBAL_HEADER_OPTIONS}>
    <Stack.Screen
      name="GameHomeScreen"
      component={GameHomeScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);


/* ==============================
   MAIN TAB NAVIGATOR
   ==============================*/
const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      headerShown: false,
      tabBarIcon: ({focused, color, size}) => {
         let iconName = "home";
         if (route.name === ROUTE_NAMES.TABS.PROFILE) iconName = "person";
         if (route.name === ROUTE_NAMES.TABS.GAME) iconName = "game-controller";
         return <Ionicons name={iconName as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.PRIMARY,
      tabBarInactiveTintColor: COLORS.GRAY,
    })}
  >
    <Tab.Screen name={ROUTE_NAMES.TABS.HOME} component={HomeStack} options={{tabBarLabel: "Di sản"}} />
    <Tab.Screen name={ROUTE_NAMES.TABS.GAME} component={GameStack} options={{tabBarLabel: "Trò chơi"}} />
    <Tab.Screen name={ROUTE_NAMES.TABS.PROFILE} component={ProfileStack} options={{tabBarLabel: "Cá nhân"}} />
  </Tab.Navigator>
);

export default MainNavigator;
