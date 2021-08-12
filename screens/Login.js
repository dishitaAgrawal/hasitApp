import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
} from "react-native";
import Button from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";
import LabeledInput from "../components/LabeledInput";
import Colors from "../constants/Colors";
import validator from "validator";
import { auth, firestore } from "firebase";
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  initialWindowMetrics,
} from "react-native-safe-area-context";

const validateFields = (email, password) => {
  const isValid = {
    email: validator.isEmail(email),
    password: validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  };

  return isValid;
};

export default () => {
  const [isCreateMode, setCreateMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [emailField, setEmailField] = useState({
    text: "dishita@gmail.com",
    errorMessage: "",
  });
  const [passwordField, setPasswordField] = useState({
    text: "Iamdishita@123",
    errorMessage: "",
  });
  const [passwordReentryField, setPasswordReentryField] = useState({
    text: "",
    errorMessage: "",
  });

  const createAccount = (email, password) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        console.log("Creating user...");
        firestore().collection("users").doc(user.uid).set({
          first_name: firstName,
          contact: contact,
          email: emailField,
        });
      });
  };
  const login = (email, password) => {
    try {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("Logged in!");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/Home.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          style={{ width: 70, height: 70, borderRadius: 10, marginBottom: 10 }}
          source={require("../assets/Todo.jpg")}
        />

        <View
          style={{
            width: 300,
            maxWidth: "95%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            marginBottom: "5%",
          }}
        >
          <Text
            style={{
              alignSelf: "flex-start",
              textAlign: "left",
              fontWeight: "bold",
              color: "#020F3B",
            }}
          >
            {isCreateMode ? "Get Started" : "Welcome!"}
          </Text>
          {isCreateMode && (
            <LabeledInput
              label="First Name"
              text={firstName}
              onChangeText={(text) => {
                setFirstName(text);
              }}
              labelStyle={styles.label}
            />
          )}
          {isCreateMode && (
            <LabeledInput
              label="Contact"
              text={contact}
              onChangeText={(text) => {
                setContact(text);
              }}
              labelStyle={styles.label}
            />
          )}
          <LabeledInput
            label="Email"
            text={emailField.text}
            onChangeText={(text) => {
              setEmailField({ text });
            }}
            errorMessage={emailField.errorMessage}
            labelStyle={styles.label}
            autoCompleteType="email"
          />
          <LabeledInput
            label="Password"
            text={passwordField.text}
            onChangeText={(text) => {
              setPasswordField({ text });
            }}
            secureTextEntry={true}
            errorMessage={passwordField.errorMessage}
            labelStyle={styles.label}
            autoCompleteType="password"
          />
          {isCreateMode && (
            <LabeledInput
              label="Re-enter Password"
              text={passwordReentryField.text}
              onChangeText={(text) => {
                setPasswordReentryField({ text });
              }}
              secureTextEntry={true}
              errorMessage={passwordReentryField.errorMessage}
              labelStyle={styles.label}
            />
          )}

          {!isCreateMode && (
            <TouchableOpacity
              style={{ justifyContent: "flex-end", width: "100%" }}
              onPress={() => {
                if (emailField.text !== "") {
                  firebase
                    .auth()
                    .sendPasswordResetEmail(emailField.text)
                    .then(function () {
                      alert("please check email for password reset link");
                    })
                    .catch(function (error) {
                      //An error happened.
                    });
                } else {
                  alert("Please enter the email for password reset link");
                }
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "darkblue",
                  textAlign: "right",
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}
          <LinearGradient
            colors={["#E80001", "#F40103", "#4C0307"]}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttons}
          >
            <TouchableOpacity
              onPress={() => {
                const isValid = validateFields(
                  emailField.text,
                  passwordField.text
                );
                let isAllValid = true;
                if (!isValid.email) {
                  emailField.errorMessage = "Please enter a valid email";
                  setEmailField({ ...emailField });
                  isAllValid = false;
                }

                if (!isValid.password) {
                  passwordField.errorMessage =
                    "Password must be at least 8 long w/numbers, uppercase, lowercase, and symbol characters";
                  setPasswordField({ ...passwordField });
                  isAllValid = false;
                }

                if (
                  isCreateMode &&
                  passwordReentryField.text != passwordField.text
                ) {
                  passwordReentryField.errorMessage = "Passwords do not match";
                  setPasswordReentryField({ ...passwordReentryField });
                  isAllValid = false;
                }

                if (isAllValid) {
                  isCreateMode
                    ? createAccount(emailField.text, passwordField.text)
                    : login(emailField.text, passwordField.text);
                }
              }}
            >
              <Text
                style={{
                  fontSize: 23,
                  textAlign: "center",
                  alignSelf: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {isCreateMode ? "Sign Up" : "Login"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity
            onPress={() => {
              setCreateMode(!isCreateMode);
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "darkblue",
                fontSize: 16,
                margin: 4,
              }}
            >
              {isCreateMode ? "Already have an account?" : "Create new account"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020F3B",
  },

  buttons: {
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
  label: {
    fontSize: 16,
    color: "darkblue",
    marginTop: 10,
  },
  header: { fontSize: 72, color: Colors.red, alignSelf: "center" },
});
