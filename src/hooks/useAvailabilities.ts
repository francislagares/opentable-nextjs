import axios from 'axios';
import { useState } from 'react';

interface Query {
  slug: string;
  day: string;
  time: string;
  partySize: string;
}

interface Data {
  time: string;
  available: boolean;
}

const useAvailabilities = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<Data[] | null>(null);

  const fetchAvailabilities = async ({ slug, partySize, day, time }: Query) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        },
      );

      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
      console.log(error);
    }
  };

  return {
    loading,
    error,
    data,
    fetchAvailabilities,
  };
};

export default useAvailabilities;
