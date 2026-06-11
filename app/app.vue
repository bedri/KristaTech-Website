<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { locale, setLocale, t } = useI18n()

useHead({
  title: computed(() => `KristaTech (KRISTA) - ${t('brandTagline')}`)
})

// Active section for highlighting nav items
const activeSection = ref('')
const sections = ['features', 'tokenomics', 'roadmap']
const isMobileMenuOpen = ref(false)

function scrollToSection(id) {
  isMobileMenuOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleScroll() {
  const scrollPosition = window.scrollY + 100
  for (const section of sections) {
    const el = document.getElementById(section)
    if (el) {
      const top = el.offsetTop
      const height = el.offsetHeight
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = section
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f3f7f5] text-slate-700 selection:bg-mint-500/20 selection:text-mint-800">
    <!-- Main Glassmorphic Header -->
    <header class="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-slate-200/40 py-3 sm:py-4 shadow-sm">
      <UContainer class="flex items-center justify-between gap-4 sm:gap-6">
        <!-- Logo / Branding -->
        <a href="#" class="flex items-center gap-2 sm:gap-3.5 group">
          <div class="w-9 h-9 sm:w-12 h-12 rounded-xl border border-slate-200/60 flex items-center justify-center shadow-sm group-hover:scale-102 transition-transform duration-300 p-1.5 sm:p-2.5 bg-gradient-to-b from-white to-[#f3f7f5]">
            <img src="/logo.svg" alt="KristaTech Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="font-extrabold text-base sm:text-lg md:text-xl tracking-wider text-slate-800 flex items-center gap-1.5 sm:gap-2">
              <span>KristaTech</span>
              <span class="hidden sm:inline text-slate-500 font-medium text-xs sm:text-sm md:text-base">(KRISTA)</span>
              <span class="text-[9px] sm:text-[10px] font-bold tracking-normal px-1.5 sm:px-2 py-0.5 rounded-md bg-mint-500/10 text-mint-600 border border-mint-500/20">
                CORE
              </span>
            </h1>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-500">
          <button 
            @click="scrollToSection('features')" 
            class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-mint-600 font-bold text-glow-mint': activeSection === 'features' }"
          >
            {{ t('navFeatures') }}
          </button>
          <button 
            @click="scrollToSection('tokenomics')" 
            class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-mint-600 font-bold text-glow-mint': activeSection === 'tokenomics' }"
          >
            {{ t('navTokenomics') }}
          </button>
          <button 
            @click="scrollToSection('roadmap')" 
            class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-mint-600 font-bold text-glow-mint': activeSection === 'roadmap' }"
          >
            {{ t('navRoadmap') }}
          </button>

          <!-- Whitepaper Link -->
          <a 
            :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper.md'" 
            target="_blank" 
            class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium text-slate-500 no-underline"
          >
            {{ t('navWhitepaper') }}
          </a>

          <!-- Documents Dropdown -->
          <div class="relative group">
            <button class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium border-none bg-transparent flex items-center gap-1">
              {{ t('navDocuments') }}
              <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            
            <div class="absolute left-0 top-full pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div class="rounded-xl bg-white border border-slate-200/60 shadow-lg p-2">
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/ADAM_Consensus.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'ADAM Konsensüsü' : 'ADAM Consensus' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'PoBLS Konsensüsü' : 'PoBLS Consensus' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/MESCAL.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'MESCAL Akıllı Sözleşmeleri' : 'MESCAL Smart Contracts' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Token Ekonomisi Çalışması' : 'Tokenomics Study' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Hardcap Analizi' : 'Hardcap Analysis' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Miner_Registration.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Madenci Kaydı' : 'Miner Registration' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Security_Audit.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Güvenlik Denetimi' : 'Security Audit' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/release-notes.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Sürüm Notları' : 'Release Notes' }}
                </a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Right Side Controls -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Language Selector -->
          <div class="flex bg-slate-200/50 rounded-lg p-0.5 border border-slate-300/40 text-xs">
            <button 
              @click="setLocale('tr')" 
              class="px-2 py-0.5 rounded transition-colors cursor-pointer border-none bg-transparent font-semibold"
              :class="locale === 'tr' ? 'bg-white text-mint-600 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'"
            >
              TR
            </button>
            <button 
              @click="setLocale('en')" 
              class="px-2 py-0.5 rounded transition-colors cursor-pointer border-none bg-transparent font-semibold"
              :class="locale === 'en' ? 'bg-white text-mint-600 shadow-sm border border-slate-200/20' : 'text-slate-500 hover:text-slate-800'"
            >
              EN
            </button>
          </div>

          <!-- Explorer Link -->
          <UButton
            to="https://explorer.kristalteknoloji.com"
            target="_blank"
            color="mint"
            variant="solid"
            size="sm"
            class="font-semibold shadow-sm shadow-mint-500/5 hidden sm:inline-flex cursor-pointer text-white bg-mint-500 hover:bg-mint-600 border-none"
            icon="i-heroicons-globe-alt"
          >
            {{ t('explorer') }}
          </UButton>

          <!-- Wallet Download Link -->
          <UButton
            to="https://github.com/bedri/KristaTech-KRISTA/releases"
            target="_blank"
            color="slate"
            variant="outline"
            size="sm"
            class="font-semibold shadow-sm border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer hidden xl:inline-flex"
            icon="i-heroicons-arrow-down-tray"
          >
            {{ t('downloadWallet') }}
          </UButton>

          <!-- GitHub Link -->
          <UButton
            to="https://github.com/bedri/KristaTech-KRISTA"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-simple-icons-github"
            label="GitHub"
            size="sm"
            class="font-semibold cursor-pointer text-slate-600 hover:text-slate-900 hidden md:inline-flex"
          />
          <UButton
            to="https://github.com/bedri/KristaTech-KRISTA"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-simple-icons-github"
            size="sm"
            class="font-semibold cursor-pointer text-slate-600 hover:text-slate-900 md:hidden"
          />

          <!-- Mobile Menu Toggle Button -->
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bars-3"
            size="sm"
            class="lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
            @click="isMobileMenuOpen = true"
          />
        </div>
      </UContainer>
    </header>

    <!-- Mobile Slideover Navigation Menu -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-sm"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-y-0 right-0 z-101 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col p-6 border-l border-slate-200/50"
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between pb-6 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <img src="/logo.svg" alt="KristaTech Logo" class="w-8 h-8" />
            <span class="font-extrabold text-slate-800 text-base">KristaTech</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-mint-500/10 text-mint-600 border border-mint-500/20">CORE</span>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            class="text-slate-500 hover:text-slate-800"
            @click="isMobileMenuOpen = false"
          />
        </div>

        <!-- Mobile Menu Links -->
        <div class="flex-grow overflow-y-auto py-6 flex flex-col gap-5">
          <button 
            @click="scrollToSection('features')" 
            class="w-full text-left py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            {{ t('navFeatures') }}
          </button>
          <button 
            @click="scrollToSection('tokenomics')" 
            class="w-full text-left py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            {{ t('navTokenomics') }}
          </button>
          <button 
            @click="scrollToSection('roadmap')" 
            class="w-full text-left py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
          >
            {{ t('navRoadmap') }}
          </button>
          
          <a 
            :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper.md'" 
            target="_blank" 
            class="block py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 font-semibold text-sm no-underline transition-colors"
          >
            {{ t('navWhitepaper') }}
          </a>

          <!-- Mobile Documents Sub-List -->
          <div class="px-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">{{ t('navDocuments') }}</span>
            <div class="flex flex-col gap-1 border-l border-slate-100 pl-3">
              <a 
                href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/ADAM_Consensus.md" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'ADAM Konsensüsü' : 'ADAM Consensus' }}
              </a>
              <a 
                :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus.md'" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'PoBLS Konsensüsü' : 'PoBLS Consensus' }}
              </a>
              <a 
                href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/MESCAL.md" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'MESCAL Akıllı Sözleşmeleri' : 'MESCAL Smart Contracts' }}
              </a>
              <a 
                :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study.md'" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'Token Ekonomisi Çalışması' : 'Tokenomics Study' }}
              </a>
              <a 
                :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis.md'" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'Hardcap Analizi' : 'Hardcap Analysis' }}
              </a>
              <a 
                href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Miner_Registration.md" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'Madenci Kaydı' : 'Miner Registration' }}
              </a>
              <a 
                href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Security_Audit.md" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'Güvenlik Denetimi' : 'Security Audit' }}
              </a>
              <a 
                href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/release-notes.md" 
                target="_blank" 
                class="block py-1.5 text-xs font-semibold text-slate-500 hover:text-mint-600 transition-colors"
              >
                {{ locale === 'tr' ? 'Sürüm Notları' : 'Release Notes' }}
              </a>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Footer -->
        <div class="pt-6 border-t border-slate-100 flex flex-col gap-4">
          <UButton
            to="https://explorer.kristalteknoloji.com"
            target="_blank"
            color="mint"
            variant="solid"
            size="sm"
            class="w-full justify-center font-semibold text-white bg-mint-500 hover:bg-mint-600 border-none cursor-pointer"
            icon="i-heroicons-globe-alt"
          >
            {{ t('explorer') }}
          </UButton>

          <UButton
            to="https://github.com/bedri/KristaTech-KRISTA/releases"
            target="_blank"
            color="slate"
            variant="outline"
            size="sm"
            class="w-full justify-center font-semibold border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
            icon="i-heroicons-arrow-down-tray"
          >
            {{ t('downloadWallet') }}
          </UButton>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-50 border-t border-slate-200/80 py-10 mt-auto">
      <UContainer class="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
        <div class="flex items-center gap-3">
          <img src="/logo.svg" alt="KristaTech Logo" class="w-7 h-7 opacity-90" />
          <div>
            <span class="font-bold text-slate-700 tracking-wider">KristaTech (KRISTA)</span>
            <span class="text-xs text-slate-400 block sm:inline sm:ml-2">{{ t('brandTagline') }}</span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <a href="https://explorer.kristalteknoloji.com" target="_blank" class="hover:text-mint-600 transition-colors">{{ t('explorer') }}</a>
          <a href="https://github.com/bedri/KristaTech-KRISTA/releases" target="_blank" class="hover:text-mint-600 transition-colors">{{ t('downloadWallet') }}</a>
          <a 
            :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Whitepaper.md'" 
            target="_blank" 
            class="hover:text-mint-600 transition-colors"
          >
            {{ t('navWhitepaper') }}
          </a>
          
          <!-- Documents Dropdown Footer -->
          <div class="relative group">
            <button class="hover:text-mint-600 transition-colors cursor-pointer text-sm font-medium border-none bg-transparent flex items-center gap-1">
              {{ t('navDocuments') }}
              <UIcon name="i-heroicons-chevron-up" class="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            
            <div class="absolute bottom-full left-0 pb-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
              <div class="rounded-xl bg-white border border-slate-200/60 shadow-lg p-2">
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/ADAM_Consensus.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'ADAM Konsensüsü' : 'ADAM Consensus' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/PoBLS_Consensus.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'PoBLS Konsensüsü' : 'PoBLS Consensus' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/MESCAL.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'MESCAL Akıllı Sözleşmeleri' : 'MESCAL Smart Contracts' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Tokenomics_Study.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Token Ekonomisi Çalışması' : 'Tokenomics Study' }}
                </a>
                <a 
                  :href="locale === 'tr' ? 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis_TR.md' : 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Hardcap_Analysis.md'" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Hardcap Analizi' : 'Hardcap Analysis' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Miner_Registration.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Madenci Kaydı' : 'Miner Registration' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/Security_Audit.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Güvenlik Denetimi' : 'Security Audit' }}
                </a>
                <a 
                  href="https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc/release-notes.md" 
                  target="_blank" 
                  class="block px-3 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-mint-600 hover:bg-mint-50/50 transition-colors"
                >
                  {{ locale === 'tr' ? 'Sürüm Notları' : 'Release Notes' }}
                </a>
              </div>
            </div>
          </div>

          <a href="https://github.com/bedri/KristaTech-KRISTA" target="_blank" class="hover:text-mint-600 transition-colors">{{ t('github') }}</a>
          <span class="text-xs px-2 py-0.5 rounded bg-white border border-slate-200/80 text-slate-500 font-semibold shadow-sm">v1.2.0</span>
        </div>
      </UContainer>
      <UContainer class="mt-6 border-t border-slate-200/50 pt-6 text-center text-xs text-slate-400">
        &copy; 2026 {{ t('footerRights') }}
      </UContainer>
    </footer>
  </div>
</template>

<style>
/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}
</style>
