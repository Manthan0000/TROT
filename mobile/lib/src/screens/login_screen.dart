import 'package:flutter/material.dart';
import '../api/api.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _api = ApiClient('http://10.0.2.2:4000'); // Android emulator localhost
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.post('/api/auth/login',
          {'email': _email.text.trim(), 'password': _password.text});
      if (res['token'] != null) {
        await _api.setToken(res['token']);
        if (!mounted) return;
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const HomeScreen()));
      } else {
        setState(() => _error = res['message']?.toString() ?? 'Login failed');
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
      appBar: AppBar(title: const Text('TROT – Login')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
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
                onPressed: _loading ? null : _login,
                child: Text(_loading ? '...' : 'Login')),
            TextButton(
              onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const RegisterScreen())),
              child: const Text('Create account'),
            )
          ],
        ),
      ),
    );
  }
}
