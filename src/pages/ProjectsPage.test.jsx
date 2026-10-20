import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProjectsPage from './ProjectsPage.jsx'

describe('ProjectsPage', () => {
  it('shows the verified-data banner and projects grid', () => {
    render(<MemoryRouter initialEntries={['/projects']}><Routes><Route path="/projects" element={<ProjectsPage />} /></Routes></MemoryRouter>)
    expect(screen.getByText('Project information is being verified.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Projects, with purpose.' })).toBeInTheDocument()
  })

  it('renders projects according to the initialStatus route', () => {
    render(<MemoryRouter initialEntries={['/projects/ongoing']}><Routes><Route path="/projects/ongoing" element={<ProjectsPage initialStatus="Ongoing" />} /></Routes></MemoryRouter>)
    expect(screen.getByText('Ongoing Developments')).toBeInTheDocument()
  })
})

