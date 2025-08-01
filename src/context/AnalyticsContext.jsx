import { useInitializeAnalytics } from '../services/analyticsService';
const AnalyticsContextProvider = ({ children }) => {
  useInitializeAnalytics();
  return children;
};

export default AnalyticsContextProvider;
