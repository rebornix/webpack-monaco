define('myModule', ['vs/editor/editor.main'/* , 'vs/basic-languages/src/monaco.contribution' */], function(monaco) {
    var editor = monaco.editor.create(document.getElementById('container'), {
            value: [
                'function foo{',
                '\t',
                '}  '
            ].join('\n'),
            language: 'javascript'
        });
});
