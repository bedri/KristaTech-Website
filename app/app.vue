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
  <div class="min-h-screen flex flex-col bg-[#0b0f19] text-gray-200 selection:bg-salmon-500/30 selection:text-salmon-200">
    <!-- Main Glassmorphic Header -->
    <header class="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-white/5 py-4">
      <UContainer class="flex items-center justify-between">
        <!-- Logo / Branding -->
        <a href="#" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 p-1.5 bg-gradient-to-b from-slate-900 to-[#0b0f19]">
            <img src="/logo.svg" alt="KristaTech Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <h1 class="font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
              KRISTA
              <span class="text-[10px] font-semibold tracking-normal px-2 py-0.5 rounded bg-salmon-500/10 text-salmon-400 border border-salmon-500/20">
                BLOCKCHAIN
              </span>
            </h1>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <button 
            @click="scrollToSection('features')" 
            class="hover:text-white transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-salmon-400 font-bold text-glow-salmon': activeSection === 'features' }"
          >
            {{ t('navFeatures') }}
          </button>
          <button 
            @click="scrollToSection('tokenomics')" 
            class="hover:text-white transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-salmon-400 font-bold text-glow-salmon': activeSection === 'tokenomics' }"
          >
            {{ t('navTokenomics') }}
          </button>
          <button 
            @click="scrollToSection('roadmap')" 
            class="hover:text-white transition-colors cursor-pointer text-sm font-medium border-none bg-transparent"
            :class="{ 'text-salmon-400 font-bold text-glow-salmon': activeSection === 'roadmap' }"
          >
            {{ t('navRoadmap') }}
          </button>
        </nav>

        <!-- Right Side Controls -->
        <div class="flex items-center gap-3">
          <!-- Language Selector -->
          <div class="flex bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs">
            <button 
              @click="setLocale('tr')" 
              class="px-2.5 py-1 rounded transition-colors cursor-pointer border-none bg-transparent font-medium"
              :class="locale === 'tr' ? 'bg-salmon-500/20 text-salmon-400 font-bold border border-salmon-500/20' : 'text-gray-400 hover:text-white'"
            >
              TR
            </button>
            <button 
              @click="setLocale('en')" 
              class="px-2.5 py-1 rounded transition-colors cursor-pointer border-none bg-transparent font-medium"
              :class="locale === 'en' ? 'bg-salmon-500/20 text-salmon-400 font-bold border border-salmon-500/20' : 'text-gray-400 hover:text-white'"
            >
              EN
            </button>
          </div>

          <!-- Explorer Link -->
          <UButton
            to="http://localhost:27799"
            target="_blank"
            color="salmon"
            variant="solid"
            size="sm"
            class="font-medium shadow-md shadow-salmon-500/10 hidden sm:inline-flex cursor-pointer"
            icon="i-heroicons-globe-alt"
          >
            {{ t('explorer') }}
          </UButton>

          <!-- GitHub Link -->
          <UButton
            to="https://github.com/bedri/KristaTech-KRISTA"
            target="_blank"
            color="neutral"
            variant="ghost"
            icon="i-simple-icons-github"
            size="sm"
            aria-label="GitHub"
            class="cursor-pointer"
          />
        </div>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <NuxtPage />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-950/80 border-t border-white/5 py-10 mt-auto">
      <UContainer class="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
        <div class="flex items-center gap-3">
          <img src="/logo.svg" alt="KristaTech Logo" class="w-6 h-6 opacity-80" />
          <div>
            <span class="font-bold text-gray-400 tracking-wider">KRISTA</span>
            <span class="text-xs text-gray-600 block sm:inline sm:ml-2">{{ t('brandTagline') }}</span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <a href="http://localhost:27799" target="_blank" class="hover:text-salmon-400 transition-colors">{{ t('explorer') }}</a>
          <a href="https://github.com/bedri/KristaTech-KRISTA" target="_blank" class="hover:text-salmon-400 transition-colors">{{ t('github') }}</a>
          <span class="text-xs px-2 py-1 rounded bg-[#0b0f19] border border-white/5 text-gray-400">v1.1.0</span>
        </div>
      </UContainer>
      <UContainer class="mt-6 border-t border-white/5 pt-6 text-center text-xs text-gray-600">
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
