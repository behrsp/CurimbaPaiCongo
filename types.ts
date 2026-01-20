
export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  phone: string;
  password?: string;
  role: UserRole;
  name: string;
  isMedium?: string;
  guia?: string;
  dirigente?: string;
}

export enum View {
  PROFILE = 'PROFILE',
  REQUEST_PONTO = 'REQUEST_PONTO',
  HOUSE_PHOTOS = 'HOUSE_PHOTOS',
  CURIMBA_ARCHIVES = 'CURIMBA_ARCHIVES',
  CALENDAR = 'CALENDAR',
  MY_GUIDES = 'MY_GUIDES',
  MANAGE_MEMBERS = 'MANAGE_MEMBERS'
}

export interface HousePhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

export interface CurimbaFile {
  id: string;
  title: string;
  content: string; // Conteúdo da letra (que pode conter links)
  date: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  workingGuides?: string; // Guias que irão trabalhar no dia
}

export interface PontoRequest {
  id: string;
  nome: string;
  linha: string;
  detalhes: string;
  solicitante: string;
  data: string;
}

export interface Guia {
  id: string;
  nome: string;
  pontoNome: string;
  letra: string;
  userPhone: string; // Relacionar ao usuário logado
}

// Define ChatMessage structure for conversation history
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
