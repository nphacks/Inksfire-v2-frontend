import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchScreenplayByIdFromDB, updateScreenplayDataInDB } from "../services/screenplay";
import "./styles/Screenplay.css";

export default function Screenplay() {
  const navigate = useNavigate();
  const { screenplay_id } = useParams();
  const [screenplay, setScreenplay] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([
    {
      id: 1,
      slugline: 'INT. DILAPIDATED HOTEL ROOM - DAY',
      scene: 'Another BANG on the door- Saito, confident now, approaches Cobb. Nash is behind Saito.'
    }
  ]);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    const loadScreenplay = async () => {
      if (screenplay_id) {
        const screenplayData = await fetchScreenplayByIdFromDB(screenplay_id);
        setScreenplay(screenplayData);
      }
    };
    loadScreenplay();
  }, [screenplay_id]);

  const handleFieldClick = (field: string) => {
    setEditingField(field);
  };

  const handleFieldBlur = async (field: string, value: string) => {
    setEditingField(null);
    setScreenplay((prev: any) => ({
      ...prev,
      [field]: value
    }));
    await updateScreenplayDataInDB(screenplay_id!, field, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  const addScene = () => {
    const newScene = {
      id: Date.now(),
      slugline: '',
      scene: ''
    };
    setScenes(prev => [...prev, newScene]);
  };

  return (
    <div className="screenplay-container">
      {screenplay && (
        <div className="screenplay">
          <div className="screenplay-page1">
            <div className="title-section">
              {editingField === 'title' ? (
                <input
                  className="title-input editing"
                  defaultValue={screenplay?.title || ''}
                  onBlur={(e) => handleFieldBlur('title', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'title')}
                  autoFocus
                  placeholder="TITLE"
                />
              ) : (
                <div 
                  className="title-display"
                  onClick={() => handleFieldClick('title')}
                >
                  {screenplay?.title || 'UNTITLED'}
                </div>
              )}
              
              <div className="written-by">Written by</div>
              
              {editingField === 'author' ? (
                <input
                  className="author-input editing"
                  defaultValue={screenplay?.author || ''}
                  onBlur={(e) => handleFieldBlur('author', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'author')}
                  autoFocus
                  placeholder="Author Name"
                />
              ) : (
                <div 
                  className="author-display"
                  onClick={() => handleFieldClick('author')}
                >
                  {screenplay?.author || 'Author Name'}
                </div>
              )}
              
              {(screenplay?.based_on || screenplay?.based_on === '') && (
                <div className="based-on-section">
                  <div className="based-on-label">Based on</div>
                  {editingField === 'based_on' ? (
                    <input
                      className="based-on-input editing"
                      defaultValue={screenplay?.based_on || ''}
                      onBlur={(e) => handleFieldBlur('based_on', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'based_on')}
                      autoFocus
                      placeholder="Source material"
                    />
                  ) : (
                    <div 
                      className="based-on-display"
                      onClick={() => handleFieldClick('based_on')}
                    >
                      {screenplay?.based_on || 'Source material'}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="contact-info">
              {editingField === 'contact_information' ? (
                <textarea
                  className="contact-input editing"
                  defaultValue={screenplay?.contact_information || ''}
                  onBlur={(e) => handleFieldBlur('contact_information', e.target.value)}
                  autoFocus
                  placeholder="Contact Information"
                />
              ) : (
                <div 
                  className="contact-display"
                  onClick={() => handleFieldClick('contact_information')}
                >
                  {screenplay?.contact_information || 'Contact Information'}
                </div>
              )}
              
              {editingField === 'draft_date' ? (
                <input
                  type="date"
                  className="date-input editing"
                  defaultValue={screenplay?.draft_date || ''}
                  onBlur={(e) => handleFieldBlur('draft_date', e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'draft_date')}
                  autoFocus
                />
              ) : (
                <div 
                  className="date-display"
                  onClick={() => handleFieldClick('draft_date')}
                >
                  {screenplay?.draft_date || new Date().toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="screenplay-pages">
            <button className="add-scene-button" onClick={addScene}>Add Scene</button>
            <div className="screenplay-page">
              <div className="page-number">2.</div>
              {scenes.map((scene, index) => (
                <div key={scene.id} className="screenplay-scene">
                  {editingField === `slugline-${scene.id}` ? (
                    <input 
                      className="slugline-input editing"
                      defaultValue={scene?.slugline || ''} 
                      onBlur={(e) => {
                        setEditingField(null);
                        setScenes(prev => prev.map(s => 
                          s.id === scene.id ? { ...s, slugline: e.target.value } : s
                        ));
                      }}
                      onKeyDown={(e) => handleKeyDown(e, `slugline-${scene.id}`)}
                      autoFocus
                      placeholder="INT./EXT. LOCATION - TIME"
                    />
                  ) : (
                    <div 
                      className="slugline-display"
                      onClick={() => handleFieldClick(`slugline-${scene.id}`)}
                    >
                      {scene?.slugline || 'INT./EXT. LOCATION - TIME'}
                    </div>
                  )}
                  
                  {editingField === `scene-${scene.id}` ? (
                    <textarea 
                      className="scene-input editing"
                      defaultValue={scene?.scene || ''} 
                      onBlur={(e) => {
                        setEditingField(null);
                        setScenes(prev => prev.map(s => 
                          s.id === scene.id ? { ...s, scene: e.target.value } : s
                        ));
                      }}
                      autoFocus
                      placeholder="Scene description and dialogue..."
                    />
                  ) : (
                    <div 
                      className="scene-display"
                      onClick={() => handleFieldClick(`scene-${scene.id}`)}
                    >
                      {scene?.scene || 'Scene description and dialogue...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}