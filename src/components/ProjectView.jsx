import { useState, useEffect } from 'react'
import { compressImage } from '../App'

export default function ProjectView({ project, onBack, onUpdate, onDelete, darkMode, toggleDarkMode }) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold dark:text-white">{project.name}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.client}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                onClick={() => onDelete(project.id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                title="Ta bort projekt"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
        {activeTab === 'tasks' && <TasksTab project={editedProject} setProject={setEditedProject} />}
        {activeTab === 'risks' && <RisksTab project={editedProject} setProject={setEditedProject} />}
        {activeTab === 'production' && <ProductionTab project={editedProject} setProject={setEditedProject} />}
        {activeTab === 'brand' && <BrandTab project={editedProject} setProject={setEditedProject} />}

        {/* Shared Notes Section - Visible on all tabs */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">📝 Anteckningar</h3>
            <button
              onClick={() => {
                const newNote = {
                  id: Date.now().toString(),
                  text: '',
                  timestamp: new Date().toISOString()
                }
                setEditedProject({
                  ...editedProject,
                  notes: [...(editedProject.notes || []), newNote]
                })
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              + Lägg till anteckning
            </button>
          </div>

          <div className="space-y-3">
            {(editedProject.notes || []).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                Inga anteckningar än. Klicka på "+ Lägg till anteckning" för att lägga till.
              </p>
            ) : (
              (editedProject.notes || []).map(note => (
                <div key={note.id} className="border dark:border-gray-700 dark:bg-gray-800/50 rounded-lg p-4">
                  <textarea
                    value={note.text}
                    onChange={(e) => {
                      setEditedProject({
                        ...editedProject,
                        notes: editedProject.notes.map(n =>
                          n.id === note.id ? { ...n, text: e.target.value } : n
                        )
                      })
                    }}
                    placeholder="Skriv din anteckning här..."
                    className="w-full text-sm dark:text-gray-200 dark:bg-transparent bg-transparent border-0 outline-none resize-none min-h-[60px] placeholder-gray-400 dark:placeholder-gray-500"
                    rows={Math.max(2, (note.text || '').split('\n').length)}
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      📅 {new Date(note.timestamp).toLocaleString('sv-SE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('Är du säker på att du vill ta bort denna anteckning?')) {
                          setEditedProject({
                            ...editedProject,
                            notes: editedProject.notes.filter(n => n.id !== note.id)
                          })
                        }
                      }}
                      className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shared Links Section - Visible on all tabs */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">🔗 Länkar</h3>
            <button
              onClick={() => {
                const linkTitle = prompt('Ange länktitel:')
                if (linkTitle && linkTitle.trim()) {
                  const linkUrl = prompt('Ange URL:')
                  if (linkUrl && linkUrl.trim()) {
                    const newLink = {
                      id: Date.now().toString(),
                      title: linkTitle.trim(),
                      url: linkUrl.trim(),
                      timestamp: new Date().toISOString()
                    }
                    setEditedProject({
                      ...editedProject,
                      links: [...(editedProject.links || []), newLink]
                    })
                  }
                }
              }}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              + Lägg till länk
            </button>
          </div>

          <div className="space-y-2">
            {(editedProject.links || []).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                Inga länkar än. Klicka på "+ Lägg till länk" för att lägga till.
              </p>
            ) : (
              (editedProject.links || []).map(link => (
                <div key={link.id} className="flex items-center justify-between border dark:border-gray-700 dark:bg-gray-800/50 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline flex-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-sm font-medium">{link.title}</span>
                  </a>
                  <button
                    onClick={() => {
                      if (confirm('Är du säker på att du vill ta bort denna länk?')) {
                        setEditedProject({
                          ...editedProject,
                          links: editedProject.links.filter(l => l.id !== link.id)
                        })
                      }
                    }}
                    className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-2"
                  >
                    Ta bort
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shared Files Section - Visible on all tabs */}
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold dark:text-white">📎 Bilder & Filer</h3>
            <div>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const isPdf = file.type === 'application/pdf'
                    let fileData
                    if (isPdf) {
                      fileData = await new Promise((resolve) => {
                        const reader = new FileReader()
                        reader.onload = (ev) => resolve(ev.target.result)
                        reader.readAsDataURL(file)
                      })
                    } else {
                      fileData = await compressImage(file)
                    }
                    setEditedProject({
                      ...editedProject,
                      shared_images: [...(editedProject.shared_images || []), {
                        id: Date.now().toString(),
                        image: fileData,
                        caption: isPdf ? file.name : '',
                        type: isPdf ? 'pdf' : 'image',
                        timestamp: new Date().toISOString()
                      }]
                    })
                  }
                }}
                className="hidden"
                id="shared-image-upload"
              />
              <label
                htmlFor="shared-image-upload"
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                + Lägg till bild/PDF
              </label>
            </div>
          </div>

          {(editedProject.shared_images || []).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              Inga filer än. Klicka på "+ Lägg till bild/PDF" för att ladda upp.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(editedProject.shared_images || []).map(img => (
                <div key={img.id} className="group relative border dark:border-gray-700 rounded-lg overflow-hidden">
                  {img.type === 'pdf' ? (
                    <a
                      href={img.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center w-full h-48 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition cursor-pointer"
                    >
                      <svg className="w-12 h-12 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">PDF</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 text-center truncate max-w-full">{img.caption || 'dokument.pdf'}</span>
                    </a>
                  ) : (
                    <img
                      src={img.image}
                      alt={img.caption || 'Bild'}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-2">
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => {
                        setEditedProject({
                          ...editedProject,
                          shared_images: editedProject.shared_images.map(i =>
                            i.id === img.id ? { ...i, caption: e.target.value } : i
                          )
                        })
                      }}
                      placeholder={img.type === 'pdf' ? 'Filnamn...' : 'Bildtext...'}
                      className="w-full text-xs dark:text-gray-200 dark:bg-transparent bg-transparent border-0 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Är du säker på att du vill ta bort denna fil?')) {
                        setEditedProject({
                          ...editedProject,
                          shared_images: editedProject.shared_images.filter(i => i.id !== img.id)
                        })
                      }
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Tidsplan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Start</label>
            <input 
              type="date"
              value={project.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Slut</label>
            <input 
              type="date"
              value={project.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Status</h3>
        <div className="space-y-2">
          {['brief', 'design', 'produktion', 'leverans', 'klar'].map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <input
                type="checkbox"
                checked={project.status_checks?.[status] || false}
                onChange={() => updateStatusCheck(status)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="capitalize font-medium dark:text-gray-200">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Projektinformation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Projektnamn</label>
            <input 
              type="text"
              value={project.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">Kund</label>
            <input 
              type="text"
              value={project.client}
              onChange={(e) => updateField('client', e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Venues/Lokaler */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold dark:text-white">📍 Lokaler</h3>
          <button
            onClick={() => {
              const newVenue = {
                id: Date.now().toString(),
                name: '',
                measurements: '',
                image: null
              }
              setProject({
                ...project,
                venues: [...(project.venues || []), newVenue]
              })
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            + Lägg till lokal
          </button>
        </div>

        <div className="space-y-4">
          {(project.venues || []).length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Inga lokaler tillagda än. Klicka på "+ Lägg till lokal" för att lägga till.</p>
          ) : (
            (project.venues || []).map(venue => (
              <div key={venue.id} className="border dark:border-gray-700 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium dark:text-gray-300 mb-1">Lokalnamn</label>
                      <input
                        type="text"
                        value={venue.name}
                        onChange={(e) => {
                          setProject({
                            ...project,
                            venues: project.venues.map(v =>
                              v.id === venue.id ? { ...v, name: e.target.value } : v
                            )
                          })
                        }}
                        className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
                        placeholder="T.ex. Huvudsalen, Entré..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium dark:text-gray-300 mb-1">Mått</label>
                      <input
                        type="text"
                        value={venue.measurements}
                        onChange={(e) => {
                          setProject({
                            ...project,
                            venues: project.venues.map(v =>
                              v.id === venue.id ? { ...v, measurements: e.target.value } : v
                            )
                          })
                        }}
                        className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
                        placeholder="T.ex. 12m x 8m x 3.5m höjd"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-gray-300 mb-1">Bild</label>
                    {venue.image ? (
                      <div className="relative">
                        <img
                          src={venue.image}
                          alt={venue.name || 'Lokal'}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => {
                            setProject({
                              ...project,
                              venues: project.venues.map(v =>
                                v.id === venue.id ? { ...v, image: null } : v
                              )
                            })
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500">Klicka för att ladda upp bild</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const compressed = await compressImage(file)
                              setProject({
                                ...project,
                                venues: project.venues.map(v =>
                                  v.id === venue.id ? { ...v, image: compressed } : v
                                )
                              })
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Är du säker på att du vill ta bort denna lokal?')) {
                      setProject({
                        ...project,
                        venues: project.venues.filter(v => v.id !== venue.id)
                      })
                    }
                  }}
                  className="mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-800"
                >
                  Ta bort lokal
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border dark:border-gray-700 border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          💡 <strong>Tips:</strong> Din data sparas automatiskt i molnet.
        </p>
      </div>
    </div>
  )
}

function TasksTab({ project, setProject }) {
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('todo')
  const [draggedTask, setDraggedTask] = useState(null)

  const addTask = () => {
    if (!newTaskText.trim()) return

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      createdAt: new Date().toISOString()
    }

    const updatedTasks = {...project.tasks}
    updatedTasks[newTaskCategory] = [...(updatedTasks[newTaskCategory] || []), newTask]

    setProject({...project, tasks: updatedTasks})
    setNewTaskText('')
  }

  const moveTask = (taskId, fromCategory, toCategory) => {
    const updatedTasks = {...project.tasks}
    const task = updatedTasks[fromCategory].find(t => t.id === taskId)

    updatedTasks[fromCategory] = updatedTasks[fromCategory].filter(t => t.id !== taskId)
    updatedTasks[toCategory] = [...(updatedTasks[toCategory] || []), task]

    setProject({...project, tasks: updatedTasks})
  }

  const deleteTask = (taskId, category) => {
    const updatedTasks = {...project.tasks}
    updatedTasks[category] = updatedTasks[category].filter(t => t.id !== taskId)
    setProject({...project, tasks: updatedTasks})
  }

  const handleDragStart = (e, task, category) => {
    setDraggedTask({ task, fromCategory: category })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, toCategory) => {
    e.preventDefault()
    if (draggedTask && draggedTask.fromCategory !== toCategory) {
      moveTask(draggedTask.task.id, draggedTask.fromCategory, toCategory)
    }
    setDraggedTask(null)
  }

  const categories = [
    { id: 'todo', label: 'Att göra', color: 'bg-gray-100 dark:bg-gray-700/50' },
    { id: 'inProgress', label: 'Pågående', color: 'bg-blue-100 dark:bg-blue-900/20' },
    { id: 'done', label: 'Klart', color: 'bg-green-100 dark:bg-green-900/20' }
  ]

  return (
    <div className="space-y-6">
      {/* Add Task */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Lägg till uppgift</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Beskriv uppgiften..."
            className="flex-1 px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg"
          />
          <select
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg"
          >
            <option value="todo">Att göra</option>
            <option value="inProgress">Pågående</option>
            <option value="done">Klart</option>
          </select>
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lägg till
          </button>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            className={`${category.color} p-4 rounded-xl transition-all`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category.id)}
          >
            <h3 className="font-semibold dark:text-white mb-3">{category.label}</h3>
            <div className="space-y-2 min-h-[100px]">
              {(project.tasks?.[category.id] || []).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, category.id)}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border dark:border-gray-700 group cursor-move hover:shadow-md transition-all active:opacity-50"
                >
                  <p className="text-sm mb-2 dark:text-gray-200">{task.text}</p>
                  <div className="flex gap-1">
                    {category.id !== 'todo' && (
                      <button
                        onClick={() => moveTask(task.id, category.id, category.id === 'inProgress' ? 'todo' : 'inProgress')}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Flytta tillbaka"
                      >
                        ←
                      </button>
                    )}
                    {category.id !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, category.id, category.id === 'todo' ? 'inProgress' : 'done')}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title="Flytta framåt"
                      >
                        →
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id, category.id)}
                      className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 ml-auto"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              ))}
              {(project.tasks?.[category.id] || []).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">Inga uppgifter</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RisksTab({ project, setProject }) {
  const [newRisk, setNewRisk] = useState({ description: '', severity: 'medel', mitigation: '' })
  const [editingRisk, setEditingRisk] = useState(null)

  const addRisk = () => {
    if (!newRisk.description.trim()) return

    const risk = {
      id: Date.now().toString(),
      ...newRisk,
      createdAt: new Date().toISOString()
    }

    setProject({ ...project, risks: [...(project.risks || []), risk] })
    setNewRisk({ description: '', severity: 'medel', mitigation: '' })
  }

  const updateRisk = (riskId, field, value) => {
    setProject({
      ...project,
      risks: (project.risks || []).map(r =>
        r.id === riskId ? { ...r, [field]: value } : r
      )
    })
  }

  const deleteRisk = (riskId) => {
    setProject({ ...project, risks: (project.risks || []).filter(r => r.id !== riskId) })
    setEditingRisk(null)
  }

  const severityColors = {
    låg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700',
    medel: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    hög: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
  }

  return (
    <div className="space-y-6">
      {/* Add Risk */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Lägg till risk</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={newRisk.description}
            onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
            placeholder="Beskriv risken..."
            className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
          />
          <textarea
            value={newRisk.mitigation}
            onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
            placeholder="Åtgärd..."
            className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
            rows="2"
          />
          <div className="flex gap-3">
            <select
              value={newRisk.severity}
              onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
              className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded-lg"
            >
              <option value="låg">Låg risk</option>
              <option value="medel">Medel risk</option>
              <option value="hög">Hög risk</option>
            </select>
            <button
              onClick={addRisk}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Lägg till
            </button>
          </div>
        </div>
      </div>

      {/* Risks List */}
      <div className="space-y-3">
        {(project.risks || []).map(risk => (
          <div key={risk.id} className={`p-4 rounded-xl border-2 ${severityColors[risk.severity]}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <select
                    value={risk.severity}
                    onChange={(e) => updateRisk(risk.id, 'severity', e.target.value)}
                    className="text-xs font-semibold uppercase px-2 py-1 rounded border-0 bg-transparent"
                  >
                    <option value="låg">LÅG RISK</option>
                    <option value="medel">MEDEL RISK</option>
                    <option value="hög">HÖG RISK</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={risk.description}
                  onChange={(e) => updateRisk(risk.id, 'description', e.target.value)}
                  className="font-medium w-full mb-2 px-2 py-1 border-0 bg-transparent"
                  placeholder="Beskrivning..."
                />
                <textarea
                  value={risk.mitigation || ''}
                  onChange={(e) => updateRisk(risk.id, 'mitigation', e.target.value)}
                  className="text-sm w-full px-2 py-1 border dark:border-gray-600 rounded bg-white/50 dark:bg-gray-800/50 dark:text-gray-200 dark:placeholder-gray-400"
                  placeholder="Åtgärd..."
                  rows="2"
                />
              </div>
              <button
                onClick={() => deleteRisk(risk.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {(project.risks || []).length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border dark:border-gray-700 text-center">
            <p className="text-gray-500">Inga risker identifierade</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductionTab({ project, setProject }) {
  const [showPrintView, setShowPrintView] = useState(null)

  const addWorkOrder = () => {
    const workOrder = {
      id: Date.now().toString(),
      title: '',
      material: '',
      description: '',
      image: null,
      status: 'planerad',
      createdAt: new Date().toISOString()
    }

    setProject({ ...project, work_orders: [...(project.work_orders || []), workOrder] })
  }

  const updateWorkOrder = (id, field, value) => {
    setProject({
      ...project,
      work_orders: (project.work_orders || []).map(w =>
        w.id === id ? { ...w, [field]: value } : w
      )
    })
  }

  const handleImageUpload = async (id, file) => {
    if (file) {
      const compressed = await compressImage(file)
      updateWorkOrder(id, 'image', compressed)
    }
  }

  const deleteWorkOrder = (id) => {
    setProject({ ...project, work_orders: (project.work_orders || []).filter(w => w.id !== id) })
    setShowPrintView(null)
  }

  const statusColors = {
    planerad: 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200',
    pågående: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    klar: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
  }

  if (showPrintView) {
    const wo = (project.work_orders || []).find(w => w.id === showPrintView)
    if (!wo) {
      setShowPrintView(null)
      return null
    }

    return (
      <div className="space-y-6">
        <button
          onClick={() => setShowPrintView(null)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800"
        >
          ← Tillbaka
        </button>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border dark:border-gray-700 print:border-0">
          <h2 className="text-2xl font-bold mb-6">Arbetsorder</h2>
          {wo.image && (
            <img src={wo.image} alt="Arbetsorder" className="w-full max-w-md mb-4 rounded-lg" />
          )}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Titel</h3>
              <p className="text-lg dark:text-white">{wo.title || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Material</h3>
              <p className="dark:text-gray-200">{wo.material || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Beskrivning</h3>
              <p className="whitespace-pre-wrap dark:text-gray-200">{wo.description || '-'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Status</h3>
              <p className="capitalize dark:text-gray-200">{wo.status}</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 print:hidden"
          >
            Skriv ut
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={addWorkOrder}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Ny arbetsorder
      </button>

      {/* Work Orders List */}
      <div className="space-y-4">
        {(project.work_orders || []).map(wo => (
          <div key={wo.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <input
                  type="text"
                  value={wo.title}
                  onChange={(e) => updateWorkOrder(wo.id, 'title', e.target.value)}
                  placeholder="Titel..."
                  className="text-lg font-semibold flex-1 px-2 py-1 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded"
                />
                <button onClick={() => deleteWorkOrder(wo.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 ml-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <input
                type="text"
                value={wo.material}
                onChange={(e) => updateWorkOrder(wo.id, 'material', e.target.value)}
                placeholder="Material..."
                className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
              />

              <textarea
                value={wo.description}
                onChange={(e) => updateWorkOrder(wo.id, 'description', e.target.value)}
                placeholder="Beskrivning..."
                className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg"
                rows="3"
              />

              {/* Image Upload */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(wo.id, e.target.files[0])}
                  className="hidden"
                  id={`upload-${wo.id}`}
                />
                <label
                  htmlFor={`upload-${wo.id}`}
                  className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  📷 Ladda upp bild
                </label>
                {wo.image && (
                  <div className="mt-2 relative inline-block">
                    <img src={wo.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => updateWorkOrder(wo.id, 'image', null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {['planerad', 'pågående', 'klar'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateWorkOrder(wo.id, 'status', status)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      wo.status === status ? statusColors[status] : 'bg-gray-50 dark:bg-gray-700/50 text-gray-400'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => setShowPrintView(wo.id)}
                  className="ml-auto px-4 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                >
                  Skriv ut
                </button>
              </div>
            </div>
          </div>
        ))}
        {(project.work_orders || []).length === 0 && (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border dark:border-gray-700 text-center">
            <p className="text-gray-500">Inga arbetsordrar än</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BrandTab({ project, setProject }) {
  const [newColor, setNewColor] = useState('#000000')

  const handleLogoUpload = async (file) => {
    if (file) {
      const compressed = await compressImage(file)
      const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
      setProject({
        ...project,
        brand: { ...brand, logos: [...brand.logos, compressed] }
      })
    }
  }

  const handleInspoUpload = async (file) => {
    if (file) {
      const compressed = await compressImage(file)
      const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
      setProject({
        ...project,
        brand: { ...brand, referenceImages: [...brand.referenceImages, compressed] }
      })
    }
  }

  const removeLogo = (index) => {
    const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
    setProject({
      ...project,
      brand: { ...brand, logos: brand.logos.filter((_, i) => i !== index) }
    })
  }

  const removeInspo = (index) => {
    const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
    setProject({
      ...project,
      brand: { ...brand, referenceImages: brand.referenceImages.filter((_, i) => i !== index) }
    })
  }

  // Normalize color code (add # if missing, validate hex)
  const normalizeColor = (color) => {
    let c = color.trim()
    // Remove # if present to normalize
    if (c.startsWith('#')) {
      c = c.slice(1)
    }
    // Check if valid hex (3 or 6 characters)
    if (/^[0-9A-Fa-f]{6}$/.test(c)) {
      return '#' + c.toUpperCase()
    }
    if (/^[0-9A-Fa-f]{3}$/.test(c)) {
      // Expand 3-char to 6-char (e.g. F00 -> FF0000)
      return '#' + c.split('').map(x => x + x).join('').toUpperCase()
    }
    return null // Invalid
  }

  const handleColorTextChange = (value) => {
    setNewColor(value)
  }

  const addColor = () => {
    const normalized = normalizeColor(newColor)
    if (!normalized) {
      alert('Ogiltig färgkod. Använd format: #FF5733 eller FF5733')
      return
    }
    const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
    setProject({
      ...project,
      brand: { ...brand, colors: [...brand.colors, normalized] }
    })
    setNewColor('#000000')
  }

  const removeColor = (index) => {
    const brand = project.brand || { logos: [], colors: [], referenceImages: [] }
    setProject({
      ...project,
      brand: { ...brand, colors: brand.colors.filter((_, i) => i !== index) }
    })
  }

  return (
    <div className="space-y-6">
      {/* Logos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Logotyper</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleLogoUpload(e.target.files[0])}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
        >
          📷 Ladda upp logga
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {(project.brand?.logos || []).map((logo, index) => (
            <div key={index} className="group relative">
              <img src={logo} alt="Logo" className="w-full h-32 object-contain bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700" />
              <button
                onClick={() => removeLogo(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Varumärkesfärger</h3>
        <div className="flex gap-3 mb-4 items-center">
          <input
            type="color"
            value={normalizeColor(newColor) || '#000000'}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-16 h-10 rounded cursor-pointer border dark:border-gray-600"
          />
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            placeholder="#FF5733 eller FF5733"
            className="flex-1 px-3 py-2 border dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-lg font-mono"
          />
          <div
            className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
            style={{ backgroundColor: normalizeColor(newColor) || '#ffffff' }}
            title="Förhandsvisning"
          />
          <button
            onClick={addColor}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lägg till
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Klistra in en färgkod (t.ex. #FF5733 eller FF5733) och klicka "Lägg till"
        </p>
        <div className="flex gap-3 flex-wrap">
          {(project.brand?.colors || []).map((color, index) => (
            <div key={index} className="group relative">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
              <button
                onClick={() => removeColor(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
              <p className="text-xs text-center mt-1 font-mono dark:text-gray-300">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inspiration Images */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700">
        <h3 className="font-semibold dark:text-white mb-4">Inspirationsbilder</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleInspoUpload(e.target.files[0])}
          className="hidden"
          id="inspo-upload"
        />
        <label
          htmlFor="inspo-upload"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
        >
          📷 Ladda upp inspirationsbild
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {(project.brand?.referenceImages || []).map((img, index) => (
            <div key={index} className="group relative">
              <img src={img} alt="Inspiration" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={() => removeInspo(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
