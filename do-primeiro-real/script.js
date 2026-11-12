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
});

