// // import React, { useState } from "react";
// // import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

// // export default function AccountSettings() {
// //   const [name, setName] = useState("Change Name");
// //   const [bio, setBio] = useState("");
// //   const [email, setEmail] = useState("example@email.com");

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.header}>👤 Account Settings</Text>

// //       <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Change Name" />
// //       <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Add Bio" />
// //       <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Update Email" />

// //       <TouchableOpacity style={styles.button}>
// //         <Text style={styles.buttonText}>Change Password</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity
// //         style={[styles.button, { backgroundColor: "#ff4d4d" }]}
// //         onPress={() => Alert.alert("Delete Account", "Are you sure?")}
// //       >
// //         <Text style={styles.buttonText}>Delete Account</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
// //   header: { fontSize: 22, fontWeight: "bold", color: "#00e0ff", marginBottom: 20 },
// //   input: {
// //     borderWidth: 1, borderColor: "#333", borderRadius: 10,
// //     padding: 10, marginBottom: 10, color: "#fff", backgroundColor: "#1e1e1e",
// //   },
// //   button: {
// //     backgroundColor: "#00e0ff", padding: 12, borderRadius: 10,
// //     marginVertical: 5, alignItems: "center",
// //   },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// // });

// // import React, { useState } from "react";
// // import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// // export default function AccountSettings() {
// //   // Default values (in real app these would come from backend or Firebase)
// //   const [name, setName] = useState("Change Name");
// //   const [bio, setBio] = useState("This is my bio...");
// //   const [email, setEmail] = useState("user@example.com");
// //   const [password, setPassword] = useState("********");

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.header}>👤 Account Settings</Text>

// //       {/* Profile Photo */}
// //       <View style={styles.photoSection}>
// //         <Image source={{ uri: "https://placekitten.com/200/200" }} style={styles.profilePhoto} />
// //         <TouchableOpacity style={styles.changePhotoBtn}>
// //           <Text style={styles.changePhotoText}>Change Photo</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Name */}
// //       <Text style={styles.label}>Name</Text>
// //       <TextInput style={styles.input} value={name} onChangeText={setName} />

// //       {/* Bio */}
// //       <Text style={styles.label}>Bio</Text>
// //       <TextInput
// //         style={[styles.input, { height: 80 }]}
// //         value={bio}
// //         onChangeText={setBio}
// //         multiline
// //       />

// //       {/* Email */}
// //       <Text style={styles.label}>Email</Text>
// //       <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

// //       {/* Password */}
// //       <Text style={styles.label}>Password</Text>
// //       <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

// //       {/* Buttons */}
// //       <TouchableOpacity style={styles.button}>
// //         <Text style={styles.buttonText}>Update Account</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4d4d" }]}>
// //         <Text style={styles.buttonText}>Delete Account</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#121212", padding: 20 },
// //   header: { fontSize: 22, fontWeight: "bold", color: "#00e0ff", marginBottom: 20 },
// //   label: { color: "#bbb", marginTop: 15 },
// //   input: {
// //     backgroundColor: "#1e1e1e",
// //     color: "#fff",
// //     padding: 12,
// //     borderRadius: 8,
// //     marginTop: 5,
// //   },
// //   photoSection: { alignItems: "center", marginBottom: 20 },
// //   profilePhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
// //   changePhotoBtn: { padding: 8, backgroundColor: "#00e0ff33", borderRadius: 8 },
// //   changePhotoText: { color: "#00e0ff" },
// //   button: { marginTop: 20, backgroundColor: "#00e0ff", padding: 12, borderRadius: 10, alignItems: "center" },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// // });

// import React, { useState } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// export default function AccountSettings() {
//   const [name, setName] = useState("Change Name");
//   const [bio, setBio] = useState("This is my bio...");
//   const [email, setEmail] = useState("user@example.com");
//   const [password, setPassword] = useState("********");
//   const [gender, setGender] = useState("male"); // male or female
//   const [customAvatar, setCustomAvatar] = useState<string | null>(null);

//   const avatarUrl = customAvatar
//     ? customAvatar
//     : gender === "male"
//     ? "https://cdn-icons-png.flaticon.com/512/147/147144.png"
//     : "https://cdn-icons-png.flaticon.com/512/194/194938.png";

//   // Function to pick image
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//       allowsEditing: true,
//       aspect: [1, 1], // square crop
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       setCustomAvatar(result.assets[0].uri);
//     }
//   };
//   const insets = useSafeAreaInsets();

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }} edges={["top", "bottom"]}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
//       >
//         <ScrollView
//           style={styles.container}
//           contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
//         >
//         <Text style={styles.header}>👤 Account Settings</Text>

//         {/* Gender Selection */}
//         <Text style={styles.label}>Select Gender</Text>
//         <View style={styles.genderContainer}>
//           {["male", "female"].map((g) => (
//             <TouchableOpacity
//               key={g}
//               style={styles.genderOption}
//               onPress={() => {
//                 setGender(g);
//                 setCustomAvatar(null); // reset custom avatar when gender changes
//               }}
//             >
//               <View style={[styles.radioOuter, gender === g && !customAvatar && styles.radioSelected]}>
//                 {gender === g && !customAvatar && <View style={styles.radioInner} />}
//               </View>
//               <Text style={styles.genderText}>{g.charAt(0).toUpperCase() + g.slice(1)}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Profile Photo */}
//         <View style={styles.photoSection}>
//           <Image source={{ uri: avatarUrl }} style={styles.profilePhoto} />
//           <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage}>
//             <Text style={styles.changePhotoText}>Change Photo</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Name */}
//         <Text style={styles.label}>Name</Text>
//         <TextInput style={styles.input} value={name} onChangeText={setName} />

//         {/* Bio */}
//         <Text style={styles.label}>Bio</Text>
//         <TextInput style={[styles.input, { height: 80 }]} value={bio} onChangeText={setBio} multiline />

//         {/* Email */}
//         <Text style={styles.label}>Email</Text>
//         <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

//         {/* Password */}
//         <Text style={styles.label}>Password</Text>
//         <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

//         {/* Buttons */}
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.buttonText}>Update Account</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={[styles.button, { backgroundColor: "#ff4d4d" }]}>
//           <Text style={styles.buttonText}>Delete Account</Text>
//         </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#121212", padding: 20,top:0},
//   header: { fontSize: 22, fontWeight: "bold", color: "#00e0ff", marginBottom: 20,top:0},
//   label: { color: "#bbb", marginTop: 0, marginBottom: 5 },
//   input: {
//     backgroundColor: "#1e1e1e",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     marginTop: 5,
//   },
//   photoSection: { alignItems: "center", marginBottom: 20 },
//   profilePhoto: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
//   changePhotoBtn: { padding: 8, backgroundColor: "#00e0ff33", borderRadius: 8 },
//   changePhotoText: { color: "#00e0ff" },
//   button: { marginTop: 20, backgroundColor: "#00e0ff", padding: 12, borderRadius: 10, alignItems: "center", width: "100%" ,bottom:5},
//   buttonText: { color: "#fff", fontWeight: "bold" },

//   /* Gender Radio Styles */
//   genderContainer: { flexDirection: "row", marginBottom: 15 },
//   genderOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
//   radioOuter: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#00e0ff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 5,
//   },
//   radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#00e0ff" },
//   radioSelected: { borderColor: "#00e0ff" },
//   genderText: { color: "#fff" },
// });
