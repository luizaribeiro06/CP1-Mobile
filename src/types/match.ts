export type ApiFutebolTime = {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo?: string;
};

export type ApiFutebolEstadio = {
  estadio_id?: number;
  nome_popular?: string;
};

export type ApiFutebolCampeonato = {
  campeonato_id?: number;
  nome?: string;
  slug?: string;
};

export type ApiFutebolPartida = {
  partida_id: number;
  placar: string;
  time_mandante: ApiFutebolTime;
  time_visitante: ApiFutebolTime;
  placar_mandante?: number | null;
  placar_visitante?: number | null;
  status: string;
  data_realizacao: string;
  hora_realizacao: string;
  estadio?: ApiFutebolEstadio;
  campeonato?: ApiFutebolCampeonato;
};

export type ApiFutebolRodadaItem = {
  nome: string;
  slug: string;
  rodada: number;
  status: string;
  _link: string;
  data: Date
};

export type ApiFutebolRodadaDetalhes = {
  nome: string;
  rodada: number;
  status: string;
  partidas?: ApiFutebolPartida[];
};

export type MatchItem = {
  id: string;
  title: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: string | null;
  awayScore: string | null;
  homeBadge?: string | null;
  awayBadge?: string | null;
  homeSigla?: string;
  awaySigla?: string;
  venue: string;
  league: string;
  date: string;
  time?: string;
  status: string;
  isHome: boolean;
  roundNumber?: number;
};
