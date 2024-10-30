import { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { useWorks, Work, CreateWorkDTO } from '@/hooks/useWorks';
import { WorkCard } from '@/components/work-card';
import { uploadService } from '@/services/api';

export default function App() {
  const { works, loading, createWork, updateWork, deleteWork } = useWorks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const handleSubmit = async (formData: CreateWorkDTO) => {
    try {
      if (selectedWork) {
        await updateWork(selectedWork.id, formData);
      } else {
        await createWork(formData);
      }
      setIsModalOpen(false);
      setSelectedWork(null);
    } catch (error) {
      console.error('Failed to save work:', error);
    }
  };
  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadService.uploadImage(file);
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedWork(null);
    setIsModalOpen(true);
  };

  const handleEdit = (work: Work) => {
    setSelectedWork(work);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Digital Portfolio
          </h1>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Bedeleu Alexandru</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Showcasing creative projects and professional work in web development and web app
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full
                     hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl
                     active:transform active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="font-medium">Add New Project</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center px-3 py-2 rounded-l-lg border ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-2 rounded-r-lg border-t border-r border-b ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                viewMode="grid"
                onToggleVisibility={async (id) => {
                  const work = works.find(w => w.id === id);
                  if (work) {
                    await updateWork(id, { isVisible: !work.isVisible });
                  }
                }}
                onEdit={handleEdit}
                onDelete={deleteWork}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {works.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                viewMode="list"
                onToggleVisibility={async (id) => {
                  const work = works.find(w => w.id === id);
                  if (work) {
                    await updateWork(id, { isVisible: !work.isVisible });
                  }
                }}
                onEdit={handleEdit}
                onDelete={deleteWork}
              />
            ))}
          </div>
        )}

        {/*/!* Projects Display *!/*/}
        {/*{viewMode === 'grid' ? (*/}
        {/*  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">*/}
        {/*    {works.map((work) => (*/}
        {/*      <WorkCard*/}
        {/*        key={work.id}*/}
        {/*        work={work}*/}
        {/*        onToggleVisibility={async (id) => {*/}
        {/*          const work = works.find(w => w.id === id);*/}
        {/*          if (work) {*/}
        {/*            await updateWork(id, { isVisible: !work.isVisible });*/}
        {/*          }*/}
        {/*        }}*/}
        {/*        onEdit={handleEdit}*/}
        {/*        onDelete={async (id) => {*/}
        {/*          if (window.confirm('Are you sure you want to delete this project?')) {*/}
        {/*            await deleteWork(id);*/}
        {/*          }*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*) : (*/}
        {/*  <div className="space-y-4">*/}
        {/*    {works.map((work) => (*/}
        {/*      <div*/}
        {/*        key={work.id}*/}
        {/*        className={`flex items-center gap-6 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow*/}
        {/*                  ${!work.isVisible ? 'opacity-50' : ''}`}*/}
        {/*      >*/}
        {/*        <img*/}
        {/*          src={work.imageUrl}*/}
        {/*          alt={work.title}*/}
        {/*          className="w-32 h-24 object-cover rounded-md"*/}
        {/*        />*/}
        {/*        <div className="flex-1 min-w-0">*/}
        {/*          <h3 className="text-lg font-semibold text-gray-900">{work.title} list</h3>*/}
        {/*          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{work.description}</p>*/}
        {/*          <a*/}
        {/*            href={work.clientUrl}*/}
        {/*            target="_blank"*/}
        {/*            rel="noopener noreferrer"*/}
        {/*            className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"*/}
        {/*          >*/}
        {/*            Vezi site-ul clientului*/}
        {/*          </a>*/}
        {/*        </div>*/}
        {/*        <div className="flex items-center gap-2">*/}
        {/*          <button*/}
        {/*            onClick={() => handleEdit(work)}*/}
        {/*            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"*/}
        {/*          >*/}
        {/*            Edit*/}
        {/*          </button>*/}
        {/*          <button*/}
        {/*            onClick={async () => {*/}
        {/*              if (window.confirm('Are you sure you want to delete this project?')) {*/}
        {/*                await deleteWork(work.id);*/}
        {/*              }*/}
        {/*            }}*/}
        {/*            className="p-2 text-red-600 hover:text-red-800 transition-colors"*/}
        {/*          >*/}
        {/*            Delete*/}
        {/*          </button>*/}
        {/*          <button*/}
        {/*            onClick={() => updateWork(work.id, { isVisible: !work.isVisible })}*/}
        {/*            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"*/}
        {/*          >*/}
        {/*            {work.isVisible ? 'Hide' : 'Show'}*/}
        {/*          </button>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*)*/}
        {/*}*/}

        {/* Empty State */}
        {works.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 text-blue-600 border border-blue-600
                       rounded-full hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </button>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <h2 className="text-2xl font-bold mb-4">
                {selectedWork ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                try {
                  // Dacă avem un fișier nou încărcat, îl procesăm mai întâi
                  const imageFile = (e.currentTarget.querySelector('#imageFile') as HTMLInputElement).files?.[0];
                  let imageUrl = formData.get('imageUrl') as string;

                  if (imageFile) {
                    imageUrl = await handleImageUpload(imageFile);
                  }

                  await handleSubmit({
                    title: formData.get('title') as string,
                    description: formData.get('description') as string,
                    imageUrl: imageUrl || '/api/placeholder/600/400',
                    clientUrl: formData.get('clientUrl') as string,
                    isVisible: true
                  });
                } catch (error) {
                  console.error('Failed to process form:', error);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      defaultValue={selectedWork?.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={selectedWork?.description}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Image
                    </label>
                    <div className="space-y-2">
                      {/* Image Preview */}
                      {(imagePreview || selectedWork?.imageUrl) && (
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview || selectedWork?.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Reset button */}
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                              const urlInput = document.getElementById('imageUrl') as HTMLInputElement;
                              if (urlInput) urlInput.value = '';
                            }}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Upload Controls */}
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setImagePreview(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('imageFile')?.click()}
                            className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                          >
                            Browse Image
                          </button>
                        </div>

                        {/* URL Input */}
                        <div className="flex-1">
                          <input
                            type="text"
                            id="imageUrl"
                            name="imageUrl"
                            placeholder="or paste image URL"
                            defaultValue={selectedWork?.imageUrl}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
                              if (e.target.value) {
                                setImagePreview(e.target.value);
                              } else {
                                setImagePreview(null);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clientUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Client URL
                    </label>
                    <input
                      type="url"
                      id="clientUrl"
                      name="clientUrl"
                      defaultValue={selectedWork?.clientUrl}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedWork(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md transition-colors
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isUploading ? 'Uploading...' : selectedWork ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}