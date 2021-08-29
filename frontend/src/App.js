import React, {useState} from 'react';

function App() {
  const [previews, setPreviews] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const addClick = (e) => {
    e.preventDefault();

    setLoadingPreview(true);
    fetch(`http://localhost:3500/meta?url=${encodeURIComponent(currentUrl)}`)
    .catch((error) => alert(`Error. ${error}`))
    .then(async (response) => {
      const preview = await response.json();
      setPreviews(x => {
        return [
          ...x,
          preview
        ];
      });
    })
    .finally(() => setLoadingPreview(false));

  };

  return (
    <div>
      <header>
        <input type="url" value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} placeholder="Enter URL" />
        <button type="button" onClick={addClick} disabled={loadingPreview}>Preview</button>
      </header>
      <main>
        <ul>
          {previews.map((preview, index) => (
            <li key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              borderBottom: '1px solid black'
            }}>
              <p>Site: {preview.site_name}</p>
              <p>Title: {preview.title}</p>
              <p>Description: {preview.description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
