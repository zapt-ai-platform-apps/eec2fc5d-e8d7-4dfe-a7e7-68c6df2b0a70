import { createSignal, onMount, Show, For } from 'solid-js';

function App() {
  const [admissionsData, setAdmissionsData] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  const fetchAdmissionsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getAdmissionsData');
      if (response.ok) {
        const data = await response.json();
        setAdmissionsData(data);
      } else {
        setError('Failed to fetch admissions data.');
        console.error('Error fetching admissions data:', response.statusText);
      }
    } catch (err) {
      setError('An error occurred while fetching admissions data.');
      console.error('Error fetching admissions data:', err);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchAdmissionsData();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 text-gray-800">
      <div class="max-w-2xl mx-auto h-full">
        <h1 class="text-3xl font-bold text-center mb-6 text-blue-600">Admissions Alert AI</h1>

        <Show when={loading()}>
          <p class="text-center text-gray-600">Loading admissions data...</p>
        </Show>

        <Show when={error()}>
          <p class="text-center text-red-500">{error()}</p>
        </Show>

        <Show when={!loading() && !error()}>
          <div class="space-y-4">
            <For each={admissionsData()}>
              {(item) => (
                <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  <h3 class="text-xl font-semibold mb-2 text-blue-600">{item.title}</h3>
                  <p class="text-gray-700 mb-2">{item.description}</p>
                  <p class="text-gray-600 text-sm mb-2">Date: {item.date}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-blue-500 hover:underline"
                  >
                    Read more
                  </a>
                </div>
              )}
            </For>
          </div>
        </Show>

        <div class="mt-8 text-center">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
            Made on ZAPT
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;