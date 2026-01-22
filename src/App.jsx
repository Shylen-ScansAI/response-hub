import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
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
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTemplates = async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err.message);
      alert('Failed to load templates: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [session]);

  const handleUpdateTemplate = async (updatedTemplate) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          title: updatedTemplate.title,
          content: updatedTemplate.content,
          keywords: updatedTemplate.keywords,
          platform: updatedTemplate.platform,
          keywords: updatedTemplate.keywords,
          platform: updatedTemplate.platform,
          // is_favorite: updatedTemplate.is_favorite // REMOVED: Managed separately
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
        .insert([{ ...dataToInsert }]) // Removed is_favorite: false
        .select()
        .single();

      if (error) throw error;
      setTemplates((prev) => [data, ...prev]);
    } catch (err) {
      console.error('Error creating template:', err.message);
      alert('Failed to create template: ' + err.message);
    }
  };

  const handleSyncData = async () => {
    if (!window.confirm('This will add any missing default templates. Your existing custom or edited templates will be safe. Continue?')) return;

    setIsLoading(true);
    try {
      // Improve duplicate detection: Check Platform + Title combination
      const currentKeys = new Set(templates.map(t => `${t.platform}-${t.title}`));

      const templatesToAdd = initialTemplates.filter(t => {
        const key = `${t.platform}-${t.title}`;
        return !currentKeys.has(key);
      }).map(({ id, ...rest }) => rest);

      if (templatesToAdd.length === 0) {
        alert('All default templates are already present.');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('templates')
        .insert(templatesToAdd)
        .select();

      if (error) throw error;

      alert(`Successfully restored ${data.length} missing templates.`);
      // Refresh strictly from DB to ensure state is consistent
      fetchTemplates();

    } catch (err) {
      console.error('Error syncing data:', err);
      alert('Sync failed: ' + err.message);
      setIsLoading(false);
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
      // Platform Filter
      if (filter !== 'All' && template.platform !== filter) {
        return false;
      }

      // 3. Search Filter
      if (searchQuery.trim() === '') return true;

      const query = searchQuery.toLowerCase();
      const matchTitle = template.title.toLowerCase().includes(query);
      const matchContent = template.content.toLowerCase().includes(query);
      const matchKeywords = template.keywords.some(k => k.toLowerCase().includes(query));

      return matchTitle || matchContent || matchKeywords;
    });
  }, [templates, filter, searchQuery]);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activeFilter={filter} onFilterChange={setFilter} />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="header-actions">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="action-buttons">
              <button
                className="sync-data-btn"
                onClick={handleSyncData}
                title="Sync missing templates from initial data"
              >
                Sync Data
              </button>
              <button className="create-template-btn" onClick={() => setIsModalOpen(true)}>
                Create +
              </button>
            </div>
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
