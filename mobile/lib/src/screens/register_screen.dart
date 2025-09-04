import 'package:flutter/material.dart';
import '../api/api.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _name = TextEditingController();
  final _api = ApiClient('http://10.0.2.2:4000');
  bool _loading = false;
  String? _error;

  Future<void> _register() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.post('/api/auth/register', {
        'email': _email.text.trim(),
        'password': _password.text,
        'name': _name.text.trim()
      });
      if (res['token'] != null) {
        await _api.setToken(res['token']);
        if (!mounted) return;
        Navigator.of(context).pop();
      } else {
        setState(
            () => _error = res['message']?.toString() ?? 'Register failed');
      }
    } catch (e) {
      setState(() => _error = 'Network error');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create account')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(
              controller: _name,
              decoration: const InputDecoration(labelText: 'Name')),
          const SizedBox(height: 12),
          TextField(
              controller: _email,
              decoration: const InputDecoration(labelText: 'Email')),
          const SizedBox(height: 12),
          TextField(
              controller: _password,
              decoration: const InputDecoration(labelText: 'Password'),
              obscureText: true),
          const SizedBox(height: 12),
          if (_error != null)
            Text(_error!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 12),
          ElevatedButton(
              onPressed: _loading ? null : _register,
              child: Text(_loading ? '...' : 'Sign up')),
        ]),
      ),
    );
  }
}
