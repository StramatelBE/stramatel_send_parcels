import PollIcon from '@mui/icons-material/Poll';
import { Box, Skeleton } from '@mui/material';
import { useState } from 'react';
import { createEditor, Editor, Transforms } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import Container from '../../../components/ContainerComponents';
import useLoadingStore from '../../../stores/loadingStore';
import useData from '../hooks/useData';
import dataStore from '../stores/dataStore';
function DataComponents() {
  const { isLoading } = useLoadingStore();
  return (
    <Container
      icon={Icon()}
      title="Data"
      content={
        isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                style={{
                  height: '50px',
                  width: '95%',
                  marginLeft: '2.5%',
                  marginRight: '2.5%',
                  marginBottom: index === 2 ? '0' : '10px',
                  borderRadius: '10px',
                }}
              />
            ))}
          </>
        ) : (
          <Data />
        )
      }
    />
  );
}

function Icon() {
  return <PollIcon sx={{ color: 'primary.light' }} />;
}

function Data() {
  const { data } = dataStore();
  const { updateData } = useData();
  const [editor] = useState(() => {
    const e = withReact(createEditor());

    // Surcharge de la méthode insertFragment pour gérer le glisser-déposer
    const { insertFragment } = e;
    e.insertFragment = (fragment) => {
      const targetNode = Editor.node(e, e.selection.anchor.path)[0];
      const targetText = targetNode.children[0].text;
      const fragmentText = fragment
        .map((node) => node.children[0].text)
        .join('');

      // Calculer la longueur finale après l'insertion
      const finalLength = targetText.length + fragmentText.length;

      // Si la longueur dépasse MAX_CHARS, annuler l'opération
      if (finalLength > MAX_CHARS) {
        return;
      }

      insertFragment(fragment);
    };

    return e;
  });

  const MAX_PARAGRAPHS = 10;
  const MAX_CHARS = 12;

  const parseValue = (item) => {
    try {
      const parsed = JSON.parse(item.value);
      return parsed.slice(0, MAX_PARAGRAPHS);
    } catch {
      return [
        {
          type: 'paragraph',
          children: [{ text: item.value || '' }],
        },
      ];
    }
  };

  const handleEditorChange = (value, item) => {
    const isValid = value.every(
      (node) => node.children[0].text.length <= MAX_CHARS
    );

    if (isValid) {
      const limitedValue = value.slice(0, MAX_PARAGRAPHS);
      const newData = {
        ...item,
        value: JSON.stringify(limitedValue),
      };
      updateData(newData);
    }
  };

  const insertNewParagraph = () => {
    Transforms.splitNodes(editor, { always: true });
  };

  const handleKeyDown = (event) => {
    const { selection } = editor;
    if (!selection) return;

    const currentNode = editor.children[selection.anchor.path[0]];
    const currentText = currentNode.children[0].text;

    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Enter',
      'Home',
      'End',
    ];

    if (event.key === 'Enter') {
      if (editor.children.length >= MAX_PARAGRAPHS) {
        event.preventDefault();
      }
      return;
    }

    const hasSelection =
      selection && selection.anchor.offset !== selection.focus.offset;

    if (
      !hasSelection &&
      currentText.length >= MAX_CHARS &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();

      if (editor.children.length < MAX_PARAGRAPHS) {
        insertNewParagraph();
        editor.insertText(event.key);
      }
    }
  };

  return (
    <form>
      {data.map((item, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          {item.type === 'EDIT' && (
            <>
              <Slate
                editor={editor}
                initialValue={parseValue(item)}
                onChange={(value) => handleEditorChange(value, item)}
              >
                <Editable
                  className="LiberationMono-Bold"
                  onKeyDown={handleKeyDown}
                  style={{
                    fontFamily: 'G552 mono',
                    fontWeight: 'bold',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    height: '100%',
                  }}
                />
              </Slate>
              <div
                style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}
              >
                {editor.children.length}/{MAX_PARAGRAPHS}
              </div>
            </>
          )}
        </Box>
      ))}
    </form>
  );
}

export default DataComponents;
