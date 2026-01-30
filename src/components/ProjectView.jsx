import { useState, useEffect } from 'react'

export default function ProjectView({ project, onBack, onUpdate, onDelete }) {
  const [editedProject, setEditedProject] = useState({...project})
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    onUpdate(editedProject)
  }, [editedProject])

  const tabs = [
    { id: 'overview', label: 'Översikt', icon: '📋' },
    { id: 'tasks', label: 'Att göra', icon: '✓' },
    { id: 'risks', label: 'Risker', icon: '⚠️' },
    { id: 'production', label: 'Produktion', icon: '🏗️' },
    { id: 'brand', label: 'Varumärke', icon: '🎨' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">{project.name}</h1>
                <p className="text-sm text-gray-600">{project.client}</p>
              </div>
            </div>
            <button 
              onClick={() => onDelete(project.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Ta bort projekt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab project={editedProject} setProject={setEditedProject} />}
        {activeTab === 'tasks' && <ComingSoonTab name="Uppgifter" />}
        {activeTab === 'risks' && <ComingSoonTab name="Risker" />}
        {activeTab === 'production' && <ComingSoonTab name="Produktion" />}
        {activeTab === 'brand' && <ComingSoonTab name="Varumärke" />}
      </main>
    </div>
  )
}

function OverviewTab({ project, setProject }) {
  const updateField = (field, value) => {
    setProject({...project, [field]: value})
  }

  const updateStatusCheck = (status) => {
    setProject({
      ...project,
      status_checks: {...project.status_checks, [status]: !project.status_checks[status]}
    })
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">Tidsplan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input 
              type="date"
              value={project.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slut</label>
            <input 
              type="date"
              value={project.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">Status</h3>
        <div className="space-y-2">
          {['brief', 'design', 'produktion', 'leverans', 'klar'].map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
              <input 
                type="checkbox"
                checked={project.status_checks?.[status] || false}
                onChange={() => updateStatusCheck(status)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="capitalize font-medium">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">Projektinformation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Projektnamn</label>
            <input 
              type="text"
              value={project.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kund</label>
            <input 
              type="text"
              value={project.client}
              onChange={(e) => updateField('client', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nästa steg</label>
            <textarea 
              value={project.next_step || ''}
              onChange={(e) => updateField('next_step', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
              placeholder="Vad är nästa steg i projektet?"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tips:</strong> Fler funktioner som Uppgifter, Risker, Produktion och Varumärke kommer snart! 
          Din data sparas automatiskt i molnet.
        </p>
      </div>
    </div>
  )
}

function ComingSoonTab({ name }) {
  return (
    <div className="bg-white p-12 rounded-xl border text-center">
      <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">{name} - Kommer snart!</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Denna funktion är under utveckling. Grundfunktionaliteten fungerar redan - vi bygger ut mer funktioner kontinuerligt!
      </p>
    </div>
  )
}
