# TROT Mobile (Flutter)

Minimal Flutter client for the TROT backend.

Setup:
- Install Flutter 3.x
- cd mobile
- flutter pub get
- If not using Android emulator, change base URL in lib/src/api/api.dart
- Run: flutter run

Screens:
- Login, Register
- Home with Profile, Skills, Match, Requests
- Chat (open from Match item tap)

Notes:
- Uses http + shared_preferences for JWT
- Android emulator uses http://10.0.2.2:4000 for backend
