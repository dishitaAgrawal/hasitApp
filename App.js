import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import ToDoList from "./screens/ToDoList";
import EditList from "./screens/EditList";
import Login from "./screens/Login";
import Colors from "./constants/Colors";
import Settings from "./screens/Settings";
import * as firebase from "firebase";
import "firebase/firestore";

import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
};
const HomeScreens = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="ToDoList"
        component={ToDoList}
        options={({ route }) => {
          return {
            title: route.params.title,
            headerStyle: {
              backgroundColor: route.params.color,
            },
            headerTintColor: "white",
          };
        }}
      />
    </HomeStack.Navigator>
  );
};
const TabScreens = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { backgroundColor: "#0C0F29" },
        activeTintColor: "gold",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreens}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Edit"
        component={EditList}
        options={{
          headerShown: true,
          tabBarLabel: "Add List",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (firebase.auth().currentUser) {
      setIsAuthenticated(true);
    }
    firebase.auth().onAuthStateChanged((user) => {
      console.log("Checking auth state...");
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);
  return (
    <NavigationContainer>
      {isAuthenticated ? <TabScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
}

var firebaseConfig = {
  apiKey: "AIzaSyBVgC6WYCuPGFpt_dPyCYCzyT3l6DmWTc4",
  authDomain: "firetodo-e3523.firebaseapp.com",
  projectId: "firetodo-e3523",
  storageBucket: "firetodo-e3523.appspot.com",
  messagingSenderId: "171507800891",
  appId: "1:171507800891:web:509210eb8072e2b2b7751e",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
