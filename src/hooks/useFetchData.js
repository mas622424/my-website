// src/hooks/useFetchData.js
import { useEffect, useState } from 'react';

const useFetchData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => console.error('Error fetching data: ', error));
    }, []);

    return { data, loading };
};

export default useFetchData;
