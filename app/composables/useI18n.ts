import { ref } from 'vue'

const translations: Record<string, Record<string, string>> = {
  en: {
    brandName: 'KRISTA',
    brandTagline: 'Cooperative Consensus & Smart Contracts',
    heroTitle: 'The Future of Decentralized Infrastructure',
    heroSubtitle: 'A next-generation blockchain architecture designed for ultra-fast cooperative consensus, cryptographic randomness, and gas-free visual smart contracts.',
    getStarted: 'Explore Features',
    viewDocs: 'Read Whitepaper',
    featuresTitle: 'Core Technologies',
    featuresSubtitle: 'The cutting-edge innovations that power KristaTech.',
    adamTitle: 'ADAM Consensus',
    adamDesc: 'Cooperative Consensus Protocol that achieves sub-second block confirmations. It orchestrates a dynamic validator network that coordinates blocks asynchronously using verifiable random functions (VRF) and Schnorr signatures.',
    poblsTitle: 'Proof of BLS Lottery',
    poblsDesc: 'A cryptographic lottery protocol using Boneh-Lynn-Shacham (BLS) threshold signatures. It ensures secure, unbiasable validator committee elections, mitigating Sybil risks while remaining highly energy-efficient.',
    mescalTitle: 'MESCAL Contracts',
    mescalDesc: 'A gas-free, structured sandbox for visual smart contract design. Program, compile, and execute digital agreements directly inside the native wallet using a secure, predictable, and robust execution runtime.',
    tokenomicsTitle: 'Model D Tokenomics',
    tokenomicsSubtitle: 'Sustainably powering the KristaTech ecosystem with optimized rewards.',
    calculatorTitle: 'Block Reward Simulator',
    calculatorDesc: 'Calculate the distribution splits of KRISTA block rewards for any block height.',
    blockHeight: 'Block Height',
    calcBtn: 'Calculate Distribution',
    masternodeReward: 'Masternode Reward',
    validatorReward: 'Validator/Miner Reward',
    devReward: 'Developer Fund',
    blockRewardTotal: 'Total Block Reward',
    halvingStatus: 'Halving Status',
    phaseTitle: 'Activation Phases',
    phaseSubtitle: 'Follow the roadmap to fully decentralized consensus activation.',
    phase1: 'Phase 1: Genesis & Bootstrap',
    phase1Desc: 'Regtest deployment, mainnet launch, and bootstrapping initial masternode infrastructure.',
    phase2: 'Phase 2: PoBLS Activation',
    phase2Desc: 'Cryptographic threshold lottery activation, transitioning the block committee selection from standard PoS.',
    phase3: 'Phase 3: MESCAL Integration',
    phase3Desc: 'Native deployment of visual smart contract execution layers and secure wallet sandbox designers.',
    explorer: 'Block Explorer',
    github: 'GitHub',
    footerRights: 'KristaTech Network. All rights reserved.',
    walletLogo: 'Wallet & Brand Logo',
    navFeatures: 'Features',
    navTokenomics: 'Tokenomics',
    navRoadmap: 'Roadmap',
    activeMasternodes: 'Active Masternodes',
    currentSupply: 'Circulating Supply',
    networkTps: 'Network TPS'
  },
  tr: {
    brandName: 'KRISTA',
    brandTagline: 'Kooperatif Konsensüs ve Akıllı Sözleşmeler',
    heroTitle: 'Merkeziyetsiz Altyapının Geleceği',
    heroSubtitle: 'Ultra hızlı kooperatif konsensüs, kriptografik rastgelelik ve gaz ücreti bulunmayan görsel akıllı sözleşmeler için tasarlanmış yeni nesil blokzincir mimarisi.',
    getStarted: 'Özellikleri İncele',
    viewDocs: 'Teknik Dokümanı Oku',
    featuresTitle: 'Çekirdek Teknolojiler',
    featuresSubtitle: 'KristaTech\'e güç veren en son yenilikleri keşfedin.',
    adamTitle: 'ADAM Konsensüsü',
    adamDesc: 'Saniye altı onaylama hızlarına ulaşan Kooperatif Konsensüs Protokolü. Doğrulanabilir rastgele işlevler (VRF) ve Schnorr imzaları kullanarak dinamik bir doğrulayıcı ağını asenkron olarak koordine eder.',
    poblsTitle: 'Proof of BLS Çekilişi',
    poblsDesc: 'Boneh-Lynn-Shacham (BLS) eşik imzalarını kullanan kriptografik çekiliş protokolü. Güvenli, manipüle edilemez doğrulayıcı seçimleri sağlar ve enerji dostu bir yapıyla Sybil saldırılarını engeller.',
    mescalTitle: 'MESCAL Sözleşmeleri',
    mescalDesc: 'Görsel akıllı sözleşme tasarımı için gaz ücreti olmayan, yapılandırılmış bir kum havuzu (sandbox). Güvenli ve öngörülebilir bir yürütme ortamında dijital anlaşmaları doğrudan yerel cüzdan içinde kodlayın, derleyin ve çalıştırın.',
    tokenomicsTitle: 'Model D Token Ekonomisi',
    tokenomicsSubtitle: 'KristaTech ekosistemini optimize edilmiş blok ödülleri ile sürdürülebilir kılma.',
    calculatorTitle: 'Blok Ödülü Simülatörü',
    calculatorDesc: 'Herhangi bir blok yüksekliği için KRISTA blok ödülü dağılım oranlarını hesaplayın.',
    blockHeight: 'Blok Yükseklik Değeri',
    calcBtn: 'Dağılımı Hesapla',
    masternodeReward: 'Masternode Ödülü',
    validatorReward: 'Validator/Madenci Ödülü',
    devReward: 'Geliştirici Fonu',
    blockRewardTotal: 'Toplam Blok Ödülü',
    halvingStatus: 'Yarılanma Durumu',
    phaseTitle: 'Aktivasyon Aşamaları',
    phaseSubtitle: 'Tam merkeziyetsiz konsensüs aktivasyonuna giden yol haritası.',
    phase1: 'Aşama 1: Genesis ve Başlangıç',
    phase1Desc: 'Regtest kurulumu, mainnet lansmanı ve masternode altyapısının yayına alınması.',
    phase2: 'Aşama 2: PoBLS Aktivasyonu',
    phase2Desc: 'Kriptografik eşik çekilişinin aktif edilmesi ve temel PoS sisteminden geçiş.',
    phase3: 'Aşama 3: MESCAL Entegrasyonu',
    phase3Desc: 'Akıllı sözleşme yürütme katmanlarının ve görsel tasarım arabiriminin yerel entegrasyonu.',
    explorer: 'Blok Gezgini',
    github: 'GitHub',
    footerRights: 'KristaTech Ağı. Tüm hakları saklıdır.',
    walletLogo: 'Cüzdan ve Marka Logosu',
    navFeatures: 'Özellikler',
    navTokenomics: 'Token Ekonomisi',
    navRoadmap: 'Yol Haritası',
    activeMasternodes: 'Aktif Masternode Sayısı',
    currentSupply: 'Dolaşımdaki Arz',
    networkTps: 'Ağ TPS Değeri'
  }
}

const currentLocale = ref('tr') // default to Turkish since the user is Turkish-speaking

if (process.client) {
  const savedLocale = localStorage.getItem('kristatech_locale')
  if (savedLocale && ['en', 'tr'].includes(savedLocale)) {
    currentLocale.value = savedLocale
  } else {
    const browserLang = navigator.language.slice(0, 2)
    if (['en', 'tr'].includes(browserLang)) {
      currentLocale.value = browserLang
    }
  }
}

export function useI18n() {
  const setLocale = (locale: string) => {
    if (['en', 'tr'].includes(locale)) {
      currentLocale.value = locale
      if (process.client) {
        localStorage.setItem('kristatech_locale', locale)
      }
    }
  }

  const t = (key: string): string => {
    const dict = translations[currentLocale.value] || translations.en
    return dict[key] || key
  }

  return {
    locale: currentLocale,
    setLocale,
    t
  }
}
