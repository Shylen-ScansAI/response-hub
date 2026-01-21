import React, { useState } from 'react';
import { X } from 'lucide-react';
import './CreateTemplateModal.css';

const CreateTemplateModal = ({ isOpen, onClose, onCreate }) => {
    const [platform, setPlatform] = useState('Partsmart');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;

        const newTemplate = {
            id: Date.now().toString(),
            platform,
            title,
            content: body,
            keywords: [platform.toLowerCase()] // Automatically add the product tag
        };

        onCreate(newTemplate);
        // Reset fields and close
        setTitle('');
        setBody('');
        setPlatform('Partsmart');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Template</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Platform</label>
                        <div className="platform-selector">
                            {['Partsmart', 'Link', 'Wati'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`platform-btn ${platform === p ? 'active' : ''} ${p.toLowerCase()}`}
                                    onClick={() => setPlatform(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter template title..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="body">Body</label>
                        <textarea
                            id="body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Enter template content..."
                            required
                            rows={8}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Create Template
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTemplateModal;
