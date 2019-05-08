cleaned multiconvis (by Enamul Hoque) by Patrick Boutet and Amon Ge 2018
`delta/gamma`: sample testing with EAO dataset
`iphone`: iphone dataset with no topic hierarchy

---
old docs:

On local disk (external hard drive):
/Volumes/ExFatStore/ConvisBackend_180507/iConVisage/Segmentation/Code_Blogs/ShallowTopicTree/src/Labeling/Code/Model/bin/MultiConVisIT

(reference link: https://github.com/Microsoft/vscode-chrome-debug#cannot-connect-to-the-target-connect-econnrefused-1270019222)
To get it running in debug mode in vscode and chrome
1. install the crhome debugger extension for vs Code
2. with vscode open the folder that has the index.html file in it
3. setup a launch config in vscode debugging tab
Should look like this:
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [

        {
            "name": "Launch index.html",
            "type": "chrome",
            "request": "launch",
            "runtimeArgs":["--allow-file-access-from-files"],
            "userDataDir": true,
            "url": "http://localhost:8080",
            "file": "${workspaceFolder}/index.html?a=iphone&userid=100&interface=2"
        }
    ]
}

- workspaceFolder is the folder you told vscode to open
4. set the file to open
5. run the debugger in vscode

For a turorial on how to properly use the avaliabel debug tools in vscode and the chrome debugger extension see here
- https://www.sitepoint.com/debugging-javascript-projects-vs-code-chrome-debugger/


dataProcessingColleciton.js
- Written by Enamul 


