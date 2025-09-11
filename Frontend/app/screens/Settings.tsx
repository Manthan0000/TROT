// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import FooterBar from "../_components/Footerbar";

// export default function Settings() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Settings Screen</Text>
//       <FooterBar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"#f5f5f5" },
//   title: { fontSize:24, fontWeight:"bold" },
// });

// import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// export default function Settings() {
//   const [name, setName] = useState(""); // user name state
//   const [editing, setEditing] = useState(false);

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
//       {/* Header */}
//       <Text style={styles.header}>Settings</Text>

//       {/* Account Settings */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Account</Text>

//         {/* Change Name */}
//         <View style={styles.item}>
//           <FontAwesome5 name="user" size={20} color="#00e0ff" />
//           {editing ? (
//             <TextInput
//               style={styles.input}
//               value={name}
//               onChangeText={setName}
//               placeholder="Enter your name"
//               placeholderTextColor="#888"
//               onSubmitEditing={() => setEditing(false)}
//               autoFocus
//             />
//           ) : (
//             <TouchableOpacity onPress={() => setEditing(true)}>
//               <Text style={styles.itemText}>{name || "Set / Change Name"}</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity style={styles.item}>
//           <Entypo name="email" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Change Email</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.item}>
//           <MaterialIcons name="lock" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Change Password</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Privacy Settings */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Privacy</Text>
//         <TouchableOpacity style={styles.item}>
//           <MaterialIcons name="visibility" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Profile Visibility</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Notification Settings */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Notifications</Text>
//         <TouchableOpacity style={styles.item}>
//           <MaterialIcons name="notifications" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Push Notifications</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.item}>
//           <Entypo name="mail" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Email Notifications</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Help & Support */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Help & Support</Text>
//         <TouchableOpacity style={styles.item}>
//           <Entypo name="help" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>FAQs</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.item}>
//           <MaterialIcons name="contact-support" size={20} color="#00e0ff" />
//           <Text style={styles.itemText}>Contact Us</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Logout */}
//       <TouchableOpacity style={styles.logoutButton}>
//         <MaterialIcons name="logout" size={22} color="white" />
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#121212",
//     padding: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#00e0ff",
//     marginBottom: 20,
//   },
//   section: {
//     marginBottom: 25,
//     backgroundColor: "#1e1e1e",
//     borderRadius: 12,
//     padding: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#ffffff",
//     marginBottom: 10,
//   },
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   itemText: {
//     fontSize: 16,
//     marginLeft: 10,
//     color: "#ddd",
//   },
//   input: {
//     marginLeft: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#00e0ff",
//     color: "white",
//     fontSize: 16,
//     paddingVertical: 2,
//     minWidth: 200,
//   },
//   logoutButton: {
//     marginTop: 20,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#e63946",
//     paddingVertical: 15,
//     borderRadius: 12,
//     bottom:20,
//   },
//   logoutText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
// });

import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Settings() {
  const router = useRouter();

  const sections = [
    { title: "Account Settings", route: "./settings/AccountSettings" },
    { title: "Privacy Settings", route: "./settings/PrivacySettings" },
    { title: "Notification Settings", route: "./settings/NotificationSettings" },
    { title: "Help & Support", route: "./settings/HelpSupport" },
    { title: "Logout", route: "./settings/Logout" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>⚙️ Settings</Text>
      {sections.map((sec) => (
        <TouchableOpacity
          key={sec.title}
          style={styles.item}
          onPress={() => router.push(sec.route)}
        >
          <Text style={styles.itemText}>{sec.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: { fontSize: 26, fontWeight: "bold", color: "#00e0ff", marginBottom: 20 },
  item: {
    padding: 15,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginVertical: 8,
  },
  itemText: { color: "#fff", fontSize: 16 },
});
