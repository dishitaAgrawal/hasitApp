import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Checkbox from './Checkbox';
import Colors from '../constants/Colors';
//import DateTimePicker from './DateTimePicker';

const EditableText = ({ isChecked, onChangeText, text, ...props }) => {
  const [isEditMode, setEditMode] = useState(props.new);
  const [chosenTime, setChosenTime]  = useState("")
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => !isChecked && setEditMode(true)}>
      {isEditMode ? (
        <TextInput
          underlineColorAndroid={'transparent'}
          selectionColor={'transparent'}
          autoFocus={true}
          value={text}
          onChangeText={onChangeText}
          style={[styles.input, { outline: 'none' }]}
          placeholder={'Add new item here'}
          onSubmitEditing={() => {}}
          maxLength={30}
          onBlur={() => {
            props.onBlur && props.onBlur();
            setEditMode(false);
          }}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: isChecked ? Colors.lightGray : Colors.black,
              textDecoration: isChecked ? 'line-through' : 'none',
            },
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ({
  text,
  isChecked,
  onChecked,
  onChangeText,
  onDelete,
  ...props
}) => {
  console.log(props.new);
  return (
    <View style={styles.container}>
      <View style={{ width:"100%", flexDirection: 'row', justifyContent:"space-evenly", padding:10 }}>
        <Checkbox isChecked={isChecked} onChecked={onChecked} />
        <EditableText
          text={text}
          onChangeText={onChangeText}
          isChecked={isChecked}
          {...props}
        />

        <TouchableOpacity onPress={onDelete}>
          <Text style={{ color: Colors.red }}>X</Text>
        </TouchableOpacity>
      </View>
      <View>
     
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    padding:20, 
    margin:10, 
    borderColor:"black", 
    borderWidth:2
  },
  icon: {
    fontSize: 16,
  },
  iconPick: {
    fontSize: 16,
    marginTop: 15,
  },
  input: {
    color: Colors.black,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 3,
    height: 25,
    fontSize: 16
  },
  text: {
    padding: 3,
    fontSize: 16,
  },
});
