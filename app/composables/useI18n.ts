import { ref } from 'vue'

const translations: Record<string, Record<string, string>> = {
  en: {
    brandName: 'KRISTA',
    brandTagline: 'Cooperative Consensus & Smart Contracts',
    heroTitle: 'Decentralized Infrastructure Made Calm and Secure',
    heroSubtitle: 'A next-generation blockchain architecture featuring ultra-fast cooperative consensus, Boneh-Lynn-Shacham (BLS) committee elections, and gas-free visual smart contracts.',
    getStarted: 'Explore Features',
    viewDocs: 'Read Technical Docs',
    featuresTitle: 'Core Technologies',
    featuresSubtitle: 'Innovative engineering that powers the KristaTech network.',
    adamTitle: 'ADAM Consensus',
    adamDesc: 'A decentralized approach model utilizing verifiable random functions (VRF) and a rolling-seed mechanism to elect a committee of 11 miners and 1 coordinator per round. It supports 13 dynamic puzzle-solving algorithms (including X11KVS, Hamsi, Fugue, Shabal, and Haval-256) to ensure ASIC-resistance.',
    poblsTitle: 'Proof of BLS (PoBLS)',
    poblsDesc: 'Cryptographic threshold lottery using the supranational/blst library. It ensures secure, unbiasable validator selection and active quorum verification on secp256k1 curves, providing lightweight, energy-efficient consensus security.',
    mescalTitle: 'MESCAL Contracts',
    mescalDesc: 'A gas-free visual smart contract sandbox for predictable digital agreements. Program escrow, vesting, and asset tokenization templates. Fully supports timelocked Coin-Lock miner registrations (1,000 KRISTA collateral locked for 2,880 blocks) directly inside the native wallet.',
    tokenomicsTitle: 'Model D Reward Splits',
    tokenomicsSubtitle: 'Optimized reward splits to ensure sustainable long-term network growth.',
    calculatorTitle: 'Block Reward & Split Simulator',
    calculatorDesc: 'Calculate the exact block rewards and payee distribution splits for any block height based on the Model D consensus upgrades, Developer Fund, and Faucet allocations.',
    blockHeight: 'Block Height',
    calcBtn: 'Calculate splits',
    masternodeReward: 'Masternode splits (Passive Payee)',
    validatorReward: 'Miner / Staker Reward (Block Producer)',
    devReward: 'Developer Fund (7%)',
    faucetReward: 'Bootstrap Faucet (0.7%)',
    quorumReward: 'Active LLMQ Quorum (10%)',
    participantsReward: 'Validator Participants Set (25%)',
    blockRewardTotal: 'Total Block Reward',
    halvingStatus: 'Emission Phase',
    phaseTitle: 'Activation Phases',
    phaseSubtitle: 'Follow the roadmap to fully decentralized consensus activation.',
    phase1: 'Phase 1: Genesis & Bootstrap',
    phase1Desc: 'Mainnet launch, X11KVS bootstrap mining, and deployment of initial Masternode infrastructure (20,000 KRISTA collateral).',
    phase2: 'Phase 2: PoBLS & Model D',
    phase2Desc: 'Activation of cryptographic threshold lottery (block 1,200) and Model D reward splits (50% passive payee, 10% active quorum, 25% participants, 15% producer).',
    phase3: 'Phase 3: MESCAL Integration',
    phase3Desc: 'Visual smart contract sandbox integration, allowing timelocked miner registrations and gas-free tokenized asset contracts.',
    explorer: 'Block Explorer',
    github: 'GitHub',
    footerRights: 'KristaTech Network. All rights reserved.',
    walletLogo: 'Wallet & Brand Logo',
    navFeatures: 'Features',
    navTokenomics: 'Tokenomics',
    navRoadmap: 'Activation Phases',
    navDocuments: 'Documents',
    activeMasternodes: 'Active Masternodes',
    currentSupply: 'Circulating Supply',
    networkTps: 'Network TPS'
  },
  tr: {
    brandName: 'KRISTA',
    brandTagline: 'Kooperatif Konsensüs ve Akıllı Sözleşmeler',
    heroTitle: 'Güvenli ve Huzurlu Merkeziyetsiz Altyapı',
    heroSubtitle: 'Ultra hızlı kooperatif konsensüs, Boneh-Lynn-Shacham (BLS) eşik çekilişleri ve gaz ücreti bulunmayan görsel akıllı sözleşmeler sunan yeni nesil blokzincir mimarisi.',
    getStarted: 'Özellikleri İncele',
    viewDocs: 'Teknik Dokümanı Oku',
    featuresTitle: 'Çekirdek Teknolojiler',
    featuresSubtitle: 'KristaTech ağına güç veren yenilikçi mühendislik çalışmaları.',
    adamTitle: 'ADAM Konsensüsü',
    adamDesc: 'Doğrulanabilir rastgele işlevler (VRF) ve döngüsel tohum (rolling-seed) mekanizması kullanan konsensüs modeli. Her turda 11 madenci ve 1 koordinatör seçer. ASIC cihazlarına karşı direnç sağlamak için 13 dinamik bulmaca çözme algoritmasını (X11KVS, Hamsi, Fugue, Shabal ve Haval-256 dahil) destekler.',
    poblsTitle: 'Proof of BLS (PoBLS)',
    poblsDesc: 'Supranational/blst kütüphanesi ile güçlendirilmiş, Boneh-Lynn-Shacham (BLS) eşik imzalarını kullanan kriptografik çekiliş protokolü. secp256k1 eğrileri üzerinde güvenli, manipüle edilemez doğrulayıcı seçimi ve aktif quorum doğrulama sağlar.',
    mescalTitle: 'MESCAL Sözleşmeleri',
    mescalDesc: 'Öngörülebilir dijital anlaşmalar için gaz ücreti olmayan görsel akıllı sözleşme oyun alanı (sandbox). Emanet (escrow), hak ediş (vesting) ve varlık tokenizasyonu şablonlarını cüzdan içinden yönetin. Cüzdanda kilitli 1.000 KRISTA teminatlı Coin-Lock madenci kayıtlarını (2.880 blok kilitli) doğrudan destekler.',
    tokenomicsTitle: 'Model D Ödül Dağılımı',
    tokenomicsSubtitle: 'KristaTech ekosisteminin uzun vadeli sürdürülebilirliği için optimize edilmiş ödül dağılım modelleri.',
    calculatorTitle: 'Blok Ödülü ve Dağılım Simülatörü',
    calculatorDesc: 'Model D konsensüs güncellemeleri, Geliştirici Fonu ve Musluk (Faucet) dağılımlarını hesaba katarak herhangi bir blok yüksekliğindeki net ödül paylarını hesaplayın.',
    blockHeight: 'Blok Yüksekliği',
    calcBtn: 'Oranları Hesapla',
    masternodeReward: 'Masternode Payı (Pasif Alıcı - %50)',
    validatorReward: 'Madenci / Staker Payı (Blok Üreticisi - %15)',
    devReward: 'Geliştirici Hazine Fonu (%7)',
    faucetReward: 'Başlangıç Musluğu (%0.7)',
    quorumReward: 'Aktif LLMQ Quorum Katılımcıları (%10)',
    participantsReward: 'Seçili Aday Doğrulayıcı Seti (%25)',
    blockRewardTotal: 'Toplam Blok Ödülü',
    halvingStatus: 'Emisyon Aşaması',
    phaseTitle: 'Aktivasyon Aşamaları',
    phaseSubtitle: 'Tam merkeziyetsiz konsensüs aktivasyonuna giden yol haritası.',
    phase1: 'Aşama 1: Genesis ve Başlangıç',
    phase1Desc: 'Mainnet lansmanı, X11KVS başlangıç madenciliği ve ilk Masternode altyapısının (20.000 KRISTA teminatı) kurulumu.',
    phase2: 'Aşama 2: PoBLS ve Model D',
    phase2Desc: 'Kriptografik eşik çekilişlerinin (1.200. blok) ve Model D ödül dağılımının (%50 pasif MN, %10 aktif quorum, %25 doğrulayıcı seti, %15 blok üreticisi) aktif edilmesi.',
    phase3: 'Aşama 3: MESCAL Entegrasyonu',
    phase3Desc: 'Görsel akıllı sözleşme geliştirme ortamının yerel entegrasyonu, kilitli madenci kayıtları ve gazsız dijital sözleşmelerin devreye alınması.',
    explorer: 'Blok Gezgini',
    github: 'GitHub',
    footerRights: 'KristaTech Ağı. Tüm hakları saklıdır.',
    walletLogo: 'Cüzdan ve Marka Logosu',
    navFeatures: 'Özellikler',
    navTokenomics: 'Token Ekonomisi',
    navRoadmap: 'Aktivasyon Aşamaları',
    navDocuments: 'Dokümanlar',
    activeMasternodes: 'Aktif Masternode Sayısı',
    currentSupply: 'Dolaşımdaki Arz',
    networkTps: 'Ağ TPS Değeri'
  }
}

export function useI18n() {
  const currentLocale = useCookie('kristatech_locale', {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    default: () => {
      if (process.server) {
        const headers = useRequestHeaders(['accept-language'])
        const acceptLanguage = headers['accept-language']
        if (acceptLanguage) {
          const preferred = acceptLanguage.split(',')[0].slice(0, 2)
          if (['en', 'tr'].includes(preferred)) {
            return preferred
          }
        }
      } else if (process.client) {
        const browserLang = navigator.language.slice(0, 2)
        if (['en', 'tr'].includes(browserLang)) {
          return browserLang
        }
      }
      return 'tr'
    }
  })

  const setLocale = (locale: string) => {
    if (['en', 'tr'].includes(locale)) {
      currentLocale.value = locale
    }
  }

  const t = (key: string): string => {
    const dict = translations[currentLocale.value || 'tr'] || translations.en
    return dict[key] || key
  }

  return {
    locale: currentLocale,
    setLocale,
    t
  }
}
