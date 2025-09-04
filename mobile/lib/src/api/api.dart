import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  final String baseUrl;
  ApiClient(this.baseUrl);

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  Future<dynamic> post(String path, Map<String, dynamic> body,
      {bool auth = false}) async {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (auth) {
      final t = await _getToken();
      if (t != null) headers['Authorization'] = 'Bearer $t';
    }
    final res = await http.post(Uri.parse('$baseUrl$path'),
        headers: headers, body: jsonEncode(body));
    return jsonDecode(res.body);
  }

  Future<dynamic> get(String path, {bool auth = false}) async {
    final headers = <String, String>{};
    if (auth) {
      final t = await _getToken();
      if (t != null) headers['Authorization'] = 'Bearer $t';
    }
    final res = await http.get(Uri.parse('$baseUrl$path'), headers: headers);
    return jsonDecode(res.body);
  }
}
