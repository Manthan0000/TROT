import 'package:flutter/material.dart';
import '../api/api.dart';

class ChatScreen extends StatefulWidget {
  final String otherUserId;
  const ChatScreen({super.key, required this.otherUserId});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _api = ApiClient('http://10.0.2.2:4000');
  final _text = TextEditingController();
  List<dynamic> _messages = [];

  Future<void> _load() async {
    final res = await _api.get('/api/chat/${widget.otherUserId}', auth: true);
    setState(() => _messages = (res['messages'] as List?)?.toList() ?? []);
  }

  Future<void> _send() async {
    await _api.post('/api/chat/${widget.otherUserId}', {'text': _text.text},
        auth: true);
    _text.clear();
    await _load();
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chat')),
      body: Column(children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: _messages.length,
            itemBuilder: (c, i) {
              final m = _messages[i] as Map;
              return Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.all(8),
                  margin: const EdgeInsets.symmetric(vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(m['text']?.toString() ?? ''),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(8),
          child: Row(children: [
            Expanded(
                child: TextField(
                    controller: _text,
                    decoration: const InputDecoration(hintText: 'Type...'))),
            IconButton(onPressed: _send, icon: const Icon(Icons.send))
          ]),
        )
      ]),
    );
  }
}
