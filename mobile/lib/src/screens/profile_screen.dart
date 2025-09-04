import 'package:flutter/material.dart';
import '../api/api.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _api = ApiClient('http://10.0.2.2:4000');
  Map<String, dynamic>? _me;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final me = await _api.get('/api/profile/me', auth: true);
      setState(() => _me = me);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final me = _me;
    if (me == null) return const Center(child: CircularProgressIndicator());
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(me['name']?.toString() ?? '',
            style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 8),
        Text(me['email']?.toString() ?? ''),
        const SizedBox(height: 8),
        Text('Credits: ${me['credits']}'),
      ]),
    );
  }
}
