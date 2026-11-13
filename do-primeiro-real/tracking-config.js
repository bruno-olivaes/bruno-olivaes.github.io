// Configuração Central de Telemetria & Marketing — Do Primeiro Real ao Patrimônio
// -----------------------------------------------------------------------------
// Preencha apenas os IDs reais abaixo, salve e faça commit/push no repositório.
// Enquanto um campo estiver vazio (''), aquele serviço não é carregado na página,
// mas o repasse automático de UTMs (src, s1, s2, s3) para a Kiwify já funciona 100%.

window.TVIN_TRACKING_CONFIG = {
    // Google Analytics 4 (ex.: 'G-ABC123DEF4')
    // Criar grátis em: https://analytics.google.com/ (Admin -> Fluxos de dados -> Web)
    // IMPORTANTE: cole este MESMO ID também na Kiwify (Produto -> Configurações -> Pixels de Conversão -> Google Analytics)
    ga4MeasurementId: 'G-0S7SRL4H71',

    // Microsoft Clarity (ex.: 'o1p2q3r4s5')
    // Criar grátis em: https://clarity.ms/ (Mapas de calor de cliques, rolagem e gravações de tela)
    clarityProjectId: 'zcsx032n9x',

    // Meta Pixel / Instagram & Facebook Ads (ex.: '123456789012345') — opcional futuro
    // Use o mesmo ID na Kiwify caso passe a impulsionar posts ou rodar tráfego pago
    metaPixelId: '',

    // Altere para true temporariamente apenas se quiser inspecionar eventos no Console (F12)
    debug: false
};

