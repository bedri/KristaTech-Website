<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'

const { locale, setLocale, t } = useI18n()

// Active section for highlighting nav items
const activeSection = ref('')
const sections = ['features', 'tokenomics', 'roadmap']

function scrollToSection(id) {
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
    <header class="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-slate-200/40 py-4 shadow-sm">
      <UContainer class="flex items-center justify-between">
        <!-- Logo / Branding -->
        <a href="#" class="flex items-center gap-3.5 group">
          <div class="w-12 h-12 rounded-xl border border-slate-200/60 flex items-center justify-center shadow-sm group-hover:scale-102 transition-transform duration-300 p-2.5 bg-gradient-to-b from-white to-[#f3f7f5]">
            <img src="/logo.svg" alt="KristaTech Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="font-extrabold text-xl tracking-wider text-slate-800 flex items-center gap-2">
              KRISTA
              <span class="text-[10px] font-bold tracking-normal px-2 py-0.5 rounded-md bg-mint-500/10 text-mint-600 border border-mint-500/20">
                CORE
              </span>
            </h1>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
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
        <div class="flex items-center gap-3">
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
            class="font-semibold shadow-sm border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer hidden md:inline-flex"
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
            class="font-semibold cursor-pointer text-slate-600 hover:text-slate-900"
          />
        </div>
      </UContainer>
    </header>

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
            <span class="font-bold text-slate-700 tracking-wider">KRISTA</span>
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
