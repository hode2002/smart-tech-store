import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { Editor as TinyMCEEditor, EditorEvent, Events } from 'tinymce';
export type EventHandler<A> = (
    a: EditorEvent<A>,
    editor: TinyMCEEditor,
) => unknown;
type EEventHandler<K extends keyof Events.EditorEventMap> = EventHandler<
    Events.EditorEventMap[K]
>;

type Props = {
    initialValue: string;
    onInit?: EEventHandler<'init'> | undefined;
};
export default function CustomEditor(props: Props) {
    const { initialValue, onInit } = props;
    return (
        <Editor
            onInit={onInit}
            apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_KEY}
            init={{
                menubar: '',
                height: 600,
                plugins: [
                    'advlist',
                    'autolink',
                    'link',
                    'image',
                    'lists',
                    'charmap',
                    'preview',
                    'anchor',
                    'pagebreak',
                    'searchreplace',
                    'wordcount',
                    'visualblocks',
                    'visualchars',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'emoticons',
                    'help',
                ],
                toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            }}
            initialValue={initialValue}
        />
    );
}
