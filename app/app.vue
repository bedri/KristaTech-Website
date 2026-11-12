<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '~/composables/useI18n'
import { sanitizeTheme, sanitizeLocale } from '~/utils/protocol'

const { locale, setLocale, t } = useI18n()

const themeCookie = useCookie('kristatech_theme', {
  maxAge: 365 * 24 * 60 * 60,
  sameSite: 'lax',
  path: '/',
  default: () => 'light'
})

const isDark = computed(() => sanitizeTheme(themeCookie.value, 'light') === 'dark')

function toggleTheme() {
  themeCookie.value = isDark.value ? 'light' : 'dark'
  if (import.meta.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
  }
}

useHead({
  htmlAttrs: {
    lang: computed(() => sanitizeLocale(locale.value, 'tr')),
    class: computed(() => (isDark.value ? 'dark' : ''))
  },
  title: computed(() => `KristaTech (KRISTA) | ${t('brandTagline')}`),
  meta: [
    {
      name: 'color-scheme',
      content: 'light dark'
    },
    {
      name: 'description',
      content: computed(() => t('heroSubtitle'))
    }
  ]
})

const activeSection = ref('features')
const sections = ['features', 'specs', 'tokenomics', 'roadmap', 'docs']
const isMobileMenuOpen = ref(false)
const isDocsDropdownOpen = ref(false)

function handleDocsDropdownFocusOut(event) {
  if (event.currentTarget && !event.currentTarget.contains(event.relatedTarget)) {
    isDocsDropdownOpen.value = false
  }
}

const documentsList = computed(() => {
  const isTr = locale.value === 'tr'
  const base = 'https://github.com/bedri/KristaTech-KRISTA/blob/develop/doc'
  return [
    {
      id: 'whitepaper',
      title: isTr ? 'Teknik Doküman (Whitepaper)' : 'Technical Whitepaper',
      badge: 'CORE',
      href: `${base}/${isTr ? 'Whitepaper_TR.md' : 'Whitepaper.md'}`
    },
    {
      id: 'adam',
      title: isTr ? 'ADAM Konsensüsü' : 'ADAM Consensus',
      badge: 'VRF + PoW',
      href: `${base}/${isTr ? 'ADAM_Consensus_TR.md' : 'ADAM_Consensus.md'}`
    },
    {
      id: 'pobls',
      title: isTr ? 'PoBLS Konsensüsü' : 'PoBLS Consensus',
      badge: 'BLST',
      href: `${base}/${isTr ? 'PoBLS_Consensus_TR.md' : 'PoBLS_Consensus.md'}`
    },
    {
      id: 'mescal',
      title: isTr ? 'MESCAL Akıllı Sözleşmeleri' : 'MESCAL Smart Contracts',
      badge: '0-GAS VM',
      href: `${base}/${isTr ? 'MESCAL_TR.md' : 'MESCAL.md'}`
    },
    {
      id: 'tokenomics',
      title: isTr ? 'Token Ekonomisi Çalışması' : 'Tokenomics Study',
      badge: 'MODEL D',
      href: `${base}/${isTr ? 'Tokenomics_Study_TR.md' : 'Tokenomics_Study.md'}`
    },
    {
      id: 'hardcap',
      title: isTr ? 'Hardcap Analizi' : 'Hardcap Analysis',
      badge: '210M CAP',
      href: `${base}/${isTr ? 'Hardcap_Analysis_TR.md' : 'Hardcap_Analysis.md'}`
    },
    {
      id: 'miner',
      title: isTr ? 'Madenci Kaydı (Coin-Lock & PoW-Lock)' : 'Miner Registration (Coin-Lock & PoW-Lock)',
      badge: '250 / 10 KRISTA',
      href: `${base}/${isTr ? 'Miner_Registration_TR.md' : 'Miner_Registration.md'}`
    },
    {
      id: 'audit',
      title: isTr ? 'Güvenlik Denetimi' : 'Security Audit',
      badge: 'SECURED',
      href: `${base}/${isTr ? 'Security_Audit_TR.md' : 'Security_Audit.md'}`
    },
    {
      id: 'releases',
      title: isTr ? 'Sürüm Notları' : 'Release Notes',
      badge: 'v1.5.5.0',
      href: `${base}/release-notes.md`
    }
  ]
})

function scrollToSection(id) {
  isMobileMenuOpen.value = false
  isDocsDropdownOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }
}

function handleScroll() {
  const scrollPosition = window.scrollY + 140
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

function handleKeydown(e) {
  if (e.key === 'Escape') {
    isMobileMenuOpen.value = false
    isDocsDropdownOpen.value = false
  }
}

watch(isMobileMenuOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-protocol-grid selection:bg-cobalt-400/20 selection:text-cobalt-800 dark:selection:text-cobalt-200">
    <!-- Accessible Skip Link -->
    <a href="#main-content" class="skip-link visually-hidden">
      {{ t('skipToContent') }}
    </a>

    <!-- Subtle Top Brand Gradient Accent Hairline -->
    <div class="h-1 w-full brand-accent-bar"></div>

    <!-- Harmonious Modern Sticky Glass Header -->
    <header
      class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-cobalt-200/60 dark:border-slate-800/80 py-3.5 transition-colors"
      :inert="isMobileMenuOpen || undefined"
    >
      <UContainer class="flex items-center justify-between gap-4">
        <!-- Brand Logo Lockup -->
        <a href="#" class="flex items-center gap-3 group focus:outline-none">
          <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border border-cobalt-300/60 dark:border-cobalt-400/30 bg-gradient-to-br from-white via-cobalt-50/70 to-coral-50/60 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-2.5 shadow-xs group-hover:border-coral-400/70 transition-all duration-300">
            <img
              src="/logo.svg"
              alt="KristaTech (KRISTA) Logo"
              width="38"
              height="30"
              fetchpriority="high"
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white">
                KristaTech
              </span>
              <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
                KRISTA
              </span>
              <span class="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30">
                <span class="w-1.5 h-1.5 rounded-full bg-[#F5897C]"></span>
                CORE
              </span>
            </div>
            <span class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {{ t('brandTagline') }}
            </span>
          </div>
        </a>

        <!-- Desktop Segmented Pill Navigation -->
        <nav
          aria-label="Primary"
          class="hidden xl:flex items-center gap-1 p-1 rounded-2xl bg-cobalt-50/75 dark:bg-slate-800/70 border border-cobalt-200/60 dark:border-slate-700/60"
        >
          <button
            type="button"
            @click="scrollToSection('features')"
            class="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            :class="activeSection === 'features'
              ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white'"
          >
            {{ t('navFeatures') }}
          </button>

          <button
            type="button"
            @click="scrollToSection('specs')"
            class="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            :class="activeSection === 'specs'
              ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white'"
          >
            {{ t('navSpecs') }}
          </button>

          <button
            type="button"
            @click="scrollToSection('tokenomics')"
            class="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            :class="activeSection === 'tokenomics'
              ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white'"
          >
            {{ t('navTokenomics') }}
          </button>

          <button
            type="button"
            @click="scrollToSection('roadmap')"
            class="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            :class="activeSection === 'roadmap'
              ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white'"
          >
            {{ t('navRoadmap') }}
          </button>

          <!-- Documents Accessible Menu & Scroll Trigger -->
          <div
            class="relative group"
            @mouseenter="isDocsDropdownOpen = true"
            @mouseleave="isDocsDropdownOpen = false"
            @focusin="isDocsDropdownOpen = true"
            @focusout="handleDocsDropdownFocusOut"
          >
            <button
              type="button"
              :aria-expanded="isDocsDropdownOpen"
              @click="scrollToSection('docs')"
              class="px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
              :class="activeSection === 'docs'
                ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white'"
            >
              <span>{{ t('navDocuments') }}</span>
              <svg aria-hidden="true" class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <div
              :inert="!isDocsDropdownOpen || undefined"
              class="absolute left-0 top-full pt-2.5 w-76 transition-all duration-200 z-50"
              :class="isDocsDropdownOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1'"
            >
              <div class="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-cobalt-200/80 dark:border-slate-700 shadow-xl p-2.5 space-y-1">
                <div class="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-cobalt-600 dark:text-cobalt-300 border-b border-cobalt-100 dark:border-slate-800 flex items-center justify-between">
                  <span>{{ locale === 'tr' ? 'Resmi Teknik Belgeler' : 'Official Technical Papers' }}</span>
                  <span class="font-mono text-coral-500">GitHub</span>
                </div>
                <a
                  v-for="doc in documentsList"
                  :key="doc.id"
                  :href="doc.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-between gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:text-cobalt-700 dark:hover:text-coral-300 hover:bg-cobalt-50/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{{ doc.title }}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 shrink-0">
                    {{ doc.badge }}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Right Controls -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          <!-- Language Toggle -->
          <div
            role="group"
            :aria-label="locale === 'tr' ? 'Dil seçimi' : 'Language selector'"
            class="flex bg-cobalt-50/80 dark:bg-slate-800 rounded-xl p-1 border border-cobalt-200/70 dark:border-slate-700 text-xs"
          >
            <button
              type="button"
              @click="setLocale('tr')"
              :aria-pressed="locale === 'tr'"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold"
              :class="locale === 'tr'
                ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
            >
              TR
            </button>
            <button
              type="button"
              @click="setLocale('en')"
              :aria-pressed="locale === 'en'"
              class="px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold"
              :class="locale === 'en'
                ? 'bg-white dark:bg-slate-900 text-cobalt-700 dark:text-cobalt-300 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'"
            >
              EN
            </button>
          </div>

          <!-- Theme Switcher (Light / Dark) -->
          <button
            type="button"
            @click="toggleTheme"
            :aria-label="isDark ? (locale === 'tr' ? 'Açık temaya geç' : 'Switch to light theme') : (locale === 'tr' ? 'Koyu temaya geç' : 'Switch to dark theme')"
            class="p-2 rounded-xl border border-cobalt-200/70 dark:border-slate-700 bg-cobalt-50/60 dark:bg-slate-800 text-cobalt-700 dark:text-slate-200 hover:border-coral-400/60 transition-colors cursor-pointer"
          >
            <svg v-if="isDark" aria-hidden="true" class="w-4 h-4 text-coral-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
            </svg>
            <svg v-else aria-hidden="true" class="w-4 h-4 text-cobalt-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Block Explorer Button -->
          <a
            href="https://explorer.kristalteknoloji.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brand-primary hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold"
          >
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.454-2.908a1.5 1.5 0 00-.281-1.731l-.772-.772a1 1 0 00-.707-.293h-.382a1 1 0 01-.707-.293l-1.121-1.121A1.5 1.5 0 018.713 6.5H10a1 1 0 00.707-.293l.854-.853A6.473 6.473 0 0116.5 10z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('explorer') }}</span>
          </a>

          <!-- Wallet Download Button -->
          <a
            href="https://github.com/bedri/KristaTech-KRISTA/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-cobalt-300/70 dark:border-cobalt-400/35 bg-white/80 dark:bg-slate-800/80 hover:border-coral-400/60 text-cobalt-700 dark:text-cobalt-200 transition-all"
          >
            <svg aria-hidden="true" class="w-4 h-4 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span>{{ t('downloadWallet') }}</span>
          </a>

          <!-- GitHub Icon Link -->
          <a
            href="https://github.com/bedri/KristaTech-KRISTA"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('github')"
            class="p-2 rounded-xl border border-cobalt-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-white hover:border-cobalt-400/50 transition-colors"
          >
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            :aria-label="locale === 'tr' ? 'Menüyü aç' : 'Open navigation menu'"
            :aria-expanded="isMobileMenuOpen"
            class="xl:hidden p-2 rounded-xl border border-cobalt-200/70 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800"
            @click="isMobileMenuOpen = true"
          >
            <svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </UContainer>
    </header>

    <!-- Mobile Navigation Drawer -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-250 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isMobileMenuOpen"
        aria-label="Mobile Navigation"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl flex flex-col p-6 border-l border-cobalt-200/70 dark:border-slate-800"
      >
        <div class="flex items-center justify-between pb-5 border-b border-cobalt-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <img src="/logo.svg" alt="KristaTech Logo" width="32" height="25" class="w-8 h-8 object-contain" />
            <span class="font-extrabold text-slate-800 dark:text-white text-base">KristaTech</span>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300">KRISTA</span>
          </div>
          <button
            type="button"
            :aria-label="locale === 'tr' ? 'Menüyü kapat' : 'Close menu'"
            class="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
            @click="isMobileMenuOpen = false"
          >
            <svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto py-5 space-y-1.5">
          <button
            type="button"
            @click="scrollToSection('features')"
            class="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            {{ t('navFeatures') }}
          </button>
          <button
            type="button"
            @click="scrollToSection('specs')"
            class="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            {{ t('navSpecs') }}
          </button>
          <button
            type="button"
            @click="scrollToSection('tokenomics')"
            class="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            {{ t('navTokenomics') }}
          </button>
          <button
            type="button"
            @click="scrollToSection('roadmap')"
            class="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            {{ t('navRoadmap') }}
          </button>
          <button
            type="button"
            @click="scrollToSection('docs')"
            class="w-full text-left py-2.5 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-cobalt-50 dark:hover:bg-slate-800 font-semibold text-sm transition-colors"
          >
            {{ t('navDocuments') }}
          </button>

          <div class="pt-4 mt-4 border-t border-cobalt-100 dark:border-slate-800 px-3">
            <span class="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cobalt-400 block mb-2.5">
              {{ locale === 'tr' ? 'Teknik Belgeler (GitHub)' : 'Technical Papers (GitHub)' }}
            </span>
            <div class="space-y-1.5 border-l-2 border-cobalt-300/50 pl-3">
              <a
                v-for="doc in documentsList"
                :key="doc.id"
                :href="doc.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cobalt-700 dark:hover:text-coral-300"
              >
                <span>{{ doc.title }}</span>
                <span class="text-[10px] font-mono text-cobalt-600 dark:text-cobalt-300">{{ doc.badge }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-cobalt-100 dark:border-slate-800 flex flex-col gap-3">
          <a
            href="https://explorer.kristalteknoloji.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-brand-primary w-full py-2.5 px-4 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2"
          >
            <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.454-2.908a1.5 1.5 0 00-.281-1.731l-.772-.772a1 1 0 00-.707-.293h-.382a1 1 0 01-.707-.293l-1.121-1.121A1.5 1.5 0 018.713 6.5H10a1 1 0 00.707-.293l.854-.853A6.473 6.473 0 0116.5 10z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('explorer') }}</span>
          </a>
          <a
            href="https://github.com/bedri/KristaTech-KRISTA/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full py-2.5 px-4 rounded-xl text-center font-bold text-sm border border-cobalt-300/70 dark:border-cobalt-400/35 text-cobalt-700 dark:text-cobalt-200 bg-cobalt-50/70 dark:bg-slate-800 flex items-center justify-center gap-2"
          >
            <svg aria-hidden="true" class="w-4 h-4 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
            <span>{{ t('downloadWallet') }}</span>
          </a>
        </div>
      </aside>
    </Transition>

    <!-- Main Landmark -->
    <main
      id="main-content"
      tabindex="-1"
      class="flex-grow focus:outline-none"
      :inert="isMobileMenuOpen || undefined"
    >
      <NuxtPage />
    </main>

    <!-- Harmonious Glassmorphic Footer -->
    <footer
      class="bg-white/75 dark:bg-slate-900/85 backdrop-blur-2xl text-slate-600 dark:text-slate-300 border-t border-cobalt-200/60 dark:border-slate-800/80 pt-16 pb-12 mt-20"
      :inert="isMobileMenuOpen || undefined"
    >
      <UContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-cobalt-200/50 dark:border-slate-800">
          <!-- Brand Column -->
          <div class="lg:col-span-4 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-white via-cobalt-50 to-coral-50 dark:from-slate-800 dark:to-slate-900 border border-cobalt-300/60 dark:border-cobalt-400/30 flex items-center justify-center p-2 shadow-xs">
                <img src="/logo.svg" alt="KristaTech Logo" width="36" height="28" loading="lazy" class="w-full h-full object-contain" />
              </div>
              <div>
                <span class="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight block">KristaTech (KRISTA)</span>
                <span class="text-xs font-mono text-cobalt-600 dark:text-cobalt-300">{{ t('brandTagline') }}</span>
              </div>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {{ t('heroSubtitle') }}
            </p>
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-cobalt-400/15 text-cobalt-700 dark:text-cobalt-300 border border-cobalt-400/30">
                Core v1.5.5.0
              </span>
              <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-coral-400/15 text-coral-700 dark:text-coral-300 border border-coral-400/30">
                secp256k1 + BLST
              </span>
              <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-cobalt-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-cobalt-200/70 dark:border-slate-700">
                210M Max Supply
              </span>
            </div>
          </div>

          <!-- Navigation Column -->
          <div class="lg:col-span-2 space-y-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cobalt-300">
              {{ locale === 'tr' ? 'Platform' : 'Platform' }}
            </h2>
            <ul role="list" class="space-y-2.5 text-sm">
              <li>
                <button type="button" @click="scrollToSection('features')" class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors cursor-pointer">
                  {{ t('navFeatures') }}
                </button>
              </li>
              <li>
                <button type="button" @click="scrollToSection('specs')" class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors cursor-pointer">
                  {{ t('navSpecs') }}
                </button>
              </li>
              <li>
                <button type="button" @click="scrollToSection('tokenomics')" class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors cursor-pointer">
                  {{ t('navTokenomics') }}
                </button>
              </li>
              <li>
                <button type="button" @click="scrollToSection('roadmap')" class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors cursor-pointer">
                  {{ t('navRoadmap') }}
                </button>
              </li>
              <li>
                <button type="button" @click="scrollToSection('docs')" class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors cursor-pointer">
                  {{ t('navDocuments') }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Technical Documentation Column -->
          <div class="lg:col-span-3 space-y-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-coral-600 dark:text-coral-300">
              {{ t('navDocuments') }}
            </h2>
            <ul role="list" class="space-y-2 text-sm">
              <li v-for="doc in documentsList.slice(0, 6)" :key="doc.id">
                <a
                  :href="doc.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-coral-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{{ doc.title }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Network & Ecosystem Column -->
          <div class="lg:col-span-3 space-y-3">
            <h2 class="text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cobalt-300">
              {{ locale === 'tr' ? 'Ağ ve Ekosistem' : 'Network & Ecosystem' }}
            </h2>
            <ul role="list" class="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://explorer.kristalteknoloji.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg aria-hidden="true" class="w-4 h-4 text-coral-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.454-2.908a1.5 1.5 0 00-.281-1.731l-.772-.772a1 1 0 00-.707-.293h-.382a1 1 0 01-.707-.293l-1.121-1.121A1.5 1.5 0 018.713 6.5H10a1 1 0 00.707-.293l.854-.853A6.473 6.473 0 0116.5 10z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ t('explorer') }}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bedri/KristaTech-KRISTA/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg aria-hidden="true" class="w-4 h-4 text-cobalt-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <span>{{ t('downloadWallet') }}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bedri/KristaTech-KRISTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <svg aria-hidden="true" class="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>{{ t('github') }}</span>
                </a>
              </li>
              <li v-for="doc in documentsList.slice(6)" :key="doc.id">
                <a
                  :href="doc.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-slate-500 dark:text-slate-400 hover:text-cobalt-700 dark:hover:text-coral-300 transition-colors"
                >
                  {{ doc.title }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; 2026 {{ t('footerRights') }}</p>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#7695CD]"></span>
              <span class="font-mono">Krista Slate #7695CD</span>
            </span>
            <span class="text-slate-300 dark:text-slate-700">•</span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#F5897C]"></span>
              <span class="font-mono">Krista Coral #F5897C</span>
            </span>
          </div>
        </div>
      </UContainer>
    </footer>
  </div>
</template>
