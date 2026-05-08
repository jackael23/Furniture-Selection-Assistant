<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Motion, Presence } from '@motionone/vue'
import { 
  Sparkles, 
  Trash2, 
  Save,
  FolderOpen,
  X
} from 'lucide-vue-next'
import { ROOMS, OPTIONS } from './constants'

const activeRoom = ref('kitchen')
const activeCategory = ref(null)
const selections = ref({
  kitchen: {},
  bathroom: {},
  'living-room': {},
  bedroom: {},
  laundry: {},
})
const isGenerating = ref(false)
const analysis = ref(null)

// Project Persistence
const savedProjects = ref([])
const showProjectsModal = ref(false)
const showSaveModal = ref(false)
const newProjectName = ref('')
const projectNameError = ref('')
const saveStatus = ref(null) // 'saving' | 'success' | null

onMounted(() => {
  const stored = localStorage.getItem('studio_moderne_projects')
  if (stored) {
    try {
      savedProjects.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse projects', e)
    }
  }
})

const openSaveModal = () => {
  newProjectName.value = `Untitled Design - ${new Date().toLocaleDateString()}`
  projectNameError.value = ''
  showSaveModal.value = true
}

const confirmSave = () => {
  projectNameError.value = ''
  const trimmedName = newProjectName.value.trim()

  if (!trimmedName) {
    projectNameError.value = 'Please enter a project name'
    return
  }

  const existingIndex = savedProjects.value.findIndex(p => p.name.toLowerCase() === trimmedName.toLowerCase())
  
  if (existingIndex !== -1) {
    if (!confirm('This project name already exists. Do you want to overwrite it?')) {
      return
    }
  }

  saveStatus.value = 'saving'
  
  setTimeout(() => {
    const projectData = {
      name: newProjectName.value,
      date: new Date().toLocaleDateString(),
      activeRoom: activeRoom.value,
      selections: JSON.parse(JSON.stringify(selections.value))
    }

    if (existingIndex !== -1) {
      savedProjects.value[existingIndex] = { ...savedProjects.value[existingIndex], ...projectData }
    } else {
      savedProjects.value.unshift({ id: Date.now().toString(), ...projectData })
    }

    localStorage.setItem('studio_moderne_projects', JSON.stringify(savedProjects.value))
    
    saveStatus.value = 'success'
    setTimeout(() => {
      showSaveModal.value = false
      saveStatus.value = null
    }, 1500)
  }, 600)
}

const loadProject = (project) => {
  selections.value = JSON.parse(JSON.stringify(project.selections))
  activeRoom.value = project.activeRoom
  analysis.value = null
  showProjectsModal.value = false
}

const deleteProject = (id) => {
  savedProjects.value = savedProjects.value.filter(p => p.id !== id)
  localStorage.setItem('studio_moderne_projects', JSON.stringify(savedProjects.value))
}

const currentRoomConfig = computed(() => {
  return ROOMS.find(r => r.id === activeRoom.value)
})

const currentSelections = computed(() => {
  return selections.value[activeRoom.value]
})

const totalPrice = computed(() => {
  let total = 0
  const cats = currentRoomConfig.value?.allowedCategories || []
  cats.forEach(cat => {
    const id = currentSelections.value[cat]
    if (id) {
      const opt = OPTIONS[cat].find(o => o.id === id)
      if (opt && opt.basePrice) total += opt.basePrice
    }
  })
  return total
})

// Set initial category when room changes
watch(activeRoom, (newRoom) => {
  const config = ROOMS.find(r => r.id === newRoom)
  if (config) {
    activeCategory.value = config.allowedCategories[0]
  }
}, { immediate: true })

const handleSelect = (category, optionId) => {
  selections.value[activeRoom.value][category] = optionId
  analysis.value = null
}

const clearSelections = () => {
  selections.value[activeRoom.value] = {}
  analysis.value = null
}

const generateAIInsight = () => {
  isGenerating.value = true
  
  setTimeout(() => {
    const selectedOptions = []
    const cats = currentRoomConfig.value.allowedCategories
    
    cats.forEach(cat => {
      const id = currentSelections.value[cat]
      if (id) {
        const opt = OPTIONS[cat].find(o => o.id === id)
        if (opt) selectedOptions.push(opt)
      }
    })

    const warnings = []
    const suggestions = []
    
    const missing = cats.filter(c => !currentSelections.value[c])
    if (missing.length > 0) {
      warnings.push(`Incomplete: ${missing.length} items still need selection.`)
    }

    const hasMarble = selectedOptions.some(o => o.id === 'f-marble')
    if (hasMarble) warnings.push("Marble requires high maintenance and regular sealing.")

    // Palette Logic
    const flooring = selectedOptions.find(o => cats.indexOf('flooring') !== -1 && OPTIONS['flooring'].some(opt => opt.id === o.id))
    const wall = selectedOptions.find(o => cats.indexOf('wall-finish') !== -1 && OPTIONS['wall-finish'].some(opt => opt.id === o.id))

    const isFlooringDark = flooring?.tags.includes('dark')
    const isWallDark = wall?.tags.includes('dark')

    if (isFlooringDark && isWallDark) {
      warnings.push("High contrast risk: Both flooring and walls are dark.")
      suggestions.push("Balance the space with bright cabinetry or high-lumen lighting to prevent a claustrophobic feel.")
    }

    // Lighting check
    const lighting = selectedOptions.find(o => o.id.startsWith('l-'))
    if (lighting?.tags.includes('bright') && selectedOptions.some(o => o.tags.includes('bright'))) {
      suggestions.push("Brilliant choice. The bright lighting complements your light finishes perfectly.")
    }

    const hasHighTier = selectedOptions.filter(o => o.priceLevel === 'high').length
    if (hasHighTier >= 3) {
      suggestions.push("Luxury heavy selection. Ensure your contractor is experienced with premium material handling.")
    }
    
    const costSum = selectedOptions.reduce((acc, curr) => {
      if (curr.priceLevel === 'high') return acc + 3
      if (curr.priceLevel === 'medium') return acc + 2
      return acc + 1
    }, 0)
    
    const avgCost = costSum / (selectedOptions.length || 1)
    const costProfile = avgCost > 2.2 ? 'high' : avgCost > 1.5 ? 'medium' : 'low'

    // Detailed labor intensity logic
    const laborIntenseCount = selectedOptions.filter(o => 
      o.id.includes('marble') || 
      o.id.includes('granite') || 
      o.id.includes('brick') || 
      o.id.includes('walnut') ||
      o.id.includes('oak')
    ).length

    const laborProfile = laborIntenseCount >= 2 ? 'high' : laborIntenseCount >= 1 ? 'medium' : 'low'
    
    const laborInfo = laborProfile === 'high' 
      ? "Expert craftsmanship required for heavy natural materials." 
      : laborProfile === 'medium' 
      ? "Standard trade rates apply for your material mix." 
      : "Turnkey-friendly selections with simplified installation."

    const materialInfo = costProfile === 'high'
      ? "Premium sourcing from specialty suppliers identified."
      : costProfile === 'medium'
      ? "Standard commercial availability with mid-tier pricing."
      : "Cost-effective solutions optimized for efficient budgeting."

    analysis.value = {
      summary: `A ${costProfile}-tier design ensemble. ${isFlooringDark && isWallDark ? 'The moody palette' : 'The selected combination'} reflects a bold, ${hasHighTier > 1 ? 'curated' : 'modern'} aesthetic.`,
      costProfile,
      warnings,
      suggestions: suggestions.length > 0 ? suggestions : ["Your current selections are well-balanced for an elegant aesthetic."],
      costBreakdown: {
        materials: { level: costProfile, info: materialInfo },
        labor: { level: laborProfile, info: laborInfo }
      }
    }
    isGenerating.value = false
  }, 1200)
}

watch(newProjectName, (val) => {
  if (val.trim()) projectNameError.value = ''
})
</script>

<template>
  <div class="h-screen flex flex-col bg-bg-studio text-text-studio font-sans selection:bg-brand/20">
    <!-- Header -->
    <header class="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bottom-border bg-white shrink-0">
      <div class="flex items-center gap-4">
        <span class="text-lg md:text-xl font-light tracking-[0.1em] md:tracking-[0.2em] text-text-studio">
          STUDIO <span class="font-bold text-brand">MODERNE</span>
        </span>
      </div>
      <div class="flex items-center gap-4 md:gap-8 text-[9px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-neutral-400 font-bold">
        <div 
          class="flex items-center gap-2 hover:text-text-studio cursor-pointer transition-colors"
          @click="showProjectsModal = !showProjectsModal"
        >
          <FolderOpen class="w-3 h-3 md:w-3.5 md:h-3.5" />
          <span class="hidden sm:inline">Projects ({{ savedProjects.length }})</span>
          <span class="sm:hidden">({{ savedProjects.length }})</span>
        </div>
        <span class="text-text-studio border-b-2 border-brand pb-1">Configurator</span>
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row overflow-hidden relative">
      <!-- Left Sidebar -->
      <nav class="w-full md:w-64 sidebar-border flex flex-col p-4 md:p-8 gap-4 md:gap-10 shrink-0 overflow-y-auto bg-white border-b md:border-b-0 md:border-r z-10">
        <section class="relative">
          <h3 class="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-3 md:mb-6 font-black">Room Selection</h3>
          <div class="relative group">
            <div class="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide snap-x">
              <button
                v-for="room in ROOMS"
                :key="room.id"
                :id="'room-' + room.id"
                :class="[
                  'whitespace-nowrap px-4 py-2 md:py-3 rounded text-[10px] md:text-[11px] uppercase tracking-widest transition-all snap-start',
                  activeRoom === room.id 
                    ? 'bg-text-studio text-white font-bold shadow-lg shadow-black/5' 
                    : 'text-neutral-400 hover:bg-neutral-50 hover:text-text-studio'
                ]"
                @click="activeRoom = room.id; analysis = null"
              >
                {{ room.name }}
              </button>
            </div>
            <!-- Mobile scroll fade -->
            <div class="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
          </div>
        </section>

        <section v-if="currentRoomConfig" class="relative">
          <h3 class="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400 mb-3 md:mb-6 font-black">Categories</h3>
          <div class="relative">
            <div class="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide snap-x">
              <button
                v-for="cat in currentRoomConfig.allowedCategories"
                :key="cat"
                :id="'cat-' + cat"
                :class="[
                  'whitespace-nowrap px-4 py-2 md:py-3 rounded text-[10px] md:text-[11px] uppercase tracking-widest transition-all border-b-2 md:border-b-0 md:border-l-2 snap-start',
                  activeCategory === cat 
                    ? 'bg-neutral-50 text-brand border-brand font-bold' 
                    : 'text-neutral-400 border-transparent hover:bg-neutral-50'
                ]"
                @click="activeCategory = cat"
              >
                {{ cat.replace('-', ' ') }}
              </button>
            </div>
            <!-- Mobile scroll fade -->
            <div class="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
          </div>
        </section>

        <button 
          @click="clearSelections"
          class="mt-4 md:mt-auto flex items-center justify-center md:justify-start gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors font-bold pt-4 md:pt-6 border-t border-neutral-100"
        >
          <Trash2 class="w-3 h-3" />
          Clear Layout
        </button>
      </nav>

      <!-- Content Area -->
      <section class="flex-1 p-6 md:p-16 overflow-y-auto bg-bg-studio pb-32 md:pb-16">
        <div class="max-w-5xl mx-auto">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8 md:mb-16">
            <h1 class="text-3xl md:text-5xl font-light tracking-tight text-text-studio capitalize">
              {{ activeCategory?.replace('-', ' ') }} <span class="text-neutral-300 font-thin italic lowercase block sm:inline">/ finish</span>
            </h1>
            <span class="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-400 font-black">
              {{ activeCategory ? OPTIONS[activeCategory].length : 0 }} CURATED SAMPLES
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <template v-if="activeCategory">
              <button
                v-for="option in OPTIONS[activeCategory]"
                :key="option.id"
                :class="[
                  'bg-white p-4 rounded-xl shadow-sm border border-neutral-100 transition-all group text-left',
                  currentSelections[activeCategory] === option.id ? 'swatch-active ring-4 ring-brand/5' : 'hover:shadow-xl hover:-translate-y-1'
                ]"
                @click="handleSelect(activeCategory, option.id)"
              >
                <div class="aspect-[4/5] bg-neutral-50 rounded-lg mb-5 overflow-hidden relative shadow-inner">
                  <img 
                    :src="option.imageUrl" 
                    :alt="option.name"
                    referrerPolicy="no-referrer"
                    :class="[
                      'w-full h-full object-cover transition-transform duration-700 group-hover:scale-105',
                      currentSelections[activeCategory] === option.id ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    ]"
                  >
                  <div :class="['absolute inset-0 transition-opacity', currentSelections[activeCategory] === option.id ? 'bg-brand/5' : 'bg-transparent']" />
                  <div 
                    v-if="currentSelections[activeCategory] === option.id"
                    class="absolute top-4 right-4 w-7 h-7 bg-brand rounded-full flex items-center justify-center shadow-2xl border-2 border-white"
                  >
                    <Sparkles class="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div class="px-1 pb-1">
                  <p class="text-xs font-black text-text-studio uppercase tracking-widest mb-2 truncate">
                    {{ option.name }}
                  </p>
                  <div class="flex justify-between items-center">
                    <p class="text-[9px] text-neutral-400 uppercase tracking-[0.15em] font-bold">
                      {{ option.tags[0] }} • {{ option.tags[1] || 'Premium' }}
                    </p>
                    <span class="text-[10px] text-brand font-bold uppercase">
                      {{ option.priceLevel }}
                    </span>
                  </div>
                </div>
              </button>
            </template>
          </div>
        </div>
      </section>

      <!-- Right Sidebar -->
      <aside v-if="currentRoomConfig" class="w-full md:w-80 sidebar-border bg-white flex flex-col shrink-0 overflow-y-auto md:overflow-hidden shadow-2xl border-t md:border-t-0 md:border-l pb-32 md:pb-0">
        <div class="p-6 md:p-10 flex-1 md:overflow-y-auto">
          <h2 class="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 md:mb-10 font-black">Spec Sheet</h2>
          
          <div class="space-y-6 md:space-y-8">
            <div class="flex justify-between items-start">
              <div class="text-[10px]">
                <p class="text-neutral-400 uppercase tracking-widest mb-1 md:mb-2 font-bold italic">Context</p>
                <p class="text-text-studio font-bold text-sm md:text-base tracking-tight capitalize">{{ activeRoom.replace('-', ' ') }}</p>
              </div>
            </div>

            <div class="h-px bg-neutral-100" />

            <div class="space-y-4 md:space-y-6">
              <div v-for="cat in currentRoomConfig.allowedCategories" :key="cat" class="flex justify-between items-start group">
                <div class="text-[10px] flex-1">
                  <p class="text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">{{ cat.replace('-', ' ') }}</p>
                  <p :class="[
                    'text-[11px] font-bold tracking-wide',
                    currentSelections[cat] ? 'text-text-studio' : 'text-neutral-200 uppercase tracking-widest'
                  ]">
                    {{ (OPTIONS[cat].find(o => o.id === currentSelections[cat]))?.name || 'Unspecified' }}
                  </p>
                </div>
                <div class="text-[10px] text-right ml-4">
                  <p v-if="currentSelections[cat]" class="text-neutral-400 font-bold">
                    ₱{{ (OPTIONS[cat].find(o => o.id === currentSelections[cat]))?.basePrice.toLocaleString() }}
                  </p>
                  <div v-if="currentSelections[cat]" class="w-1.5 h-1.5 rounded-full bg-brand mt-1 inline-block" />
                </div>
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-neutral-100">
              <div class="flex justify-between items-center bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                <div class="text-[10px]">
                  <p class="text-neutral-400 uppercase tracking-widest mb-1 font-bold">Estimated Budget</p>
                  <p class="text-2xl font-black tracking-tight text-text-studio">
                    ₱{{ totalPrice.toLocaleString() }}
                  </p>
                </div>
                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span class="text-[10px] font-black text-brand">₱</span>
                </div>
              </div>
            </div>

            <!-- AI Section -->
            <div class="mt-8 md:mt-16 pt-6 md:pt-10 border-t border-neutral-100">
              <Presence exit-before-enter>
                <Motion
                  v-if="analysis"
                  key="analysis"
                  :initial="{ opacity: 0, scale: 0.95 }"
                  :animate="{ opacity: 1, scale: 1 }"
                  :exit="{ opacity: 0, scale: 0.95 }"
                  class="p-4 md:p-6 rounded-2xl bg-brand/5 border border-brand/10 relative overflow-hidden"
                >
                  <div class="flex items-center gap-2 mb-4 md:mb-5">
                    <div class="w-2 h-2 rounded-full bg-brand" />
                    <h4 class="text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] text-brand">
                      AI Narrative
                    </h4>
                  </div>
                  
                  <div class="space-y-4 md:space-y-5">
                    <p class="text-[10px] md:text-[11px] leading-relaxed text-text-studio font-medium italic opacity-80">
                      "{{ analysis.summary }}"
                    </p>
                    
                    <div v-if="analysis.warnings.length > 0" class="space-y-2 md:space-y-3">
                      <div v-for="(w, i) in analysis.warnings" :key="i" class="text-[9px] md:text-[10px] leading-relaxed text-red-500 font-bold uppercase tracking-widest border-l-2 border-red-500 pl-3">
                        {{ w }}
                      </div>
                    </div>

                    <div v-if="analysis.costBreakdown" class="grid grid-cols-2 gap-4 md:gap-6 border-y border-brand/10 py-4 md:py-5">
                      <div class="space-y-1">
                        <span class="text-[8px] uppercase tracking-[0.2em] text-neutral-400 font-black">Materials</span>
                        <p class="text-[9px] md:text-[10px] font-black text-text-studio uppercase tracking-widest">
                          {{ analysis.costBreakdown.materials.level }}
                        </p>
                        <p class="text-[8px] md:text-[9px] leading-tight text-neutral-400 italic">
                          {{ analysis.costBreakdown.materials.info }}
                        </p>
                      </div>
                      <div class="space-y-1">
                        <span class="text-[8px] uppercase tracking-[0.2em] text-neutral-400 font-black">Labor</span>
                        <p class="text-[9px] md:text-[10px] font-black text-text-studio uppercase tracking-widest">
                          {{ analysis.costBreakdown.labor.level }}
                        </p>
                        <p class="text-[8px] md:text-[9px] leading-tight text-neutral-400 italic">
                          {{ analysis.costBreakdown.labor.info }}
                        </p>
                      </div>
                    </div>

                    <div class="text-[9px] md:text-[10px] text-neutral-400 leading-relaxed tracking-widest">
                      <span class="text-brand font-black block mb-1 md:mb-2 uppercase">Refinement:</span>
                      {{ analysis.suggestions[0] }}
                    </div>
                  </div>
                </Motion>
                <Motion
                  v-else
                  key="empty"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0 }"
                  class="p-6 md:p-10 border-2 border-dashed border-neutral-100 rounded-2xl text-center"
                >
                  <Sparkles class="w-4 h-4 md:w-5 md:h-5 text-neutral-200 mx-auto mb-3 md:mb-4" />
                  <p class="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-black">
                    Run Analysis
                  </p>
                </Motion>
              </Presence>
            </div>
          </div>
        </div>

        <div class="hidden md:flex p-8 bg-neutral-50 flex-col gap-4 border-t border-neutral-100 uppercase">
          <button
            :disabled="isGenerating"
            class="w-full bg-text-studio text-white text-[11px] font-black py-5 tracking-[0.4em] hover:bg-brand transition-all disabled:opacity-30 shadow-xl shadow-black/10 cursor-pointer"
            @click="generateAIInsight"
          >
            {{ isGenerating ? 'Curating...' : 'Analyze Design' }}
          </button>
          <button
            class="w-full border border-neutral-200 text-text-studio text-[10px] font-black py-5 tracking-[0.4em] hover:bg-white transition-all flex items-center justify-center gap-2"
            @click="openSaveModal"
          >
            <Save class="w-3 h-3" />
            Save Design
          </button>
        </div>
      </aside>

      <!-- Sticky Mobile Footer Actions -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-neutral-100 flex gap-3 md:hidden z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        <button
          :disabled="isGenerating"
          class="flex-1 bg-text-studio text-white text-[10px] font-black uppercase py-4 tracking-[0.2em] rounded-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          @click="generateAIInsight"
        >
          <Sparkles class="w-3 h-3" />
          {{ isGenerating ? '...' : 'Analyze' }}
        </button>
        <button
          class="flex-1 border border-neutral-200 text-text-studio text-[10px] font-black uppercase py-4 tracking-[0.2em] rounded-lg bg-white active:scale-95 transition-all flex items-center justify-center gap-2"
          @click="openSaveModal"
        >
          <Save class="w-3 h-3" />
          Save
        </button>
      </div>
    </main>

    <!-- Projects Modal -->
    <Presence>
      <Motion
        v-if="showProjectsModal"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="showProjectsModal = false"
      >
        <Motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div class="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h2 class="text-xl font-light tracking-tight text-text-studio">Saved <span class="font-bold">Projects</span></h2>
              <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Design Archive</p>
            </div>
            <button 
              @click="showProjectsModal = false"
              class="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X class="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-8">
            <div v-if="savedProjects.length === 0" class="py-20 text-center">
              <FolderOpen class="w-12 h-12 text-neutral-100 mx-auto mb-4" />
              <p class="text-sm font-medium text-neutral-300 uppercase tracking-widest">No saved designs yet</p>
              <button 
                @click="showProjectsModal = false"
                class="mt-6 text-[10px] font-black text-brand uppercase tracking-[0.2em] hover:underline"
              >
                Start a New Project
              </button>
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
              <div 
                v-for="project in savedProjects" 
                :key="project.id"
                class="flex items-center justify-between p-6 rounded-xl border border-neutral-100 hover:border-brand/30 hover:shadow-lg transition-all group"
              >
                <div @click="loadProject(project)" class="flex-1 cursor-pointer">
                  <h3 class="text-xs font-black uppercase tracking-widest text-text-studio mb-1 group-hover:text-brand transition-colors">
                    {{ project.name }}
                  </h3>
                  <div class="flex items-center gap-3 text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">
                    <span>{{ project.date }}</span>
                    <span class="w-1 h-1 rounded-full bg-neutral-200" />
                    <span>{{ project.activeRoom }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    @click.stop="loadProject(project)"
                    class="px-4 py-2 bg-neutral-50 text-text-studio text-[9px] font-black uppercase tracking-widest rounded hover:bg-brand hover:text-white transition-all shadow-sm"
                  >
                    Open
                  </button>
                  <button 
                    @click.stop="deleteProject(project.id)"
                    class="px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded text-neutral-200 hover:text-red-500"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Motion>
      </Motion>
    </Presence>

    <!-- Save Modal -->
    <Presence>
      <Motion
        v-if="showSaveModal"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        @click.self="showSaveModal = false"
      >
        <Motion
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: 20 }"
          class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        >
          <div class="p-8 pb-4">
            <h2 class="text-xl font-light text-text-studio">Save <span class="font-bold">Design</span></h2>
            <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Design Archive</p>
          </div>
          
          <div class="p-8 pt-4 space-y-6">
            <div class="space-y-2">
              <label class="text-[9px] uppercase tracking-widest text-neutral-400 font-black">Project Name</label>
              <input 
                v-model="newProjectName"
                type="text" 
                :class="[
                  'w-full bg-neutral-50 border rounded-lg px-4 py-3 text-xs font-bold text-text-studio focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all',
                  projectNameError ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' : 'border-neutral-100 focus:border-brand/40 focus:ring-brand/20'
                ]"
                placeholder="Ex: Modern Minimalist Kitchen"
                @keyup.enter="confirmSave"
              >
              <Presence>
                <Motion
                  v-if="projectNameError"
                  :initial="{ opacity: 0, y: -10 }"
                  :animate="{ opacity: 1, y: 0 }"
                  :exit="{ opacity: 0, y: -10 }"
                  class="text-[9px] font-bold text-red-500 uppercase tracking-widest pl-1"
                >
                  {{ projectNameError }}
                </Motion>
              </Presence>
            </div>

            <div class="flex gap-3 pt-4">
              <button 
                @click="showSaveModal = false"
                class="flex-1 px-6 py-4 border border-neutral-200 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] rounded hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
              <button 
                @click="confirmSave"
                :disabled="saveStatus === 'saving' || !newProjectName.trim()"
                :class="[
                  'flex-1 px-6 py-4 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded transition-all shadow-xl shadow-brand/10',
                  saveStatus === 'success' ? 'bg-green-500' : 'bg-brand'
                ]"
              >
                <template v-if="saveStatus === 'saving'">Syncing...</template>
                <template v-else-if="saveStatus === 'success'">Saved!</template>
                <template v-else>Confirm Save</template>
              </button>
            </div>
          </div>
        </Motion>
      </Motion>
    </Presence>
  </div>
</template>

<style>
@import "tailwindcss";

/* Base transitions and utility fixes */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Ensure smooth scrolling */
html, body {
  @apply overflow-hidden h-full;
}
</style>
