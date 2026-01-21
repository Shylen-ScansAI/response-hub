import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import TemplateCard from './components/TemplateCard';
import CreateTemplateModal from './components/CreateTemplateModal';
import { initialTemplates } from './data/initialData';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Wati', 'Partsmart', 'Link'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data.length === 0) {
        // Seed database if empty
        console.log('Database empty, seeding with initial templates...');
        const { data: seededData, error: seedError } = await supabase
          .from('templates')
          .insert(initialTemplates.map(({ id, ...rest }) => rest)) // Don't send local IDs
          .select();

        if (seedError) throw seedError;
        setTemplates(seededData);
      } else {
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUpdateTemplate = async (updatedTemplate) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          title: updatedTemplate.title,
          content: updatedTemplate.content,
          keywords: updatedTemplate.keywords,
          platform: updatedTemplate.platform
        })
        .eq('id', updatedTemplate.id);

      if (error) throw error;

      setTemplates((prev) =>
        prev.map((t) => (t.id === updatedTemplate.id ? updatedTemplate : t))
      );
    } catch (err) {
      console.error('Error updating template:', err.message);
      alert('Failed to update template: ' + err.message);
    }
  };

  const handleCreateTemplate = async (newTemplate) => {
    try {
      // id is handled by DB (gen_random_uuid())
      const { id, ...dataToInsert } = newTemplate;
      const { data, error } = await supabase
        .from('templates')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;
      setTemplates((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Error creating template:', err.message);
      alert('Failed to create template: ' + err.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Error deleting template:', err.message);
        alert('Failed to delete template: ' + err.message);
      }
    }
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      // 1. Platform Filter
      if (filter !== 'All' && template.platform !== filter) return false;

      // 2. Search Filter
      if (searchQuery.trim() === '') return true;

      const query = searchQuery.toLowerCase();
      const matchTitle = template.title.toLowerCase().includes(query);
      const matchContent = template.content.toLowerCase().includes(query);
      const matchKeywords = template.keywords.some(k => k.toLowerCase().includes(query));

      return matchTitle || matchContent || matchKeywords;
    });
  }, [templates, filter, searchQuery]);

  return (
    <div className="app-container">
      <Sidebar activeFilter={filter} onFilterChange={setFilter} />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="header-actions">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <button className="create-template-btn" onClick={() => setIsModalOpen(true)}>
              Create +
            </button>
          </div>

          <div className="templates-list">
            {isLoading ? (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                No templates found.
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUpdate={handleUpdateTemplate}
                  onDelete={handleDeleteTemplate}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTemplate}
      />
    </div>
  );
}

export default App;
