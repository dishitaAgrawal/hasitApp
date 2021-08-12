import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { firestore, auth } from "firebase";

import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Header } from "react-native-elements";
export default class Settings extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      contact: "",
      image: "#",
      docId: "",
      userId: firebase.auth().currentUser.email,
    };
  }

  getUserDetails = () => {
    var email = this.state.userId;
    firestore()
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.data());
          var data = doc.data();
          this.setState({
            firstName: data.first_name,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = async () => {
    await this.uploadImage(this.state.image, this.state.userId);
    firestore().collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,

      contact: this.state.contact,
    });

    alert("Profile Updated Successfully");
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.setState({ image: uri });
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: require("../assets/defaultpp.jpg") });
      });
  };
  componentDidMount() {
    this.getUserDetails();
    this.fetchImage();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{ text: "Profile", style: { color: "#fff" } }}
          containerStyle={{
            backgroundColor: "#0C0F29",
            justifyContent: "space-around",
          }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ScrollView>
            <Avatar
              rounded
              source={{
                uri: this.state.image,
              }}
              size="medium"
              onPress={() => this.selectPicture()}
              containerStyle={styles.imageContainer}
              showEditButton
            />
            <View style={styles.formContainer}>
              <View
                style={{
                  flex: 0.66,
                  padding: RFValue(10),
                }}
              >
                <Text style={styles.label}>First Name </Text>
                <TextInput
                  style={styles.formTextInput}
                  placeholder={"First Name"}
                  maxLength={12}
                  onChangeText={(text) => {
                    this.setState({
                      firstName: text,
                    });
                  }}
                  value={this.state.firstName}
                />

                <Text style={styles.label}>Contact </Text>
                <TextInput
                  style={styles.formTextInput}
                  placeholder={"Contact"}
                  maxLength={10}
                  keyboardType={"numeric"}
                  onChangeText={(text) => {
                    this.setState({
                      contact: text,
                    });
                  }}
                  value={this.state.contact}
                />
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateUserDetails();
                  }}
                >
                  <LinearGradient
                    colors={["#E80001", "#F40103", "#4C0307"]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { marginBottom: 20 }]}
                  onPress={() => {
                    auth().signOut();
                  }}
                >
                  <LinearGradient
                    colors={["#E80001", "#F40103", "#4C0307"]}
                    start={{ x: -1, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Log out
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor:"#6fc0b8"
  // },
  formContainer: {
    flex: 0.88,
    justifyContent: "center",
  },
  label: {
    fontSize: RFValue(18),
    color: "#717D7E",
    fontWeight: "bold",
    padding: RFValue(10),
    marginLeft: RFValue(20),
  },
  formTextInput: {
    width: "90%",
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "grey",
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(20),
    borderRadius: 20,
    padding: 20,
  },
  buttonView: {
    flex: 0.22,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
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
  imageContainer: {
    width: "30%",
    height: "30%",
    alignSelf: "center",
    borderRadius: 20,
  },
});
