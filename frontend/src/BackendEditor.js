import Editor from "@monaco-editor/react";

export default function BackendEditor({ code, setCode,backendUrl }) {
  return (
    <div className="pt-2">
      <div className="ml-2 flex flex-row gap-5 mb-3 items-center">
        <h3 className="text-gray-400">Backend Code</h3>
        <input
          type="text"
          readOnly
          value={backendUrl}
          placeholder="Backend url in your code"
          className="border-2 border-blue-200 py-1 px-3 rounded-md text-gray-500"
        />
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
