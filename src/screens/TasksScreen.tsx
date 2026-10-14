import { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/TaskModal';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import type { TaskFilter } from '../types/task';

export function TasksScreen() {
  const { colors, fonts } = useTheme();
  const {
    tasks,
    filteredTasks,
    filter,
    loading,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
  } = useTasks();
  const styles = getStyles(colors, fonts);

  const [modalVisible, setModalVisible] = useState(false);

  function confirmDelete(taskId: string, taskTitle: string) {
    if (Platform.OS === 'web') {
      
        deleteTask(taskId);
      
      return;
    }

    Alert.alert(
      'Excluir Tarefa',
      `Deseja realmente remover "${taskTitle}" do seu checklist?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ],
    );
  }

  const FILTERS: { key: TaskFilter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'completed', label: 'Concluídas' },
  ];

  return (
    <View style={styles.screen}>
      <Header subtitle="Checklist de Dia de Jogo" />

      <View style={styles.content}>
        {/* BARRA DE AÇÃO SUPERIOR: TÍTULO + BOTÃO ADICIONAR */}
        <View style={styles.actionBar}>
          <View>
            <Text style={styles.title}>MatchDay Checklist</Text>
            <Text style={styles.subtitle}>
              {tasks.filter((t) => t.completed).length} de {tasks.length} concluídas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Adicionar nova tarefa ao checklist"
            accessibilityHint="Abre formulário para criar um novo preparativo de dia de jogo"
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+ NOVA TAREFA</Text>
          </TouchableOpacity>
        </View>

        {/* FILTROS (TODAS / PENDENTES / CONCLUÍDAS) */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isSelected = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterChip, isSelected ? styles.filterChipActive : undefined]}
                onPress={() => setFilter(f.key)}
                accessibilityRole="button"
                accessibilityLabel={`Filtrar tarefas: ${f.label}`}
                accessibilityHint="Exibe as tarefas correspondentes a este filtro"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected ? styles.filterChipTextActive : undefined,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LISTA DE TAREFAS */}
        {loading ? (
          <Loading message="Carregando checklist..." />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={() => toggleTask(item.id)}
                onDelete={() => confirmDelete(item.id, item.title)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>Seu checklist está vazio</Text>
                <Text style={styles.emptyDescription}>
                  {filter === 'all'
                    ? 'Todo torcedor tem seus rituais para acompanhar o Timão: comprar uma camisa nova, passar naquela barraca de pastel de sempre ou vestir a meia furada da sorte. 🖤🤍Não deixe nenhum ritual passar em branco! Clique em “+ NOVA TAREFA” e adicione seus rituais à lista para não esquecer nenhum deles no próximo jogo do Corinthians!'
                    
                    : 'Não há itens nesta categoria de filtro.'}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={addTask}
      />
    </View>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      flex: 1,
      padding: 18,
    },
    actionBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontFamily: fonts.extraBold,
      color: colors.text,
    },
    subtitle: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.subtext,
      marginTop: 2,
    },
    addButton: {
      backgroundColor: colors.buttonBg,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 8,
    },
    addButtonText: {
      color: colors.buttonText,
      fontSize: 11,
      fontFamily: fonts.extraBold,
      letterSpacing: 0.5,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: colors.circleBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterChipActive: {
      backgroundColor: colors.buttonBg,
      borderColor: colors.buttonBg,
    },
    filterChipText: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    filterChipTextActive: {
      color: colors.buttonText,
      fontFamily: fonts.bold,
    },
    listContent: {
      paddingBottom: 30,
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emptyIcon: {
      fontSize: 36,
    },
    emptyTitle: {
      fontSize: 16,
      fontFamily: fonts.bold,
      color: colors.text,
    },
    emptyDescription: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.subtext,
      textAlign: 'center',
      maxWidth: 260,
    },
  });
}
