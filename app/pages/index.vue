<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

// Fetch real-time status from our server API proxy
const { data: statusData } = await useFetch('/api/status')

// 1. Hero Countdown Milestones
const currentBlock = ref(950)
const masternodesCount = computed(() => {
  return statusData.value?.masternodes?.enabled || 128
})
const circulatingSupply = computed(() => {
  return statusData.value?.totalSupply || 5085400
})

const blocksRemaining = computed(() => Math.max(0, 1000 - currentBlock.value))
const progressPercentage = computed(() => Math.min(100, (currentBlock.value / 1000) * 100))

function simulateBlock() {
  if (currentBlock.value < 1000) {
    currentBlock.value++
  }
}

onMounted(() => {
  if (statusData.value?.success && typeof statusData.value?.height === 'number') {
    currentBlock.value = statusData.value.height
  }
})

// 2. Interactive Feature: ADAM Consensus
const isSimulatingConsensus = ref(false)
const consensusStep = ref(-1)
const consensusSteps = [
  'Generating VRF seed from previous block...',
  'Electing committee (11 Miners, 1 Coordinator)...',
  'Miners solving dynamic puzzles (ASIC-resistant)...',
  'Aggregating BLS signature shares (BLST)...',
  'Block verified and committed to KRISTA chain!'
]

function startConsensusSim() {
  if (isSimulatingConsensus.value) return
  isSimulatingConsensus.value = true
  consensusStep.value = 0
  const interval = setInterval(() => {
    if (consensusStep.value < consensusSteps.length - 1) {
      consensusStep.value++
    } else {
      clearInterval(interval)
      setTimeout(() => {
        isSimulatingConsensus.value = false
        consensusStep.value = -1
      }, 1500)
    }
  }, 1000)
}

// 3. Interactive Feature: PoBLS Lottery
const isLotteryRunning = ref(false)
const selectedCommittee = ref([])
const candidates = [
  'KTNode_Alpha_7b43', 'KTNode_Beta_92a1', 'KTNode_Gamma_04f8', 
  'KTNode_Delta_e851', 'KTNode_Epsilon_38c9', 'KTNode_Zeta_19da', 
  'KTNode_Eta_44bc', 'KTNode_Theta_66f1'
]

function runLottery() {
  if (isLotteryRunning.value) return
  isLotteryRunning.value = true
  selectedCommittee.value = []
  
  let counter = 0
  const interval = setInterval(() => {
    selectedCommittee.value = Array.from({ length: 3 }, () => candidates[Math.floor(Math.random() * candidates.length)])
    counter++
    if (counter > 12) {
      clearInterval(interval)
      const shuffled = [...candidates].sort(() => 0.5 - Math.random())
      selectedCommittee.value = shuffled.slice(0, 3)
      isLotteryRunning.value = false
    }
  }, 100)
}

// 4. Interactive Feature: MESCAL Smart Contracts
const mescalTemplate = ref('escrow')
const mescalParams = ref({
  amount: 1000,
  locktime: 2880,
  refundAddress: 'KTNrvQkwv1Yo...CYv'
})

const mescalBytecode = computed(() => {
  if (mescalTemplate.value === 'escrow') {
    return `OP_INIT_CONTRACT
OP_CHECK_COLLATERAL ${mescalParams.value.amount}_KRISTA
OP_PUSH_TIMEOUT ${mescalParams.value.locktime}_BLOCKS
OP_IF_EXPIRED
  OP_SEND_TO_SENDER
OP_ELSE
  OP_LOCK_MINER_REGISTRATION
OP_ENDIF`
  } else if (mescalTemplate.value === 'vesting') {
    return `OP_INIT_CONTRACT
OP_SET_VESTING_START
OP_PUSH_RATE 20_PERCENT_PER_YEAR
OP_CHECK_TIMELOCK 730_DAYS
OP_CLAIM_RELEASE
OP_END_CONTRACT`
  } else {
    return `OP_INIT_CONTRACT
OP_MINT_ASSET "KRISTA_TICKET"
OP_SET_MAX_SUPPLY 100000000
OP_MINT_TO_SENDER 5000000
OP_LOCK_METADATA
OP_END_CONTRACT`
  }
})

// 5. Interactive Tokenomics Calculator
const calcHeight = ref(1000)

const totalReward = computed(() => {
  const h = Number(calcHeight.value)
  if (h <= 1) return 5000000 // Premine block
  if (h < 1000) return 100     // PoW Bootstrap blocks
  
  // Year decay model: every 1,051,200 blocks reward decreases by 20%
  const year = Math.floor((h - 2) / 1051200)
  const reward = 14.5 * Math.pow(0.8, year)
  return Math.max(0, parseFloat(reward.toFixed(4)))
})

const splitPercentages = computed(() => {
  const h = Number(calcHeight.value)
  
  const devPercent = h > 1 ? 7.0 : 0.0
  const faucetPercent = (h > 1 && h <= 50000) ? 0.7 : 0.0
  const remaining = 100.0 - devPercent - faucetPercent
  
  if (h < 1000) {
    return {
      dev: devPercent,
      faucet: faucetPercent,
      mn: 0.0,
      quorum: 0.0,
      participants: 0.0,
      producer: remaining
    }
  }
  
  if (h >= 1200) {
    // Model D active
    return {
      dev: devPercent,
      faucet: faucetPercent,
      mn: 50.0,
      quorum: 10.0,
      participants: 25.0,
      producer: remaining - 50.0 - 10.0 - 25.0
    }
  } else if (h > 5000) {
    // Legacy MN phase (non-Model D)
    return {
      dev: devPercent,
      faucet: faucetPercent,
      mn: 80.0,
      quorum: 0.0,
      participants: 0.0,
      producer: remaining - 80.0
    }
  } else {
    // Bootstrap phase (<= 5000)
    return {
      dev: devPercent,
      faucet: faucetPercent,
      mn: 0.0,
      quorum: 0.0,
      participants: 0.0,
      producer: remaining
    }
  }
})

const devRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.dev / 100)).toFixed(4)))
const faucetRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.faucet / 100)).toFixed(4)))
const mnRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.mn / 100)).toFixed(4)))
const quorumRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.quorum / 100)).toFixed(4)))
const participantsRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.participants / 100)).toFixed(4)))
const producerRewardAmount = computed(() => parseFloat((totalReward.value * (splitPercentages.value.producer / 100)).toFixed(4)))

const requiredCollateral = computed(() => {
  return 20000
})
</script>

<template>
  <div class="space-y-24 py-12">
    <!-- Hero Section -->
    <section class="relative flex flex-col items-center justify-center text-center px-4 py-8">
      <!-- Background glowing lights -->
      <div class="absolute w-96 h-96 rounded-full bg-mint-500/5 blur-[120px] top-[-50px] left-[20%] pointer-events-none"></div>
      <div class="absolute w-96 h-96 rounded-full bg-sky-blue-500/5 blur-[120px] bottom-0 right-[20%] pointer-events-none"></div>

      <!-- Mainnet 1000 Milestone Banner -->
      <div 
        class="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-mint-500/20 via-sky-blue-500/20 to-mint-500/20 border border-slate-200/50 backdrop-blur-md inline-block max-w-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        @click="simulateBlock"
      >
        <div class="bg-white px-5 py-2.5 rounded-[14px] flex flex-col gap-1.5 items-center">
          <div class="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-700">
            <span class="w-2 h-2 rounded-full bg-mint-500 animate-ping"></span>
            <span v-if="currentBlock < 1000">HYBRID upgrade: block {{ currentBlock }}</span>
            <span v-else class="text-mint-600">Upgrade active: block 1000 activated!</span>
          </div>
          
          <div v-if="currentBlock < 1000" class="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 mt-0.5">
            <div 
              class="h-full bg-gradient-to-r from-mint-500 to-sky-blue-500 transition-all duration-500" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          
          <span v-if="currentBlock < 1000" class="text-[10px] text-slate-400">
            {{ blocksRemaining }} blocks remaining until block 1000. Click to simulate block ticks!
          </span>
          <span v-else class="text-[10px] text-mint-500 font-bold">
            Consensus upgraded. MPA and PoBLS active!
          </span>
        </div>
      </div>

      <!-- Title / Tagline -->
      <div class="max-w-4xl space-y-6">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-800 leading-tight">
          {{ t('heroTitle') }}
        </h1>
        <p class="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {{ t('heroSubtitle') }}
        </p>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mt-8">
        <UButton
          @click="scrollToSection('features')"
          color="mint"
          size="lg"
          variant="solid"
          class="px-8 py-3 text-sm font-semibold shadow-md shadow-mint-500/10 cursor-pointer text-white bg-mint-500 hover:bg-mint-600 border-none"
        >
          {{ t('getStarted') }}
        </UButton>
        <UButton
          to="https://github.com/bedri/KristaTech-KRISTA"
          target="_blank"
          color="slate"
          size="lg"
          variant="outline"
          class="px-8 py-3 text-sm font-semibold cursor-pointer border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          {{ t('viewDocs') }}
        </UButton>
      </div>

      <!-- Stat Badges Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-16">
        <div class="glass-card rounded-2xl p-6 border border-slate-200/50 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-8 transition-opacity duration-300">
            <UIcon name="i-heroicons-cpu-chip" class="w-20 h-20 text-mint-500" />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('activeMasternodes') }}</span>
          <span class="text-2xl font-extrabold text-slate-800 mt-1.5">{{ masternodesCount.toLocaleString() }}</span>
          <span class="text-[10px] text-mint-600 font-semibold mt-1">With 20k KRISTA collateral</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border border-slate-200/50 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-8 transition-opacity duration-300">
            <UIcon name="i-heroicons-banknotes" class="w-20 h-20 text-sky-blue-500" />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('currentSupply') }}</span>
          <span class="text-2xl font-extrabold text-slate-800 mt-1.5">{{ circulatingSupply.toLocaleString() }}</span>
          <span class="text-[10px] text-sky-blue-600 font-semibold mt-1">100M KRISTA Hard Cap</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border border-slate-200/50 flex flex-col justify-center items-center shadow-sm relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-8 transition-opacity duration-300">
            <UIcon name="i-heroicons-bolt" class="w-20 h-20 text-mint-500" />
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ t('networkTps') }}</span>
          <span class="text-2xl font-extrabold text-slate-800 mt-1.5">2,500+</span>
          <span class="text-[10px] text-mint-600 font-semibold mt-1">30s Block spacing</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="scroll-mt-24 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          {{ t('featuresTitle') }}
        </h2>
        <p class="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          {{ t('featuresSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <!-- Feature 1: ADAM -->
        <div class="glass-card rounded-2xl p-8 border border-slate-200/50 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-11 h-11 rounded-xl bg-mint-500/10 flex items-center justify-center text-mint-600 mb-5">
              <UIcon name="i-heroicons-cpu-chip" class="w-5.5 h-5.5" />
            </div>
            <h3 class="text-lg font-bold text-slate-800 tracking-wide">{{ t('adamTitle') }}</h3>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {{ t('adamDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-slate-200/40 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-400 font-bold uppercase tracking-wider">ADAM Engine Sim</span>
                <span 
                  class="px-2 py-0.5 rounded text-[8px] font-bold"
                  :class="isSimulatingConsensus ? 'bg-mint-500/10 text-mint-600 animate-pulse' : 'bg-slate-200/60 text-slate-500'"
                >
                  {{ isSimulatingConsensus ? 'Running' : 'Idle' }}
                </span>
              </div>

              <!-- Console Simulation Output -->
              <div class="bg-white rounded p-2.5 min-h-[50px] flex items-center text-[11px] font-mono border border-slate-200/50 mt-1 shadow-inner">
                <span v-if="consensusStep >= 0" class="text-mint-600">
                  ⚡ {{ consensusSteps[consensusStep] }}
                </span>
                <span v-else class="text-slate-400">Click button to run consensus loop...</span>
              </div>

              <UButton
                @click="startConsensusSim"
                color="mint"
                variant="soft"
                size="xs"
                block
                :loading="isSimulatingConsensus"
                class="mt-1 font-semibold cursor-pointer text-mint-700 bg-mint-500/10 hover:bg-mint-500/20"
              >
                Simulate Block Proposal
              </UButton>
            </div>
          </div>
        </div>

        <!-- Feature 2: PoBLS -->
        <div class="glass-card rounded-2xl p-8 border border-slate-200/50 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-11 h-11 rounded-xl bg-sky-blue-500/10 flex items-center justify-center text-sky-blue-600 mb-5">
              <UIcon name="i-heroicons-shield-check" class="w-5.5 h-5.5" />
            </div>
            <h3 class="text-lg font-bold text-slate-800 tracking-wide">{{ t('poblsTitle') }}</h3>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {{ t('poblsDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-slate-200/40 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-400 font-bold uppercase tracking-wider">BLS Signature Lottery</span>
                <span 
                  class="px-2 py-0.5 rounded text-[8px] font-bold"
                  :class="isLotteryRunning ? 'bg-sky-blue-500/10 text-sky-blue-600 animate-pulse' : 'bg-slate-200/60 text-slate-500'"
                >
                  {{ isLotteryRunning ? 'Drawing' : 'Ready' }}
                </span>
              </div>

              <!-- Lottery Output -->
              <div class="bg-white rounded p-2 flex flex-col gap-1 border border-slate-200/50 mt-1 min-h-[50px] justify-center shadow-inner">
                <div v-if="selectedCommittee.length" class="flex flex-wrap gap-1.5 justify-center">
                  <span 
                    v-for="node in selectedCommittee" 
                    :key="node" 
                    class="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-blue-500/10 border border-sky-blue-500/20 text-sky-blue-600"
                  >
                    {{ node }}
                  </span>
                </div>
                <span v-else class="text-[11px] text-slate-400 text-center font-mono">Run committee lottery draw...</span>
              </div>

              <UButton
                @click="runLottery"
                color="sky-blue"
                variant="soft"
                size="xs"
                block
                :loading="isLotteryRunning"
                class="mt-1 font-semibold cursor-pointer text-sky-blue-700 bg-sky-blue-500/10 hover:bg-sky-blue-500/20 border-none"
              >
                Run Lottery Draw
              </UButton>
            </div>
          </div>
        </div>

        <!-- Feature 3: MESCAL -->
        <div class="glass-card rounded-2xl p-8 border border-slate-200/50 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-11 h-11 rounded-xl bg-mint-500/10 flex items-center justify-center text-mint-600 mb-5">
              <UIcon name="i-heroicons-code-bracket-square" class="w-5.5 h-5.5" />
            </div>
            <h3 class="text-lg font-bold text-slate-800 tracking-wide">{{ t('mescalTitle') }}</h3>
            <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
              {{ t('mescalDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-slate-200/40 bg-slate-50/50 rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-[10px] mb-0.5">
                <span class="text-slate-400 font-bold uppercase tracking-wider">MESCAL Template</span>
                <select 
                  v-model="mescalTemplate" 
                  class="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-600 focus:outline-none"
                >
                  <option value="escrow">Coin-Lock Registration</option>
                  <option value="vesting">Vesting Schedule</option>
                  <option value="token">Asset Minting</option>
                </select>
              </div>

              <!-- Parameter Toggles (Escrow Only for Demo simplicity) -->
              <div v-if="mescalTemplate === 'escrow'" class="grid grid-cols-2 gap-2 text-[9px] text-slate-500">
                <label class="flex flex-col">
                  Collateral (KRISTA)
                  <input type="number" v-model="mescalParams.amount" class="bg-white border border-slate-200 rounded px-1 mt-0.5 text-slate-700 focus:outline-none" />
                </label>
                <label class="flex flex-col">
                  Locktime (Blocks)
                  <input type="number" v-model="mescalParams.locktime" class="bg-white border border-slate-200 rounded px-1 mt-0.5 text-slate-700 focus:outline-none" />
                </label>
              </div>

              <!-- Bytecode Output -->
              <pre class="bg-white rounded p-2 text-[8px] font-mono border border-slate-200/50 overflow-x-auto text-mint-600 max-h-[70px] leading-tight mt-0.5 shadow-inner">{{ mescalBytecode }}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tokenomics Section -->
    <section id="tokenomics" class="scroll-mt-24 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          {{ t('tokenomicsTitle') }}
        </h2>
        <p class="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          {{ t('tokenomicsSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 items-start">
        <!-- Tokenomics Detail Card -->
        <div class="lg:col-span-5 glass-card rounded-2xl p-8 border border-slate-200/50 space-y-6 shadow-sm">
          <h3 class="text-lg font-bold text-slate-800 tracking-wide">Emission Parameters</h3>
          <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
            KRISTA implements a sustainable token emission protocol featuring a hard cap of 100M tokens and a yearly 20% decay rate, providing a highly predictable supply curve.
          </p>

          <div class="space-y-4 pt-4 border-t border-slate-200/50">
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-400">Hard Cap:</span>
              <span class="font-bold text-slate-700">100,000,000 KRISTA</span>
            </div>
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-400">Decay Rate:</span>
              <span class="font-bold text-mint-600">20% Year-over-Year</span>
            </div>
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-400">Initial Block Reward (Block 1000):</span>
              <span class="font-bold text-slate-700">14.5 KRISTA</span>
            </div>
            <div class="flex items-center justify-between text-xs sm:text-sm">
              <span class="text-slate-400">Premine Allocation:</span>
              <span class="font-bold text-slate-700">5,000,000 KRISTA</span>
            </div>
          </div>

          <div class="p-4 bg-mint-500/5 rounded-xl border border-mint-500/10 flex items-start gap-3">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-mint-600 shrink-0 mt-0.5" />
            <p class="text-[11px] text-mint-700 leading-relaxed">
              Block reward decay occurs every 1,051,200 blocks (~1 year). The Developer Fund (7%) and Faucet (0.7%) splits are enforced at the protocol level.
            </p>
          </div>
        </div>

        <!-- Interactive Calculator Card -->
        <div class="lg:col-span-7 glass-card rounded-2xl p-8 border border-slate-200/50 space-y-6 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-mint-500/10 rounded-lg text-mint-600">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800 tracking-wide">{{ t('calculatorTitle') }}</h3>
              <p class="text-xs text-slate-400">{{ t('calculatorDesc') }}</p>
            </div>
          </div>

          <!-- Input Slider -->
          <div class="space-y-4 pt-4">
            <div class="flex justify-between items-center text-xs sm:text-sm">
              <label for="block-height-input" class="text-slate-500 font-semibold">{{ t('blockHeight') }}:</label>
              <input 
                id="block-height-input"
                type="number" 
                v-model="calcHeight" 
                min="1" 
                max="5000000" 
                class="bg-white border border-slate-200 rounded px-3 py-1 text-sm text-slate-700 focus:outline-none focus:border-mint-500/50 w-32 text-right font-mono"
              />
            </div>
            <input 
              type="range" 
              v-model="calcHeight" 
              min="1" 
              max="3500000" 
              class="w-full accent-mint-500 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <!-- Calculations Output -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200/50">
            <!-- Left Stats -->
            <div class="space-y-4">
              <div>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Total Block Reward</span>
                <div class="text-3xl font-extrabold text-slate-800 mt-1 font-mono">
                  {{ totalReward }} <span class="text-xs font-semibold text-slate-400">KRISTA</span>
                </div>
              </div>

              <div>
                <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Masternode Collateral</span>
                <div class="text-xl font-bold text-sky-blue-600 mt-1 font-mono">
                  {{ requiredCollateral.toLocaleString() }} <span class="text-xs font-semibold text-slate-400">KRISTA</span>
                </div>
              </div>
            </div>

            <!-- Right splits -->
            <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/50 shadow-inner">
              <span class="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-2">Payout Allocations</span>
              
              <!-- Dev Hazine Allocation -->
              <div v-if="splitPercentages.dev > 0" class="space-y-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>{{ t('devReward') }}</span>
                  <span class="font-mono">{{ devRewardAmount }} KRISTA ({{ splitPercentages.dev }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-slate-600" :style="{ width: `${splitPercentages.dev}%` }"></div>
                </div>
              </div>

              <!-- Faucet Allocation -->
              <div v-if="splitPercentages.faucet > 0" class="space-y-1 pt-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span>{{ t('faucetReward') }}</span>
                  <span class="font-mono">{{ faucetRewardAmount }} KRISTA ({{ splitPercentages.faucet }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-orange-400" :style="{ width: `${splitPercentages.faucet * 10}%` }"></div>
                </div>
              </div>

              <!-- Masternode Allocation -->
              <div v-if="splitPercentages.mn > 0" class="space-y-1 pt-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span class="text-sky-blue-600">{{ t('masternodeReward') }}</span>
                  <span class="font-mono text-slate-700">{{ mnRewardAmount }} KRISTA ({{ splitPercentages.mn }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-sky-blue-500" :style="{ width: `${splitPercentages.mn}%` }"></div>
                </div>
              </div>

              <!-- Active Quorum Allocation -->
              <div v-if="splitPercentages.quorum > 0" class="space-y-1 pt-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span class="text-sky-blue-700">{{ t('quorumReward') }}</span>
                  <span class="font-mono text-slate-700">{{ quorumRewardAmount }} KRISTA ({{ splitPercentages.quorum }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-sky-blue-600" :style="{ width: `${splitPercentages.quorum}%` }"></div>
                </div>
              </div>

              <!-- Participants Allocation -->
              <div v-if="splitPercentages.participants > 0" class="space-y-1 pt-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span class="text-mint-700">{{ t('participantsReward') }}</span>
                  <span class="font-mono text-slate-700">{{ participantsRewardAmount }} KRISTA ({{ splitPercentages.participants }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-mint-400" :style="{ width: `${splitPercentages.participants}%` }"></div>
                </div>
              </div>

              <!-- Block Producer Allocation -->
              <div class="space-y-1 pt-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-600">
                  <span class="text-mint-600">{{ t('validatorReward') }}</span>
                  <span class="font-mono text-slate-700">{{ producerRewardAmount }} KRISTA ({{ splitPercentages.producer.toFixed(1) }}%)</span>
                </div>
                <div class="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-mint-500" :style="{ width: `${splitPercentages.producer}%` }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Roadmap Section -->
    <section id="roadmap" class="scroll-mt-24 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl font-extrabold text-slate-800 tracking-tight">
          {{ t('phaseTitle') }}
        </h2>
        <p class="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
          {{ t('phaseSubtitle') }}
        </p>
      </div>

      <div class="relative max-w-4xl mx-auto px-4">
        <!-- Connecting Line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-mint-500/30 via-sky-blue-500/30 to-transparent transform -translate-x-1/2 hidden md:block"></div>

        <div class="space-y-12">
          <!-- Phase 1 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <div class="flex-1 text-right hidden md:block pr-8">
              <span class="text-[10px] font-bold text-mint-600 uppercase tracking-widest bg-mint-500/10 px-3 py-1 rounded-full border border-mint-500/20">Active</span>
            </div>

            <!-- Bullet point node -->
            <div class="w-6 h-6 rounded-full border-4 border-[#f3f7f5] bg-mint-500 shadow-md shadow-mint-500/40 z-10 shrink-0"></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-slate-200/50 shadow-sm pl-8 text-left">
              <div class="md:hidden mb-2">
                <span class="text-[10px] font-bold text-mint-600 uppercase tracking-widest bg-mint-500/10 px-3 py-1 rounded-full border border-mint-500/20">Active</span>
              </div>
              <h3 class="text-base font-bold text-slate-800">{{ t('phase1') }}</h3>
              <p class="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                {{ t('phase1Desc') }}
              </p>
            </div>
          </div>

          <!-- Phase 2 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <!-- Bullet point node -->
            <div 
              class="w-6 h-6 rounded-full border-4 border-[#f3f7f5] shadow-md z-10 shrink-0 md:order-2"
              :class="currentBlock >= 1000 ? 'bg-mint-500 shadow-mint-500/40' : 'bg-sky-blue-500 shadow-sky-blue-500/20'"
            ></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-slate-200/50 shadow-sm pr-8 text-left md:text-right md:order-1">
              <div class="mb-2">
                <span 
                  class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  :class="currentBlock >= 1000 ? 'text-mint-600 bg-mint-500/10 border-mint-500/20' : 'text-sky-blue-600 bg-sky-blue-500/10 border-sky-blue-500/20'"
                >
                  {{ currentBlock >= 1000 ? 'Active' : 'Next Phase' }}
                </span>
              </div>
              <h3 class="text-base font-bold text-slate-800">{{ t('phase2') }}</h3>
              <p class="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                {{ t('phase2Desc') }}
              </p>
            </div>

            <div class="flex-1 hidden md:block"></div>
          </div>

          <!-- Phase 3 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <div class="flex-1 text-right hidden md:block pr-8">
              <span 
                class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                :class="currentBlock >= 5000 ? 'text-mint-600 bg-mint-500/10 border-mint-500/20' : 'text-slate-400 bg-slate-100 border-slate-200'"
              >
                {{ currentBlock >= 5000 ? 'Active' : 'Future' }}
              </span>
            </div>

            <!-- Bullet point node -->
            <div 
              class="w-6 h-6 rounded-full border-4 border-[#f3f7f5] shadow-md z-10 shrink-0"
              :class="currentBlock >= 5000 ? 'bg-mint-500 shadow-mint-500/40' : 'bg-slate-300'"
            ></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-slate-200/50 shadow-sm pl-8 text-left">
              <div class="md:hidden mb-2">
                <span 
                  class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  :class="currentBlock >= 5000 ? 'text-mint-600 bg-mint-500/10 border-mint-500/20' : 'text-slate-400 bg-slate-100 border-slate-200'"
                >
                  {{ currentBlock >= 5000 ? 'Active' : 'Future' }}
                </span>
              </div>
              <h3 class="text-base font-bold text-slate-800">{{ t('phase3') }}</h3>
              <p class="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                {{ t('phase3Desc') }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-glow-mint {
  text-shadow: 0 0 12px rgba(51, 184, 125, 0.2);
}
</style>
