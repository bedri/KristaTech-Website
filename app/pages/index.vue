<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { t } = useI18n()

// Fetch real-time status from our server API proxy
const { data: statusData } = await useFetch('/api/status')

// 1. Hero Countdown Milestones
const currentBlock = ref(997)
const masternodesCount = computed(() => {
  return statusData.value?.masternodes?.enabled || 1248
})
const circulatingSupply = computed(() => {
  return statusData.value?.totalSupply || 54280000
})

const blocksRemaining = computed(() => Math.max(0, 1000 - currentBlock.value))
const progressPercentage = computed(() => (currentBlock.value / 1000) * 100)

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
  'Generating VRF block seed...',
  'Electing committee block coordinator...',
  'Gathering threshold BLS signatures...',
  'Verifying Schnorr aggregates...',
  'Block committed to KRISTA chain!'
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
  'KNode_Alpha_7b43', 'KNode_Beta_92a1', 'KNode_Gamma_04f8', 
  'KNode_Delta_e851', 'KNode_Epsilon_38c9', 'KNode_Zeta_19da', 
  'KNode_Eta_44bc', 'KNode_Theta_66f1'
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
  amount: 750,
  locktime: 2880,
  refundAddress: 'KRa8f4...m7Y'
})

const mescalBytecode = computed(() => {
  if (mescalTemplate.value === 'escrow') {
    return `OP_INIT_CONTRACT
OP_CHECK_COLLATERAL ${mescalParams.value.amount}
OP_PUSH_TIMEOUT ${mescalParams.value.locktime}
OP_IF_EXPIRED
  OP_SEND_TO ${mescalParams.value.refundAddress}
OP_ELSE
  OP_RESOLVE_ESCROW
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
OP_SET_MAX_SUPPLY 5000
OP_MINT_TO_SENDER 500
OP_LOCK_METADATA
OP_END_CONTRACT`
  }
})

// 5. Interactive Tokenomics Calculator
const calcHeight = ref(1000)

const totalReward = computed(() => {
  const h = Number(calcHeight.value)
  if (h <= 1) return 30000000 // Premine block
  
  // Year decay model: every 1,051,200 blocks reward decreases by 15%
  const year = Math.floor((h - 2) / 1051200)
  const reward = 25.0 * Math.pow(0.85, year)
  return Math.max(0, parseFloat(reward.toFixed(4)))
})

const splitPercentages = computed(() => {
  const h = Number(calcHeight.value)
  if (h <= 5000) {
    return { mn: 0, miner: 100 }
  } else if (h <= 100000) {
    return { mn: 80, miner: 20 }
  } else {
    return { mn: 60, miner: 40 }
  }
})

const mnRewardAmount = computed(() => {
  return parseFloat((totalReward.value * (splitPercentages.value.mn / 100)).toFixed(4))
})

const minerRewardAmount = computed(() => {
  return parseFloat((totalReward.value * (splitPercentages.value.miner / 100)).toFixed(4))
})

const requiredCollateral = computed(() => {
  const h = Number(calcHeight.value)
  if (h <= 100000) return 15000
  if (h <= 200000) return 17500
  return 20000
})
</script>

<template>
  <div class="space-y-24 py-12">
    <!-- Hero Section -->
    <section class="relative flex flex-col items-center justify-center text-center px-4 py-8">
      <!-- Background glowing lights -->
      <div class="absolute w-96 h-96 rounded-full bg-salmon-500/10 blur-[120px] top-[-50px] left-[20%] pointer-events-none"></div>
      <div class="absolute w-96 h-96 rounded-full bg-slate-blue-500/10 blur-[120px] bottom-0 right-[20%] pointer-events-none"></div>

      <!-- Mainnet 1000 Milestone Banner -->
      <div 
        class="mb-8 p-1 rounded-2xl bg-gradient-to-r from-salmon-500/30 via-slate-blue-500/30 to-salmon-500/30 border border-salmon-500/20 backdrop-blur-md inline-block max-w-lg shadow-xl cursor-pointer"
        @click="simulateBlock"
      >
        <div class="bg-[#0b0f19] px-6 py-3 rounded-[14px] flex flex-col gap-2 items-center">
          <div class="flex items-center gap-3 text-sm font-semibold tracking-wider text-white">
            <span class="w-2.5 h-2.5 rounded-full bg-salmon-500 animate-ping"></span>
            <span v-if="currentBlock < 1000">🚀 MAINNET TRANSITION: BLOCK {{ currentBlock }}</span>
            <span v-else class="text-salmon-400">🎉 MILESTONE COMPLETED: BLOCK 1000 ACTIVATED!</span>
          </div>
          
          <div v-if="currentBlock < 1000" class="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 mt-1">
            <div 
              class="h-full bg-gradient-to-r from-salmon-500 to-slate-blue-500 transition-all duration-500" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          
          <span v-if="currentBlock < 1000" class="text-xs text-gray-400">
            {{ blocksRemaining }} blocks remaining until block 1000. Click to simulate blocks!
          </span>
          <span v-else class="text-xs text-salmon-300 font-bold">
            Consensus mechanism upgraded. Ready for PoBLS activation!
          </span>
        </div>
      </div>

      <!-- Title / Tagline -->
      <div class="max-w-4xl space-y-6">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {{ t('heroTitle') }}
        </h1>
        <p class="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          {{ t('heroSubtitle') }}
        </p>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mt-10">
        <UButton
          @click="scrollToSection('features')"
          color="salmon"
          size="lg"
          variant="solid"
          class="px-8 py-3.5 text-sm font-bold shadow-lg shadow-salmon-500/20 cursor-pointer"
        >
          {{ t('getStarted') }}
        </UButton>
        <UButton
          to="https://github.com/bedri/KristaTech-KRISTA"
          target="_blank"
          color="neutral"
          size="lg"
          variant="outline"
          class="px-8 py-3.5 text-sm font-bold cursor-pointer"
        >
          {{ t('viewDocs') }}
        </UButton>
      </div>

      <!-- Stat Badges Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-20">
        <div class="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center shadow-lg relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <UIcon name="i-heroicons-cpu-chip" class="w-24 h-24 text-salmon-400" />
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ t('activeMasternodes') }}</span>
          <span class="text-3xl font-extrabold text-white mt-2">{{ masternodesCount.toLocaleString() }}</span>
          <span class="text-[10px] text-salmon-400 font-medium mt-1">With 15k-20k collateral</span>
        </div>

        <div class="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center shadow-lg relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <UIcon name="i-heroicons-banknotes" class="w-24 h-24 text-slate-blue-400" />
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ t('currentSupply') }}</span>
          <span class="text-3xl font-extrabold text-white mt-2">{{ circulatingSupply.toLocaleString() }}</span>
          <span class="text-[10px] text-slate-blue-400 font-medium mt-1">100,000,000 Hard Cap</span>
        </div>


        <div class="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center shadow-lg relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
            <UIcon name="i-heroicons-bolt" class="w-24 h-24 text-salmon-400" />
          </div>
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ t('networkTps') }}</span>
          <span class="text-3xl font-extrabold text-white mt-2">2,500+</span>
          <span class="text-[10px] text-salmon-400 font-medium mt-1">Sub-second finality</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="scroll-mt-24 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {{ t('featuresTitle') }}
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          {{ t('featuresSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <!-- Feature 1: ADAM -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-salmon-500/10 flex items-center justify-center text-salmon-400 mb-6">
              <UIcon name="i-heroicons-cpu-chip" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">{{ t('adamTitle') }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ t('adamDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-white/5 bg-[#070b13] rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-semibold uppercase tracking-wider">ADAM Engine Sim</span>
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="isSimulatingConsensus ? 'bg-salmon-500/15 text-salmon-400 animate-pulse' : 'bg-white/5 text-gray-400'"
                >
                  {{ isSimulatingConsensus ? 'Running' : 'Idle' }}
                </span>
              </div>

              <!-- Console Simulation Output -->
              <div class="bg-[#0b0f19] rounded p-2.5 min-h-[50px] flex items-center text-xs font-mono border border-white/5 mt-2">
                <span v-if="consensusStep >= 0" class="text-salmon-300">
                  ⚡ {{ consensusSteps[consensusStep] }}
                </span>
                <span v-else class="text-gray-600">Click compile to run consensus loop...</span>
              </div>

              <UButton
                @click="startConsensusSim"
                color="salmon"
                variant="soft"
                size="xs"
                block
                :loading="isSimulatingConsensus"
                class="mt-2 font-medium cursor-pointer"
              >
                Simulate Block Proposal
              </UButton>
            </div>
          </div>
        </div>

        <!-- Feature 2: PoBLS -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-slate-blue-500/10 flex items-center justify-center text-slate-blue-400 mb-6">
              <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">{{ t('poblsTitle') }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ t('poblsDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-white/5 bg-[#070b13] rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 font-semibold uppercase tracking-wider">BLS Signature Lottery</span>
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="isLotteryRunning ? 'bg-slate-blue-500/15 text-slate-blue-400 animate-pulse' : 'bg-white/5 text-gray-400'"
                >
                  {{ isLotteryRunning ? 'Drawing' : 'Ready' }}
                </span>
              </div>

              <!-- Lottery Output -->
              <div class="bg-[#0b0f19] rounded p-2 flex flex-col gap-1 border border-white/5 mt-2 min-h-[50px] justify-center">
                <div v-if="selectedCommittee.length" class="flex flex-wrap gap-1.5 justify-center">
                  <span 
                    v-for="node in selectedCommittee" 
                    :key="node" 
                    class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-blue-500/10 border border-slate-blue-500/20 text-slate-blue-400"
                  >
                    {{ node }}
                  </span>
                </div>
                <span v-else class="text-xs text-gray-600 text-center font-mono">Run committee lottery draw...</span>
              </div>

              <UButton
                @click="runLottery"
                color="neutral"
                variant="soft"
                size="xs"
                block
                :loading="isLotteryRunning"
                class="mt-2 font-medium cursor-pointer hover:border-slate-blue-500/30"
              >
                Run Lottery Draw
              </UButton>
            </div>
          </div>
        </div>

        <!-- Feature 3: MESCAL -->
        <div class="glass-card rounded-2xl p-8 border border-white/5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-salmon-500/10 flex items-center justify-center text-salmon-400 mb-6">
              <UIcon name="i-heroicons-code-bracket-square" class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">{{ t('mescalTitle') }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ t('mescalDesc') }}
            </p>
          </div>

          <!-- Interactive Sim -->
          <div class="mt-8 border border-white/5 bg-[#070b13] rounded-xl p-4 flex flex-col justify-center min-h-[140px]">
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-500 font-semibold uppercase tracking-wider">MESCAL Template</span>
                <select 
                  v-model="mescalTemplate" 
                  class="bg-[#0b0f19] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-gray-300 focus:outline-none"
                >
                  <option value="escrow">Escrow Contract</option>
                  <option value="vesting">Vesting Schedule</option>
                  <option value="token">Asset Minting</option>
                </select>
              </div>

              <!-- Parameter Toggles (Escrow Only for Demo simplicity) -->
              <div v-if="mescalTemplate === 'escrow'" class="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                <label class="flex flex-col">
                  Collateral (KRISTA)
                  <input type="number" v-model="mescalParams.amount" class="bg-[#0b0f19] border border-white/10 rounded px-1 mt-0.5 text-gray-300" />
                </label>
                <label class="flex flex-col">
                  Locktime (min)
                  <input type="number" v-model="mescalParams.locktime" class="bg-[#0b0f19] border border-white/10 rounded px-1 mt-0.5 text-gray-300" />
                </label>
              </div>

              <!-- Bytecode Output -->
              <pre class="bg-[#0b0f19] rounded p-2 text-[8px] font-mono border border-white/5 overflow-x-auto text-salmon-300 max-h-[70px] leading-tight mt-1">{{ mescalBytecode }}</pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tokenomics Section -->
    <section id="tokenomics" class="scroll-mt-24 space-y-12">
      <div class="text-center space-y-3">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {{ t('tokenomicsTitle') }}
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          {{ t('tokenomicsSubtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 items-start">
        <!-- Tokenomics Detail Card -->
        <div class="lg:col-span-5 glass-card rounded-2xl p-8 border border-white/5 space-y-6 shadow-xl">
          <h3 class="text-xl font-bold text-white tracking-wide">Emission Parameters</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            KRISTA implements a sustainable token emission protocol featuring a hard cap of 100M tokens and a yearly 15% decay rate, providing a highly predictable supply curve.
          </p>

          <div class="space-y-4 pt-4 border-t border-white/5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Hard Cap:</span>
              <span class="font-bold text-white">100,000,000 KRISTA</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Decay Rate:</span>
              <span class="font-bold text-salmon-400">15% Year-over-Year</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Initial Block Reward:</span>
              <span class="font-bold text-white">25 KRISTA</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Premine Allocation:</span>
              <span class="font-bold text-white">30,000,000 KRISTA</span>
            </div>
          </div>

          <div class="p-4 bg-salmon-500/5 rounded-xl border border-salmon-500/10 flex items-start gap-3">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-salmon-400 shrink-0 mt-0.5" />
            <p class="text-xs text-salmon-300/80 leading-relaxed">
              Masternode payouts transition from 80% to 60% in the maturation phase, guaranteeing long-term security incentives for validator nodes and stakers.
            </p>
          </div>
        </div>

        <!-- Interactive Calculator Card -->
        <div class="lg:col-span-7 glass-card rounded-2xl p-8 border border-white/5 space-y-6 shadow-xl">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-salmon-500/10 rounded-lg text-salmon-400">
              <UIcon name="i-heroicons-calculator" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white tracking-wide">{{ t('calculatorTitle') }}</h3>
              <p class="text-xs text-gray-500">{{ t('calculatorDesc') }}</p>
            </div>
          </div>

          <!-- Input Slider -->
          <div class="space-y-4 pt-4">
            <div class="flex justify-between items-center text-sm">
              <label for="block-height-input" class="text-gray-400 font-semibold">{{ t('blockHeight') }}:</label>
              <input 
                id="block-height-input"
                type="number" 
                v-model="calcHeight" 
                min="2" 
                max="5000000" 
                class="bg-[#0b0f19] border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-salmon-500/50 w-32 text-right font-mono"
              />
            </div>
            <input 
              type="range" 
              v-model="calcHeight" 
              min="2" 
              max="3500000" 
              class="w-full accent-salmon-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <!-- Calculations Output -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <!-- Left Stats -->
            <div class="space-y-4">
              <div>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Total Reward (Decay Adjusted)</span>
                <div class="text-3xl font-extrabold text-white mt-1 font-mono">
                  {{ totalReward }} <span class="text-sm font-medium text-gray-400">KRISTA</span>
                </div>
              </div>

              <div>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Masternode Collateral</span>
                <div class="text-xl font-bold text-slate-blue-400 mt-1 font-mono">
                  {{ requiredCollateral.toLocaleString() }} <span class="text-xs font-medium text-gray-400">KRISTA</span>
                </div>
              </div>
            </div>

            <!-- Right splits -->
            <div class="space-y-3 bg-[#070b13] p-4 rounded-xl border border-white/5">
              <span class="text-xs text-gray-500 uppercase tracking-wider block mb-2">Payout Allocations</span>
              
              <!-- Masternode Allocation -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-slate-blue-400">{{ t('masternodeReward') }}</span>
                  <span class="text-white">{{ splitPercentages.mn }}%</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400 font-mono">
                  <span>{{ mnRewardAmount }} KRISTA</span>
                </div>
                <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-slate-blue-500" :style="{ width: `${splitPercentages.mn}%` }"></div>
                </div>
              </div>

              <!-- Validator Allocation -->
              <div class="space-y-1 pt-2">
                <div class="flex justify-between text-xs font-semibold">
                  <span class="text-salmon-400">{{ t('validatorReward') }}</span>
                  <span class="text-white">{{ splitPercentages.miner }}%</span>
                </div>
                <div class="flex justify-between text-xs text-gray-400 font-mono">
                  <span>{{ minerRewardAmount }} KRISTA</span>
                </div>
                <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-salmon-500" :style="{ width: `${splitPercentages.miner}%` }"></div>
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
        <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {{ t('phaseTitle') }}
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          {{ t('phaseSubtitle') }}
        </p>
      </div>

      <div class="relative max-w-4xl mx-auto px-4">
        <!-- Connecting Line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-salmon-500/40 via-slate-blue-500/40 to-transparent transform -translate-x-1/2 hidden md:block"></div>

        <div class="space-y-12">
          <!-- Phase 1 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <div class="flex-1 text-right hidden md:block pr-8">
              <span class="text-xs font-bold text-salmon-400 uppercase tracking-widest bg-salmon-500/10 px-3 py-1 rounded-full border border-salmon-500/20">Active</span>
            </div>

            <!-- Bullet point node -->
            <div class="w-6 h-6 rounded-full border-4 border-[#0b0f19] bg-salmon-500 shadow-lg shadow-salmon-500/50 z-10 shrink-0"></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-white/5 shadow-md pl-8 text-left">
              <div class="md:hidden mb-2">
                <span class="text-xs font-bold text-salmon-400 uppercase tracking-widest bg-salmon-500/10 px-3 py-1 rounded-full border border-salmon-500/20">Active</span>
              </div>
              <h3 class="text-lg font-bold text-white">{{ t('phase1') }}</h3>
              <p class="text-gray-400 text-sm mt-2 leading-relaxed">
                {{ t('phase1Desc') }}
              </p>
            </div>
          </div>

          <!-- Phase 2 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <!-- Bullet point node -->
            <div 
              class="w-6 h-6 rounded-full border-4 border-[#0b0f19] shadow-lg z-10 shrink-0 md:order-2"
              :class="currentBlock >= 1000 ? 'bg-salmon-500 shadow-salmon-500/50' : 'bg-slate-blue-500 shadow-slate-blue-500/30'"
            ></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-white/5 shadow-md pr-8 text-left md:text-right md:order-1">
              <div class="mb-2">
                <span 
                  class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  :class="currentBlock >= 1000 ? 'text-salmon-400 bg-salmon-500/10 border-salmon-500/20' : 'text-slate-blue-400 bg-slate-blue-500/10 border-slate-blue-500/20'"
                >
                  {{ currentBlock >= 1000 ? 'Active' : 'Next Phase' }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-white">{{ t('phase2') }}</h3>
              <p class="text-gray-400 text-sm mt-2 leading-relaxed">
                {{ t('phase2Desc') }}
              </p>
            </div>

            <div class="flex-1 hidden md:block"></div>
          </div>


          <!-- Phase 3 -->
          <div class="relative flex flex-col md:flex-row items-center gap-8 group">
            <div class="flex-1 text-right hidden md:block pr-8">
              <span 
                class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                :class="currentBlock >= 5000 ? 'text-salmon-400 bg-salmon-500/10 border-salmon-500/20' : 'text-gray-500 bg-white/5 border-white/5'"
              >
                {{ currentBlock >= 5000 ? 'Active' : 'Future' }}
              </span>
            </div>

            <!-- Bullet point node -->
            <div 
              class="w-6 h-6 rounded-full border-4 border-[#0b0f19] shadow-md z-10 shrink-0"
              :class="currentBlock >= 5000 ? 'bg-salmon-500 shadow-salmon-500/50' : 'bg-white/20'"
            ></div>

            <div class="flex-1 glass-card rounded-2xl p-6 border border-white/5 shadow-md pl-8 text-left">
              <div class="md:hidden mb-2">
                <span 
                  class="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                  :class="currentBlock >= 5000 ? 'text-salmon-400 bg-salmon-500/10 border-salmon-500/20' : 'text-gray-500 bg-white/5 border-white/5'"
                >
                  {{ currentBlock >= 5000 ? 'Active' : 'Future' }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-white">{{ t('phase3') }}</h3>
              <p class="text-gray-400 text-sm mt-2 leading-relaxed">
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
/* Scoped custom styling if needed */
.text-glow-salmon {
  text-shadow: 0 0 10px rgba(245, 137, 124, 0.4);
}
</style>
