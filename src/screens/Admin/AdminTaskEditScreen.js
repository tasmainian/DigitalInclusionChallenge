import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import {
  Card,
  CardItem,
  Container,
  Text,
  Footer,
  FooterTab,
  Icon,
  Item,
  Input,
  Picker,
  Button,
  Label,
} from "native-base";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Button as NativeButton,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { db } from "../../utils/firebase";

export default function AdminTaskEditScreen({ navigation }) {
  const [userId, settUserId] = useState("36112759-7710-4c22-b63b-8433b507f02e");
  const [loaded] = useFonts({
    Rubik: require("../../assets/fonts/Rubik-Medium.ttf"),
  });
  const [name, setName] = useState("");
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const [selectedTime, setSelectedTime] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  useEffect(() => {
    const onValueChange = db
      .ref(`/users/${userId}/name`)
      .on("value", (snapshot) => {
        setName(snapshot.val());
      });
    // Stop listening for updates when no longer required
    return () => db.ref(`/users/${userId}`).off("value", onValueChange);
  }, [userId]);

  if (!loaded) {
    return null;
  }

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time) => {
    console.warn("A time has been picked: ", time);
    setSelectedTime(time);
    hideTimePicker();
  };

  return (
    <>
      <Container style={styles.container}>
        <LinearGradient
          colors={["#F4A261", "transparent"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: hp("100%"),
          }}
        />
        <Text style={styles.title}>Task Overview</Text>
        <Item style={styles.taskNameBox} floatingLabel>
          <Label style={{ color: "lightgrey", fontFamily: "Rubik" }}>
            Task Name
          </Label>
          <Input style={{ fontFamily: "Rubik" }} />
        </Item>
        <Item picker style={styles.taskCategory}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "lightgrey", fontFamily: "Rubik" }}>
              Category
            </Text>
            <Picker
              mode="dropdown"
              iosIcon={
                <Icon name="arrow-down" style={{ color: "lightgrey" }} />
              }
              style={{ width: undefined }}
              placeholder="Select category"
              placeholderStyle={{ color: "lightgrey", fontFamily: "Rubik" }}
              textStyle={{ fontFamily: "Rubik" }}
              itemTextStyle={{ fontFamily: "Rubik" }}
              // placeholderStyle={{ color: "#bfc6ea" }}
              //   placeholderIconColor="#007aff"
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
            >
              <Picker.Item label="Morning" value="morning" />
              <Picker.Item label="Afternoon" value="afternoon" />
              <Picker.Item label="Evening" value="evening" />
              <Picker.Item label="Motivator" value="motivator" />
            </Picker>
          </View>
        </Item>
        <View style={styles.checkbox}>
          <BouncyCheckbox
            isChecked={toggleCheckBox}
            fillColor="#4f9b8f"
            disableText
            onPress={(checked) => setToggleCheckBox(checked)}
          />
          <Text style={{ fontFamily: "Rubik", fontSize: hp("2.2%") }}>
            Time
          </Text>
        </View>
        {toggleCheckBox && (
          <View style={styles.timeField}>
            <Text style={{ fontFamily: "Rubik", fontSize: hp("2.2%") }}>
              {selectedTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
            <NativeButton
              title="Set time"
              color="lightgrey"
              onPress={showTimePicker}
            />
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              headerTextIOS="Pick a time"
              mode="time"
              onConfirm={handleConfirm}
              onCancel={hideTimePicker}
            />
          </View>
        )}
        {/* <TouchableOpacity onPress={() => navigation.navigate("QR")}>
        <Card style={styles.card1}>
          <CardItem cardBody>
            <Image
              source={require("../../assets/images/scanQR.png")}
              style={{ width: hp("23%"), aspectRatio: 1 }}
            />
          </CardItem>
          <CardItem cardBody>
            <Text style={styles.buttonText}>Scan</Text>
          </CardItem>
        </Card>
      </TouchableOpacity> */}
        {/* <TouchableOpacity onPress={() => navigation.navigate("Task")}>
          <Card style={styles.card2}>
            <CardItem cardBody>
              <Image
                source={require("../../assets/images/tasks.png")}
                style={{ width: hp("23%"), aspectRatio: 1 }}
              />
            </CardItem>
            <CardItem cardBody>
              <Text style={styles.buttonText}>Tasks</Text>
            </CardItem>
          </Card>
        </TouchableOpacity> */}
      </Container>
      <Footer style={styles.footerTab}>
        <FooterTab>
          <Button>
            <Icon style={styles.footerTabIcon} name="apps" />
          </Button>
          <Button>
            <Icon style={styles.footerTabIcon} name="create" />
          </Button>
          <Button>
            <Icon style={styles.footerTabIcon} name="trash" />
          </Button>
        </FooterTab>
      </Footer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E76F51",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  card1: {
    height: hp("33%"),
    width: wp("75%"),
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: -15, height: 15 },
  },
  card2: {
    height: hp("33%"),
    width: wp("75%"),
    margin: 0,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 45,
    marginTop: 30,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: -15, height: 15 },
  },
  title: {
    fontSize: hp("4%"),
    color: "#fff",
    marginBottom: 30,
    fontFamily: "Rubik",
  },
  buttonText: {
    fontSize: hp("4%"),
    fontFamily: "Rubik",
  },
  footerTab: {
    backgroundColor: "#4f9b8f",
  },
  footerTabIcon: {
    color: "white",
    fontSize: 35,
  },
  taskNameBox: {
    width: wp("80%"),
  },
  taskCategory: {
    marginTop: 20,
    width: wp("80%"),
  },
  checkbox: {
    marginTop: 15,
    marginLeft: 30,
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  timeField: {
    marginLeft: 70,
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
});