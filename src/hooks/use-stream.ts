'use client';

import { useEffect, useState } from 'react';

export function useStream(
  text: string,
  speed = 20,
) {
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput('');

    let index = 0;

    const interval = setInterval(() => {
      index++;

      setOutput(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return output;
}