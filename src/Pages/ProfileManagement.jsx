import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { getUnitedStatesUniversities } from '../data/universities';
import { majors } from '../data/majors';
import { disciplines } from '../data/disciplines';
import { useNavigate } from 'react-router-dom';

const timeZones = [
  "Eastern Standard Time (EST)",
  "Central Standard Time (CST)",
  "Mountain Standard Time (MST)",
  "Pacific Standard Time (PST)",
  "Alaska Standard Time (AKST)",
  "Hawaii-Aleutian Standard Time (HST)",
];

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    major: '',
    gradYear: '',
    university: '',
    timeZone: '',
    discipline: '',
    avatar: '',
    first_name: '',
    last_name: '',
    github_url: '',
    linkedin_url: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [filteredMajors, setFilteredMajors] = useState([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState([]);
  const [filteredTimeZones, setFilteredTimeZones] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    university: false,
    major: false,
    discipline: false,
    timeZone: false,
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          console.log('No user logged in');
          return;
        }

        // Fetch the user's profile
        const { data: profile, error } = await supabase
          .from('UserProfile')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
          return;
        }

        // Populate the form fields with the fetched profile data
        setProfileData((prevData) => ({
          ...prevData,
          major: profile.major || '',
          gradYear: profile.grad_year || '',
          university: profile.university || '',
          timeZone: profile.time_zone || '',
          discipline: profile.discipline || '',
          avatar: profile.avatar_url || user.user_metadata.avatar_url || '',
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          github_url: profile.github_url || '',
          linkedin_url: profile.linkedin_url || '',
        }));
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    filterSuggestions(name, value);
  };

  const filterSuggestions = (field, value) => {
    if (value.trim() === '') {
      setShowSuggestions((prev) => ({ ...prev, [field]: false }));
      return;
    }

    switch (field) {
      case 'university':
        setFilteredUniversities(
          getUnitedStatesUniversities().filter((u) =>
            u.toLowerCase().includes(value.toLowerCase())
          )
        );
        setShowSuggestions((prev) => ({ ...prev, university: true }));
        break;
      case 'major':
        setFilteredMajors(
          majors.filter((m) =>
            m.toLowerCase().includes(value.toLowerCase())
          )
        );
        setShowSuggestions((prev) => ({ ...prev, major: true }));
        break;
      case 'discipline':
        setFilteredDisciplines(
          disciplines.filter((d) =>
            d.toLowerCase().includes(value.toLowerCase())
          )
        );
        setShowSuggestions((prev) => ({ ...prev, discipline: true }));
        break;
      case 'timeZone':
        setFilteredTimeZones(
          timeZones.filter((tz) =>
            tz.toLowerCase().includes(value.toLowerCase())
          )
        );
        setShowSuggestions((prev) => ({ ...prev, timeZone: true }));
        break;
      default:
        break;
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
  
      if (!userId) {
        throw new Error('User must be logged in to upload an avatar.');
      }
  
      const filePath = `avatars/${userId}/${file.name}`;
  
      // Upload the file to the bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
  
      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw new Error('Failed to upload avatar.');
      }
  
      // Fetch the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
  
      if (publicUrlData?.publicUrl) {
        setProfileData((prevData) => ({ ...prevData, avatar: publicUrlData.publicUrl }));
        setAvatarFile(file);
      } else {
        throw new Error('Failed to retrieve public URL for the avatar.');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
      alert('Failed to upload avatar. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    try {
      let avatarUrl = profileData.avatar;

      // Handle avatar upload
      if (avatarFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`public/${avatarFile.name}`, avatarFile, { upsert: true });

        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          throw new Error('Failed to upload avatar');
        }

        avatarUrl = `${supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl}`;
      }

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session retrieval error:', sessionError);
        throw new Error('No user session found.');
      }

      // Save or update profile data
      const { error: upsertError } = await supabase.from('UserProfile').upsert({
        user_id: session.user.id,
        major: profileData.major,
        grad_year: profileData.gradYear,
        university: profileData.university,
        time_zone: profileData.timeZone,
        discipline: profileData.discipline,
        avatar_url: avatarUrl,
        profile_complete: true,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        github_url: profileData.github_url,
        linkedin_url: profileData.linkedin_url,
      });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw new Error('Failed to save profile to the database');
      }

      alert('Profile saved successfully!');
      navigate('/posts'); // Redirect to another page
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    }
  };

  const gradYearOptions = Array.from({ length: 13 }, (_, i) => 2018 + i);
  return (
    <div className="profile-management max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-gray-300">
          <img
            src={profileData.avatar || 'https://via.placeholder.com/150'}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <label className="block text-center">
          <span className="text-sm font-medium">Upload Avatar</span>
          <input
            type="file"
            onChange={handleAvatarUpload}
            className="hidden"
            id="avatarUpload"
          />
          <label
            htmlFor="avatarUpload"
            className="block mt-2 px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md cursor-pointer hover:bg-blue-100"
          >
            Choose File
          </label>
        </label>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Manage Profile</h2>

      <form className="bg-white p-8 rounded-xl space-y-6">
  {/* First Name and Last Name */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-gray-700">First Name:</label>
      <input
        type="text"
        name="first_name"
        value={profileData.first_name}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your first name"
      />
    </div>
    <div className="space-y-2">
      <label className="block text-lg font-semibold text-gray-700">Last Name:</label>
      <input
        type="text"
        name="last_name"
        value={profileData.last_name}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your last name"
      />
    </div>
  </div>

  {/* Major */}
  <div className="space-y-2">
    <label className="block text-lg font-semibold text-gray-700">Major:</label>
    <input
      type="text"
      name="major"
      value={profileData.major}
      onChange={handleInputChange}
      onFocus={() => setShowSuggestions((prev) => ({ ...prev, major: true }))}
      onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, major: false })), 100)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your major"
    />
    {showSuggestions.major && (
      <ul className="border border-gray-300 rounded-lg mt-2 bg-white max-h-40 overflow-y-auto shadow-md">
        {filteredMajors.map((major, index) => (
          <li
            key={index}
            className="p-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setProfileData((prev) => ({ ...prev, major }));
              setShowSuggestions((prev) => ({ ...prev, major: false }));
            }}
          >
            {major}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Graduation Year */}
  <div className="space-y-2">
    <label className="block text-lg font-semibold text-gray-700">Graduation Year:</label>
    <select
      name="gradYear"
      value={profileData.gradYear}
      onChange={handleInputChange}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Select Year</option>
      {gradYearOptions.map((year, index) => (
        <option key={index} value={year}>
          {year}
        </option>
      ))}
    </select>
  </div>

  {/* University */}
  <div className="space-y-2">
    <label className="block text-lg font-semibold text-gray-700">University:</label>
    <input
      type="text"
      name="university"
      value={profileData.university}
      onChange={handleInputChange}
      onFocus={() => setShowSuggestions((prev) => ({ ...prev, university: true }))}
      onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, university: false })), 100)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your university"
    />
    {showSuggestions.university && (
      <ul className="border border-gray-300 rounded-lg mt-2 bg-white max-h-40 overflow-y-auto shadow-md">
        {filteredUniversities.map((university, index) => (
          <li
            key={index}
            className="p-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setProfileData((prev) => ({ ...prev, university }));
              setShowSuggestions((prev) => ({ ...prev, university: false }));
            }}
          >
            {university}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Time Zone */}
  <div className="space-y-2">
    <label className="block text-lg font-semibold text-gray-700">Time Zone:</label>
    <input
      type="text"
      name="timeZone"
      value={profileData.timeZone}
      onChange={handleInputChange}
      onFocus={() => setShowSuggestions((prev) => ({ ...prev, timeZone: true }))}
      onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, timeZone: false })), 100)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your time zone"
    />
    {showSuggestions.timeZone && (
      <ul className="border border-gray-300 rounded-lg mt-2 bg-white max-h-40 overflow-y-auto shadow-md">
        {filteredTimeZones.map((timeZone, index) => (
          <li
            key={index}
            className="p-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setProfileData((prev) => ({ ...prev, timeZone }));
              setShowSuggestions((prev) => ({ ...prev, timeZone: false }));
            }}
          >
            {timeZone}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Discipline */}
  <div className="space-y-2">
    <label className="block text-lg font-semibold text-gray-700">Discipline:</label>
    <input
      type="text"
      name="discipline"
      value={profileData.discipline}
      onChange={handleInputChange}
      onFocus={() => setShowSuggestions((prev) => ({ ...prev, discipline: true }))}
      onBlur={() => setTimeout(() => setShowSuggestions((prev) => ({ ...prev, discipline: false })), 100)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter your discipline"
    />
    {showSuggestions.discipline && (
      <ul className="border border-gray-300 rounded-lg mt-2 bg-white max-h-40 overflow-y-auto shadow-md">
        {filteredDisciplines.map((discipline, index) => (
          <li
            key={index}
            className="p-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setProfileData((prev) => ({ ...prev, discipline }));
              setShowSuggestions((prev) => ({ ...prev, discipline: false }));
            }}
          >
            {discipline}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* GitHub Section */}
  <div className="space-y-2 flex items-center gap-4">
    <label className="block text-lg font-semibold text-gray-700">GitHub:</label>
    <div className="flex items-center gap-2">
      <img src="/github-mark.svg" alt="GitHub" className="w-6 h-6" />
      <input
        type="url"
        name="github_url"
        value={profileData.github_url}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="https://github.com/username"
      />
    </div>
  </div>

  {/* LinkedIn Section */}
  <div className="space-y-2 flex items-center gap-4">
    <label className="block text-lg font-semibold text-gray-700">LinkedIn:</label>
    <div className="flex items-center gap-2">
      <img src="/linkedin-logo.svg" alt="LinkedIn" className="w-6 h-6" />
      <input
        type="url"
        name="linkedin_url"
        value={profileData.linkedin_url}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="https://linkedin.com/in/username"
      />
    </div>
  </div>

  {/* Save Button */}
  <div className="text-center mt-4">
    <button
      type="button"
      onClick={handleSaveProfile}
      className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all"
    >
      Save Profile
    </button>
  </div>
</form>
    </div>
  );
};

export default ProfileManagement;