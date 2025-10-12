import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { skillCategories } from '../data/skillCategories';
import Header from '../_components/Header';
import SkillList from '../components/SkillList';
import FooterBar from '../_components/Footerbar';

interface SkillScreenProps {
  categoryId: string;
}

export default function SkillScreen({ categoryId }: SkillScreenProps) {
  const { theme } = useTheme();
  const category = skillCategories.find(cat => cat.id === categoryId);

  if (!category) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title={category.title} />
        <SkillList skills={category.skills} description={category.description} categoryId={categoryId} />
        <FooterBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});