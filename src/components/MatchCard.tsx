import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import type { MatchItem } from '../types/match';

type MatchCardProps = {
  match: MatchItem;
};

export function MatchCard({ match }: MatchCardProps) {
  const { colors, fonts } = useTheme();
  const styles = getStyles(colors, fonts);

  const [homeImgError, setHomeImgError] = useState(false);
  const [awayImgError, setAwayImgError] = useState(false);

  const isCorinthiansHome = match.homeTeam.toLowerCase().includes('corinthians');
  const isCorinthiansAway = match.awayTeam.toLowerCase().includes('corinthians');

  const roundLabel = match.roundNumber
    ? `${match.roundNumber}ª RODADA • ${match.league.toUpperCase()}`
    : match.league.toUpperCase();

  const dateTimeLabel = match.time ? `${match.date} • ${match.time}` : match.date;

  const scoreText =
    match.homeScore !== null && match.awayScore !== null
      ? `${match.homeScore} x ${match.awayScore}`
      : 'vs';

  return (
    <View
      style={styles.card}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Jogo: ${match.homeTeam} ${match.homeScore ?? ''} contra ${match.awayTeam} ${match.awayScore ?? ''}, no estádio ${match.venue}`}
    >
      <View style={styles.headerRow}>
        <Text style={styles.leagueText}>{roundLabel}</Text>
        <Text style={styles.dateText}>{dateTimeLabel}</Text>
      </View>

      <View style={styles.matchRow}>
        {/* TIME CASA */}
        <View style={styles.teamCol}>
          {isCorinthiansHome ? (
            <Image
              source={require('../../assets/icon_corinthians.png')}
              style={styles.teamBadge}
              accessibilityRole="image"
              accessibilityLabel="Escudo do Corinthians"
            />
          ) : match.homeBadge && !homeImgError ? (
            <Image
              source={{ uri: match.homeBadge }}
              style={styles.teamBadge}
              onError={() => setHomeImgError(true)}
              accessibilityRole="image"
              accessibilityLabel={`Escudo de ${match.homeTeam}`}
            />
          ) : (
            <View style={styles.badgePlaceholder}>
              <Text style={styles.badgePlaceholderText}>
                {match.homeSigla || match.homeTeam.substring(0, 3).toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.teamName,
              isCorinthiansHome ? styles.corinthiansHighlight : undefined,
            ]}
            numberOfLines={1}
          >
            {match.homeTeam}
          </Text>
        </View>

        {/* PLACAR */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{scoreText}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{match.status}</Text>
          </View>
        </View>

        {/* TIME FORA */}
        <View style={styles.teamCol}>
          {isCorinthiansAway ? (
            <Image
              source={require('../../assets/icon_corinthians.png')}
              style={styles.teamBadge}
              accessibilityRole="image"
              accessibilityLabel="Escudo do Corinthians"
            />
          ) : match.awayBadge && !awayImgError ? (
            <Image
              source={{ uri: match.awayBadge }}
              style={styles.teamBadge}
              onError={() => setAwayImgError(true)}
              accessibilityRole="image"
              accessibilityLabel={`Escudo de ${match.awayTeam}`}
            />
          ) : (
            <View style={styles.badgePlaceholder}>
              <Text style={styles.badgePlaceholderText}>
                {match.awaySigla || match.awayTeam.substring(0, 3).toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            style={[
              styles.teamName,
              isCorinthiansAway ? styles.corinthiansHighlight : undefined,
            ]}
            numberOfLines={1}
          >
            {match.awayTeam}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.venueText}>📍 {match.venue}</Text>
      </View>
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
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 10,
      marginBottom: 12,
    },
    leagueText: {
      fontSize: 10,
      fontFamily: fonts.extraBold,
      color: colors.muted,
      letterSpacing: 0.5,
    },
    dateText: {
      fontSize: 11,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    matchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    teamCol: {
      flex: 1,
      alignItems: 'center',
    },
    teamBadge: {
      width: 44,
      height: 44,
      resizeMode: 'contain',
      marginBottom: 6,
    },
    badgePlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.circleBg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    badgePlaceholderText: {
      fontSize: 12,
      fontFamily: fonts.extraBold,
      color: colors.text,
    },
    teamName: {
      fontSize: 12,
      fontFamily: fonts.semiBold,
      color: colors.text,
      textAlign: 'center',
    },
    corinthiansHighlight: {
      fontFamily: fonts.extraBold,
      color: colors.text,
    },
    scoreContainer: {
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    scoreText: {
      fontSize: 20,
      fontFamily: fonts.black,
      color: colors.text,
      letterSpacing: 2,
    },
    statusPill: {
      backgroundColor: colors.circleBg,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginTop: 4,
    },
    statusText: {
      fontSize: 10,
      fontFamily: fonts.medium,
      color: colors.subtext,
    },
    footerRow: {
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'center',
    },
    venueText: {
      fontSize: 11,
      fontFamily: fonts.regular,
      color: colors.subtext,
    },
  });
}
