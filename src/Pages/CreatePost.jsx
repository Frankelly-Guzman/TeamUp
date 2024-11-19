import React, { useState } from 'react';
import { supabase } from '../client';
import { useNavigate } from 'react-router-dom';

// Sample list of programming languages for suggestions
const languagesList = [
  'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust', 'TypeScript', 
  'Swift', 'PHP', 'C#', 'Kotlin', 'Dart', 'Scala', 'Elixir', 'React', 'Vue',
  'Angular', 'Svelte', 'Ember', 'Node.js', 'Express.js', 'Flask', 'Django',
  'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Flutter', 'React Native',
  'Xamarin', 'Unity', 'Unreal Engine', 'jQuery', 'Bootstrap', 'Tailwind CSS',
  'Sass', 'Less', 'PostCSS', 'WebAssembly', 'GraphQL', 'Apollo', 'Relay', 'REST',
  'gRPC', 'WebSocket', 'Socket.io', 'Deno', 'Nest.js', 'Next.js', 'Nuxt.js',
  'Gatsby', 'Hugo', 'Jekyll', 'WordPress', 'Drupal', 'Magento', 'Shopify',
  'BigCommerce', 'WooCommerce', 'Stripe', 'PayPal', 'Square', 'AWS', 'Azure',
  'Google Cloud', 'Firebase', 'Netlify', 'Vercel', 'Heroku', 'DigitalOcean',
  'Kubernetes', 'Docker', 'Jenkins', 'CircleCI', 'Travis CI', 'GitHub Actions',
];

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tag, setTag] = useState('');
  const [languages, setLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body || !tag) {
      setError('Please fill out all fields.');
      return;
    }

    setError(null);
    setSuccess(false);

    const { data, error } = await supabase
      .from('Posts')
      .insert([{ title, body, tag, languages }]);

    if (error) {
      setError('An error occurred while creating the post.');
      console.error(error);
    } else {
      setSuccess(true);
      setTitle('');
      setBody('');
      setTag('');
      setLanguages([]);
      setLanguageInput('');

      setTimeout(() => {
        navigate('/posts');
      }, 3000);
    }
  };

  const handleLanguageChange = (e) => {
    const input = e.target.value;
    setLanguageInput(input);

    if (input) {
      const filtered = languagesList.filter(lang =>
        lang.toLowerCase().includes(input.toLowerCase()) && !languages.includes(lang)
      );
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages([]);
    }
  };

  const handleAddLanguage = (language) => {
    setLanguages([...languages, language]);
    setLanguageInput('');
    setFilteredLanguages([]);
  };

  const handleRemoveLanguage = (language) => {
    setLanguages(languages.filter(lang => lang !== language));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          Post created successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the post title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the post body"
            rows="5"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Tag</label>
          <div>
            <label>
              <input
                type="radio"
                value="Project"
                onChange={(e) => setTag(e.target.value)}
                checked={tag === 'Project'}
                name="tag"
                className="mr-2"
              />
              Project
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="Hackathon"
                onChange={(e) => setTag(e.target.value)}
                checked={tag === 'Hackathon'}
                name="tag"
                className="mr-2"
              />
              Hackathon
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Programming Languages</label>
          <input
            type="text"
            value={languageInput}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a language..."
          />
          {filteredLanguages.length > 0 && (
            <div className="border border-gray-300 mt-1 rounded-md shadow-lg bg-white">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleAddLanguage(lang)}
                >
                  {lang}
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap space-x-2">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full inline-flex items-center"
              >
                {lang}
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveLanguage(lang)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;