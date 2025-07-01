import Editor from "@monaco-editor/react";

export default function FrontendEditor({ code, setCode, setUrl }) {
  return (
    <div className="pt-2">
      <div className="ml-2 flex flex-row gap-5 mb-3 items-center">
        <h3 className="text-gray-400">Frontend Code</h3>
        <input
          type="text"
          placeholder="Backend url in your code"
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          className="border-2 border-blue-700 py-1 px-3 rounded-md"
        />
      </div>
      <Editor
        height="600px"
        language="javascript"
        value={code}
        onChange={(val) => setCode(val)}
      />
    </div>
  );
}
