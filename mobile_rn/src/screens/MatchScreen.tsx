import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../api/client';

type MatchUser = {
  _id: string;
  name: string;
  avatarUrl?: string;
  skillsTeach?: string[];
  skillsLearn?: string[];
  credits?: number;
};

export default function MatchScreen() {
  const [data, setData] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.matchSuggestions();
      setData(res as unknown as MatchUser[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={data.length === 0 ? styles.center : undefined}
      ListEmptyComponent={<Text>No matches yet</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.avatarUrl ? (
            <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            {!!item.skillsTeach?.length && (
              <Text numberOfLines={1} style={styles.meta}>Teaches: {item.skillsTeach.join(', ')}</Text>
            )}
            {!!item.skillsLearn?.length && (
              <Text numberOfLines={1} style={styles.meta}>Wants: {item.skillsLearn.join(', ')}</Text>
            )}
          </View>
          {typeof item.credits === 'number' && (
            <Text style={styles.credits}>{item.credits}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 8,
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#666',
    marginTop: 2,
  },
  credits: {
    marginLeft: 8,
    fontWeight: '600',
  },
});


