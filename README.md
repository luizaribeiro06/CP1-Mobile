# CP1 Mobile — Fiel Profile

Aplicativo desenvolvido em **React Native + TypeScript + Expo** para cadastro, autenticação local, gerenciamento de perfil e personalização de tema.

Todas as informações da aplicação são armazenadas localmente utilizando **AsyncStorage**.

## Tecnologias
* React Native
* TypeScript
* Expo SDK 57
* AsyncStorage
* Expo Splash Screen
* Poppins (google fonts)

## Como executar

1. Clone o repositório.

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto:

```bash
npm start
```

Também é possível executar utilizando:

```bash
npm run android
npm run ios
npm run web
```

## Funcionalidades implementadas

### Cadastro

* Cadastro de usuário localmente
* Campos de nome, nome de usuário, e-mail, senha e confirmação de senha
* Validação dos campos obrigatórios
* Validação do formato do e-mail
* Validação de confirmação de senha
* Mensagens de erro
* Loading durante o cadastro
* Persistência dos dados utilizando AsyncStorage

### Login

* Login utilizando nome de usuário e senha
* Validação dos campos
* Comparação com os dados cadastrados no AsyncStorage
* Mensagem para credenciais incorretas
* Loading durante o login
* Criação de sessão local após autenticação

### Sessão

* Sessão persistida no AsyncStorage
* Restauração automática da sessão ao abrir o aplicativo
* Validação da sessão com o usuário armazenado
* Logout removendo somente a sessão
* Cadastro e tema permanecem salvos após o logout

### Perfil

* Visualização dos dados do usuário autenticado
* Nome
* Nome de usuário
* E-mail
* Telefone
* Cidade
* Biografia
* Formulário para edição dos dados
* Validação do nome e e-mail
* Validação do telefone
* Validação da cidade
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

O usuário pode alternar o tema através do controle disponível no perfil.

A preferência escolhida é persistida no AsyncStorage e restaurada automaticamente ao abrir o aplicativo.

### Logout

Ao realizar logout:

* A sessão ativa é removida do AsyncStorage
* O usuário retorna para a tela de Login
* O cadastro permanece salvo
* O tema permanece salvo

## Persistência local

O projeto utiliza AsyncStorage para armazenar:

```ts
const USER_STORAGE_KEY = '@myprofile:user';
const SESSION_STORAGE_KEY = '@myprofile:session';
const THEME_STORAGE_KEY = '@myprofile:theme';
```

O AsyncStorage é utilizado para:

* Salvar o cadastro
* Recuperar o cadastro
* Atualizar os dados do perfil
* Recuperar os dados atualizados
* Salvar a sessão
* Recuperar a sessão
* Remover a sessão no logout
* Salvar o tema
* Recuperar o tema

## Estado e imutabilidade

O projeto utiliza `useState` e `useEffect` para gerenciamento de estado e ciclo de vida.

As alterações do estado do usuário respeitam o princípio da **imutabilidade**, utilizando o estado anterior e o operador spread:

```ts
setUser((previousUser) => {
  if (!previousUser) return updatedUser;

  return {
    ...previousUser,
    ...updatedUser,
  };
});
```

Dessa forma, o objeto anterior não é alterado diretamente.

## TypeScript

O projeto foi desenvolvido utilizando TypeScript.

São utilizados tipos para:

* Usuário
* Sessão
* Tema
* Props dos componentes
* Estados
* Formulários
* Funções

O uso de `any` é evitado.

### Tipo do usuário

```ts
type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
};
```

## Componentização

O projeto foi organizado utilizando componentes reutilizáveis:

```text
src/
  components/
    CustomInput.tsx
    ProfileCard.tsx
    ProfileForm.tsx
    ThemeSwitch.tsx
    Loading.tsx
    ErrorMessage.tsx

  constants/
    storage.ts

  screens/
    LoginScreen.tsx
    RegisterScreen.tsx
    ProfileScreen.tsx
    IngressosScreen.tsx

  services/
    storageService.ts

  theme/
    theme.ts

  types/
    session.ts
    theme.ts
    user.ts
```

## Loading e tratamento de erros

O aplicativo apresenta feedback durante operações que podem levar algum tempo, como:

* Recuperação inicial dos dados
* Cadastro
* Login
* Salvamento do perfil

Também são tratados possíveis erros durante:

* Cadastro
* Login
* Recuperação da sessão
* Recuperação do usuário
* Salvamento do usuário
* Recuperação do tema
* Salvamento do tema
* Logout

## Integrantes

* Gabrielly Candido — RM 560916
* João Victor Ferreira — RM 560439
* Jonathan Henrique da Silva — RM 561139
* Luiza Ribeiro — RM 560200

## Prints da aplicação


```md
<img width="410" height="776" alt="image" src="https://github.com/user-attachments/assets/91496557-552e-4a23-a7a3-f40af79b89fd" />

<img width="427" height="788" alt="image" src="https://github.com/user-attachments/assets/73d484ec-56c1-4b64-bf54-beba9ad35e6f" />

<img width="265" height="563" alt="image" src="https://github.com/user-attachments/assets/7ec4b425-0110-43d2-b085-41186c5caf0d" />

<img width="263" height="575" alt="image" src="https://github.com/user-attachments/assets/a0e5d841-5ad2-45db-9609-1e2a73659f2e" />

```
