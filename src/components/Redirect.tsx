import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Redirect({ url }: { url: string }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(url);
  }, [navigate, url]);

  return <div>Redirect</div>;
}
