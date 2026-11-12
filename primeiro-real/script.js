// Do Primeiro Real ao Patrimônio — Interactivity Script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer para animações suaves .fade-in-up
    const fadeElements = document.querySelectorAll('.fade-in-up');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // 2. FAQ Acordeão Interativo
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Fecha outros itens para efeito clean
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active', !isActive);
        });
    });

    // 3. Sticky Mobile CTA Bar após rolar o Hero
    const stickyBar = document.querySelector('.sticky-cta-bar');
    const heroSection = document.querySelector('.hero');

    if (stickyBar && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom < 0) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        });
    }

    // 4. Princípio do Dia (Matemática Aplicada: algarismo 0 a 9 = date % 10)
    const principiosDia = {
        1: {
            nome: '1 — Conhecimento (Knowledge)',
            conceito: 'A base de tudo na vida: observar, pesquisar fatos reais e ler os contratos antes de gastar um centavo.',
            aplicacao: 'Revise sua fatura e extratos de banco hoje antes de qualquer compra. Informação verificada evita juros e golpes.'
        },
        2: {
            nome: '2 — Sabedoria (Wisdom)',
            conceito: 'O conhecimento colocado em movimento por meio de atitudes, hábitos e escolhas concretas no dia a dia.',
            aplicacao: 'Saber que o rotativo destrói o salário é conhecimento; quitar ou cortar o gasto supérfluo hoje e separar seus primeiros R$ 20 é sabedoria prática.'
        },
        3: {
            nome: '3 — Compreensão (Understanding)',
            conceito: 'A clareza mental que nasce da união entre estudo e prática: enxergar como o sistema induz o consumo por ansiedade.',
            aplicacao: 'Antes de parcelar algo para agradar ou aliviar o cansaço, pergunte quantas horas de trabalho aquela compra realmente custa.'
        },
        4: {
            nome: '4 — Cultura & Liberdade (Culture / Freedom)',
            conceito: 'Seu modo de viver determina sua emancipação. Autonomia material começa quando sua rotina reflete seus valores, não propagandas.',
            aplicacao: 'Reserve um tempo gratuito hoje para estudar em comunidade e troque entretenimento caro por encontros que fortalecem seu bairro.'
        },
        5: {
            nome: '5 — Poder & Justiça (Power / Equality)',
            conceito: 'Poder verdadeiro é força guiada pela verdade e pela justiça com quem está ao lado — sem oprimir nem se deixar explorar.',
            aplicacao: 'Constância de guardar R$ 50 por mês com disciplina constrói mais poder financeiro familiar do que ganhar muito e viver sem reserva.'
        },
        6: {
            nome: '6 — Igualdade (Equality)',
            conceito: 'Ninguém vence sozinho na ponta da rua. Partilhar saber financeiro e oportunidades eleva o nível de toda a comunidade.',
            aplicacao: 'Compartilhe o conhecimento útil que você aprendeu com alguém da sua casa, trabalho ou vizinhança para fortalecer o círculo local.'
        },
        7: {
            nome: '7 — Construção & Autodomínio (Build / God)',
            conceito: 'Assumir o comando consciente da própria mente e das decisões diárias em vez de terceirizar a responsabilidade.',
            aplicacao: 'Troque reclamações por um passo executável de 15 minutos hoje: liste suas 3 prioridades financeiras da semana e cumpra a primeira.'
        },
        8: {
            nome: '8 — Construir ou Destruir (Build or Destroy)',
            conceito: 'Cada escolha diária constrói segurança e patrimônio ou consome silenciosamente o esforço de meses de trabalho.',
            aplicacao: 'Olhe para os últimos 3 gastos do seu cartão: eles construíram sua reserva e capacidade de produzir ou apenas drenaram seu caixa?'
        },
        9: {
            nome: '9 — Realização & Nascimento (Born)',
            conceito: 'Tirar planos sólidos do papel e transformá-los em resultado palpável no mundo real com consistência.',
            aplicacao: 'Execute o projeto ou tarefa financeira que estava adiado. Um plano bom colocado em marcha hoje vale mais do que a perfeição parada.'
        },
        0: {
            nome: '0 — Cifra / Ciclo Completo (Cipher)',
            conceito: 'A totalidade de 360 graus: proteger a família, fazer o dinheiro circular dentro da comunidade e manter a prestação de contas aberta.',
            aplicacao: 'Fortaleça o comércio do seu bairro, negocie com clareza e revise seu ciclo mensal para começar o próximo ainda mais estruturado.'
        }
    };

    const elDigit = document.getElementById('math-digit');
    const elTitle = document.getElementById('math-principle-title');
    const elText = document.getElementById('math-principle-text');
    const elApp = document.getElementById('math-principle-app');
    const elDateLabel = document.getElementById('math-date-label');

    if (elDigit && elTitle && elText && elApp) {
        const hoje = new Date();
        const algarismo = hoje.getDate() % 10;
        const p = principiosDia[algarismo] || principiosDia[1];
        const dataFormatada = hoje.toLocaleDateString('pt-BR');

        elDigit.textContent = String(algarismo);
        elTitle.textContent = `Princípio do Dia: ${p.nome}`;
        elText.innerHTML = `<strong>O Princípio:</strong> ${p.conceito}`;
        elApp.innerHTML = `💡 <strong>Aplicação financeira & comunitária (${dataFormatada}):</strong> ${p.aplicacao}`;
        if (elDateLabel) {
            elDateLabel.textContent = `Princípio do Dia (Matemática Aplicada) • Algoritmo Diário (${dataFormatada})`;
        }
    }
});

