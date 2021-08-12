import { CommonActions } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Colors from "../constants/Colors";
import ColorSelector from "../components/ColorSelector";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";
import { Header } from "react-native-elements";

const colorList = [
  "blue",
  "teal",
  "green",
  "olive",
  "yellow",
  "orange",
  "red",
  "pink",
  "purple",
  "blueGray",
];

export default ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  // route.params.title ||
  const [color, setColor] = useState(Colors.blue);
  // route.params.color
  const [isValid, setValidity] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: title, style: { color: "#fff" } }}
        containerStyle={{
          backgroundColor: color,
          justifyContent: "space-around",
        }}
      />

      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ margin: 10, flexDirection: "row" }}>
          <Text style={styles.label}>List Name</Text>
          {!isValid && (
            <Text style={{ color: Colors.red, fontSize: 18 }}>
              *List name cannot be empty
            </Text>
          )}
        </View>
        <TextInput
          underlineColorAndroid={"transparent"}
          selectionColor={"transparent"}
          autoFocus={true}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setValidity(true);
          }}
          placeholder={"New List Name"}
          maxLength={30}
          style={[styles.input, { outline: "none" }]}
        />

        <Text
          style={{
            color: Colors.black,
            fontWeight: "bold",
            fontSize: 16,
            margin: 10,
          }}
        >
          Choose Color
        </Text>
        <ColorSelector
          onSelect={(color) => {
            setColor(color);
            navigation.dispatch(CommonActions.setParams({ color }));
          }}
          selectedColor={color}
          colorOptions={colorList}
        />
        <LinearGradient
          colors={["#E80001", "#F40103", "#4C0307"]}
          start={{ x: -1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ margin: 10, padding: 10, borderRadius: 20 }}
        >
          <TouchableOpacity
            onPress={() => {
              try {
                if (title.length > 0) {
                  route.params.saveChanges({ title, color });
                  navigation.dispatch(CommonActions.goBack());
                } else {
                  setValidity(false);
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    color: Colors.darkGray,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 3,
    height: 30,
    fontSize: 24,
  },
  saveButton: {
    borderRadius: 25,
    backgroundColor: Colors.darkGray,
    height: 48,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttons: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 425,
    margin: 10,
    padding: 10,
    alignSelf: "center",
    width: "70%",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    shadowColor: "#bbbb",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    opacity: 0.9,
    borderRadius: 20,
  },
});
