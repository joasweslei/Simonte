📊 Project Lab — Simulador de Distribuições (Triangular e PERT-Beta)

📌 Visão Geral
Este projeto é um simulador estatístico interativo que utiliza números aleatórios reais para gerar e visualizar distribuições de probabilidade, com foco em:
  📐 Distribuição Triangular
  📈 Distribuição PERT-Beta
A aplicação é executada diretamente no navegador e permite ao usuário definir parâmetros de estimativa (otimista, mais provável e pessimista), simulando cenários típicos de gestão de projetos e análise de risco.

🚀 Funcionalidades
🔢 Geração de números aleatórios via API quântica (ANU - Austrália)
📊 Simulação de distribuições:
  Triangular
  PERT-Beta
📉 Visualização com histogramas interativos
  ⏱️ Medição de tempo de execução
  📶 Barra de progresso em tempo real
  ⚙️ Interface simples e intuitiva

🧠 Conceitos Aplicados

Este projeto envolve conceitos importantes de:
Probabilidade e Estatística
Simulação de Monte Carlo
Distribuições contínuas
Engenharia de Software (JS + UI)
Visualização de dados

🌐 Fonte dos Dados
Os números aleatórios são obtidos da API:
👉 https://qrng.anu.edu.au

Baseada em fenômenos quânticos
Gera números verdadeiramente aleatórios (não pseudoaleatórios)

🖥️ Tecnologias Utilizadas
HTML5
CSS3
JavaScript (Vanilla + jQuery)
jQuery UI (barra de progresso)
Google Charts (visualização)
API externa (QRNG ANU)

📂 Estrutura do Projeto
📁 project-lab/
│
├── index.html          # Interface principal
├── simulador.js        # Lógica de simulação e cálculo
├── estilo.css          # Estilos da aplicação
├── jquery.min.js       # Biblioteca jQuery
├── jquery-ui.js        # UI components
├── jquery-ui.css       # Estilo UI
└── README.md           # Documentação

⚙️ Como Executar
Clone o repositório:
git clone https://github.com/seu-usuario/project-lab.git
Abra o arquivo:
index.html
Execute diretamente no navegador (não precisa de servidor)

🧪 Como Usar
Defina os parâmetros:
Otimista (A)
Mais provável (B)
Pessimista (C)

Escolha:
 Distribuição Triangular ou PERT-Beta
 Defina o número de simulações
 Clique em Executar

📊 Saída
O sistema irá gerar:
  Histograma de frequência
  Curva acumulada
  Distribuição probabilística simulada

📐 Diferença entre as Distribuições
🔺 Triangular
   Simples e intuitiva
   Baseada apenas nos três pontos (A, B, C)
📈 PERT-Beta
  Mais suave e realista
  Considera peso maior no valor mais provável
  Muito usada em gestão de projetos (PERT)

⚠️ Observações
A API externa pode ter limitações de requisição
O desempenho depende da quantidade de simulações
Requer conexão com internet

💡 Possíveis Melhorias
  🔄 Cache de números aleatórios
  📊 Exportação dos gráficos (PNG/PDF)
  📉 Comparação entre distribuições
  🧮 Inclusão de outras distribuições (Normal, Exponencial)
  📱 Versão responsiva

👨‍💻 Autor
Desenvolvido para fins educacionais e experimentais em:
  Estatística aplicada
  Simulação de cenários
  Visualização de dados
