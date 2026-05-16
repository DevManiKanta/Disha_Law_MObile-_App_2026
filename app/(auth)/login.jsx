import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

export default function LoginScreen() {
  const handleLogin = () => {
    router.replace("/(drawer)/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Enter Email"
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Password"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
