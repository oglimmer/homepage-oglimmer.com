import { describe, expect, it } from 'vitest'
import { projects, legacyProjects, type Project } from '../data/projects'

function findProject(title: string, list: Project[]): Project | undefined {
  return list.find(p => p.title === title)
}

describe('Data: ID5 IRL Attendance App project', () => {
  const irlPlannerProject = findProject('ID5 IRL Attendance App', projects)

  it('is present in the projects array', () => {
    expect(irlPlannerProject !== undefined).toBe(true)
  })

  it('has the correct title', () => {
    expect(irlPlannerProject!.title).toBe('ID5 IRL Attendance App')
  })

  it('has two links', () => {
    expect(irlPlannerProject!.linkData.length).toBe(2)
  })

  it('has the Web link to irl-planner.oglimmer.com', () => {
    const webLink = irlPlannerProject!.linkData.find(([, label]) => label === 'Web')
    expect(webLink !== undefined).toBe(true)
    expect(webLink![0]).toBe('https://irl-planner.oglimmer.com/')
  })

  it('has the source code link to the GitHub repo', () => {
    const sourceLink = irlPlannerProject!.linkData.find(([, label]) => label === 'source code')
    expect(sourceLink !== undefined).toBe(true)
    expect(sourceLink![0]).toBe('https://github.com/oglimmer/irl-planner-pro')
  })

  it('lists the technologies from the repository', () => {
    expect(irlPlannerProject!.techList).toBe('[Go, Vue, TypeScript, Shell, CSS, Go Template]')
  })

  it('mentions Google SSO, offsites, and conditional logic in the description', () => {
    const text = irlPlannerProject!.text
    expect(text.includes('Google SSO')).toBe(true)
    expect(text.includes('offsites')).toBe(true)
    expect(text.includes('conditional logic')).toBe(true)
  })
})

describe('Data: coding-agent project', () => {
  const codingAgentProject = findProject('Coding Agent - Self-Service Feature Development Platform', projects)

  it('is present in the projects array', () => {
    expect(codingAgentProject !== undefined).toBe(true)
  })

  it('has the correct title', () => {
    expect(codingAgentProject!.title).toBe('Coding Agent - Self-Service Feature Development Platform')
  })

  it('has two links', () => {
    expect(codingAgentProject!.linkData.length).toBe(2)
  })

  it('has the Web link to coding-agent.oglimmer.com', () => {
    const webLink = codingAgentProject!.linkData.find(([, label]) => label === 'Web')
    expect(webLink !== undefined).toBe(true)
    expect(webLink![0]).toBe('https://coding-agent.oglimmer.com/')
  })

  it('has the source code link to the GitHub repo', () => {
    const sourceLink = codingAgentProject!.linkData.find(([, label]) => label === 'source code')
    expect(sourceLink !== undefined).toBe(true)
    expect(sourceLink![0]).toBe('https://github.com/oglimmer/coding-agent')
  })

  it('lists the technologies from the repository', () => {
    expect(codingAgentProject!.techList).toBe('[Go, Shell, Vue, TypeScript, Docker, CSS]')
  })

  it('mentions autonomous coding agent, PR, and auto-merge in the description', () => {
    const text = codingAgentProject!.text
    expect(text.includes('autonomous coding agent')).toBe(true)
    expect(text.includes('pull request')).toBe(true)
    expect(text.includes('auto-merge')).toBe(true)
  })
})

describe('Data: all projects have required fields', () => {
  const allProjects = [...projects, ...legacyProjects]

  it('every project has a non-empty title', () => {
    for (const p of allProjects) {
      expect(p.title.length > 0).toBe(true)
    }
  })

  it('every project has a non-empty text', () => {
    for (const p of allProjects) {
      expect(p.text.length > 0).toBe(true)
    }
  })

  it('every project has at least one link', () => {
    for (const p of allProjects) {
      expect(p.linkData.length > 0).toBe(true)
    }
  })
})
