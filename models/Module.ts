export interface ModuleMaintainer {
  name: string
  avatarUrl: string | null
  username?: string
  urlKey: string
}
export interface Module {
  id: number
  name: string
  urlKey: string
  iconUrl?: string
  techname: string
  repository: {
    url: string
    name: string
    description: string
    category: {
      name: string
      urlKey: string
    }
  }
  serie: string
  version: string
  dependencies: string[]
  usedBy: string[]
  license: string
  summary: string
  mustHave: boolean
  maturity: string
  authors: ModuleAuthor[]
  publicURL: string
  runboatURL: string
  githubUrl: string
  readmeFragments: {
    description?: string
    configure?: string //
    context?: string //ModuleContext
    credits?: string
    history?: string
    install?: string //ModuleInstall
    roadmap?: string //ModuleRoadMap
    usage?: string //ModuleUsage
    contributors?: string //ModuleContributors
  }
  maintainers: ModuleMaintainers[]
  bugTracker: {
    url: string
    instructions: string
  }
  popularity: number
  lastUpdate: Date | null
}

export interface ModuleMaintainers {
  avatarUrl: string
  githubUser: string
  name: string
  urlKey: string
}

export interface ModuleAuthor {
  name: string
  urlKey: string
}
export interface ModuleGroupedHit {
  urlKey: string
  hits: ModuleWithHighlight[]
}

export interface ModuleWithHighlight extends Module {
  highlights: {
    field: string
    value: string
  }[]
}
export interface ModuleResult {
  hits: ModuleGroupedHit[]
  total: number
}