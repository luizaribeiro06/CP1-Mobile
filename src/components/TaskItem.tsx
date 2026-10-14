import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import type { Task, TaskCategory } from '../types/task';

type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

const CATEGORY_META: Record<TaskCategory, { label: string; icon: string; color: string }> = {
  ingresso: { label: 'Ingresso', icon: '🎟️', color: '#0284C7' },
  transporte: { label: 'Transporte', icon: '🚇', color: '#059669' },
  vestuario: { label: 'Manto', icon: '👕', color: '#7C3AED' },
  estadio: { label: 'Arena', icon: '🏟️', color: '#D97706' },
  geral: { label: 'Geral', icon: '📋', color: '#4B5563' },
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { colors, fonts } = useTheme();
  const styles = getStyles(colors, fonts);

  const categoryMeta = CATEGORY_META[task.category] || CATEGORY_META.geral;

  return (
    <View style={[styles.card, task.completed ? styles.cardCompleted : undefined]}>
      <TouchableOpacity
        style={styles.checkArea}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`Marcar tarefa "${task.title}" como ${task.completed ? 'pendente' : 'concluída'}`}
        accessibilityHint="Alterna a conclusão desta tarefa do dia de jogo"
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, task.completed ? styles.checkboxActive : undefined]}>
          {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>

        <View style={styles.textBlock}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { borderColor: categoryMeta.color }]}>
              <Text style={[styles.categoryText, { color: categoryMeta.color }]}>
                {categoryMeta.icon} {categoryMeta.label}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.title,
              task.completed ? styles.titleCompleted : undefined,
            ]}
          >
            {task.title}
          </Text>
          {task.description ? (
            <Text
              style={[
                styles.description,
                task.completed ? styles.descriptionCompleted : undefined,
              ]}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel={`Excluir tarefa "${task.title}"`}
        accessibilityHint="Remove esta tarefa permanentemente da sua lista"
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    cardCompleted: {
      opacity: 0.7,
      backgroundColor: colors.circleBg,
    },
    checkArea: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginRight: 10,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      marginRight: 12,
      backgroundColor: 'transparent',
    },
    checkboxActive: {
      backgroundColor: colors.buttonBg,
      borderColor: colors.buttonBg,
    },
    checkmark: {
      color: colors.buttonText,
      fontSize: 14,
      fontFamily: fonts.black,
      lineHeight: 16,
    },
    textBlock: {
      flex: 1,
    },
    categoryRow: {
      flexDirection: 'row',
      marginBottom: 4,
    },
    categoryBadge: {
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
    },
    categoryText: {
      fontSize: 10,
      fontFamily: fonts.bold,
      letterSpacing: 0.5,
    },
    title: {
      fontSize: 14,
      fontFamily: fonts.semiBold,
      color: colors.text,
      lineHeight: 20,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.muted,
    },
    description: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.subtext,
      marginTop: 2,
    },
    descriptionCompleted: {
      textDecorationLine: 'line-through',
      color: colors.muted,
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.circleBg,
    },
    deleteIcon: {
      color: colors.danger,
      fontSize: 14,
      fontFamily: fonts.bold,
    },
  });
}
