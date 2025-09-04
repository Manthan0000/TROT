import 'package:flutter/material.dart';
import '../api/api.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});
  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  final _api = ApiClient('http://10.0.2.2:4000');
  List<dynamic> _items = [];
  final _skillId = TextEditingController();

  Future<void> _load() async {
    final res = await _api.get('/api/requests', auth: true);
    setState(() => _items = (res as List).toList());
  }

  Future<void> _send() async {
    await _api.post('/api/requests', {'skillId': _skillId.text.trim()},
        auth: true);
    _skillId.clear();
    await _load();
  }

  Future<void> _act(String id, String action) async {
    await _api.post('/api/requests/$id/$action', {}, auth: true);
    await _load();
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(children: [
        Row(children: [
          Expanded(
              child: TextField(
                  controller: _skillId,
                  decoration: const InputDecoration(labelText: 'Skill ID'))),
          const SizedBox(width: 8),
          ElevatedButton(onPressed: _send, child: const Text('Request')),
        ]),
        const Divider(height: 24),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _load,
            child: ListView.builder(
              itemCount: _items.length,
              itemBuilder: (c, i) {
                final r = _items[i] as Map;
                return ListTile(
                  title: Text('${r['status']} • ${r['priceCredits']} credits'),
                  subtitle: Text('from ${r['from']} to ${r['to']}'),
                  trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                    TextButton(
                        onPressed: () => _act(r['id'], 'accept'),
                        child: const Text('Accept')),
                    TextButton(
                        onPressed: () => _act(r['id'], 'reject'),
                        child: const Text('Reject')),
                  ]),
                );
              },
            ),
          ),
        )
      ]),
    );
  }
}
