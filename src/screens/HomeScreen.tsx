import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Header } from '../components/Header';
import { MatchCard } from '../components/MatchCard';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../hooks/useTheme';
import { fetchCorinthiansRecentMatches } from '../services/matchesService';
import type { MatchItem } from '../types/match';

type HomeScreenProps = {
  navigation?: {
    navigate: (screen: string) => void;
  };
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { colors, fonts } = useTheme();
  const { tasks } = useTasks();
  const styles = getStyles(colors, fonts);

  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await fetchCorinthiansRecentMatches();
      setMatches(data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os jogos recentes do Corinthians.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMatches();
  }, [loadMatches]);

  // Estatísticas do Checklist
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <View style={styles.screen}>
      <Header subtitle="MatchDay Central" />

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.topSection}>
            {/* WIDGET DO CHECKLIST DE DIA DE JOGO */}
            <View style={styles.checklistBanner}>
              <View style={styles.bannerHeader}>
                <Text style={styles.bannerBadge}>MATCHDAY CHECKLIST</Text>
                <Text style={styles.bannerCount}>
                  {completedTasks}/{totalTasks} CONCLUÍDAS
                </Text>
              </View>

              <Text style={styles.bannerTitle}>
                {pendingTasks === 0 && totalTasks > 0
                  ? '🏆 Tudo pronto para o jogo do Timão!'
                  : `Você tem ${pendingTasks} ${pendingTasks === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`}
              </Text>

              <Text style={styles.bannerSubtitle}>
                {pendingTasks > 0
                  ? 'Confira os preparativos de ingresso, transporte e manto sagrado.'
                  : 'Checklist 100% completo! Boa partida na Arena.'}
              </Text>

              {navigation ? (
                <TouchableOpacity
                  style={styles.bannerButton}
                  onPress={() => navigation.navigate('Checklist')}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir Checklist de MatchDay"
                  accessibilityHint="Navega para a tela de tarefas do dia de jogo"
                  activeOpacity={0.7}
                >
                  <Text style={styles.bannerButtonText}>ACESSAR MEU CHECKLIST</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* SEÇÃO DA API PÚBLICA DE JOGOS */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PARTIDAS RECENTES DO TIMÃO</Text>
              <Text style={styles.apiSource}>API Futebol (5 últimos jogos)</Text>
            </View>

            {/* FEEDBACK DE LOADING */}
            {loading && !refreshing ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={colors.text} />
                <Text style={styles.loadingText}>Buscando partidas do Corinthians...</Text>
              </View>
            ) : null}

            {/* FEEDBACK DE ERRO COM BOTÃO DE RETENTATIVA */}
            {errorMessage && !loading ? (
              <View
                style={styles.errorBox}
                accessibilityRole="alert"
                accessibilityLabel="Erro ao carregar partidas"
              >
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorTitle}>Falha na conexão com a API</Text>
                <Text style={styles.errorDescription}>{errorMessage}</Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={loadMatches}
                  accessibilityRole="button"
                  accessibilityLabel="Tentar novamente carregar partidas"
                  accessibilityHint="Faz uma nova requisição à API do TheSportsDB"
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryButtonText}>TENTAR NOVAMENTE</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {!loading && !errorMessage && matches.length === 0 ? (
              <View style={styles.centerBox}>
                <Text style={styles.emptyText}>Nenhuma partida recente encontrada no momento.</Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <MatchCard match={item} />}
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
      padding: 18,
      paddingBottom: 32,
    },
    topSection: {
      marginBottom: 12,
    },
    checklistBanner: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 18,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    bannerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bannerBadge: {
      fontSize: 10,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 1,
    },
    bannerCount: {
      fontSize: 11,
      fontFamily: fonts.bold,
      color: colors.danger,
    },
    bannerTitle: {
      fontSize: 17,
      fontFamily: fonts.extraBold,
      color: colors.text,
      marginBottom: 4,
    },
    bannerSubtitle: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.subtext,
      lineHeight: 18,
      marginBottom: 14,
    },
    bannerButton: {
      backgroundColor: colors.buttonBg,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerButtonText: {
      color: colors.buttonText,
      fontSize: 12,
      fontFamily: fonts.extraBold,
      letterSpacing: 0.5,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 0.8,
    },
    apiSource: {
      fontSize: 11,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    centerBox: {
      paddingVertical: 32,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    loadingText: {
      fontSize: 13,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    emptyText: {
      fontSize: 13,
      fontFamily: fonts.regular,
      color: colors.subtext,
      textAlign: 'center',
    },
    errorBox: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.danger,
      alignItems: 'center',
      marginVertical: 12,
    },
    errorIcon: {
      fontSize: 28,
      marginBottom: 6,
    },
    errorTitle: {
      fontSize: 15,
      fontFamily: fonts.bold,
      color: colors.danger,
      marginBottom: 4,
    },
    errorDescription: {
      fontSize: 12,
      fontFamily: fonts.regular,
      color: colors.subtext,
      textAlign: 'center',
      marginBottom: 14,
    },
    retryButton: {
      backgroundColor: colors.danger,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontFamily: fonts.extraBold,
      letterSpacing: 0.5,
    },
  });
}
