import Editor from "@monaco-editor/react";

export default function BackendEditor({ code, setCode }) {
  return (
    <div>
      <h3>Backend Code (Flask)</h3>
      <Editor
        height="300px"
        language="python"
        value={code}
        onChange={(val) => setCode(val)}
      />
    </div>
  );
}
