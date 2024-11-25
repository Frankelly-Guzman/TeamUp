import universitiesData from './world_universities_and_domains.json';

export const getUnitedStatesUniversities = () => {
  return universitiesData
    .filter(university => university.country === 'United States')
    .map(university => university.name);
};