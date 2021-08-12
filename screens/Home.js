import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {
  onSnapshot,
  addDoc,
  removeDoc,
  updateDoc,
} from "../services/collections";
import { firestore, auth } from "firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const ListButton = ({ title, color, onPress, onDelete, onOptions }) => {
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: color }]}
      onPress={onPress}
    >
      <View style={{ flex: 0.8 }}>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 0.2,
        }}
      >
        <TouchableOpacity onPress={onOptions}>
          <MaterialCommunityIcons
            name="playlist-edit"
            size={25}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <MaterialCommunityIcons name="trash-can" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const listsRef = firestore()
    .collection("users")
    .doc(auth().currentUser.uid)
    .collection("lists");

  useEffect(() => {
    onSnapshot(
      listsRef,
      (newLists) => {
        setLists(newLists);
      },
      {
        sort: (a, b) => {
          if (a.index < b.index) {
            return -1;
          }

          if (a.index > b.index) {
            return 1;
          }

          return 0;
        },
      }
    );
  }, []);

  const addItemToLists = ({ title, color }) => {
    const index = lists.length > 1 ? lists[lists.length - 1].index + 1 : 0;
    addDoc(listsRef, { title, color, index });
  };

  const removeItemFromLists = (id) => {
    removeDoc(listsRef, id);
  };

  const updateItemFromLists = (id, item) => {
    updateDoc(listsRef, id, item);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.3 }}>
        <ImageBackground
          source={require("../assets/Home.png")}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>Welcome Back User!</Text>
          <Text style={styles.h2}>Happy Organising</Text>
        </ImageBackground>
      </View>
      <View style={{ flex: 0.7, backgroundColor: "white" }}>
        <FlatList
          data={lists}
          renderItem={({ item: { title, color, id, index } }) => {
            return (
              <ListButton
                title={title}
                color={color}
                navigation={navigation}
                onPress={() => {
                  navigation.navigate("ToDoList", {
                    title,
                    color,
                    listId: id,
                  });
                }}
                onOptions={() => {
                  navigation.navigate("Edit", {
                    title,
                    color,
                    saveChanges: (newItem) =>
                      updateItemFromLists(id, {
                        index,
                        ...newItem,
                      }),
                  });
                }}
                onDelete={() => removeItemFromLists(id)}
              />
            );
          }}
        />
        <TouchableOpacity
          onPress={() => {
            try {
              navigation.navigate("Edit", { saveChanges: addItemToLists });
            } catch (error) {
              console.log(error);
            }
          }}
          style={styles.fab}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemTitle: { fontSize: 24, padding: 5, color: "white" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  icon: {
    padding: 10,
    fontSize: 24,
    paddingBottom: 25,
    marginTop: 1500,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 250,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fab: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    right: 10,
    top: -20,
    backgroundColor: "red",
    borderRadius: 30,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: "white",
  },
  text: {
    marginBottom: 20,
    marginRight: 75,
    fontSize: 25,
    color: "white",
  },
  h2: {
    marginBottom: 50,
    marginRight: 165,
    fontSize: 15,
    color: "white",
  },
});
