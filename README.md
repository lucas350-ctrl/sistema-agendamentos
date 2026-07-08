# 📅 Sistema de Agendamentos API

API REST desenvolvida para gerenciamento e controle de agendamentos (ex: barbearias ou consultórios), criada como projeto prático de portfólio durante o 3º período de Engenharia de Software.

## 🚀 Tecnologias Utilizadas
* **Node.js**
* **Express.js** (Framework minimalista para rotas)
* **JavaScript (ES6+)**

## 🛠️ Funcionalidades do Sistema
* **Cadastro de Clientes e Prestadores:** Armazenamento estruturado na memória da aplicação.
* **Criação de Agendamentos:** Registro de data, horário, cliente e profissional.
* **Regra de Negócio Crítica:** Validação inteligente que impede conflito de horários (dois agendamentos idênticos para o mesmo profissional).
* **Listagem e Remoção:** Rotas HTTP dedicadas para listar horários ocupados e cancelar agendamentos.

## 📁 Como rodar o projeto localmente
1. Clone o repositório: `git clone https://github.com`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `node server.js`
