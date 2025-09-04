import 'package:flutter/material.dart';
import '../api/api.dart';
import 'chat_screen.dart';

class MatchScreen extends StatefulWidget {
  const MatchScreen({super.key});
  @override
  State<MatchScreen> createState() => _MatchScreenState();
}

class _MatchScreenState extends State<MatchScreen> {
  final _api = ApiClient('http://10.0.2.2:4000');
  List<dynamic> _matches = [];

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await _api.get('/api/match/suggestions', auth: true);
      setState(() => _matches = (res as List).toList());
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _matches.length,
        itemBuilder: (c, i) {
          final m = _matches[i] as Map;
          return Card(
            child: ListTile(
              title: Text(m['name']?.toString() ?? ''),
              subtitle: Text(
                  'Teaches: ${(m['skillsTeach'] as List?)?.join(', ') ?? ''}'),
              onTap: () {
                final id = m['__id'] ?? m['id'] ?? m['_id'];
                if (id != null) {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => ChatScreen(otherUserId: id.toString()),
                    ),
                  );
                }
              },
            ),
          );
        },
      ),
    );
  }
}
