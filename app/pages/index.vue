<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import {
  calculateNextMilestone,
  calculateTotalBlockReward,
  calculateEmissionEpochLabel,
  calculateModelDSplits,
  calculateRewardAmounts,
  generateMescalBytecode,
  sanitizeBlockHeight,
  MASTERNODE_COLLATERAL
} from '~/utils/protocol'

const { locale, t } = useI18n()

// Fetch real-time blockchain status from server API proxy
const { data: statusData, refresh } = await useFetch('/api/status', {
  key: 'blockchain-status'
})

// 1. Live Blockchain & Milestone Telemetry
const currentBlock = ref(sanitizeBlockHeight(statusData.value?.height, 997))
const masternodesCount = computed(() => statusData.value?.masternodes?.enabled ?? 0)
const circulatingSupply = computed(() => statusData.value?.totalSupply ?? 19800)

const nextMilestone = computed(() => calculateNextMilestone(currentBlock.value, locale.value))

function scrollToSection(id) {
  const element = document.getElementById(id)
  if (element) {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}

let statusPollTimer = null
let consensusInterval = null
let consensusTimeout = null
let lotteryInterval = null
let copyTimeout = null

onMounted(() => {
  statusPollTimer = setInterval(async () => {
    try {
      await refresh()
      if (statusData.value?.success && typeof statusData.value?.height === 'number') {
        currentBlock.value = sanitizeBlockHeight(statusData.value.height, currentBlock.value)
      }
    } catch (e) {
      console.error('Error refreshing block status:', e)
    }
  }, 5000)
})

onUnmounted(() => {
  if (statusPollTimer) clearInterval(statusPollTimer)
  if (consensusInterval) clearInterval(consensusInterval)
  if (consensusTimeout) clearTimeout(consensusTimeout)
  if (lotteryInterval) clearInterval(lotteryInterval)
  if (copyTimeout) clearTimeout(copyTimeout)
})

// 2. Interactive Feature: ADAM Consensus Simulator
const isSimulatingConsensus = ref(false)
const consensusStep = ref(-1)
const consensusSteps = computed(() =>
  locale.value === 'tr'
    ? [
        'Önceki bloktan VRF tohumu (rolling-seed) üretiliyor...',
        'Komite seçiliyor: 11 Madenci + 1 Koordinatör...',
        '18 dinamik ASIC-dirençli bulmaca ve 3\'lü permütasyon doğrulanıyor (X11KVS/Hamsi/Fugue)...',
        'BLS12-381 ve secp256k1 imza payları birleştiriliyor...',
        'Blok doğrulandı ve KRISTA zincirine işlendi!'
      ]
    : [
        'Generating VRF rolling-seed from previous block...',
        'Electing round committee (11 Miners, 1 Coordinator)...',
        'Verifying 18 dynamic ASIC-resistant puzzles & 3-permutation VRF (X11KVS/Hamsi/Fugue)...',
        'Aggregating BLS12-381 & secp256k1 signature shares (supranational/blst)...',
        'Block verified and committed to KRISTA chain!'
      ]
)

function startConsensusSim() {
  if (isSimulatingConsensus.value) return
  if (consensusInterval) clearInterval(consensusInterval)
  if (consensusTimeout) clearTimeout(consensusTimeout)

  isSimulatingConsensus.value = true
  consensusStep.value = 0
  consensusInterval = setInterval(() => {
    if (consensusStep.value < consensusSteps.value.length - 1) {
      consensusStep.value++
    } else {
      clearInterval(consensusInterval)
      consensusInterval = null
      consensusTimeout = setTimeout(() => {
        isSimulatingConsensus.value = false
        consensusStep.value = -1
        consensusTimeout = null
      }, 1800)
    }
  }, 950)
}

// 3. Interactive Feature: PoBLS Lottery Simulator
const isLotteryRunning = ref(false)
const selectedCommittee = ref([
  'KTNode_Alpha_7b43',
  'KTNode_Delta_e851',
  'KTNode_Zeta_19da'
])
const candidates = [
  'KTNode_Alpha_7b43', 'KTNode_Beta_92a1', 'KTNode_Gamma_04f8',
  'KTNode_Delta_e851', 'KTNode_Epsilon_38c9', 'KTNode_Zeta_19da',
  'KTNode_Eta_44bc', 'KTNode_Theta_66f1'
]

function runLottery() {
  if (isLotteryRunning.value) return
  if (lotteryInterval) clearInterval(lotteryInterval)

  isLotteryRunning.value = true
  let counter = 0
  lotteryInterval = setInterval(() => {
    selectedCommittee.value = Array.from(
      { length: 3 },
      () => candidates[Math.floor(Math.random() * candidates.length)]
    )
    counter++
    if (counter > 10) {
      clearInterval(lotteryInterval)
      lotteryInterval = null
      const shuffled = [...candidates].sort(() => 0.5 - Math.random())
      selectedCommittee.value = shuffled.slice(0, 3)
      isLotteryRunning.value = false
    }
  }, 90)
}

// 4. Interactive Feature: MESCAL Smart Contracts Studio
const mescalTemplate = ref('escrow')
const copiedBytecode = ref(false)
const mescalParams = ref({
  amount: 250,
  locktime: 2900,
  refundAddress: 'KTNrvQkwv1Yo...CYv'
})

const mescalBytecode = computed(() =>
  generateMescalBytecode(mescalTemplate.value, mescalParams.value)
)

async function copyMescalBytecode() {
  try {
    if (import.meta.client && navigator.clipboard) {
      await navigator.clipboard.writeText(mescalBytecode.value)
      copiedBytecode.value = true
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copiedBytecode.value = false
        copyTimeout = null
      }, 2000)
    }
  } catch {
    copiedBytecode.value = false
  }
}

// 5. Interactive Tokenomics Calculator
const calcHeight = ref(2200)
const heightPresets = [
  { labelTr: 'Genesis (1)', labelEn: 'Genesis (1)', height: 1 },
  { labelTr: 'Başlangıç (500)', labelEn: 'Bootstrap (500)', height: 500 },
  { labelTr: 'Model D (2.200)', labelEn: 'Model D (2,200)', height: 2200 },
  { labelTr: 'Standart (10.000)', labelEn: 'Standard (10,000)', height: 10000 },
  { labelTr: '2. Çeyrek (269.200)', labelEn: 'Quarter 2 (269,200)', height: 269200 },
  { labelTr: '1. Yıl (1.051.200)', labelEn: 'Year 1 (1,051,200)', height: 1051200 }
]

const sliderProgressPercent = computed(() => {
  const val = Math.min(3500000, Math.max(1, sanitizeBlockHeight(calcHeight.value, 1)))
  return `${((val - 1) / (3500000 - 1)) * 100}%`
})

const totalReward = computed(() => calculateTotalBlockReward(calcHeight.value))
const emissionEpochLabel = computed(() => calculateEmissionEpochLabel(calcHeight.value, locale.value))
const splitPercentages = computed(() => calculateModelDSplits(calcHeight.value))
const rewardAmounts = computed(() => calculateRewardAmounts(calcHeight.value))

const devRewardAmount = computed(() => rewardAmounts.value.dev)
const faucetRewardAmount = computed(() => rewardAmounts.value.faucet)
const mnRewardAmount = computed(() => rewardAmounts.value.mn)
const quorumRewardAmount = computed(() => rewardAmounts.value.quorum)
const participantsRewardAmount = computed(() => rewardAmounts.value.participants)
const producerRewardAmount = computed(() => rewardAmounts.value.producer)

const requiredCollateral = computed(() => MASTERNODE_COLLATERAL)

// Strictly harmonious logo-derived palette for all 6 reward segments
const allocationRows = computed(() => [
  {
    key: 'mn',
    label: t('masternodeReward'),
    percent: splitPercentages.value.mn,
    amount: mnRewardAmount.value,
    dotClass: 'bg-[#7695CD]',
    barClass: 'bg-[#7695CD]'
  },
  {
    key: 'participants',
    label: t('participantsReward'),
    percent: splitPercentages.value.participants,
    amount: participantsRewardAmount.value,
    dotClass: 'bg-[#46649e]',
    barClass: 'bg-[#46649e]'
  },
  {
    key: 'producer',
    label: t('validatorReward'),
    percent: splitPercentages.value.producer,
    amount: producerRewardAmount.value,
    dotClass: 'bg-[#F5897C]',
    barClass: 'bg-[#F5897C]'
  },
  {
    key: 'quorum',
    label: t('quorumReward'),
    percent: splitPercentages.value.quorum,
    amount: quorumRewardAmount.value,
    dotClass: 'bg-[#a4bce8]',
    barClass: 'bg-[#a4bce8]'
  },
  {
    key: 'dev',
    label: t('devReward'),
    percent: splitPercentages.value.dev,
    amount: devRewardAmount.value,
    dotClass: 'bg-[#d45849]',
    barClass: 'bg-[#d45849]'
  },
  {
    key: 'faucet',
    label: t('faucetReward'),
    percent: splitPercentages.value.faucet,
    amount: faucetRewardAmount.value,
    dotClass: 'bg-[#f8b8af]',
    barClass: 'bg-[#f8b8af]'
  }
])

// 6. Technical Specifications & Documentation Cards
const chainSpecs = computed(() => {
  const isTr = locale.value === 'tr'
  return [
    {
      label: isTr ? 'Ağ Sembolü (Ticker)' : 'Network Ticker',
      value: 'KRISTA'
    },
    {
      label: isTr ? 'Konsensüs Mimarisi' : 'Consensus Architecture',
      value: 'Hybrid PoW / PoS + ADAM + PoBLS'
    },
    {
      label: isTr ? 'Madencilik Algoritmaları' : 'Mining Algorithms',
      value: isTr ? '18 Dinamik Algoritma + 3\'lü Permütasyon (X11KVS, Hamsi, Fugue, Shabal, Whirlpool, Haval-256...)' : '18 Dynamic Algorithms + 3-Permutation VRF (X11KVS, Hamsi, Fugue, Shabal, Whirlpool, Haval-256...)'
    },
    {
      label: isTr ? 'Kriptografik İmza ve Eğri' : 'Cryptographic Curve & Signatures',
      value: 'secp256k1 + BLS12-381 / supranational-blst'
    },
    {
      label: isTr ? 'Hedef Blok Süresi' : 'Target Block Spacing',
      value: isTr ? '30 Saniye (Günde 2.880 Blok)' : '30 Seconds (2,880 Blocks / Day)'
    },
    {
      label: isTr ? 'Maksimum Arz (Hard Cap)' : 'Maximum Supply (Hard Cap)',
      value: '210,000,000 KRISTA'
    },
    {
      label: isTr ? 'Ön Madencilik (Premine)' : 'Premine Allocation',
      value: isTr ? '0 KRISTA (%100 Adil Başlangıç)' : '0 KRISTA (100% Fair Launch)'
    },
    {
      label: isTr ? 'Akıllı Sözleşme Katmanı' : 'Smart Contract Layer',
      value: isTr ? 'MESCAL (Sıfır Gaz Ücretli Deterministik Sandbox)' : 'MESCAL (Zero-Gas Deterministic Sandbox)'
    }
  ]
})

const researchPapers = computed(() => {
  const isTr = locale.value === 'tr'
  const base = 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc'
  return [
    {
      code: 'DOC-01',
      badge: 'WHITEPAPER',
      accent: 'cobalt',
      title: isTr ? 'KristaTech Teknik Dokümanı (Whitepaper)' : 'KristaTech Technical Whitepaper',
      desc: isTr
        ? 'Kooperatif konsensüs mimarisi, kriptografik ilkeller ve ağ vizyonunun kapsamlı akademik özeti.'
        : 'Comprehensive architectural blueprint covering cooperative consensus, cryptographic primitives, and network design.',
      href: `${base}/${isTr ? 'Whitepaper_TR.md' : 'Whitepaper.md'}`
    },
    {
      code: 'DOC-02',
      badge: 'VRF + 18 ALGO',
      accent: 'coral',
      title: isTr ? 'ADAM Konsensüs Protokolü' : 'ADAM Consensus Specification',
      desc: isTr
        ? 'Doğrulanabilir Rastgele İşlevler (VRF), döngüsel tohum ve 11 madenci + 1 koordinatör komite seçimi.'
        : 'Verifiable Random Functions (VRF), rolling-seed state machine, and 11 miners + 1 coordinator committee election.',
      href: `${base}/${isTr ? 'ADAM_Consensus_TR.md' : 'ADAM_Consensus.md'}`
    },
    {
      code: 'DOC-03',
      badge: 'BLST QUORUM',
      accent: 'cobalt',
      title: isTr ? 'Proof of BLS (PoBLS) Konsensüsü' : 'Proof of BLS (PoBLS) Consensus',
      desc: isTr
        ? 'Supranational/blst kütüphanesi ile BLS12-381 ve secp256k1 üzerinde çalışan manipüle edilemez eşik çekiliş sistemi.'
        : 'Cryptographic threshold lottery powered by supranational/blst (BLS12-381 + secp256k1) for unbiasable quorum verification.',
      href: `${base}/${isTr ? 'PoBLS_Consensus_TR.md' : 'PoBLS_Consensus.md'}`
    },
    {
      code: 'DOC-04',
      badge: '0-GAS VM',
      accent: 'coral',
      title: isTr ? 'MESCAL Akıllı Sözleşmeleri' : 'MESCAL Smart Contracts',
      desc: isTr
        ? 'Gaz ücreti bulunmayan görsel akıllı sözleşme şablonları: Emanet, hak ediş, tokenizasyon ve Coin-Lock.'
        : 'Gas-free visual smart contract templates for escrow, linear vesting, asset minting, and Coin-Lock.',
      href: `${base}/${isTr ? 'MESCAL_TR.md' : 'MESCAL.md'}`
    },
    {
      code: 'DOC-05',
      badge: 'MODEL D',
      accent: 'cobalt',
      title: isTr ? 'Token Ekonomisi Çalışması' : 'Tokenomics & Model D Study',
      desc: isTr
        ? '%35 pasif Masternode, %40 doğrulayıcı komitesi (%20 MN + %8 Coin-Lock + %12 PoW), %15 blok üreticisi, %10 aktif quorum ve %50 sahipsiz koltuk yakımı.'
        : 'Economic modeling of the 35% Masternode, 40% Validator Committee, 15% Producer, 10% Quorum split and 50% unclaimed-seat burn.',
      href: `${base}/${isTr ? 'Tokenomics_Study_TR.md' : 'Tokenomics_Study.md'}`
    },
    {
      code: 'DOC-06',
      badge: '210M CAP',
      accent: 'coral',
      title: isTr ? 'Hardcap ve Emisyon Analizi' : 'Hardcap & Emission Analysis',
      desc: isTr
        ? '210 milyon KRISTA maksimum arz sınırı ve 90 günde bir %1.9 geometrik azalma eğrisi simülasyonu.'
        : 'Long-term supply curve verification proving the strict 210M hard cap and 1.9% quarterly geometric decay.',
      href: `${base}/${isTr ? 'Hardcap_Analysis_TR.md' : 'Hardcap_Analysis.md'}`
    },
    {
      code: 'DOC-07',
      badge: '250 / 10 KRISTA',
      accent: 'cobalt',
      title: isTr ? 'Madenci Kaydı Rehberi' : 'Miner Registration Guide',
      desc: isTr
        ? 'Cüzdan içi 250 KRISTA Coin-Lock, 10 KRISTA PoW-Lock (2.900 blok kilitli) ve Zero-Coin Açık PoW kayıt adımları.'
        : 'Step-by-step operator guide for 250 KRISTA Coin-Lock, 10 KRISTA PoW-Lock (2,900 blocks), and Zero-Coin Open PoW registration.',
      href: `${base}/${isTr ? 'Miner_Registration_TR.md' : 'Miner_Registration.md'}`
    },
    {
      code: 'DOC-08',
      badge: 'AUDIT',
      accent: 'coral',
      title: isTr ? 'Protokol Güvenlik Denetimi' : 'Protocol Security Audit',
      desc: isTr
        ? 'Konsensüs kuralları, kriptografik doğrulama, ağ katmanı ve akıllı sözleşme güvenlik incelemesi.'
        : 'Comprehensive security review of consensus rules, BLST verification, P2P hardening, and MESCAL safety.',
      href: `${base}/${isTr ? 'Security_Audit_TR.md' : 'Security_Audit.md'}`
    }
  ]
})
</script>

<template>
  <UContainer class="space-y-24 sm:space-y-32 py-10 sm:py-16">
    <!-- 1. HERO SECTION (Harmonious Glassmorphic Split Layout) -->
    <section class="relative pt-2 sm:pt-6">
      <!-- Ambient Logo-Colored Soft Glows -->
      <div class="absolute -top-12 left-4 w-80 h-80 rounded-full bg-[#7695CD]/15 blur-[110px] pointer-events-none"></div>
      <div class="absolute top-16 right-4 w-80 h-80 rounded-full bg-[#F5897C]/15 blur-[110px] pointer-events-none"></div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative">
        <!-- Left Column: Brand Value Proposition & Actions -->
        <div class="lg:col-span-7 space-y-6 text-left hero-title-container">
          <!-- Harmonious Live Network Pill -->
          <div class="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 dark:bg-slate-900/85 border border-cobalt-300/60 dark:border-slate-700 shadow-xs">
            <span class="inline-flex items-center gap-2 text-xs font-bold text-cobalt-700 dark:text-cobalt-300">
              <span class="relative flex h-2 w-2">
                <span class="pulse-indicator animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5897C] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-[#F5897C]"></span>
              </span>
              {{ t('liveNetwork') }}
            </span>
            <span class="text-cobalt-200 dark:text-slate-700">•</span>
            <span class="text-xs font-mono font-bold text-coral-600 dark:text-coral-300">
              {{ locale === 'tr' ? `Blok #${currentBlock.toLocaleString()}` : `Block #${currentBlock.toLocaleString()}` }}
            </span>
            <span class="hidden sm:inline text-cobalt-200 dark:text-slate-700">•</span>
            <span class="hidden sm:inline text-xs font-mono text-slate-500 dark:text-slate-400">
              Core v1.4.5.9
            </span>
          </div>

          <!-- Main Headline with Fluid Container Scaling -->
          <h1 class="hero-fluid-title font-extrabold tracking-tight text-slate-800 dark:text-white leading-[1.14]">
            <span v-if="locale === 'tr'">
              Güvenli, Huzurlu ve Kurumsal
              <span class="brand-gradient-text">Kooperatif Konsensüs</span>
              Altyapısı
            </span>
            <span v-else>
              Calm, Secure &amp; Institutional
              <span class="brand-gradient-text">Cooperative Consensus</span>
              Infrastructure
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {{ t('heroSubtitle') }}
          </p>

          <!-- Primary CTA Buttons -->
          <div class="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              type="button"
              @click="scrollToSection('features')"
              class="btn-brand-primary inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold cursor-pointer"
            >
              <span>{{ t('getStarted') }}</span>
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
              </svg>
            </button>

            <a
              href="https://github.com/bedri/KristaTech-KRISTA/releases"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-cobalt-800 dark:text-cobalt-200 bg-white/85 dark:bg-slate-800/85 hover:border-cobalt-400 border border-cobalt-200/80 dark:border-slate-700 shadow-xs transition-all"
            >
              <svg aria-hidden="true" class="w-4 h-4 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              <span>{{ t('downloadWallet') }}</span>
            </a>

            <a
              :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper.md'"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-cobalt-50/70 dark:bg-slate-800/60 hover:bg-cobalt-100/70 dark:hover:bg-slate-800 border border-cobalt-200/70 dark:border-slate-700 transition-all"
            >
              <span>{{ t('viewDocs') }}</span>
              <svg aria-hidden="true" class="w-4 h-4 text-cobalt-600 dark:text-cobalt-300" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>

          <!-- Architectural Highlights Strip -->
          <div class="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-cobalt-200/60 dark:border-slate-800">
              <span class="block text-xs font-mono font-bold text-cobalt-700 dark:text-cobalt-300">0 KRISTA</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Ön Madencilik (Adil)' : 'Zero Premine' }}</span>
            </div>
            <div class="px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-cobalt-200/60 dark:border-slate-800">
              <span class="block text-xs font-mono font-bold text-coral-600 dark:text-coral-300">18 ALGO</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'ASIC-Dirençli VRF' : 'ASIC-Resistant VRF' }}</span>
            </div>
            <div class="px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-cobalt-200/60 dark:border-slate-800">
              <span class="block text-xs font-mono font-bold text-cobalt-700 dark:text-cobalt-300">BLST QUORUM</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">BLS12-381 PoBLS</span>
            </div>
            <div class="px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/75 border border-cobalt-200/60 dark:border-slate-800">
              <span class="block text-xs font-mono font-bold text-coral-600 dark:text-coral-300">0-GAS VM</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">MESCAL Sandbox</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Harmonious Glassmorphic Protocol Architecture Card -->
        <div class="lg:col-span-5">
          <div class="protocol-card rounded-3xl overflow-hidden">
            <!-- Top Logo Color Accent Bar -->
            <div class="h-1.5 w-full brand-accent-bar"></div>

            <!-- Card Header -->
            <div class="p-6 sm:p-7 border-b border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3.5">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-white via-cobalt-50 to-coral-50 dark:from-slate-800 dark:to-slate-900 border border-cobalt-300/60 dark:border-cobalt-400/30 flex items-center justify-center p-2.5 shadow-xs">
                  <img src="/logo.svg" alt="" width="34" height="27" class="w-full h-full object-contain" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-extrabold text-sm text-slate-800 dark:text-white">KRISTA CORE STACK</span>
                    <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30">
                      LIVE
                    </span>
                  </div>
                  <span class="text-xs text-cobalt-600 dark:text-cobalt-300 font-medium block mt-0.5">{{ nextMilestone.eraName }}</span>
                </div>
              </div>
              <div class="text-right font-mono">
                <span class="text-[11px] text-slate-500 dark:text-slate-400 block">{{ t('currentBlockLabel') }}</span>
                <span class="text-xl font-extrabold text-cobalt-700 dark:text-cobalt-300">#{{ currentBlock.toLocaleString() }}</span>
              </div>
            </div>

            <!-- 3-Layer Stack Visual inside Glass Card -->
            <div class="p-6 sm:p-7 space-y-4">
              <div class="text-xs font-mono font-bold uppercase tracking-wider text-cobalt-600 dark:text-cobalt-300 flex items-center justify-between">
                <span>{{ locale === 'tr' ? 'Üç Katmanlı Kooperatif Mimari' : '3-Layer Cooperative Stack' }}</span>
                <span class="text-coral-600 dark:text-coral-300">BLS12-381 + secp256k1</span>
              </div>

              <div class="space-y-3">
                <!-- Layer 1 -->
                <div class="tonal-panel p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-[#7695CD]/20 border border-[#7695CD]/40 text-cobalt-700 dark:text-cobalt-200 font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                      01
                    </span>
                    <div class="min-w-0">
                      <span class="text-sm font-bold text-slate-800 dark:text-white block">ADAM Consensus Engine</span>
                      <span class="text-xs text-slate-500 dark:text-slate-400 block truncate">VRF Rolling-Seed • 11 Miners + 1 Coordinator</span>
                    </div>
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-200/70 dark:border-slate-700 shrink-0">
                    Block 200+
                  </span>
                </div>

                <!-- Layer 2 -->
                <div class="tonal-panel p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-[#F5897C]/20 border border-[#F5897C]/40 text-coral-700 dark:text-coral-200 font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div class="min-w-0">
                      <span class="text-sm font-bold text-slate-800 dark:text-white block">PoBLS Threshold Lottery</span>
                      <span class="text-xs text-slate-500 dark:text-slate-400 block truncate">supranational/blst • Active LLMQ Quorum</span>
                    </div>
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-coral-700 dark:text-coral-300 border border-coral-200/70 dark:border-slate-700 shrink-0">
                    Block 2,000+
                  </span>
                </div>

                <!-- Layer 3 -->
                <div class="tonal-panel p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="w-8 h-8 rounded-xl bg-[#7695CD]/20 border border-[#7695CD]/40 text-cobalt-700 dark:text-cobalt-200 font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                      03
                    </span>
                    <div class="min-w-0">
                      <span class="text-sm font-bold text-slate-800 dark:text-white block">MESCAL Smart Contracts</span>
                      <span class="text-xs text-slate-500 dark:text-slate-400 block truncate">Zero-Gas Sandbox • 250 / 10 KRISTA Lock</span>
                    </div>
                  </div>
                  <span class="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-200/70 dark:border-slate-700 shrink-0">
                    Genesis+
                  </span>
                </div>
              </div>

              <!-- Next Milestone Progress Tracker -->
              <div class="pt-4 border-t border-cobalt-200/50 dark:border-slate-800 space-y-2.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-500 dark:text-slate-400 font-semibold">{{ t('nextMilestoneLabel') }}:</span>
                  <span class="font-mono font-bold text-cobalt-700 dark:text-cobalt-300">{{ nextMilestone.nextName }}</span>
                </div>
                <div class="w-full h-2.5 bg-cobalt-100/80 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    class="h-full rounded-full brand-accent-bar transition-all duration-500"
                    :style="{ width: `${nextMilestone.progress}%` }"
                  ></div>
                </div>
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Block #{{ currentBlock.toLocaleString() }}</span>
                  <span v-if="nextMilestone.remaining > 0" class="text-coral-600 dark:text-coral-300 font-semibold">
                    {{ locale === 'tr' ? `Hedefe ${nextMilestone.remaining.toLocaleString()} blok kaldı` : `${nextMilestone.remaining.toLocaleString()} blocks remaining` }}
                  </span>
                  <span v-else class="text-cobalt-700 dark:text-cobalt-300 font-bold">
                    {{ locale === 'tr' ? 'Tamamlandı' : 'Activated' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4-Card Harmonious Telemetry Strip -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
        <!-- Metric 1 -->
        <div class="protocol-card rounded-3xl p-6 relative overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ t('activeMasternodes') }}
            </span>
            <span class="w-9 h-9 rounded-xl bg-[#7695CD]/15 text-cobalt-600 dark:text-cobalt-300 flex items-center justify-center">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-extrabold font-mono text-slate-800 dark:text-white">
            {{ masternodesCount.toLocaleString() }}
          </div>
          <p class="text-xs text-cobalt-700 dark:text-cobalt-300 font-semibold mt-2">
            {{ locale === 'tr' ? '4.200 KRISTA Teminat • %35 Pasif + %20 Komite + %10 Quorum' : '4,200 KRISTA Collateral • 35% Passive + 20% Committee + 10% Quorum' }}
          </p>
        </div>

        <!-- Metric 2 -->
        <div class="protocol-card rounded-3xl p-6 relative overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ t('currentSupply') }}
            </span>
            <span class="w-9 h-9 rounded-xl bg-[#F5897C]/15 text-coral-600 dark:text-coral-300 flex items-center justify-center">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-extrabold font-mono text-slate-800 dark:text-white">
            {{ circulatingSupply.toLocaleString() }}
          </div>
          <p class="text-xs text-coral-600 dark:text-coral-300 font-semibold mt-2">
            {{ locale === 'tr' ? '210M KRISTA Maks. Arz • 0 Premine' : '210M KRISTA Hard Cap • 0 Premine' }}
          </p>
        </div>

        <!-- Metric 3 -->
        <div class="protocol-card rounded-3xl p-6 relative overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ t('networkTps') }}
            </span>
            <span class="w-9 h-9 rounded-xl bg-[#7695CD]/15 text-cobalt-600 dark:text-cobalt-300 flex items-center justify-center">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-extrabold font-mono text-slate-800 dark:text-white">
            2,500+ <span class="text-base font-bold text-slate-400">TPS</span>
          </div>
          <p class="text-xs text-cobalt-700 dark:text-cobalt-300 font-semibold mt-2">
            {{ locale === 'tr' ? '30 Saniye Blok Süresi (2.880 Blok/Gün)' : '30s Block Spacing (2,880 Blocks/Day)' }}
          </p>
        </div>

        <!-- Metric 4 -->
        <div class="protocol-card rounded-3xl p-6 relative overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {{ t('cryptoSecurity') }}
            </span>
            <span class="w-9 h-9 rounded-xl bg-[#F5897C]/15 text-coral-600 dark:text-coral-300 flex items-center justify-center">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
          <div class="text-3xl font-extrabold font-mono text-slate-800 dark:text-white">
            18 <span class="text-base font-bold text-slate-400">ALGO + BLST</span>
          </div>
          <p class="text-xs text-coral-600 dark:text-coral-300 font-semibold mt-2">
            {{ locale === 'tr' ? 'X11KVS + VRF + BLS12-381 Eşik İmzası' : 'X11KVS + VRF + BLS12-381 Threshold Sig' }}
          </p>
        </div>
      </div>
    </section>

    <!-- 2. CORE PROTOCOL ARCHITECTURE & WORKBENCH (#features) -->
    <section id="features" class="scroll-mt-24 space-y-12">
      <div class="max-w-3xl mx-auto text-center space-y-3">
        <span class="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
          01 / CORE ARCHITECTURE
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {{ t('featuresTitle') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {{ t('featuresSubtitle') }}
        </p>
      </div>

      <!-- Subgrid 3-Column Feature Cards (with harmonious tonal sub-panels) -->
      <div class="feature-cards-grid">
        <!-- Pillar 1: ADAM Consensus -->
        <article class="feature-subgrid-card protocol-card rounded-3xl p-7 sm:p-8 relative overflow-clip">
          <!-- Row 1: Header -->
          <div class="space-y-3 min-w-0">
            <div class="flex items-center justify-between gap-2 min-w-0">
              <div class="w-12 h-12 shrink-0 rounded-2xl bg-[#7695CD]/15 border border-[#7695CD]/35 flex items-center justify-center text-cobalt-600 dark:text-cobalt-300">
                <svg aria-hidden="true" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30 min-w-0 break-words text-right">
                {{ t('adamBadge') }}
              </span>
            </div>
            <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
              {{ t('adamTitle') }}
            </h3>
          </div>

          <!-- Row 2: Description & Algorithm Tags -->
          <div class="space-y-4 my-5">
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('adamDesc') }}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">X11KVS</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">Hamsi</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">Fugue</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">Shabal</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">Whirlpool</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 font-semibold">+13 Dynamic</span>
            </div>
          </div>

          <!-- Row 3: Harmonious Interactive Simulator -->
          <div class="tonal-panel rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono font-bold text-cobalt-700 dark:text-cobalt-300 uppercase tracking-wider">ADAM Round Sim</span>
              <div class="flex items-center gap-1.5">
                <span
                  v-for="stepIdx in 5"
                  :key="stepIdx"
                  class="w-2 h-2 rounded-full transition-colors"
                  :class="consensusStep >= stepIdx - 1 ? 'bg-[#F5897C]' : 'bg-cobalt-200 dark:bg-slate-700'"
                ></span>
              </div>
            </div>

            <div
              aria-live="polite"
              class="bg-white/90 dark:bg-slate-900/90 rounded-xl p-3 min-h-[60px] flex items-center text-xs font-mono border border-cobalt-200/70 dark:border-slate-800"
            >
              <span v-if="consensusStep >= 0" class="text-cobalt-700 dark:text-coral-300 font-semibold">
                &gt; {{ consensusSteps[consensusStep] }}
              </span>
              <span v-else class="text-slate-500 dark:text-slate-400">
                {{ locale === 'tr' ? '> VRF komite simülasyonunu başlatmak için tıklayın...' : '> Click below to simulate a VRF consensus round...' }}
              </span>
            </div>

            <button
              type="button"
              @click="startConsensusSim"
              :disabled="isSimulatingConsensus"
              class="btn-brand-primary w-full py-2.5 px-4 rounded-xl text-xs font-bold disabled:opacity-60 cursor-pointer"
            >
              {{ isSimulatingConsensus
                ? (locale === 'tr' ? 'Komite Turu Yürütülüyor...' : 'Simulating Round...')
                : (locale === 'tr' ? 'Blok Önerisini Simüle Et' : 'Simulate Block Proposal') }}
            </button>
          </div>
        </article>

        <!-- Pillar 2: Proof of BLS (PoBLS) -->
        <article class="feature-subgrid-card protocol-card rounded-3xl p-7 sm:p-8 relative overflow-clip">
          <!-- Row 1: Header -->
          <div class="space-y-3 min-w-0">
            <div class="flex items-center justify-between gap-2 min-w-0">
              <div class="w-12 h-12 shrink-0 rounded-2xl bg-[#F5897C]/15 border border-[#F5897C]/35 flex items-center justify-center text-coral-600 dark:text-coral-300">
                <svg aria-hidden="true" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30 min-w-0 break-words text-right">
                {{ t('poblsBadge') }}
              </span>
            </div>
            <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
              {{ t('poblsTitle') }}
            </h3>
          </div>

          <!-- Row 2: Description & Tags -->
          <div class="space-y-4 my-5">
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('poblsDesc') }}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">supranational/blst</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">BLS12-381 + secp256k1</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 font-semibold">LLMQ Quorum</span>
            </div>
          </div>

          <!-- Row 3: Harmonious Interactive Simulator -->
          <div class="tonal-panel rounded-2xl p-4 flex flex-col justify-between gap-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-mono font-bold text-coral-700 dark:text-coral-300 uppercase tracking-wider">BLS Threshold Lottery</span>
              <span class="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-200/60 dark:border-slate-700">
                {{ isLotteryRunning ? (locale === 'tr' ? 'Çekiliyor...' : 'Drawing...') : 'Quorum Ready' }}
              </span>
            </div>

            <div class="bg-white/90 dark:bg-slate-900/90 rounded-xl p-3 min-h-[60px] flex flex-wrap items-center justify-center gap-1.5 border border-cobalt-200/70 dark:border-slate-800">
              <span
                v-for="node in selectedCommittee"
                :key="node"
                class="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-cobalt-400/15 border border-cobalt-400/35 text-cobalt-800 dark:text-cobalt-200"
              >
                {{ node }}
              </span>
            </div>

            <button
              type="button"
              @click="runLottery"
              :disabled="isLotteryRunning"
              class="btn-brand-primary w-full py-2.5 px-4 rounded-xl text-xs font-bold disabled:opacity-60 cursor-pointer"
            >
              {{ locale === 'tr' ? 'Kriptografik Çekilişi Çalıştır' : 'Run BLS Committee Lottery' }}
            </button>
          </div>
        </article>

        <!-- Pillar 3: MESCAL Smart Contracts -->
        <article class="feature-subgrid-card protocol-card rounded-3xl p-7 sm:p-8 relative overflow-clip">
          <!-- Row 1: Header -->
          <div class="space-y-3 min-w-0">
            <div class="flex items-center justify-between gap-2 min-w-0">
              <div class="w-12 h-12 shrink-0 rounded-2xl bg-[#7695CD]/15 border border-[#7695CD]/35 flex items-center justify-center text-cobalt-600 dark:text-cobalt-300">
                <svg aria-hidden="true" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30 min-w-0 break-words text-right">
                {{ t('mescalBadge') }}
              </span>
            </div>
            <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
              {{ t('mescalTitle') }}
            </h3>
          </div>

          <!-- Row 2: Description & Tags -->
          <div class="space-y-4 my-5 min-w-0">
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('mescalDesc') }}
            </p>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 font-semibold">250 KRISTA Coin-Lock</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">10 KRISTA PoW-Lock</span>
              <span class="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-cobalt-800 dark:text-slate-300 border border-cobalt-200/60 dark:border-slate-700">2,900 Blocks</span>
            </div>
          </div>

          <!-- Row 3: Harmonious Interactive MESCAL Studio -->
          <div class="tonal-panel rounded-2xl p-4 flex flex-col justify-between gap-2.5 min-w-0">
            <div class="flex flex-wrap items-center justify-between gap-2 min-w-0">
              <label for="mescal-template-select" class="text-xs font-mono font-bold text-cobalt-700 dark:text-cobalt-300 uppercase shrink-0">
                MESCAL VM
              </label>
              <div class="flex items-center gap-1.5 min-w-0 max-w-full">
                <select
                  id="mescal-template-select"
                  v-model="mescalTemplate"
                  class="min-w-0 max-w-full truncate bg-white dark:bg-slate-900 border border-cobalt-200/80 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 font-mono"
                >
                  <option value="escrow">Coin-Lock (250 KRISTA)</option>
                  <option value="vesting">Linear Vesting</option>
                  <option value="token">Asset Minting</option>
                </select>
                <button
                  type="button"
                  @click="copyMescalBytecode"
                  class="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-cobalt-200/80 dark:border-slate-700 hover:border-coral-400 text-[11px] font-mono font-semibold text-coral-600 dark:text-coral-300 cursor-pointer"
                >
                  {{ copiedBytecode ? (locale === 'tr' ? 'Kopyalandı' : 'Copied') : (locale === 'tr' ? 'Kopyala' : 'Copy') }}
                </button>
              </div>
            </div>

            <div v-if="mescalTemplate === 'escrow'" class="grid grid-cols-2 gap-2 text-xs min-w-0">
              <label for="mescal-collateral-input" class="flex flex-col min-w-0 text-slate-500 dark:text-slate-400 font-mono">
                <span class="truncate">Collateral (KRISTA)</span>
                <input
                  id="mescal-collateral-input"
                  type="number"
                  min="1"
                  max="210000000"
                  v-model="mescalParams.amount"
                  class="w-full min-w-0 bg-white dark:bg-slate-900 border border-cobalt-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1 mt-1 text-slate-800 dark:text-white font-mono text-xs font-semibold"
                />
              </label>
              <label for="mescal-locktime-input" class="flex flex-col min-w-0 text-slate-500 dark:text-slate-400 font-mono">
                <span class="truncate">Locktime (Blocks)</span>
                <input
                  id="mescal-locktime-input"
                  type="number"
                  min="1"
                  max="5256000"
                  v-model="mescalParams.locktime"
                  class="w-full min-w-0 bg-white dark:bg-slate-900 border border-cobalt-200/80 dark:border-slate-700 rounded-lg px-2.5 py-1 mt-1 text-slate-800 dark:text-white font-mono text-xs font-semibold"
                />
              </label>
            </div>

            <pre
              tabindex="0"
              class="w-full max-w-full min-w-0 bg-white/90 dark:bg-slate-900/90 rounded-xl p-2.5 text-xs font-mono border border-cobalt-200/70 dark:border-slate-800 overflow-y-auto whitespace-pre-wrap break-words overscroll-contain text-cobalt-800 dark:text-cobalt-200 max-h-[96px] leading-relaxed"
            ><code>{{ mescalBytecode }}</code></pre>
          </div>
        </article>
      </div>
    </section>

    <!-- 3. PROTOCOL SPECIFICATIONS & NODE PARTICIPATION TIERS (#specs) -->
    <section id="specs" class="scroll-mt-24 space-y-12">
      <div class="max-w-3xl mx-auto text-center space-y-3">
        <span class="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30">
          02 / TECHNICAL SPECIFICATIONS
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {{ t('specsTitle') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {{ t('specsSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Left: Deterministic Chain Parameters -->
        <div class="lg:col-span-6 protocol-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-3 pb-5 border-b border-cobalt-200/60 dark:border-slate-800">
              <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
                {{ t('chainParamsTitle') }}
              </h3>
              <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300">
                MAINNET
              </span>
            </div>

            <ul role="list" class="spec-list mt-2">
              <li
                v-for="spec in chainSpecs"
                :key="spec.label"
                class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"
              >
                <span class="text-slate-500 dark:text-slate-400 font-medium">{{ spec.label }}</span>
                <span class="font-mono font-bold text-slate-800 dark:text-white sm:text-right">{{ spec.value }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-6 p-4 rounded-2xl tonal-panel flex items-center justify-between gap-4">
            <div class="text-xs text-slate-600 dark:text-slate-300">
              <strong class="block text-cobalt-800 dark:text-cobalt-200 mb-0.5">
                {{ locale === 'tr' ? 'Açık Kaynak Doğrulama' : 'Open-Source Verification' }}
              </strong>
              <span>
                {{ locale === 'tr'
                  ? 'Tüm konsensüs kuralları C++ çekirdek kaynak kodunda açıkça denetlenebilir.'
                  : 'All consensus parameters are deterministically enforced in the C++ Core daemon.' }}
              </span>
            </div>
            <a
              href="https://github.com/bedri/KristaTech-KRISTA"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-brand-primary shrink-0 px-4 py-2 rounded-xl text-xs font-bold"
            >
              GitHub
            </a>
          </div>
        </div>

        <!-- Right: Network Participation & Collateral Tiers -->
        <div class="lg:col-span-6 protocol-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
          <div class="flex items-center justify-between gap-3 pb-5 border-b border-cobalt-200/60 dark:border-slate-800">
            <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
              {{ t('nodeTiersTitle') }}
            </h3>
            <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300">
              MODEL D ROLES
            </span>
          </div>

          <div class="space-y-4 flex-1 flex flex-col justify-center">
            <!-- Tier 1: Masternode -->
            <div class="tonal-panel p-5 rounded-2xl border-l-4 border-l-[#7695CD] space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-extrabold text-base text-slate-800 dark:text-white">
                  {{ locale === 'tr' ? '1. Masternode Operatörü' : '1. Masternode Operator' }}
                </span>
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/85 dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-200/70 dark:border-slate-700">
                  4,200 KRISTA {{ locale === 'tr' ? 'Teminat' : 'Collateral' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {{ locale === 'tr'
                  ? 'Ağ yönetişimi, LLMQ quorum imzaları ve doğrulayıcı komite hizmetlerini yürütür. Model D kapsamında %35 pasif + %20 MN doğrulayıcı komitesi (5x%4) + %10 aktif LLMQ quorum payını alır.'
                  : 'Provides LLMQ quorum verification and committee validation. Receives 35% Passive Payee share + 20% MN Validator Committee share (5x4%) + 10% Active LLMQ Quorum share under Model D.' }}
              </p>
            </div>

            <!-- Tier 2: Coin-Lock & Open PoW Miners -->
            <div class="tonal-panel p-5 rounded-2xl border-l-4 border-l-[#F5897C] space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-extrabold text-base text-slate-800 dark:text-white">
                  {{ locale === 'tr' ? '2. Coin-Lock ve Açık PoW Madencileri' : '2. Coin-Lock & Open PoW Miners' }}
                </span>
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/85 dark:bg-slate-900 text-coral-600 dark:text-coral-300 border border-coral-200/70 dark:border-slate-700">
                  250 / 10 KRISTA • 2,900 {{ locale === 'tr' ? 'Blok' : 'Blocks' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {{ locale === 'tr'
                  ? '250 KRISTA Coin-Lock (%8 özel koltuk) veya 10 KRISTA PoW-Lock / Zero-Coin Açık PoW (%12 açık koltuk, 3x%4) ile ADAM turlarına ve dahili 1-Click CPU/GPU madenciliğine katılır.'
                  : 'Participates via 250 KRISTA Coin-Lock (8% dedicated seat) or 10 KRISTA PoW-Lock / Zero-Coin Open PoW (12% open seats, 3x4%) in ADAM rounds with built-in 1-Click GUI & external CPU/GPU mining.' }}
              </p>
            </div>

            <!-- Tier 3: PoS Staker & Active PoB -->
            <div class="tonal-panel p-5 rounded-2xl border-l-4 border-l-cobalt-600 space-y-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-extrabold text-base text-slate-800 dark:text-white">
                  {{ locale === 'tr' ? '3. PoS Staker ve Aktif PoB' : '3. PoS Staker & Active PoB' }}
                </span>
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/85 dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-200/70 dark:border-slate-700">
                  {{ locale === 'tr' ? 'Blok 200+ Aktif' : 'Active Block 200+' }}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {{ locale === 'tr'
                  ? '200. bloktan itibaren enerji verimli Hisse Kanıtı (PoS), PoBLS çekilişleri ve 3.0x\'e kadar Aktif Yakım Kanıtı (PoB) staking çarpanıyla %15 Blok Üreticisi ödül havuzuna katılır.'
                  : 'Participates in energy-efficient Proof of Stake (PoS), PoBLS lottery, and up to 3.0x Active Proof-of-Burn (PoB) staking multiplier for the 15% Block Producer pool starting at Block 200.' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. MODEL D TOKENOMICS & REWARD SIMULATOR (#tokenomics) -->
    <section id="tokenomics" class="scroll-mt-24 space-y-12">
      <div class="max-w-3xl mx-auto text-center space-y-3">
        <span class="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
          03 / MODEL D CRYPTOECONOMICS
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {{ t('tokenomicsTitle') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {{ t('tokenomicsSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Monetary Policy Card -->
        <div class="lg:col-span-5 protocol-card rounded-3xl p-7 sm:p-8 space-y-6">
          <div class="space-y-2">
            <span class="text-xs font-mono font-bold text-coral-600 dark:text-coral-300 uppercase tracking-wider">
              {{ locale === 'tr' ? 'Para Politikası ve Arz Disiplini' : 'Monetary Policy & Supply Discipline' }}
            </span>
            <h3 class="text-2xl font-extrabold text-slate-800 dark:text-white">
              {{ locale === 'tr' ? 'Emisyon Parametreleri' : 'Emission Parameters' }}
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ locale === 'tr'
                ? 'KRISTA, 210 Milyon maksimum arz sınırı ve 10.000. bloktan itibaren her 259.200 blokta (~90 gün) %1.9 geometrik azalma uygulayan öngörülebilir bir emisyon modeline sahiptir.'
                : 'KRISTA enforces a strict 210M maximum supply cap with a predictable 1.9% geometric decay every 259,200 blocks (~90 days) starting at Block 10,000.' }}
            </p>
          </div>

          <dl class="space-y-3.5 pt-4 border-t border-cobalt-200/60 dark:border-slate-800 text-sm">
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Maksimum Arz (Hard Cap):' : 'Maximum Supply (Hard Cap):' }}</dt>
              <dd class="font-mono font-extrabold text-slate-800 dark:text-white">210,000,000 KRISTA</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Ön Madencilik (Premine):' : 'Premine Allocation:' }}</dt>
              <dd class="font-mono font-bold text-coral-600 dark:text-coral-300">0 KRISTA (No Premine)</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Başlangıç Ödülü (Blok 2–9.999):' : 'Bootstrap Subsidy (Blocks 2–9,999):' }}</dt>
              <dd class="font-mono font-bold text-slate-800 dark:text-white">40 → 30 → 20 KRISTA</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Standart Ödül (Blok 10.000+):' : 'Standard Subsidy (Block 10,000+):' }}</dt>
              <dd class="font-mono font-bold text-slate-800 dark:text-white">15.0 KRISTA</dd>
            </div>
            <div class="flex items-center justify-between">
              <dt class="text-slate-500 dark:text-slate-400">{{ locale === 'tr' ? 'Çeyreklik Azalma Oranı:' : 'Quarterly Decay Rate:' }}</dt>
              <dd class="font-mono font-bold text-cobalt-700 dark:text-cobalt-300">
                {{ locale === 'tr' ? '90 Günde Bir %1.9' : '1.9% Every 90 Days' }}
              </dd>
            </div>
          </dl>

          <div class="p-4 rounded-2xl tonal-panel space-y-1.5">
            <div class="text-xs font-bold text-cobalt-800 dark:text-cobalt-200 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#F5897C]"></span>
              <span>{{ locale === 'tr' ? 'Protokol Seviyesi Kesintiler' : 'Protocol-Level Allocations' }}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ locale === 'tr'
                ? 'Geliştirici Hazine Fonu (%7.0) ve Başlangıç Musluğu (50.000. bloğa kadar %0.7) ayrıldıktan sonra kalan %92.3 (veya %93) ödül havuzu Model D oranlarıyla (%35 / %40 / %15 / %10) dağıtılır; sahipsiz komite koltuklarının %50\'si otomatik yakılır.'
                : 'After the mandatory Developer Fund (7.0%) and Bootstrap Faucet (0.7% until block 50,000), the remaining 92.3% (or 93.0%) pool is split 35% / 40% / 15% / 10% via Model D, with 50% of unclaimed committee seats permanently burned.' }}
            </p>
          </div>
        </div>

        <!-- Right Column: Interactive Block Reward & Split Simulator -->
        <div class="lg:col-span-7 protocol-card rounded-3xl p-7 sm:p-8 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cobalt-200/60 dark:border-slate-800">
            <div>
              <h3 class="text-xl font-extrabold text-slate-800 dark:text-white">
                {{ t('calculatorTitle') }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ t('calculatorDesc') }}
              </p>
            </div>
            <span class="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 shrink-0 self-start sm:self-center">
              {{ emissionEpochLabel }}
            </span>
          </div>

          <!-- Preset Milestone Buttons -->
          <div class="space-y-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              {{ locale === 'tr' ? 'Hızlı Dönem Seçimi:' : 'Quick Epoch Presets:' }}
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="preset in heightPresets"
                :key="preset.height"
                type="button"
                @click="calcHeight = preset.height"
                class="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer"
                :class="Number(calcHeight) === preset.height
                  ? 'btn-brand-primary border-transparent'
                  : 'bg-cobalt-50/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-cobalt-200/70 dark:border-slate-700 hover:border-cobalt-400'"
              >
                {{ locale === 'tr' ? preset.labelTr : preset.labelEn }}
              </button>
            </div>
          </div>

          <!-- Slider & Input Control -->
          <div class="space-y-3 pt-1">
            <div class="flex items-center justify-between gap-4">
              <label for="block-height-input" class="text-sm font-bold text-slate-700 dark:text-slate-200">
                {{ t('blockHeight') }}:
              </label>
              <input
                id="block-height-input"
                type="number"
                v-model="calcHeight"
                min="1"
                max="5000000"
                class="bg-white dark:bg-slate-900 border border-cobalt-300/70 dark:border-slate-700 rounded-xl px-3.5 py-1.5 text-sm font-mono font-bold text-slate-800 dark:text-white w-36 text-right"
              />
            </div>
            <input
              type="range"
              aria-label="Block Height Slider"
              v-model="calcHeight"
              min="1"
              max="3500000"
              :style="{ '--progress': sliderProgressPercent }"
              class="brand-slider w-full h-2 rounded-lg cursor-pointer"
            />
          </div>

          <!-- Harmonious Tonal Summary Metrics Banner -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl tonal-panel">
            <div>
              <span class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {{ t('blockRewardTotal') }}
              </span>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-cobalt-700 dark:text-cobalt-300 mt-1">
                {{ totalReward }} <span class="text-xs font-semibold text-slate-500">KRISTA</span>
              </div>
            </div>
            <div>
              <span class="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {{ locale === 'tr' ? 'Masternode Teminatı' : 'Masternode Collateral' }}
              </span>
              <div class="text-2xl sm:text-3xl font-extrabold font-mono text-coral-600 dark:text-coral-300 mt-1">
                {{ requiredCollateral.toLocaleString() }} <span class="text-xs font-semibold text-slate-500">KRISTA</span>
              </div>
            </div>
          </div>

          <!-- Visual Multi-Segment Stacked Bar -->
          <div class="space-y-2">
            <div class="w-full h-3.5 bg-cobalt-100/80 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              <div
                v-for="row in allocationRows"
                :key="row.key"
                v-show="row.percent > 0"
                :class="row.barClass"
                class="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                :style="{ width: `${row.percent}%` }"
              ></div>
            </div>
          </div>

          <!-- Accessible Semantic Table for Payout Allocations -->
          <div class="overflow-x-auto rounded-2xl border border-cobalt-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50">
            <table class="w-full text-left border-collapse text-xs sm:text-sm">
              <caption class="visually-hidden">
                {{ locale === 'tr' ? 'Model D Blok Ödülü Dağılım Tablosu' : 'Model D Block Reward Split Breakdown Table' }}
              </caption>
              <thead>
                <tr class="bg-cobalt-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-cobalt-200/60 dark:border-slate-700">
                  <th scope="col" class="py-3 px-4 font-bold">{{ locale === 'tr' ? 'Alıcı Katmanı' : 'Recipient Tier' }}</th>
                  <th scope="col" class="py-3 px-4 font-bold text-right">{{ locale === 'tr' ? 'Oran (%)' : 'Share (%)' }}</th>
                  <th scope="col" class="py-3 px-4 font-bold text-right">{{ locale === 'tr' ? 'Blok Başına Ödül' : 'Payout / Block' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-cobalt-100 dark:divide-slate-800">
                <tr
                  v-for="row in allocationRows"
                  :key="row.key"
                  class="hover:bg-cobalt-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td class="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                    <span class="inline-flex items-center gap-2.5">
                      <span class="w-3 h-3 rounded-full shrink-0" :class="row.dotClass"></span>
                      <span>{{ row.label }}</span>
                    </span>
                  </td>
                  <td class="py-2.5 px-4 font-mono text-right text-slate-600 dark:text-slate-300">
                    {{ row.percent.toFixed(2) }}%
                  </td>
                  <td class="py-2.5 px-4 font-mono font-bold text-right text-slate-800 dark:text-white">
                    {{ row.amount }} KRISTA
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. CONSENSUS ACTIVATION ROADMAP (#roadmap) -->
    <section id="roadmap" class="scroll-mt-24 space-y-12">
      <div class="max-w-3xl mx-auto text-center space-y-3">
        <span class="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30">
          04 / ACTIVATION ROADMAP
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {{ t('phaseTitle') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {{ t('phaseSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Phase 1 -->
        <div class="protocol-card rounded-3xl p-6 flex flex-col justify-between border-t-4 border-t-[#7695CD]">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300">
                BLOCK 1
              </span>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
                {{ locale === 'tr' ? 'Aktif' : 'Active' }}
              </span>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
              {{ t('phase1') }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('phase1Desc') }}
            </p>
          </div>
          <div class="pt-4 mt-6 border-t border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>X11KVS + MESCAL</span>
            <span class="text-cobalt-600 dark:text-cobalt-400 font-bold">100%</span>
          </div>
        </div>

        <!-- Phase 2 -->
        <div
          class="protocol-card rounded-3xl p-6 flex flex-col justify-between border-t-4"
          :class="currentBlock >= 200 ? 'border-t-[#7695CD]' : 'border-t-[#F5897C]'"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300">
                BLOCK 200
              </span>
              <span
                class="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                :class="currentBlock >= 200
                  ? 'bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border-cobalt-400/30'
                  : 'bg-coral-400/15 text-coral-700 dark:text-coral-300 border-coral-400/30'"
              >
                {{ currentBlock >= 200 ? (locale === 'tr' ? 'Aktif' : 'Active') : (locale === 'tr' ? 'Sıradaki' : 'Next Phase') }}
              </span>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
              {{ t('phase2') }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('phase2Desc') }}
            </p>
          </div>
          <div class="pt-4 mt-6 border-t border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>PoS + ADAM VRF</span>
            <span class="text-cobalt-600 dark:text-cobalt-400 font-bold">
              {{ currentBlock >= 200 ? '100%' : `${Math.floor((currentBlock / 200) * 100)}%` }}
            </span>
          </div>
        </div>

        <!-- Phase 3 -->
        <div
          class="protocol-card rounded-3xl p-6 flex flex-col justify-between border-t-4"
          :class="currentBlock >= 2000 ? 'border-t-[#7695CD]' : 'border-t-[#F5897C]'"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300">
                BLOCK 2,000
              </span>
              <span
                class="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                :class="currentBlock >= 2000
                  ? 'bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border-cobalt-400/30'
                  : 'bg-coral-400/15 text-coral-700 dark:text-coral-300 border-coral-400/30'"
              >
                {{ currentBlock >= 2000 ? (locale === 'tr' ? 'Aktif' : 'Active') : (locale === 'tr' ? 'Sıradaki' : 'Next Phase') }}
              </span>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
              {{ t('phase3') }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('phase3Desc') }}
            </p>
          </div>
          <div class="pt-4 mt-6 border-t border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>BLST BLS12-381</span>
            <span class="text-coral-600 dark:text-coral-400 font-bold">
              {{ currentBlock >= 2000 ? '100%' : `${Math.min(99, Math.floor((currentBlock / 2000) * 100))}%` }}
            </span>
          </div>
        </div>

        <!-- Phase 4 -->
        <div
          class="protocol-card rounded-3xl p-6 flex flex-col justify-between border-t-4"
          :class="currentBlock >= 2200 ? 'border-t-[#7695CD]' : 'border-t-cobalt-300 dark:border-t-slate-700'"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300">
                BLOCK 2,200
              </span>
              <span
                class="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                :class="currentBlock >= 2200
                  ? 'bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border-cobalt-400/30'
                  : 'bg-cobalt-50 dark:bg-slate-800 text-cobalt-700 dark:text-slate-300 border-cobalt-200 dark:border-slate-700'"
              >
                {{ currentBlock >= 2200 ? (locale === 'tr' ? 'Aktif' : 'Active') : (locale === 'tr' ? 'Planlanan' : 'Scheduled') }}
              </span>
            </div>
            <h3 class="text-lg font-extrabold text-slate-800 dark:text-white">
              {{ t('phase4') }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('phase4Desc') }}
            </p>
          </div>
          <div class="pt-4 mt-6 border-t border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>35 / 40 / 15 / 10</span>
            <span class="text-cobalt-600 dark:text-cobalt-400 font-bold">
              {{ currentBlock >= 2200 ? '100%' : `${Math.min(99, Math.floor((currentBlock / 2200) * 100))}%` }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. OFFICIAL TECHNICAL DOCUMENTATION & RESEARCH LIBRARY (#docs) -->
    <section id="docs" class="scroll-mt-24 space-y-12">
      <div class="max-w-3xl mx-auto text-center space-y-3">
        <span class="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
          05 / RESEARCH &amp; DOCUMENTATION
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {{ t('docsSectionTitle') }}
        </h2>
        <p class="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
          {{ t('docsSectionSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <a
          v-for="paper in researchPapers"
          :key="paper.code"
          :href="paper.href"
          target="_blank"
          rel="noopener noreferrer"
          class="protocol-card rounded-3xl p-6 flex flex-col justify-between group no-underline"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs text-slate-400">{{ paper.code }}</span>
              <span
                class="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border"
                :class="paper.accent === 'coral'
                  ? 'bg-coral-400/15 text-coral-700 dark:text-coral-300 border-coral-400/30'
                  : 'bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border-cobalt-400/30'"
              >
                {{ paper.badge }}
              </span>
            </div>
            <h3 class="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-cobalt-600 dark:group-hover:text-coral-300 transition-colors">
              {{ paper.title }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ paper.desc }}
            </p>
          </div>

          <div class="pt-4 mt-5 border-t border-cobalt-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cobalt-700 dark:text-cobalt-300 group-hover:text-coral-600 dark:group-hover:text-coral-300 transition-colors">
            <span>{{ locale === 'tr' ? 'Belgeyi İncele (TR/EN)' : 'Read Specification' }}</span>
            <svg aria-hidden="true" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
            </svg>
          </div>
        </a>
      </div>
    </section>
  </UContainer>
</template>
