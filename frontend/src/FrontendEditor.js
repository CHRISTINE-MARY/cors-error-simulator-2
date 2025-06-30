import Editor from "@monaco-editor/react";

export default function FrontendEditor({ code, setCode }) {
  return (
    <div>
      <h3>Frontend Code</h3>
      <Editor
        height="300px"
        language="javascript"
        value={code}
        onChange={(val) => setCode(val)}
      />
    </div>
  );
}
