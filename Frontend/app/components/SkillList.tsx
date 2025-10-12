import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import type { Skill } from '../data/skillCategories';
import { resolveApiBase } from '../../lib/api';

interface SkillListProps {
  skills: Skill[];
  description: string;
  categoryId?: string;
}

interface UserWithSkill {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  skillDescription?: string;
  skillExperience?: string;
}

export default function SkillList({ skills, description, categoryId }: SkillListProps) {
  const { theme } = useTheme();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [usersWithSkill, setUsersWithSkill] = useState<UserWithSkill[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Map categoryId to backend category enum
  const getBackendCategory = (categoryId?: string) => {
    const categoryMap: Record<string, string> = {
      'technical': 'Technical',
      'creative': 'Creative',
      'engineering': 'Mentorship',
      'business': 'Finance',
      'science': 'Primary and Secondary',
      'personal': 'More'
    };
    return categoryMap[categoryId || ''] || 'Technical';
  };

  const fetchUsersWithSkill = async (skillName: string) => {
    if (!categoryId) return;
    
    setLoadingUsers(true);
    try {
      const base = resolveApiBase();
      const backendCategory = getBackendCategory(categoryId);
      const response = await fetch(
        `${base}/api/skills/users?skillName=${encodeURIComponent(skillName)}&category=${encodeURIComponent(backendCategory)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setUsersWithSkill(data.users || []);
      } else {
        setUsersWithSkill([]);
      }
    } catch (error) {
      console.error('Error fetching users with skill:', error);
      setUsersWithSkill([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSkillPress = (skillName: string) => {
    setSelectedSkill(skillName);
    setModalVisible(true);
    fetchUsersWithSkill(skillName);
  };

  const renderUserItem = ({ item }: { item: UserWithSkill }) => (
    <View style={[styles.userItem, { backgroundColor: theme.secondaryBackground }]}>
      <Image 
        source={{ uri: item.avatarUrl || 'https://via.placeholder.com/50' }} 
        style={styles.userAvatar} 
      />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.userEmail, { color: theme.muted }]}>{item.email}</Text>
        {item.skillDescription && (
          <Text style={[styles.skillDesc, { color: theme.muted }]}>
            {item.skillDescription}
          </Text>
        )}
        {item.skillExperience && (
          <Text style={[styles.skillExp, { color: theme.muted }]}>
            Experience: {item.skillExperience}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
        <Text style={[styles.description, { color: theme.text }]}>
          {description}
        </Text>
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.skillItem,
                { backgroundColor: theme.secondaryBackground }
              ]}
              onPress={() => handleSkillPress(skill.name)}
            >
              <Text style={[styles.skillName, { color: theme.text }]}>
                {skill.name}
              </Text>
              {skill.description && (
                <Text style={[styles.skillDescription, { color: theme.muted }]}>
                  {skill.description}
                </Text>
              )}
              <Text style={[styles.tapHint, { color: theme.primary }]}>
                Tap to see users with this skill
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Users with "{selectedSkill}"
            </Text>
            
            {loadingUsers ? (
              <Text style={[styles.loadingText, { color: theme.muted }]}>
                Loading users...
              </Text>
            ) : usersWithSkill.length > 0 ? (
              <FlatList
                data={usersWithSkill}
                renderItem={renderUserItem}
                keyExtractor={(item) => item._id}
                style={styles.usersList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={[styles.noUsersText, { color: theme.muted }]}>
                No users found with this skill yet.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  skillsContainer: {
    gap: 12,
  },
  skillItem: {
    padding: 16,
    borderRadius: 12,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 14,
  },
  tapHint: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  noUsersText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 20,
  },
  usersList: {
    maxHeight: 400,
  },
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  skillDesc: {
    fontSize: 12,
    marginBottom: 2,
  },
  skillExp: {
    fontSize: 12,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});