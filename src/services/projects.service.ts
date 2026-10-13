import type { Project, ProjectDivision } from '@/types/project.types'
import { projectsMock } from '@/data/projects.mock'
import { delay } from './delay'

export interface ProjectsFilter {
  division?: ProjectDivision
}

export async function getProjects(filter?: ProjectsFilter): Promise<Project[]> {
  await delay()
  if (filter?.division) {
    return projectsMock.filter((p) => p.division === filter.division)
  }
  return projectsMock
}

export async function getProjectById(id: string): Promise<Project | null> {
  await delay()
  return projectsMock.find((p) => p.id === id) ?? null
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await delay()
  return projectsMock.find((p) => p.slug === slug) ?? null
}
