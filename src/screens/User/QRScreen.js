import { BarCodeScanner } from "expo-barcode-scanner";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Card, CardItem } from "native-base";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { db } from "../../utils/firebase";

export default function QRScreen({ navigation }) {
  const [userId, settUserId] = useState("36112759-7710-4c22-b63b-8433b507f02e");
  const [hasPermission, setHasPermission] = useState(null);
  const [taskComponent, setTaskComponent] = useState(null);
  const [task, setTask] = useState(null);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      })();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    db.ref(`/users/${userId}/tasks/${data}`).on("value", (snapshot) => {
      let dbTask = snapshot.val();
      if (dbTask != null) setTask({ id: data, ...dbTask });
    });

    setTaskComponent(
      task && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("InstructionScreen", {
              instructions: task.instructions,
              title: task.name,
            })
          }
        >
          <Card style={styles.card}>
            <CardItem cardBody>
              <Image
                source={{ uri: task.image }}
                style={{ width: wp("25%"), aspectRatio: 1 }}
              />
            </CardItem>
            <CardItem cardBody>
              <Text style={styles.buttonText}>{task.name}</Text>
            </CardItem>
          </Card>
        </TouchableOpacity>
      )
    );
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2A9D8F", "transparent"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: hp("100%"),
        }}
      />
      <Text style={styles.title}>Scan QR</Text>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={styles.scanner}
      />
      {taskComponent}
      <Button
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={require("../../assets/icons/home.png")}
          fadeDuration={0}
          style={{
            width: wp("10%"),
            aspectRatio: 1,
            resizeMode: "contain",
            marginBottom: 35,
            marginRight: 10,
          }}
        />
        <Text style={styles.title}>Back to HOME</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#264653",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  scanner: {
    width: wp("100%"),
    height: hp("50%"),
  },
  title: {
    fontWeight: "bold",
    fontSize: hp("4%"),
    color: "#fff",
    marginBottom: 30,
    // fontFamily: 'Rubik'
  },
  card: {
    width: wp("33%"),
    margin: 0,
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: hp("2%"),
  },
  backButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    marginTop: 10,
    width: wp("100%"),
    height: hp("12%"),
    backgroundColor: "#F4A261",
    justifyContent: "center",
  },
});
