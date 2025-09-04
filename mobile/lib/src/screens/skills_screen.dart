import 'package:flutter/material.dart';
import '../api/api.dart';

class SkillsScreen extends StatefulWidget {
  const SkillsScreen({super.key});
  @override
  State<SkillsScreen> createState() => _SkillsScreenState();
}

class _SkillsScreenState extends State<SkillsScreen> {
  final _api = ApiClient('http://10.0.2.2:4000');
  final _name = TextEditingController();
  final _price = TextEditingController(text: '10');
  List<dynamic> _skills = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await _api.get('/api/skills');
      setState(() => _skills = (res as List).toList());
    } catch (_) {}
  }

  Future<void> _add() async {
    try {
      await _api.post(
          '/api/skills',
          {
            'name': _name.text.trim(),
            'priceCredits': int.tryParse(_price.text) ?? 10
          },
          auth: true);
      _name.clear();
      await _load();
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        Row(children: [
          Expanded(
              child: TextField(
                  controller: _name,
                  decoration: const InputDecoration(labelText: 'Skill'))),
          const SizedBox(width: 8),
          SizedBox(
              width: 80,
              child: TextField(
                  controller: _price,
                  decoration: const InputDecoration(labelText: 'Cr'),
                  keyboardType: TextInputType.number)),
          const SizedBox(width: 8),
          ElevatedButton(onPressed: _add, child: const Text('Add')),
        ]),
        const SizedBox(height: 12),
        Expanded(
          child: ListView.builder(
            itemCount: _skills.length,
            itemBuilder: (c, i) {
              final s = _skills[i] as Map;
              return ListTile(
                  title: Text(s['name']?.toString() ?? ''),
                  subtitle: Text('Credits: ${s['priceCredits'] ?? 0}'));
            },
          ),
        )
      ]),
    );
  }
}
