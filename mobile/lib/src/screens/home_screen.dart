import 'package:flutter/material.dart';
import 'profile_screen.dart';
import 'skills_screen.dart';
import 'match_screen.dart';
import 'requests_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      const ProfileScreen(),
      const SkillsScreen(),
      const MatchScreen(),
      const RequestsScreen(),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('TROT')),
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
          NavigationDestination(icon: Icon(Icons.school), label: 'Skills'),
          NavigationDestination(icon: Icon(Icons.search), label: 'Match'),
          NavigationDestination(
              icon: Icon(Icons.swap_horiz), label: 'Requests'),
        ],
      ),
    );
  }
}
