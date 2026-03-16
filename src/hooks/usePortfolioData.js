import { useData } from "../contexts/DataContext";

const usePortfolioData = () => {
  const { data, loading, error } = useData();

  // Safe defaults while loading
  const safeData = data || {
    projects: [],
    technicalExplorations: [],
    skills: [],
    roles: [],
    headlines: [],
    links: {}
  };

  return { data: safeData, loading, error };
};

export default usePortfolioData;
