// storage.js
console.log('[storage.js] Loaded');

let arts = [];
try {
  console.log('[storage.js] Attempting to load arts from localStorage...');
  const storedArts = localStorage.getItem('arts');
  arts = storedArts ? JSON.parse(storedArts) : [];
  if (!Array.isArray(arts)) {
    console.warn('[storage.js] Invalid data type from localStorage, resetting to empty array');
    arts = [];
  }
} catch (e) {
  console.error('[storage.js] Failed to parse arts from localStorage:', e);
  arts = [];
}

if (arts.length === 0) {
  console.log('[storage.js] No arts found, initializing with defaults');
  arts = [
    {
      title: "Sunset Landscape",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      description: "A beautiful sunset over the mountains."
    },
    {
      title: "Abstract Colors",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      description: "An abstract painting with vibrant colors."
    },
  ];
  localStorage.setItem('arts', JSON.stringify(arts));
  console.log('[storage.js] Default arts saved to localStorage');
} else {
  console.log('[storage.js] Arts loaded:', arts);
}

export { arts };
