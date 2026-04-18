📊 Project Lab — Simulador de Distribuições








Simulador interativo de distribuições probabilísticas (Triangular e PERT-Beta) utilizando números aleatórios reais provenientes de uma API quântica.

🎥 Preview do Sistema

💡 Substitua o link abaixo pelo GIF do seu projeto rodando

🚀 Demonstração

📌 Funcionalidades principais:

🔢 Geração de números aleatórios reais (QRNG)
📊 Simulação de cenários com:
Distribuição Triangular
Distribuição PERT-Beta
📉 Visualização com histogramas dinâmicos
📶 Barra de progresso em tempo real
⏱️ Medição de performance
🧠 Aplicações

Este projeto pode ser utilizado em:

📊 Gestão de Projetos (estimativas PERT)
📈 Análise de risco
🎓 Ensino de Estatística
🔬 Simulação de Monte Carlo
🛠️ Tecnologias
HTML5
CSS3
JavaScript (Vanilla)
jQuery + jQuery UI
Google Charts
API QRNG (Australian National University)
📂 Estrutura do Projeto
project-lab/
│
├── index.html
├── simulador.js
├── estilo.css
├── jquery.min.js
├── jquery-ui.js
├── jquery-ui.css
├── assets/
│   └── preview.gif
└── README.md
⚙️ Como Executar
git clone https://github.com/seu-usuario/project-lab.git
cd project-lab

Abra o arquivo index.html no navegador.

🧪 Como Usar
Defina:
Otimista (A)
Mais provável (B)
Pessimista (C)
Escolha a distribuição:
Triangular
PERT-Beta
Defina o número de simulações
Clique em Executar
📊 Saída do Sistema
Histograma de frequência
Frequência acumulada
Distribuição probabilística
📐 Modelos Utilizados
🔺 Distribuição Triangular

Modelo simples baseado em três pontos:

Mínimo (A)
Mais provável (B)
Máximo (C)
📈 Distribuição PERT-Beta

Modelo mais sofisticado:

Suaviza a curva
Dá maior peso ao valor mais provável
Muito utilizado em análise de projetos
⚠️ Limitações
Dependência de API externa (QRNG)
Necessidade de conexão com internet
Performance impactada com alto volume de simulações
💡 Melhorias Futuras
📥 Exportação de gráficos (PNG/PDF)
📊 Comparação entre distribuições
📱 Interface responsiva
🧮 Inclusão de novas distribuições (Normal, Exponencial)
⚡ Cache de números aleatórios
🧑‍💻 Autor

Desenvolvido para fins educacionais e experimentais.

📄 Licença

Este projeto está sob a licença MIT.
