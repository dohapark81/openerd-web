// src/components/JSONEditor.tsx
import React, { useState, useEffect } from 'react';

interface JSONEditorProps {
  data: any; // Replace 'any' with your ERD data type
  onDataChange: (newData: any) => void;
}

const JSONEditor: React.FC<JSONEditorProps> = ({ data, onDataChange }) => {
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2));
  }, [data]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(event.target.value);
    try {
      const newData = JSON.parse(event.target.value);
      onDataChange(newData);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <textarea
      value={jsonText}
      onChange={handleChange}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default JSONEditor;