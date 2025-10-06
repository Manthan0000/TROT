import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterBar from "../_components/Footerbar";
import { resolveApiBase } from "../../lib/api";

const PROFILE_MENU = [
  { key: "my-profile", label: "My Profile", icon: "person-circle-outline" },
  { key: "enhance-profile", label: "Enhance Profile", icon: "person-add-outline" },
  { key: "add-skills", label: "Add Skills", icon: "construct-outline" },
  { key: "courses", label: "Courses", icon: "school-outline" },
  { key: "credits", label: "Credits", icon: "star-outline" },
  { key: "buy-credits", label: "Buy Credits", icon: "card-outline" },
  { key: "create-avatar", label: "Create Avatar", icon: "color-wand-outline" },
  { key: "referrals", label: "Referrals", icon: "people-outline" },
  { key: "watchlist", label: "Watchlist", icon: "bookmark-outline" },
];

export default function Profile() {
  const [avatarModal, setAvatarModal] = useState(false);
  const [enhanceOpen, setEnhanceOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const initialFallback = Image.resolveAssetSource(require("../../assets/images/default-avatar.jpg")).uri;
  const [avatarUrl, setAvatarUrl] = useState(initialFallback);
  const [pendingAvatarUri, setPendingAvatarUri] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      const [yy, mm, dd] = dob.split("-").map((x) => parseInt(x, 10));
      return new Date(yy, mm - 1, dd);
    }
    return new Date(2000, 0, 1);
  });

  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem("avatarUrl");
        if (cached) {
          setAvatarUrl(cached);
          (globalThis as any).__AVATAR_URL__ = cached;
        }
        const cachedName = (globalThis as any).__USER_NAME__ || (await AsyncStorage.getItem("userName"));
        const cachedEmail = (globalThis as any).__USER_EMAIL__ || (await AsyncStorage.getItem("userEmail"));
        if (cachedName) setName(cachedName);
        if (cachedEmail) setEmail(cachedEmail);
      } catch {}
    })();
  }, []);
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{name || "Your Name"}</Text>
          <Text style={styles.email}>{email || "your@email.com"}</Text>
        </View>
      </View>

      <FlatList
        data={PROFILE_MENU}
        keyExtractor={(i) => i.key}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (item.key === "create-avatar") setAvatarModal(true);
              if (item.key === "enhance-profile") setEnhanceOpen(true);
            }}
          >
            <Text style={styles.rowLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={avatarModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create Your Avatar</Text>
            <Text style={styles.modalHint}>Pick a photo from your device, then Save</Text>
            <TouchableOpacity
              style={[styles.btn, styles.btnSecondary, { marginTop: 12, alignSelf: "flex-start" }]}
              onPress={async () => {
                try {
                  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                  if (perm.status !== "granted") return;
                  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
                  if (result.canceled) return;
                  const asset = result.assets?.[0];
                  if (!asset?.uri) return;
                  setPendingAvatarUri(asset.uri);
                  setSourceUrl(asset.uri);
                } catch (e) {
                  alert("Upload failed. Check network/API base.");
                }
              }}
            >
              <Text style={[styles.btnText, { color: "#111827" }]}>Choose from Library</Text>
            </TouchableOpacity>

            <View style={styles.previewRow}>
              <View style={styles.previewCol}>
                <Text style={styles.previewLabel}>Your Photo</Text>
                <Image source={{ uri: pendingAvatarUri || avatarUrl }} style={styles.previewImg} />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setAvatarModal(false)}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!pendingAvatarUri}
                style={[styles.btn, styles.btnPrimary, !pendingAvatarUri && { opacity: 0.6 }]}
                onPress={async () => {
                  try {
                    if (!pendingAvatarUri) return;
                    const token = await (await import("@react-native-async-storage/async-storage")).default.getItem("authToken");
                    const form = new FormData();
                    form.append("avatar", {
                      // @ts-ignore
                      uri: pendingAvatarUri,
                      name: "avatar.jpg",
                      type: "image/jpeg",
                    });
                    const base = resolveApiBase();
                    const resp = await fetch(`${base}/api/avatar/upload`, {
                      method: "POST",
                      headers: { Authorization: token ? `Bearer ${token}` : "" },
                      body: form,
                    });
                    let data: any = null;
                    try { data = await resp.json(); } catch {}
                    if (!resp.ok) { alert((data && data.message) || `Upload failed (${resp.status})`); return; }
                    if (data?.avatarUrl) {
                      setAvatarUrl(data.avatarUrl);
                      (globalThis as any).__AVATAR_URL__ = data.avatarUrl;
                      const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
                      await AsyncStorage.setItem("avatarUrl", data.avatarUrl);
                      setPendingAvatarUri("");
                      setAvatarModal(false);
                    }
                  } catch (e) {
                    alert("Upload failed. Check API base and token.");
                  }
                }}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={enhanceOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enhance Profile</Text>
            <Text style={styles.modalHint}>Add more details to personalize your account</Text>

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.radioRow}>
              {[
                { key: "male", label: "Male" },
                { key: "female", label: "Female" },
                { key: "other", label: "Other" },
              ].map((opt) => (
                <TouchableOpacity key={opt.key} style={styles.radioItem} onPress={() => setGender(opt.key)}>
                  <View style={[styles.radioOuter, gender === opt.key && styles.radioOuterActive]}>
                    {gender === opt.key && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <TouchableOpacity style={[styles.input, { justifyContent:"center" }]} onPress={()=>{
              const init = /^\d{4}-\d{2}-\d{2}$/.test(dob)
                ? new Date(parseInt(dob.slice(0,4),10), parseInt(dob.slice(5,7),10)-1, parseInt(dob.slice(8,10),10))
                : new Date(2000,0,1);
              setSelectedDate(init);
              setDobPickerOpen(true);
            }}>
              <Text style={{ color: dob ? "#111827" : "#6b7280" }}>{dob || "Choose date"}</Text>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Role</Text>
            <TouchableOpacity style={[styles.input, { justifyContent:"center" }]} onPress={()=>setRolePickerOpen(true)}>
              <Text style={{ color: role ? "#111827" : "#6b7280" }}>{role || "Select role (student/professional/other)"}</Text>
            </TouchableOpacity>
            <TextInput placeholder="Phone Number" placeholderTextColor="#6b7280" style={styles.input} keyboardType="phone-pad" onChangeText={(t)=>setPhone(t)} value={phone} />
            <TextInput placeholder="Education" placeholderTextColor="#6b7280" style={styles.input} onChangeText={(t)=>setEducation(t)} value={education} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={()=>setEnhanceOpen(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={async ()=>{
                  try {
                    const token = await AsyncStorage.getItem("authToken");
                    const base = resolveApiBase();
                    const resp = await fetch(`${base}/api/settings/enhanced`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
                      body: JSON.stringify({ gender, dob, role, phone, education }),
                    });
                    let data: any = null;
                    try { data = await resp.json(); } catch {}
                    if (!resp.ok) { alert((data && data.message) || `Failed to save (${resp.status})`); return; }
                    alert("Profile updated");
                    setEnhanceOpen(false);
                  } catch (e) {
                    alert("Network error. Check API base and firewall.");
                  }
                }}
              >
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DOB Picker (system calendar) */}
      {dobPickerOpen && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "android" ? "calendar" : "spinner"}
          maximumDate={new Date()}
          onChange={(event, date) => {
            if (Platform.OS === "android") setDobPickerOpen(false);
            if (!date) return;
            const today = new Date();
            const safe = date > today ? today : date;
            setSelectedDate(safe);
            const y = safe.getFullYear();
            const m = String(safe.getMonth() + 1).padStart(2, "0");
            const d = String(safe.getDate()).padStart(2, "0");
            setDob(`${y}-${m}-${d}`);
          }}
          onTouchCancel={() => setDobPickerOpen(false)}
        />
      )}

      {/* Role Picker Modal */}
      <Modal visible={rolePickerOpen} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Role</Text>
            {(["student","professional","other"] as const).map((opt)=> (
              <TouchableOpacity key={opt} style={[styles.row, { paddingHorizontal:0 }]} onPress={()=>{ setRole(opt); setRolePickerOpen(false); }}>
                <Text style={styles.rowLabel}>{opt[0].toUpperCase()+opt.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={()=>setRolePickerOpen(false)}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FooterBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#ffffff" },
  header: { flexDirection:"row", alignItems:"center", padding:16, backgroundColor:"#eef6ff" },
  avatar: { width:60, height:60, borderRadius:30, marginRight:12 },
  name: { fontSize:18, fontWeight:"700", color:"#111827" },
  email: { fontSize:13, color:"#6b7280" },
  separator: { height:1, backgroundColor:"#e5e7eb" },
  row: { paddingVertical:14, paddingHorizontal:8, backgroundColor:"#ffffff" },
  rowLabel: { fontSize:16, color:"#111827" },
  modalBackdrop: { flex:1, backgroundColor:"rgba(0,0,0,0.35)", justifyContent:"flex-end" },
  modalCard: { backgroundColor:"#ffffff", padding:16, borderTopLeftRadius:16, borderTopRightRadius:16 },
  modalTitle: { fontSize:18, fontWeight:"700", color:"#111827" },
  modalHint: { marginTop:4, color:"#6b7280" },
  fieldLabel: { marginTop:12, color:"#374151", fontWeight:"600" },
  input: { marginTop:12, borderWidth:1, borderColor:"#e5e7eb", borderRadius:10, paddingHorizontal:12, height:44, color:"#111827" },
  radioRow: { flexDirection:"row", gap:16, marginTop:10 },
  radioItem: { flexDirection:"row", alignItems:"center", gap:8 },
  radioOuter: { width:18, height:18, borderRadius:9, borderWidth:2, borderColor:"#9ca3af", alignItems:"center", justifyContent:"center" },
  radioOuterActive: { borderColor: "#111827" },
  radioInner: { width:10, height:10, borderRadius:5, backgroundColor:"#111827" },
  radioLabel: { color: "#111827" },
  previewRow: { flexDirection:"row", gap:12, marginTop:14 },
  previewCol: { flex:1 },
  previewLabel: { fontSize:12, color:"#6b7280", marginBottom:6 },
  previewImg: { width:"100%", height:140, borderRadius:10, backgroundColor:"#f3f4f6" },
  modalActions: { flexDirection:"row", justifyContent:"flex-end", gap:12, marginTop:16 },
  btn: { paddingVertical:10, paddingHorizontal:16, borderRadius:10 },
  btnSecondary: { backgroundColor:"#e5e7eb" },
  btnPrimary: { backgroundColor:"#111827" },
  btnText: { color:"#ffffff", fontWeight:"600" },
});
