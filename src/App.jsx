import { createSignal, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [academicLevel, setAcademicLevel] = createSignal('');
  const [interests, setInterests] = createSignal('');
  const [newsfeed, setNewsfeed] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const handleGenerateNewsfeed = async () => {
    setLoading(true);
    const prompt = `Generate a personalized newsfeed with the latest updates on university admissions, application deadlines, and admission test schedules for major Pakistan universities. Tailor the newsfeed to a student with the following academic level and interests:

Academic Level: ${academicLevel()}
Interests: ${interests()}

Provide the output in JSON format with the following structure:

{
  "newsfeed": [
    {
      "title": "Title of the news item",
      "summary": "Short summary of the news item",
      "link": "URL to more information",
      "date": "Date of the event or deadline"
    }
  ]
}`;

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'json'
      });

      if (result && Array.isArray(result.newsfeed)) {
        setNewsfeed(result.newsfeed);
      } else if (result && Array.isArray(result)) {
        setNewsfeed(result);
      } else {
        console.error('Invalid response format:', result);
      }
    } catch (error) {
      console.error('Error generating newsfeed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-6 text-blue-600">Admissions Alert AI</h1>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Academic Level</label>
            <input
              type="text"
              placeholder="Enter your academic level (e.g., High School, Undergraduate)"
              value={academicLevel()}
              onInput={(e) => setAcademicLevel(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-semibold mb-2">Interests</label>
            <input
              type="text"
              placeholder="Enter your interests (e.g., Engineering, Medicine)"
              value={interests()}
              onInput={(e) => setInterests(e.target.value)}
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border"
            />
          </div>
          <button
            onClick={handleGenerateNewsfeed}
            class={`w-full py-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading()}
          >
            {loading() ? 'Generating Newsfeed...' : 'Generate Newsfeed'}
          </button>
        </div>

        <Show when={newsfeed().length > 0}>
          <div class="mt-8">
            <h2 class="text-2xl font-bold mb-4">Your Personalized Newsfeed</h2>
            <div class="space-y-4">
              <For each={newsfeed()}>
                {(item) => (
                  <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-2 text-blue-600">{item.title}</h3>
                    <p class="text-gray-700 mb-2">{item.summary}</p>
                    <p class="text-gray-600 text-sm mb-2">Date: {item.date}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                      Read more
                    </a>
                  </div>
                )}
              </For>
            </div>
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