import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

class TrotApp extends StatelessWidget {
  const TrotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TROT',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}
