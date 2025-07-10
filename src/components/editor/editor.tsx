"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { githubDark } from "@uiw/codemirror-theme-github";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={githubDark}
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ]}
      onChange={onChange}
      className="h-full"
    />
  );
};