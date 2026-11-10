import { computed } from 'vue'
import { sanitizeLocale, resolveInitialLocale, type Locale } from '../utils/protocol.ts'

export const translations: Readonly<Record<Locale, Readonly<Record<string, string>>>> = Object.freeze({
  en: Object.freeze({
    brandName: 'KRISTA',
    brandTagline: 'Cooperative Consensus & Smart Contracts',
    skipToContent: 'Skip to main content',
    liveNetwork: 'Mainnet Operational',
    currentBlockLabel: 'Current Block',
    consensusStatusLabel: 'Active Era',
    nextMilestoneLabel: 'Next Milestone',
    heroBadgeTag: 'LAYER-1 COOPERATIVE BLOCKCHAIN ARCHITECTURE',
    heroTitle: 'Institutional-Grade Cooperative Consensus & Gas-Free Smart Contracts',
    heroTitleHighlight: 'Cooperative Consensus',
    heroSubtitle: 'A next-generation Layer-1 blockchain engineered with Verifiable Random Function (VRF) committee elections, Boneh-Lynn-Shacham (BLS) cryptographic threshold quorums, and deterministic gas-free MESCAL smart contracts.',
    getStarted: 'Explore Architecture',
    viewDocs: 'Read Whitepaper',
    featuresTitle: 'Core Protocol Architecture',
    featuresSubtitle: 'Three foundational engineering layers working in harmony to guarantee ASIC-resistance, cryptographic finality, and zero-gas smart contract execution.',
    adamTitle: 'ADAM Consensus',
    adamBadge: '18-Algorithm + 3-Permutation VRF',
    adamDesc: 'A Decentralized Approach Model (ADAM) utilizes Verifiable Random Functions (VRF) and a rolling-seed state machine to elect an unbiasable committee of 11 validators and 1 coordinator per round across 18 dynamic puzzle-solving algorithms and 3-algorithm permutations (Blake, BMW, Groestl, JH, Keccak, Skein, Luffa, CubeHash, Shavite, SIMD, Echo, X11KVS, Hamsi, Fugue, Shabal, Whirlpool, Haval-256).',
    poblsTitle: 'Proof of BLS (PoBLS)',
    poblsBadge: 'supranational/blst • BLS12-381',
    poblsDesc: 'Powered by the high-performance supranational/blst library, PoBLS executes a cryptographic threshold lottery over BLS12-381 + secp256k1 curves for manipulation-proof validator committee selection and active 5-of-5 LLMQ quorum verification.',
    mescalTitle: 'MESCAL Smart Contracts',
    mescalBadge: 'Zero-Gas Visual Sandbox VM',
    mescalDesc: 'A deterministic, gas-free visual smart contract execution environment for predictable digital agreements. Supports native Coin-Lock (250 KRISTA) and PoW-Lock (10 KRISTA) miner registrations (locked for 2,900 blocks), multi-party escrow, linear vesting, and HTLC swaps directly inside the Core wallet.',
    specsTitle: 'Protocol Specifications & Participation Tiers',
    specsSubtitle: 'Deterministic chain parameters, cryptographic primitives, and network participation requirements enforced at the consensus layer.',
    chainParamsTitle: 'Consensus & Chain Parameters',
    nodeTiersTitle: 'Network Participation & Collateral Tiers',
    tokenomicsTitle: 'Model D Cryptoeconomics & Reward Splits',
    tokenomicsSubtitle: 'Predictable monetary policy with zero premine, a strict 210M hard cap, 50% automatic unclaimed-seat burn, and sustainable multi-actor reward distribution.',
    calculatorTitle: 'Interactive Block Reward & Split Simulator',
    calculatorDesc: 'Simulate exact block subsidies and protocol-enforced Model D recipient splits across any block height from Genesis to long-term maturity.',
    blockHeight: 'Target Block Height',
    calcBtn: 'Calculate Splits',
    masternodeReward: 'Passive Masternode Queue (35% of Pool)',
    validatorReward: 'Block Producer — Miner / Staker (15% of Pool)',
    devReward: 'Developer Treasury Fund (7.0%)',
    faucetReward: 'Bootstrap Faucet (0.7% until Block 50k)',
    quorumReward: 'Active LLMQ Quorum (10% of Pool)',
    participantsReward: 'Cooperative Validator Committee — 11 Seats (40% of Pool)',
    blockRewardTotal: 'Total Block Subsidy',
    halvingStatus: 'Emission Epoch',
    phaseTitle: 'Mainnet Consensus Activation Roadmap',
    phaseSubtitle: 'Deterministic block-height milestones governing the progressive decentralization of the KristaTech network.',
    phase1: 'Phase 1: Genesis, X11KVS & MESCAL Activation',
    phase1Desc: 'Mainnet launch at Block 1 with zero premine, X11KVS bootstrap mining (Blocks 1–199), active MESCAL smart contracts (escrow, vesting, HTLC, Coin-Lock), and initial Masternode registration (4,200 KRISTA collateral).',
    phase2: 'Phase 2: PoS & ADAM Consensus Integration',
    phase2Desc: 'Activation of Proof of Stake (PoS) block production alongside A Decentralized Approach Model (ADAM) featuring VRF rolling-seed 11-validator committee elections across 18 algorithms at Block 200.',
    phase3: 'Phase 3: PoBLS Cryptographic Committee Elections',
    phase3Desc: 'Activation of the Boneh-Lynn-Shacham (BLS12-381) threshold lottery at Block 2,000 using supranational/blst for verifiable, manipulation-proof validator committee selection.',
    phase4: 'Phase 4: Model D Multi-Actor Reward Splits & 3-Algo Permutations',
    phase4Desc: 'Full activation of the Model D economic distribution engine (35% Passive Masternode, 40% Validator Committee [8% Coin-Lock + 12% Open PoW + 20% MN], 15% Block Producer, 10% Active LLMQ Quorum + 50% Unclaimed Seat Burn) at Block 2,200.',
    docsSectionTitle: 'Technical Documentation & Research Library',
    docsSectionSubtitle: 'Peer-reviewable specifications, cryptographic proofs, economic models, and security audit reports for the KristaTech protocol.',
    explorer: 'Block Explorer',
    downloadWallet: 'Download Core Wallet',
    github: 'GitHub Repository',
    footerRights: 'KristaTech Network (KRISTA). Open-source decentralized infrastructure.',
    walletLogo: 'Wallet & Brand Logo',
    navFeatures: 'Architecture',
    navSpecs: 'Specifications',
    navTokenomics: 'Tokenomics',
    navRoadmap: 'Roadmap',
    navWhitepaper: 'Whitepaper',
    navDocuments: 'Documentation',
    activeMasternodes: 'Active Masternodes',
    currentSupply: 'Circulating Supply',
    networkTps: 'Throughput & Block Time',
    cryptoSecurity: 'Cryptographic Security'
  }),
  tr: Object.freeze({
    brandName: 'KRISTA',
    brandTagline: 'Kooperatif Konsensüs ve Akıllı Sözleşmeler',
    skipToContent: 'Ana içeriğe geç',
    liveNetwork: 'Mainnet Aktif',
    currentBlockLabel: 'Güncel Blok',
    consensusStatusLabel: 'Aktif Dönem',
    nextMilestoneLabel: 'Sıradaki Kilometre Taşı',
    heroBadgeTag: 'KATMAN-1 KOOPERATİF BLOKZİNCİR MİMARİSİ',
    heroTitle: 'Kurumsal Düzeyde Kooperatif Konsensüs ve Gaz Ücretsiz Akıllı Sözleşmeler',
    heroTitleHighlight: 'Kooperatif Konsensüs',
    heroSubtitle: 'Doğrulanabilir Rastgele İşlev (VRF) komite seçimleri, Boneh-Lynn-Shacham (BLS) kriptografik eşik çekilişleri ve gaz ücreti bulunmayan deterministik MESCAL akıllı sözleşmeleriyle tasarlanmış yeni nesil Katman-1 blokzincir altyapısı.',
    getStarted: 'Mimariyi İncele',
    viewDocs: 'Whitepaper Oku',
    featuresTitle: 'Çekirdek Protokol Mimarisi',
    featuresSubtitle: 'ASIC direncini, kriptografik kesinliği ve sıfır gaz ücretli akıllı sözleşme yürütmesini garanti altına almak için uyum içinde çalışan üç temel mühendislik katmanı.',
    adamTitle: 'ADAM Konsensüsü',
    adamBadge: '18 Algoritma + 3’lü Permütasyon VRF',
    adamDesc: 'A Decentralized Approach Model (ADAM), doğrulanabilir rastgele işlevler (VRF) ve döngüsel tohum (rolling-seed) mekanizmasıyla her turda 11 doğrulayıcı ve 1 koordinatör seçer. ASIC cihazlarına karşı tam direnç için 18 dinamik algoritmayı ve 3’lü algoritma permütasyonlarını (Blake, BMW, Groestl, JH, Keccak, Skein, Luffa, CubeHash, Shavite, SIMD, Echo, X11KVS, Hamsi, Fugue, Shabal, Whirlpool, Haval-256) destekler.',
    poblsTitle: 'Proof of BLS (PoBLS)',
    poblsBadge: 'supranational/blst • BLS12-381',
    poblsDesc: 'Yüksek performanslı supranational/blst kütüphanesiyle güçlendirilen PoBLS, BLS12-381 + secp256k1 eğrileri üzerinde kriptografik eşik çekilişi yürüterek manipüle edilemez doğrulayıcı komitesi seçimi ve 5 üyeli aktif LLMQ quorum doğrulaması sağlar.',
    mescalTitle: 'MESCAL Akıllı Sözleşmeleri',
    mescalBadge: 'Sıfır Gaz Ücretli Görsel Sandbox VM',
    mescalDesc: 'Öngörülebilir dijital anlaşmalar için gaz ücreti olmayan deterministik görsel akıllı sözleşme katmanı. Doğrudan çekirdek cüzdan içinden 250 KRISTA Coin-Lock ve 10 KRISTA PoW-Lock (2.900 blok kilitli) madenci kayıtlarını, emanet (escrow), hak ediş (vesting) ve HTLC takasını destekler.',
    specsTitle: 'Protokol Teknik Özellikleri ve Katılım Katmanları',
    specsSubtitle: 'Konsensüs katmanında zorunlu kılınan deterministik zincir parametreleri, kriptografik ilkeller ve ağ katılım gereksinimleri.',
    chainParamsTitle: 'Konsensüs ve Zincir Parametreleri',
    nodeTiersTitle: 'Ağ Katılımı ve Teminat Katmanları',
    tokenomicsTitle: 'Model D Kripto-Ekonomi ve Ödül Dağılımı',
    tokenomicsSubtitle: 'Sıfır ön madencilik (0 Premine), 210 Milyon maksimum arz sınırı, çözülmemiş koltukların %50 otomatik yakımı ve çok paydaşlı sürdürülebilir ödül paylaşım modeli.',
    calculatorTitle: 'Etkileşimli Blok Ödülü ve Dağılım Simülatörü',
    calculatorDesc: 'Genesis bloğundan uzun vadeli emisyon dönemlerine kadar istediğiniz blok yüksekliğinde protokol tarafından uygulanan net Model D ödül paylarını simüle edin.',
    blockHeight: 'Hedef Blok Yüksekliği',
    calcBtn: 'Oranları Hesapla',
    masternodeReward: 'Pasif Masternode Kuyruğu (Havuzun %35’i)',
    validatorReward: 'Blok Üreticisi — Madenci / Staker (Havuzun %15’i)',
    devReward: 'Geliştirici Hazine Fonu (%7.0)',
    faucetReward: 'Başlangıç Musluğu (50k Bloğa Kadar %0.7)',
    quorumReward: 'Aktif LLMQ Quorum (Havuzun %10’u)',
    participantsReward: 'Kooperatif Doğrulayıcı Komitesi — 11 Koltuk (Havuzun %40’ı)',
    blockRewardTotal: 'Toplam Blok Ödülü',
    halvingStatus: 'Emisyon Dönemi',
    phaseTitle: 'Mainnet Konsensüs Aktivasyon Yol Haritası',
    phaseSubtitle: 'KristaTech ağının kademeli merkeziyetsizleşmesini yöneten deterministik blok yüksekliği kilometre taşları.',
    phase1: 'Aşama 1: Genesis, X11KVS ve MESCAL Aktivasyonu',
    phase1Desc: '1. blokta sıfır ön madencilik (0 Premine) ile Mainnet lansmanı, Blok 1–199 arası X11KVS başlangıç madenciliği, aktif MESCAL akıllı sözleşmeleri (emanet, hak ediş, HTLC, Coin-Lock) ve 4.200 KRISTA teminatlı Masternode altyapısının devreye alınması.',
    phase2: 'Aşama 2: PoS ve ADAM Konsensüs Entegrasyonu',
    phase2Desc: '200. blokta Hisse Kanıtı (PoS) blok üretimi ile VRF döngüsel tohum ve 18 algoritmalı 11 doğrulayıcı komite seçimlerini içeren ADAM konsensüs protokolünün devreye alınması.',
    phase3: 'Aşama 3: PoBLS Kriptografik Komite Seçimleri',
    phase3Desc: '2.000. blokta supranational/blst (BLS12-381) kütüphanesi tabanlı, manipüle edilemez doğrulayıcı komitesi seçimi sağlayan PoBLS eşik çekilişlerinin aktif edilmesi.',
    phase4: 'Aşama 4: Model D Çok Paydaşlı Ödül Dağılımı ve 3’lü Permütasyon',
    phase4Desc: '2.200. blokta sürdürülebilir ağ büyümesini güvenceye alan Model D ödül dağılım modelinin (%35 Pasif MN, %40 Kooperatif Komite [%8 Coin-Lock + %12 Açık PoW + %20 MN], %15 Blok Üreticisi, %10 Aktif Quorum + %50 Çözülmemiş Koltuk Yakımı) devreye alınması.',
    docsSectionTitle: 'Teknik Dokümantasyon ve Araştırma Kütüphanesi',
    docsSectionSubtitle: 'KristaTech protokolüne ait teknik şartnameler, kriptografik tasarım belgeleri, ekonomik analizler ve güvenlik denetimi raporları.',
    explorer: 'Blok Gezgini',
    downloadWallet: 'Çekirdek Cüzdanı İndir',
    github: 'GitHub Deposu',
    footerRights: 'KristaTech Ağı (KRISTA). Açık kaynaklı merkeziyetsiz blokzincir altyapısı.',
    walletLogo: 'Cüzdan ve Marka Logosu',
    navFeatures: 'Mimari',
    navSpecs: 'Teknik Özellikler',
    navTokenomics: 'Token Ekonomisi',
    navRoadmap: 'Yol Haritası',
    navWhitepaper: 'Whitepaper',
    navDocuments: 'Dokümanlar',
    activeMasternodes: 'Aktif Masternode',
    currentSupply: 'Dolaşımdaki Arz',
    networkTps: 'Kapasite ve Blok Süresi',
    cryptoSecurity: 'Kriptografik Güvenlik'
  })
})

export function translate(localeInput: unknown, key: string): string {
  if (typeof key !== 'string' || key.length === 0) {
    return ''
  }
  const safeLocale = sanitizeLocale(localeInput, 'tr')
  const dict = translations[safeLocale]
  if (Object.hasOwn(dict, key)) {
    return dict[key]
  }
  if (Object.hasOwn(translations.en, key)) {
    return translations.en[key]
  }
  return key
}

export function useI18n() {
  const rawLocaleCookie = useCookie<string>('kristatech_locale', {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: 'lax',
    path: '/',
    default: () => {
      if (import.meta.server) {
        const headers = useRequestHeaders(['accept-language'])
        return resolveInitialLocale(headers['accept-language'], null, 'tr')
      }
      if (import.meta.client && typeof navigator !== 'undefined') {
        return resolveInitialLocale(null, navigator.language, 'tr')
      }
      return 'tr'
    }
  })

  const safeLocale = computed<Locale>(() => sanitizeLocale(rawLocaleCookie.value, 'tr'))

  const setLocale = (nextLocale: unknown) => {
    if (nextLocale === 'en' || nextLocale === 'tr') {
      rawLocaleCookie.value = nextLocale
    }
  }

  const t = (key: string): string => translate(safeLocale.value, key)

  return {
    locale: safeLocale,
    setLocale,
    t
  }
}
