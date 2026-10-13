import { useQuery } from '@tanstack/react-query'
import { getProjectById, getProjects, type ProjectsFilter } from '@/services/projects.service'

export function useProjects(filter?: ProjectsFilter) {
  return useQuery({
    queryKey: ['projects', filter?.division],
    queryFn: () => getProjects(filter),
  })
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id as string),
    enabled: Boolean(id),
  })
}
