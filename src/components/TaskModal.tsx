import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CustomInput } from './CustomInput';
import { useTheme } from '../hooks/useTheme';
import type { TaskCategory } from '../types/task';

type TaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description?: string; category: TaskCategory }) => Promise<void>;
};

const CATEGORIES: { key: TaskCategory; label: string; icon: string }[] = [
  { key: 'ingresso', label: 'Ingresso', icon: '🎟️' },
  { key: 'vestuario', label: 'Manto', icon: '👕' },
  { key: 'transporte', label: 'Transporte', icon: '🚇' },
  { key: 'estadio', label: 'Arena', icon: '🏟️' },
  { key: 'geral', label: 'Geral', icon: '📋' },
];

export function TaskModal({ visible, onClose, onSave }: TaskModalProps) {
  const { colors, fonts } = useTheme();
  const styles = getStyles(colors, fonts);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('ingresso');
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  function resetState() {
    setTitle('');
    setDescription('');
    setCategory('ingresso');
    setError(undefined);
  }

  async function handleSave() {
    if (!title.trim()) {
      setError('Informe o título da tarefa.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      resetState();
      onClose();
    } catch {
      setError('Erro ao salvar tarefa. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    resetState();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Nova Tarefa de MatchDay</Text>
            <TouchableOpacity
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Fechar janela"
              accessibilityHint="Fecha este formulário sem salvar a tarefa"
              style={styles.closeButton}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.form}>
              <CustomInput
                label="O QUE VOCÊ PRECISA FAZER?"
                placeholder="Ex.: Comprar ingresso no Fiel Torcedor"
                value={title}
                onChangeText={(t) => {
                  setTitle(t);
                  if (error) setError(undefined);
                }}
                error={error}
                labelColor={colors.subtext}
                inputBackgroundColor={colors.inputBg}
                inputTextColor={colors.text}
                inputBorderColor={colors.inputBorder}
                placeholderColor={colors.placeholder}
                accessibilityRole="none"
                accessibilityLabel="Título da tarefa de dia de jogo"
                accessibilityHint="Digite o que você precisa fazer para o jogo"
              />

              <CustomInput
                label="DETALHES OU OBSERVAÇÕES (OPCIONAL)"
                placeholder="Ex.: Levar comprovante impresso ou QR code"
                value={description}
                onChangeText={setDescription}
                labelColor={colors.subtext}
                inputBackgroundColor={colors.inputBg}
                inputTextColor={colors.text}
                inputBorderColor={colors.inputBorder}
                placeholderColor={colors.placeholder}
                multiline
                accessibilityRole="none"
                accessibilityLabel="Detalhes da tarefa"
                accessibilityHint="Digite detalhes ou instruções opcionais"
              />

              <Text style={styles.categoryLabel}>CATEGORIA</Text>
              <View style={styles.categoryList}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      style={[styles.categoryChip, isSelected ? styles.categoryChipSelected : undefined]}
                      onPress={() => setCategory(cat.key)}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar categoria ${cat.label}`}
                      accessibilityHint="Define a categoria desta tarefa"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected ? styles.categoryChipTextSelected : undefined,
                        ]}
                      >
                        {cat.icon} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                disabled={saving}
                style={[styles.saveButton, saving ? styles.buttonDisabled : undefined]}
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityLabel="Adicionar tarefa"
                accessibilityHint="Salva a nova tarefa na sua lista de dia de jogo"
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'SALVANDO...' : 'ADICIONAR TAREFA'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancel}
                style={styles.cancelButton}
                accessibilityRole="button"
                accessibilityLabel="Cancelar criação de tarefa"
                accessibilityHint="Fecha este formulário descartando as alterações"
              >
                <Text style={styles.cancelButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function getStyles(
  colors: ReturnType<typeof useTheme>['colors'],
  fonts: ReturnType<typeof useTheme>['theme']['fonts'],
) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.cardBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 22,
      maxHeight: '85%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 12,
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: fonts.extraBold,
      color: colors.text,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.circleBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeIcon: {
      color: colors.subtext,
      fontSize: 14,
      fontFamily: fonts.bold,
    },
    form: {
      gap: 14,
    },
    categoryLabel: {
      fontSize: 12,
      fontFamily: fonts.bold,
      color: colors.subtext,
      letterSpacing: 0.5,
      marginTop: 2,
    },
    categoryList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.circleBg,
    },
    categoryChipSelected: {
      backgroundColor: colors.buttonBg,
      borderColor: colors.buttonBg,
    },
    categoryChipText: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.text,
    },
    categoryChipTextSelected: {
      color: colors.buttonText,
      fontFamily: fonts.bold,
    },
    saveButton: {
      height: 48,
      backgroundColor: colors.buttonBg,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    saveButtonText: {
      color: colors.buttonText,
      fontFamily: fonts.extraBold,
      fontSize: 13,
      letterSpacing: 0.5,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    cancelButton: {
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButtonText: {
      color: colors.subtext,
      fontFamily: fonts.bold,
      fontSize: 12,
    },
  });
}
