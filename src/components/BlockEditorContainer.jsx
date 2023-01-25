import IsolatedBlockEditor, { EditorLoaded, DocumentSection, ToolbarSlot, CollaborativeEditing } from '@automattic/isolated-block-editor';


export default function BlockEditorContainer(){
    function onLoad( content, parser, rawHandler ) {
        console.log('loading here')
        // Does the content contain blocks?
        if ( content.indexOf( '<!--' ) !== -1 ) {
            // Parse the blocks
            return parser( content );
        }
    
        // Raw HTML - do our best
        return rawHandler( { HTML: content } );
    }

    const settings = {
        iso: {},
        editor: {}
    }
    return(
        <IsolatedBlockEditor
        settings={settings}
        onLoad={( parser, rawHandler ) => onLoad('<p>Here is text</p>', parser, rawHandler)}
        >
            <EditorLoaded onLoaded={ () => {console.log('loaded')} } onLoading={ () => {console.log('loading')} } />
		   <DocumentSection>Extra Information</DocumentSection>
        </IsolatedBlockEditor>
    )
}