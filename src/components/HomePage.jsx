import { useState } from 'react'
import NewProjectModal from './NewProjectModal'

export default function HomePage({ projects, onOpenProject, onAddProject, onSignOut, darkMode, toggleDarkMode }) {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  const activeProjects = projects.filter(p => !p.status_checks?.klar)
  const completedProjects = projects.filter(p => p.status_checks?.klar)

  const getTotalTasks = () => {
    let total = 0, completed = 0
    projects.forEach(p => {
      if (p.tasks) {
        total += (p.tasks.todo?.length || 0) + (p.tasks.inProgress?.length || 0) + (p.tasks.done?.length || 0)
        completed += p.tasks.done?.length || 0
      }
    })
    return { total, completed }
  }

  const getCriticalRisks = () => {
    let count = 0
    projects.forEach(p => {
      count += (p.risks || []).filter(r => r.severity === 'hög').length
    })
    return count
  }

  const taskStats = getTotalTasks()
  const criticalRisks = getCriticalRisks()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EventFlow</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Projekthantering för eventbyråer</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title={darkMode ? 'Ljust läge' : 'Mörkt läge'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Nytt projekt
              </button>
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold dark:text-white">{activeProjects.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktiva projekt</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold dark:text-white">{taskStats.completed}/{taskStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uppgifter klara</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${criticalRisks > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <svg className={`w-6 h-6 ${criticalRisks > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold dark:text-white">{criticalRisks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kritiska risker</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Projects - FIRST */}
        {activeProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Aktiva projekt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />
              ))}
            </div>
          </section>
        )}

        {/* All Tasks Overview - SECOND */}
        {projects.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">📋 Alla uppgifter - översikt</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Todo */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Att göra</h3>
                <div className="space-y-2">
                  {projects.map(project =>
                    (project.tasks?.todo || []).map(task => (
                      <div key={task.id} className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600 text-sm">
                        <p className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">{project.name}</p>
                        <p className="dark:text-gray-200">{task.text}</p>
                      </div>
                    ))
                  )}
                  {projects.every(p => !p.tasks?.todo?.length) && (
                    <p className="text-sm text-gray-400 text-center py-4">Inga uppgifter</p>
                  )}
                </div>
              </div>

              {/* In Progress */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Pågående</h3>
                <div className="space-y-2">
                  {projects.map(project =>
                    (project.tasks?.inProgress || []).map(task => (
                      <div key={task.id} className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600 text-sm">
                        <p className="font-medium text-xs text-blue-600 dark:text-blue-400 mb-1">{project.name}</p>
                        <p className="dark:text-gray-200">{task.text}</p>
                      </div>
                    ))
                  )}
                  {projects.every(p => !p.tasks?.inProgress?.length) && (
                    <p className="text-sm text-gray-400 text-center py-4">Inga uppgifter</p>
                  )}
                </div>
              </div>

              {/* Done */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-green-700 dark:text-green-400">Klart</h3>
                <div className="space-y-2">
                  {projects.map(project =>
                    (project.tasks?.done || []).map(task => (
                      <div key={task.id} className="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600 text-sm">
                        <p className="font-medium text-xs text-green-600 dark:text-green-400 mb-1">{project.name}</p>
                        <p className="dark:text-gray-200">{task.text}</p>
                      </div>
                    ))
                  )}
                  {projects.every(p => !p.tasks?.done?.length) && (
                    <p className="text-sm text-gray-400 text-center py-4">Inga uppgifter</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Notes Overview - THIRD */}
        {projects.length > 0 && projects.some(p => p.notes?.length > 0) && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm mb-8">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">📝 Alla anteckningar</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {projects.map(project =>
                (project.notes || []).map(note => (
                  <div key={note.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-600">
                    <p className="font-medium text-xs text-blue-600 dark:text-blue-400 mb-1">{project.name}</p>
                    <p className="text-sm dark:text-gray-200">{note.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.timestamp).toLocaleString('sv-SE', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Completed Projects - FOURTH */}
        {completedProjects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-500 dark:text-gray-400">Avslutade projekt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
              {completedProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Inga projekt än</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Skapa ditt första projekt för att komma igång!
            </p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Skapa projekt
            </button>
          </div>
        )}
      </main>

      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)} 
          onAdd={(project) => {
            onAddProject(project)
            setShowNewProjectModal(false)
          }} 
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  const getStatusBadge = () => {
    if (project.status_checks?.klar) return <span className="status-badge status-klar">Klar</span>
    if (project.status_checks?.leverans) return <span className="status-badge status-leverans">Leverans</span>
    if (project.status_checks?.produktion) return <span className="status-badge status-produktion">Produktion</span>
    if (project.status_checks?.design) return <span className="status-badge status-design">Design</span>
    if (project.status_checks?.brief) return <span className="status-badge status-brief">Brief</span>
    return <span className="status-badge status-brief">Brief</span>
  }

  const totalTasks = (project.tasks?.todo?.length || 0) + (project.tasks?.inProgress?.length || 0) + (project.tasks?.done?.length || 0)
  const completedTasks = project.tasks?.done?.length || 0

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg dark:text-white">{project.name}</h3>
        {getStatusBadge()}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.client}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {new Date(project.end_date).toLocaleDateString('sv-SE')}
      </div>
      {totalTasks > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Framsteg</span>
            <span>{completedTasks}/{totalTasks}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}
      {(project.risks || []).some(r => r.severity === 'hög') && (
        <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Kritisk risk
        </div>
      )}
    </div>
  )
}
