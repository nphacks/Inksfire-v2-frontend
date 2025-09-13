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
      slugline: 'INT. DILAPIDATED HOTEL ROOM - DAY',
      scene: 'Another BANG on the door- Saito, confident now, approaches Cobb. Nash is behind Saito.'
    }
  ]);

  useEffect(() => {
    const loadScreenplay = async () => {
      if (screenplay_id) {
        const screenplayData = await fetchScreenplayByIdFromDB(screenplay_id);
        setScreenplay(screenplayData);
      }
    };
    loadScreenplay();
  }, [screenplay_id]);

  const handleInputChange = (field: string, value: string) => {
    setScreenplay((prev: any) => {
      if (!prev) {
        return { [field]: value };
      }
      return {...prev, [field]: value};
    });
  };

  const handleScreenplayUpdate = async (field: string, value: string) => {
    console.log(`Updated ${field}:`, value);
    await updateScreenplayDataInDB(screenplay_id!, field, value)
  };

  const addScene = () => {
    setScenes(prev => [...prev, { slugline: '', scene: '' }]);
  };

  const handleSceneChange = (index: number, field: string, value: string) => {
    setScenes(prev => prev.map((scene, i) => 
      i === index ? { ...scene, [field]: value } : scene
    ));
  };

  const handleSceneUpdate = async (index: number, field: string, value: string) => {
    console.log(`Updated scene ${index} ${field}:`, value);
    // Add your scene update API call here
  };

  return (
    <>
      {screenplay && (
        <div>
          <pre>{JSON.stringify(screenplay, null, 2)}</pre>
        </div>
      )}
      {screenplay && (
        <div className="screenplay">
          <div className="screenplay-page1">
            <div className="title-section">
              <input
                className="title-input"
                value={screenplay?.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={(e) => handleScreenplayUpdate('title', e.target.value)}
                placeholder="TITLE"
              />
              <div className="written-by">Written by</div>
              <input
                className="author-input"
                value={screenplay?.author || ''}
                onChange={(e) => handleInputChange('author', e.target.value)}
                onBlur={(e) => handleScreenplayUpdate('author', e.target.value)}
                placeholder="Author Name"
              />
            </div>
            
            <div className="contact-info">
              <textarea
                className="contact-input"
                value={screenplay?.contact_information || ''}
                onChange={(e) => handleInputChange('contact_information', e.target.value)}
                onBlur={(e) => handleScreenplayUpdate('contact_information', e.target.value)}
                placeholder="Contact Information"
              />
              <input
                type="date"
                className="date-input"
                value={screenplay?.draft_date || ''}
                onChange={(e) => handleInputChange('draft_date', e.target.value)}
                onBlur={(e) => handleScreenplayUpdate('draft_date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="screenplay-pages">
            <button onClick={addScene}>Add scene</button>
            {scenes.map((scene, index) => (
              <div key={index} className="screenplay-scene">
                <input 
                  type="text" 
                  name="slugline" 
                  value={scene?.slugline || ''} 
                  onChange={(e) => handleSceneChange(index, 'slugline', e.target.value)}
                  onBlur={(e) => handleSceneUpdate(index, 'slugline', e.target.value)}
                />
                <textarea 
                  name="scene" 
                  value={scene?.scene || ''} 
                  onChange={(e) => handleSceneChange(index, 'scene', e.target.value)}
                  onBlur={(e) => handleSceneUpdate(index, 'scene', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        
      )}
    </>
  );
}