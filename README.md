# CP2 Mobile — FielFlow / MatchDay Checklist

Aplicativo desenvolvido em **React Native + TypeScript + Expo** para o torcedor do Corinthians organizar seus rituais e tarefas de dia de jogo (MatchDay Checklist), acompanhar resultados recentes do Timão consumindo a **API Futebol** e gerenciar seu perfil com persistência local e alternância de tema.

Evolução do Checkpoint 1 (Fiel Profile) para o Checkpoint 2 (FielFlow / MatchDay Checklist).

Todas as informações da aplicação são armazenadas localmente utilizando **AsyncStorage**.

## O Conceito do MatchDay Checklist

> Todo torcedor tem seus rituais para acompanhar o Timão: comprar uma camisa nova, passar naquela barraca de pastel de sempre ou vestir a meia furada da sorte. 🖤🤍
> 
> **Não deixe nenhum ritual passar em branco!** Clique em **“+ NOVA TAREFA”** e adicione seus rituais à lista para não esquecer nenhum deles no próximo jogo do Corinthians!

O checklist foi desenvolvido para que cada torcedor personalize seus preparativos para o dia de jogo (ingressos, transporte, manto alvinegro, chegada à Arena e rituais da sorte). Cada torcedor possui seus dados estritamente isolados pelo seu `userId`.

## Tecnologias

* React Native
* TypeScript
* Expo SDK 57
* React Navigation (Stack e Bottom Tabs)
* Context API (AuthContext, TaskContext, ThemeContext)
* AsyncStorage
* API Futebol (api-futebol.com.br)
* Expo Splash Screen
* Poppins (google fonts)

## Como executar

1. Clone o repositório.

2. Instale as dependências:

```bash
npm install
```

3. Configure a chave da API Futebol no arquivo `.env`:
Crie um arquivo `.env` na raiz do projeto (ou utilize o `.env.example` como base) e informe sua chave da API Futebol obtida no painel da plataforma:

```env
EXPO_PUBLIC_API_FUTEBOL_KEY=sua_chave_aqui
EXPO_PUBLIC_API_FUTEBOL_BASE_URL=https://api.api-futebol.com.br/v1
EXPO_PUBLIC_CAMPEONATO_ID=10
EXPO_PUBLIC_CORINTHIANS_ID=65
```

4. Verifique a tipagem TypeScript estrita:

```bash
npm run type-check
```

5. Inicie o projeto:

```bash
npm start
```

Também é possível executar utilizando:

```bash
npm run android
npm run ios
npm run web
```

## Configuração da API Futebol

A tela Home consome os dados da **API Futebol** para exibir os 5 jogos mais recentes do Corinthians no Campeonato Brasileiro.

Para utilizar a API:
1. Acesse o painel da API Futebol: https://dash.api-futebol.com.br/
2. Crie sua conta gratuita e copie a chave gerada.
3. Insira a chave no arquivo `.env` da raiz do projeto na variável `EXPO_PUBLIC_API_FUTEBOL_KEY`.

## Usuários de teste para avaliação

O aplicativo possui dois usuários fixos de teste pré-configurados e suporte a novos cadastros:

| Usuário | Senha | Perfil (Role) | Roteamento inicial |
| :--- | :--- | :--- | :--- |
| **admin** | `123` | `admin` (Administrador) | Abre diretamente na aba **Configurações** |
| **user** | `123` | `user` (Usuário Comum) | Abre diretamente na aba **Home** |
| **Novo Cadastro** | *(definida no form)* | `user` (Torcedor) | Abre diretamente na aba **Home** |

## Funcionalidades implementadas

### Cadastro

* Cadastro de usuário localmente com atribuição automática do perfil `user`
* Campos de nome, nome de usuário, e-mail, senha e confirmação de senha
* Validação dos campos obrigatórios
* Validação do formato do e-mail
* Validação de confirmação de senha
* Mensagens de erro
* Loading durante o cadastro
* Redirecionamento automático para a tela de login após confirmação
* Persistência dos dados utilizando AsyncStorage

### Login e Roteamento por Perfil

* Login utilizando nome de usuário e senha
* Validação dos campos e mensagens de erro para credenciais incorretas
* Autenticação dos usuários fixos (`admin` e `user`) e de torcedores cadastrados
* **Roteamento pós-login condicional por perfil:**
  * Se o perfil for `admin`: o app abre diretamente na aba **Configurações**
  * Se o perfil for `user`: o app abre diretamente na aba **Home**
* Alternância de tema Light/Dark disponível diretamente na tela de login
* Loading durante a autenticação
* Criação de sessão local após autenticação

### Header Padronizado

* Presente em todas as abas principais (Home, Checklist, Configurações)
* Exibição de saudação personalizada com o primeiro nome do torcedor
* Badge identificador do perfil (`ADMIN` ou `USUÁRIO`)
* Botão acessível de logout com confirmação e encerramento de sessão

### MatchDay Checklist (Rituais e Tarefas do Dia de Jogo)

* Lista de rituais com início **vazio** para cada torcedor personalizar seus itens
* **Isolamento total de dados:** cada usuário visualiza, edita e exclui exclusivamente as tarefas vinculadas ao seu `userId`
* Categorização de tarefas: Ingresso, Manto, Transporte, Arena e Geral
* Filtros rápidos por status: Todas, Pendentes e Concluídas
* Modal interativo para criação de nova tarefa
* Checkbox acessível para marcar conclusão ou pendência
* Exclusão de tarefas compatível com Web e Mobile nativo
* Persistência no AsyncStorage isolada por usuário

### Partidas Recentes do Corinthians (API Futebol)

* Consumo em tempo real da API Futebol com os 5 últimos jogos finalizados do Corinthians no Brasileirão Série A
* Exibição de rodada, placar, data, horário, estádio e escudo dos clubes
* Indicador de carregamento com ActivityIndicator
* Bloco de tratamento de erros com `try/catch`
* Botão interativo de **"Tentar Novamente"** em caso de indisponibilidade de rede
* Widget de resumo do MatchDay Checklist integrado na tela Home

### Perfil e Configurações

* Visualização dos dados do usuário autenticado (Nome, Usuário, Perfil de Acesso, E-mail, Telefone, Cidade, Biografia)
* Formulário para edição dos dados com todas as validações legadas preservadas:
  * Validação de nome (mínimo 2 caracteres e apenas letras)
  * Validação do formato de e-mail
  * Validação do telefone com DDD
  * Validação da cidade
* Painel exclusivo para o Administrador com indicadores de contas ativas e status do sistema
* Alternância de tema Light/Dark com persistência
* Feedback visual durante o salvamento
* Persistência das alterações no AsyncStorage

### Tema Light/Dark

O aplicativo possui dois temas completos:

* Light
* Dark

O tema é aplicado de forma consistente aos principais elementos da interface, incluindo:

* Background
* Header
* Textos
* Subtextos
* Inputs
* Bordas
* Cards
* Botões
* Placeholders
* Mensagens
* Formulários

O usuário pode alternar o tema através do controle disponível no Perfil e na tela de Login.

A preferência escolhida é persistida no AsyncStorage e restaurada automaticamente ao abrir o aplicativo.

### Logout

Ao realizar logout:

* A sessão ativa é removida do AsyncStorage
* O usuário retorna para a tela de Login
* O cadastro permanece salvo
* O tema permanece salvo
* As tarefas cadastradas permanecem salvas para o respectivo usuário

### Acessibilidade

Todos os elementos interativos possuem suporte a acessibilidade nativa:

* `accessibilityRole` em botões, links, checkboxes e inputs
* `accessibilityLabel` descritivo para leitores de tela
* `accessibilityHint` informando a ação executada pelo elemento

## Persistência local

O projeto utiliza AsyncStorage para armazenar:

```ts
const USER_STORAGE_KEY = '@myprofile:user';
const SESSION_STORAGE_KEY = '@myprofile:session';
const THEME_STORAGE_KEY = '@myprofile:theme';
const REGISTERED_USERS_KEY = '@fielflow:registered_users';
const TASKS_STORAGE_PREFIX = '@fielflow:tasks_';
```

O AsyncStorage é utilizado para:

* Salvar e recuperar múltiplos usuários cadastrados
* Atualizar os dados do perfil
* Salvar e restaurar a sessão ativa
* Remover a sessão no logout
* Salvar e recuperar o tema escolhido
* Salvar e recuperar tarefas isoladas por `userId`

## Arquitetura de Estado Global (Context API)

O projeto utiliza a **Context API** estruturada em 3 contextos e hooks customizados:

* `AuthContext` / `useAuth`: Autenticação, sessão persistida, perfis e atualização cadastral
* `TaskContext` / `useTasks`: Gerenciamento do checklist de rituais com isolamento por usuário
* `ThemeContext` / `useTheme`: Modo claro/escuro e aplicação das cores em toda a árvore de componentes

As alterações de estado respeitam o princípio da **imutabilidade**, utilizando o estado anterior e o operador spread:

```ts
setTasks((prevTasks) => [newTask, ...prevTasks]);
```

## TypeScript

O projeto foi desenvolvido utilizando TypeScript em modo estrito.

São utilizados tipos para:

* Usuário (`User`, `UserRole`)
* Sessão (`Session`)
* Tema (`ThemeMode`, `ThemeColors`)
* Tarefas (`Task`, `TaskCategory`, `TaskFilter`)
* Partidas e API (`MatchItem`, `ApiFutebolPartida`, `ApiFutebolRodadaItem`)
* Navegação (`RootStackParamList`, `MainTabParamList`)
* Props dos componentes e formulários

O uso de `any` é evitado em 100% do código-fonte. O comando `npm run type-check` valida a compilação com zero erros.

### Tipos principais

```ts
export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  role: UserRole;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  category: TaskCategory;
  createdAt: string;
};
```

## Componentização

O projeto foi organizado utilizando componentes reutilizáveis:

```text
src/
  components/
    CustomInput.tsx
    ErrorMessage.tsx
    Header.tsx
    Loading.tsx
    MatchCard.tsx
    ProfileCard.tsx
    ProfileForm.tsx
    TaskItem.tsx
    TaskModal.tsx
    ThemeSwitch.tsx

  constants/
    storage.ts

  contexts/
    AuthContext.tsx
    TaskContext.tsx
    ThemeContext.tsx

  hooks/
    useAuth.ts
    useFonts.ts
    useTasks.ts
    useTheme.ts

  navigation/
    AppNavigator.tsx

  screens/
    HomeScreen.tsx
    LoginScreen.tsx
    RegisterScreen.tsx
    SettingsScreen.tsx
    TasksScreen.tsx
    WelcomeScreen.tsx

  services/
    matchesService.ts
    storageService.ts

  theme/
    theme.ts

  types/
    match.ts
    navigation.ts
    session.ts
    task.ts
    theme.ts
    user.ts
```

## Loading e tratamento de erros

O aplicativo apresenta feedback durante operações que podem levar algum tempo, como:

* Recuperação inicial dos dados e fontes
* Cadastro
* Login
* Salvamento do perfil
* Consulta à API Futebol com indicador de carregamento

Também são tratados possíveis erros durante:

* Cadastro
* Login
* Recuperação da sessão
* Recuperação do usuário
* Salvamento do usuário
* Recuperação do tema
* Salvamento do tema
* Consulta à API Futebol (com botão de retentativa)
* Logout

## Integrantes

* Gabrielly Candido — RM 560916
* João Victor Ferreira — RM 560439
* Jonathan Henrique da Silva — RM 561139
* Luiza Ribeiro — RM 560200

## Prints da aplicação

<img width="410" height="776" alt="image" src="https://github.com/user-attachments/assets/91496557-552e-4a23-a7a3-f40af79b89fd" />

<img width="427" height="788" alt="image" src="https://github.com/user-attachments/assets/73d484ec-56c1-4b64-bf54-beba9ad35e6f" />

<img width="265" height="563" alt="image" src="https://github.com/user-attachments/assets/7ec4b425-0110-43d2-b085-41186c5caf0d" />

<img width="263" height="575" alt="image" src="https://github.com/user-attachments/assets/a0e5d841-5ad2-45db-9609-1e2a73659f2e" />