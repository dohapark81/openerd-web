import { useState, useCallback, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => void;
}

const EditableField = ({ value, onSave }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback((event: any) => {
    setFieldValue(event.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onSave(fieldValue);
  }, [fieldValue, onSave]);

  const handleKeyDown = useCallback((event: any) => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setFieldValue(value);
    }
  }, [handleBlur, value]);

  return (
    <div className="editable-field" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={fieldValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="editable-input"
        />
      ) : (
        <span className="field-value">{fieldValue}</span>
      )}
    </div>
  );
};

export default EditableField;
