import { CommonActions } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity,TextInput } from 'react-native';
import Colors from "../constants/Colors";

export default ({ buttonStyle, textStyle, onPress, text }) => {
    return(
        <TouchableOpacity style = {[styles.button,buttonStyle]} 
        onPress={onPress} >
            <Text style ={[styles.text,textStyle]}>{text}</Text>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        borderRadius: 25,
        backgroundColor: Colors.darkGray,
        height: 48,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    text: { color: "white", fontSize: 24, fontWeight: "bold" },
});