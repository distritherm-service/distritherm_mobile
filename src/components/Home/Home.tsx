import React, { useState, useEffect } from 'react';
import HomePresenter from './HomePresenter';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Any additional state management for the Home screen can be added here
  
  return (
    <HomePresenter 
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Home; 