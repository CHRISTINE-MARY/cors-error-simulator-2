import Editor from "@monaco-editor/react";

export default function BackendEditor({ code, setCode}) {
  return (
    <div className="pt-2">
      <div className="ml-2 flex flex-row gap-5 mb-3 items-center">
        <h3 className="text-gray-400">Backend Code</h3>
      
      </div>
      <Editor
        height="600px"
       
        language="python"
        value={code}
        onChange={(val) => setCode(val)}
      />
    </div>
  );
}
