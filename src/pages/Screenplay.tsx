import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchScreenplayByIdFromDB, updateScreenplayDataInDB } from "../services/screenplay";
import "./styles/Screenplay.css";

interface Scene {
  id: string;
  slugline: string;
  scene: string;
}

export default function Screenplay() {
  const navigate = useNavigate();
  const { screenplay_id } = useParams();
  const [screenplay, setScreenplay] = useState<any>(null);
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: '1',
      slugline: 'INT. DILAPIDATED HOTEL ROOM - DAY',
      scene: 'Another BANG on the door- Saito, confident now, approaches Cobb. Nash is behind Saito.'
    }
  ]);

  useEffect(() => {
    const loadScreenplay = async () => {
      if (screenplay_id) {
        const screenplayData = await fetchScreenplayByIdFromDB(screenplay_id);
        if (screenplayData) {
          setScreenplay(screenplayData);
        }
      }
    };
    loadScreenplay();
  }, [screenplay_id]);

  const handleContentChange = async (field: string, value: string, sceneId?: string) => {
    if (sceneId) {
      // Handle scene updates
      setScenes(prev => prev.map(scene => 
        scene.id === sceneId 
          ? { ...scene, [field]: value }
          : scene
      ));
    } else {
      // Handle screenplay metadata updates
      setScreenplay((prev: any) => ({
        ...prev,
        [field]: value
      }));
      
      if (screenplay_id) {
        await updateScreenplayDataInDB(screenplay_id, field, value);
      }
    }
  };

  const addScene = () => {
    const newScene: Scene = {
      id: Date.now().toString(),
      slugline: '',
      scene: ''
    };
    setScenes(prev => [...prev, newScene]);
  };

  const removeScene = (sceneId: string) => {
    setScenes(prev => prev.filter(scene => scene.id !== sceneId));
  };

  if (!screenplay) {
    return <div className="loading">Loading screenplay...</div>;
  }

  return (
    <div className="screenplay-container">
      <div className="screenplay-document">
        {/* Title Page */}
        <div className="screenplay-page title-page">
          <div className="title-section">
            <div 
              className="title-field"
              contentEditable
              suppressContentEditableWarning
              data-field="title"
              onBlur={(e) => handleContentChange('title', e.currentTarget.textContent || '')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {screenplay.title || 'UNTITLED'}
            </div>
            
            <div className="written-by-label">Written by</div>
            
            <div 
              className="author-field"
              contentEditable
              suppressContentEditableWarning
              data-field="author"
              onBlur={(e) => handleContentChange('author', e.currentTarget.textContent || '')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {screenplay.author || 'Author Name'}
            </div>
            
            <div className="based-on-section">
              <div className="based-on-label">Based on</div>
              <div 
                className="based-on-field"
                contentEditable
                suppressContentEditableWarning
                data-field="based_on"
                onBlur={(e) => handleContentChange('based_on', e.currentTarget.textContent || '')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              >
                {screenplay.based_on || 'Source material (optional)'}
              </div>
            </div>
          </div>
          
          <div className="contact-info">
            <div 
              className="contact-field"
              contentEditable
              suppressContentEditableWarning
              data-field="contact_information"
              onBlur={(e) => handleContentChange('contact_information', e.currentTarget.textContent || '')}
            >
              {screenplay.contact_information || 'Contact Information'}
            </div>
            
            <div 
              className="date-field"
              contentEditable
              suppressContentEditableWarning
              data-field="draft_date"
              onBlur={(e) => handleContentChange('draft_date', e.currentTarget.textContent || '')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.currentTarget.blur();
                }
              }}
            >
              {screenplay.draft_date || new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Script Pages */}
        <div className="screenplay-page script-page">
          <div className="page-number">2.</div>
          
          {scenes.map((scene) => (
            <div key={scene.id} className="scene-block" data-scene-id={scene.id}>
              <div className="scene-controls">
                <button 
                  className="remove-scene-btn"
                  onClick={() => removeScene(scene.id)}
                  title="Remove scene"
                >
                  ×
                </button>
              </div>
              
              <div 
                className="slugline-field"
                contentEditable
                suppressContentEditableWarning
                data-field="slugline"
                data-scene-id={scene.id}
                onBlur={(e) => handleContentChange('slugline', e.currentTarget.textContent || '', scene.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              >
                {scene.slugline || 'INT./EXT. LOCATION - TIME'}
              </div>
              
              <div 
                className="scene-field"
                contentEditable
                suppressContentEditableWarning
                data-field="scene"
                data-scene-id={scene.id}
                onBlur={(e) => handleContentChange('scene', e.currentTarget.textContent || '', scene.id)}
              >
                {scene.scene || 'Scene description and dialogue...'}
              </div>
            </div>
          ))}
          
          <button className="add-scene-btn" onClick={addScene}>
            + Add Scene
          </button>
        </div>
      </div>
    </div>
  );
}