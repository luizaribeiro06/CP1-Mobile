import type {
  ApiFutebolRodadaDetalhes,
  ApiFutebolRodadaItem,
  MatchItem,
} from '../types/match';

const API_KEY =
  process.env.EXPO_PUBLIC_API_FUTEBOL_KEY ||
  'test_541aec824fabbfa1e446d52871d59a';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_FUTEBOL_BASE_URL ||
  'https://api.api-futebol.com.br/v1';

const CAMPEONATO_ID = Number(process.env.EXPO_PUBLIC_CAMPEONATO_ID || '10');
const CORINTHIANS_ID = Number(process.env.EXPO_PUBLIC_CORINTHIANS_ID || '65');

async function apiFetch<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Erro API Futebol (${response.status}): ${errorText || response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchCorinthiansRecentMatches(): Promise<MatchItem[]> {

  const rodadas = await apiFetch<ApiFutebolRodadaItem[]>(`/campeonatos/${CAMPEONATO_ID}/rodadas`);
  console.log(rodadas)
  // Filtra as rodadas agendadas
  const agendadas = rodadas.filter((r) => r.status === 'agendada');
  console.log(agendadas)

  // Pega as 5 últimas rodadas agendadas e inverte para exibir da mais recente para a mais antiga
  const ultimas5Rodadas = agendadas.filter((r) => r.rodada >=  29) ;

  // 2. Busca os detalhes das 5 rodadas em paralelo
  const detalhesRodadas = await Promise.all(
    ultimas5Rodadas.map((r) =>
      apiFetch<ApiFutebolRodadaDetalhes>(`/campeonatos/${CAMPEONATO_ID}/rodadas/${r.rodada}`),
    ),
  );

  const jogosDoTimao: MatchItem[] = [];

  for (const detalhes of detalhesRodadas) {
    const partidas = detalhes.partidas || [];
    const jogo = partidas.find(
      (p) =>
        p.time_mandante?.time_id === CORINTHIANS_ID ||
        p.time_visitante?.time_id === CORINTHIANS_ID,
    );

    if (jogo) {
      const isHome = jogo.time_mandante?.time_id === CORINTHIANS_ID;
      jogosDoTimao.push({
        id: String(jogo.partida_id),
        title: jogo.placar,
        homeTeam: jogo.time_mandante?.nome_popular || 'Mandante',
        awayTeam: jogo.time_visitante?.nome_popular || 'Visitante',
        homeScore: jogo.placar_mandante !== undefined && jogo.placar_mandante !== null ? String(jogo.placar_mandante) : null,
        awayScore: jogo.placar_visitante !== undefined && jogo.placar_visitante !== null ? String(jogo.placar_visitante) : null,
        homeBadge: jogo.time_mandante?.escudo || null,
        awayBadge: jogo.time_visitante?.escudo || null,
        homeSigla: jogo.time_mandante?.sigla || 'MND',
        awaySigla: jogo.time_visitante?.sigla || 'VIS',
        venue: jogo.estadio?.nome_popular || (isHome ? 'Neo Química Arena' : 'Estádio Visitante'),
        league: jogo.campeonato?.nome || 'Brasileirão Série A',
        date: jogo.data_realizacao,
        time: jogo.hora_realizacao,
        status: jogo.status === 'finalizado' ? 'Finalizado' : jogo.status,
        isHome,
        roundNumber: detalhes.rodada,
      });
    }
  }

  return jogosDoTimao;
}
