# Biblioteca da Igreja 📚

Uma aplicação de biblioteca virtual desenvolvida com **React, Vite, TypeScript e CSS puro** (sem Material-UI).

## 🎯 Características

- 🔍 **Busca em tempo real**: Filtre livros por título, autor ou gênero
- 📖 **Galeria de livros**: Grid responsivo que se adapta perfeitamente a qualquer tela
- ⭐ **Sistema de avaliações**: Deixe comentários e notas para cada livro
- 🎨 **Design sofisticado**: Estética editorial com tipografia expressiva
- 📱 **100% Responsivo**: Layout fluido que usa toda a largura disponível
- ⚡ **CSS Puro**: Sem dependências de bibliotecas de UI, controle total do layout

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **Vite** para build e desenvolvimento rápido
- **React Router DOM** para navegação
- **CSS Puro** para estilização (sem MUI)
- **CSS Grid** para layout responsivo

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── data/
│   └── books.ts          # Dados mockados dos livros
├── pages/
│   ├── HomePage.tsx      # Página principal com galeria
│   └── BookDetailPage.tsx # Página de detalhes do livro
├── styles/
│   ├── global.css        # Estilos globais e variáveis CSS
│   ├── HomePage.css      # Estilos da página principal
│   └── BookDetailPage.css # Estilos da página de detalhes
├── assets/
│   └── logo-elv.png      # Logo da igreja
└── App.tsx               # Componente raiz com rotas
```

## ✨ Funcionalidades

### Página Principal
- Grid responsivo que usa CSS Grid nativo com `auto-fill`
- Adapta automaticamente o número de colunas baseado na largura da tela
- Campo de busca com filtro em tempo real
- Animações suaves ao carregar e interagir
- Cards com hover effects elegantes
- Sistema de rating com estrelas
- Tags de gênero e ano de publicação

### Página de Detalhes
- Layout responsivo de duas colunas (mobile adapta para uma coluna)
- Informações completas do livro
- Sistema de avaliações e comentários
- Formulário interativo para nova avaliação
- Cálculo automático de média de notas
- Lista de avaliações com avatares
- Navegação de volta para a biblioteca

## 🎨 Design

### Paleta de Cores
- **Primária**: Tons de marrom escuro (#2C1810)
- **Secundária**: Tons de caramelo (#C17C4C)
- **Background**: Tons de bege (#F5F1EC)

### Tipografia
- **Display**: Playfair Display (serifada, elegante)
- **Corpo**: Crimson Text (serifada, legível)

### Layout Responsivo
O grid usa CSS Grid com `auto-fill` e `minmax` para se adaptar perfeitamente:
- Mobile: 1 coluna
- Tablet: 2-3 colunas
- Desktop: 4-5 colunas
- Telas grandes: 6+ colunas

**100% da largura sempre utilizada, independente do número de livros!**

## 🔄 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 📝 Dados Mockados

O projeto inclui 12 livros clássicos com:
- Título e autor
- Capa (imagens do Unsplash)
- Descrição completa
- Gênero e ano de publicação
- Avaliações com notas e comentários

## 🎯 Próximos Passos

Sugestões para expandir o projeto:
- [ ] Integração com backend/API
- [ ] Autenticação de usuários
- [ ] Salvar favoritos
- [ ] Sistema de empréstimos
- [ ] Upload de capas personalizadas
- [ ] Modo escuro
- [ ] Paginação
- [ ] Ordenação (alfabética, por nota, etc.)

## 🙏 Créditos

Desenvolvido para a Biblioteca da Igreja ELV

## 📄 Licença

Este é um projeto de demonstração.
