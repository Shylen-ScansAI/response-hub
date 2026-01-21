import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Copy, Plus, X, ChevronDown, ChevronUp, MoreVertical, Trash2, Check } from 'lucide-react';
import './TemplateCard.css';

const TemplateCard = ({ template, onUpdate, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [content, setContent] = useState(template.content);
    const [title, setTitle] = useState(template.title);

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        // Could add toast here
        alert('Copied to clipboard!');
    };

    const handleSave = () => {
        onUpdate({ ...template, content, title });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(template.title);
        setContent(template.content);
        setIsEditing(false);
    };

    const handleAddKeyword = () => {
        const keyword = prompt('Enter new keyword:');
        if (keyword) {
            onUpdate({ ...template, keywords: [...template.keywords, keyword] });
        }
    };

    const handleRemoveTag = (e, index) => {
        e.stopPropagation();
        const newKeywords = [...template.keywords];
        newKeywords.splice(index, 1);
        onUpdate({ ...template, keywords: newKeywords });
    };

    const platformColorVar =
        template.platform === 'Partsmart' ? '--color-red' :
            template.platform === 'Link' ? '--color-blue' :
                template.platform === 'Wati' ? '--color-green' : '--color-text-secondary';

    return (
        <div
            className={`template-card ${isExpanded ? 'expanded' : ''}`}
            style={{ borderColor: `var(${platformColorVar})` }}
        >
            <div className="card-header">
                {isEditing ? (
                    <input
                        className="edit-title-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                ) : (
                    <h3>{template.title}</h3>
                )}

                <div className="card-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} title="Save" className="save-action-btn">
                                <Check size={18} />
                            </button>
                            <button onClick={handleCancel} title="Cancel" className="cancel-action-btn">
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleCopy} title="Copy" className="copy-action-btn">
                                <Copy size={18} />
                            </button>

                            <div className="menu-container" ref={menuRef}>
                                <button
                                    className={`menu-trigger ${isMenuOpen ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    title="More actions"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {isMenuOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => { setIsEditing(true); setIsExpanded(true); setIsMenuOpen(false); }}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button onClick={() => { handleAddKeyword(); setIsMenuOpen(false); }}>
                                            <Plus size={14} /> Add Tag
                                        </button>
                                        <button className="delete-option" onClick={() => { onDelete(template.id); setIsMenuOpen(false); }}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className={`card-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {isEditing ? (
                    <textarea
                        className="edit-content-area"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                ) : (
                    <pre className="content-text">{content}</pre>
                )}
            </div>

            <div className="card-footer">
                <div className="tags-container">
                    <span className="tag platform-tag" style={{ backgroundColor: `var(${platformColorVar})` }}>
                        {template.platform}
                    </span>
                    {template.keywords.map((kw, idx) => (
                        <span key={idx} className="tag keyword-tag" style={{ backgroundColor: `var(${platformColorVar})` }}>
                            {kw}
                            <button className="remove-tag-btn" onClick={(e) => handleRemoveTag(e, idx)}>
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>

                <button className="expand-toggle" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
            </div>
        </div>
    );
};

export default TemplateCard;
