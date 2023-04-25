/*
ANDROID-COPY-VIDEOS.JS
*/

/* For this project, the video files need to be copied from an SD card
into the app data file upon first launch of the app.

We can't include the videos in the app itself, due to bandwidth limitations as
well as limitations from the Google Play store.

The six video files live in a folder called "npt" in the root directorty of the
SD card.

This all also needs to work when the app is not being loaded by RFF (i.e. if
a random person downloads the app from the store), so we'll host the files on
a server as well, and trigger a direct download from there in the case where
there is no SD card. */

/*jslint browser */
/*global alert, console, cordova, FileTransfer, fetch  */

const filelist = [
    "npt-video-1.mp4", "npt-video-2.mp4", "npt-video-3.mp4",
    "npt-video-4.mp4", "npt-video-5.mp4", "npt-video-6.mp4"
];
  
  
function manageVideos() {
    console.log("Manage Videos");

    // first create list
    
    let vids = filelist.map(n => ({ name:n, status:"unknown" }));
    let nvids = vids.length;
    let shaker;

    // Use the Insomnia plugin to keep the screen active during file transfer
    function keepAppAwake() {
        window.plugins.insomnia.keepAwake();
        console.log("awake");
    }

    function checkAllStatus() {
        let vi = -1;
        shaker = setInterval(keepAppAwake, 1000);
        function next() {
            vi += 1;
            if (vi == nvids) {
                // done all this so show the menu
                showVideoMenu();
                clearInterval(shaker);
                return;
            }
            // check if the reference exists
            window.resolveLocalFileSystemURL( 
                cordova.file.dataDirectory + vids[vi].name,
                // found it
                (details) => { 
                    vids[vi].status = "AVAILABLE";
                    next();
                },
                // no such file
                () => { 
                    vids[vi].status = "MISSING";
                    next();
                }
            );
        }
        next();
    }

    // are any missing
    function needVids() { 
        return vids.some(v => v.status == "MISSING")
    }


    function showVideoMenu() {
        let required = needVids();
        
        document.getElementById("videopanel").classList.toggle("visuallyhidden", !required);
        if (!required) return;
        
        updateVideoStatus("Some video files are required by this application.", true);
        
        // bind the buttons
        document.getElementById("videocopy").onclick = () => {
            document.getElementById("videofilelist").click();
        }
        
        document.getElementById("videodownload").onclick = () => {
            downloadFromNet();
        }
        
        document.getElementById("videoskip").onclick = () => {
            document.getElementById("videopanel").classList.toggle("visuallyhidden", true);
        }

        // when files are selected
        document.getElementById("videofilelist").onchange = () => {
            let files = document.getElementById("videofilelist").files;
            console.log(files);
            copyFromFileList(files);
        }
    }


    function updateVideoStatus(message, showMenu) {
        document.getElementById("videomenu").classList.toggle("visuallyhidden", !showMenu);
        document.getElementById("videomessage").innerHTML = message;
        document.getElementById("videostatuslist").innerHTML = vids.map(v => v.name + " - " + v.status).join("\n");
    }

    function copyFromFileList(files) {
        // match each if we can
        for (i = 0; i < files.length; i += 1) { 
            let file = files.item(i);
            let match = vids.find(v => v.name == file.name);
            if (match) {
                match.fromFile = file;
            }
        }
        
        let vi =- 1;
        shaker = setInterval(keepAppAwake, 1000);
        function next() {
            updateVideoStatus("Starting Copy", false);
            vi += 1;
            if (vi == nvids) {
                showVideoMenu();
                clearInterval(shaker);
                return;
            }
            if (!vids[vi].fromFile) { 
                // we don't have a file to get it from
                next(); 
                return; 
            }
            copyFileToStorage(vids[vi].fromFile,
                (perc) => { // progress
                    vids[vi].status = "COPYING " + perc + "%";
                    updateVideoStatus("Copying...", false);
                },
                () => { // successfully
                    console.log("success file copy!")
                    vids[vi].status = "AVAILABLE";
                    vids.fromFile = null; // clear any file data and free it
                    next();
                },
                () => { // failed
                    console.log("failed file copy!")
                    vids[vi].status = "MISSING";
                    vids.fromFile = null; // clear any file data and free it
                    next();
                }
            )
        }
        next();
    }


    function downloadFromNet() {
        fetch("https://rff.ebw.co/URLList.json")
        .then((response) => response.text())
        .then((text) => {
            const jsonData = JSON.parse(text);
            downloadFromURLList(jsonData.dataPairList)
        });
    }

    function downloadFromURLList(files) {
        console.log(files);
        for (i = 0; i < files.length; i += 1) { // match each if we can
            let match = vids.find(v => v.name == files[i][0]);
            if (match) {
                match.fromURL = files[i][1];
            }
        }
        
        let vi =- 1;
        shaker = setInterval(keepAppAwake, 1000);
        
        function next() {
            updateVideoStatus("Starting Download", false);
            vi += 1;
            if (vi == nvids) {
                showVideoMenu();
                clearInterval(shaker);
                return;
            }
            if ((vids[vi].status == "AVAILABLE") || (!vids[vi].fromURL)) { 
                // we don't need it or don't have a URL to get it from
                next();
                return; 
            }

            // Use the cordova-plugin-file-transfer plugin to downlaod the file
            console.log("create file transfer", vids[vi].fromURL, cordova.file.dataDirectory + vids[vi].name)
            
            let fileTransfer = new FileTransfer();
            fileTransfer.onprogress = (p) => {
                let perc = Math.round(p.loaded * 100 / (p.total + 1));
                vids[vi].status = "Downloading " + perc + "%";
                updateVideoStatus("Downloading...");
            };
            
            fileTransfer.download(
                vids[vi].fromURL,
                cordova.file.dataDirectory + "TMP_" + vids[vi].name,
                () => {
                    console.log("got file")
                    renameFile("TMP_" + vids[vi].name, vids[vi].name)
                    vids[vi].status = "AVAILABLE";
                    vids.fromURL = null; // clear any URL
                    next();
                },
                () => {
                    console.log("failed download")
                    vids[vi].status = "MISSING";
                    vids.fromURL = null; // clear any URL
                    next();
                }
            )
        }
        next();
    }
    
    checkAllStatus(); // actually start these checks
}


function renameFile(oldName, newName) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry) => {
        dirEntry.getFile(oldName, {  }, (oldFile) => {
            oldFile.moveTo(
                dirEntry,
                newName,
                () => console.log("rename complete"), 
                () => console.log("rename failed")
            );
        });
    });
}

function copyFileToStorage(file, pcb, scb, fcb) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, (dirEntry) => {
        dirEntry.getFile(
            "TMP_" + file.name, 
            {create: true, exclusive: false}, 
            (fileEntry) => {
                fileEntry.createWriter((fileWriter) => {
                    let BLOCK_SIZE = 1000000;
                    let written = 0;
                    function writeNext() {
                        var sz = Math.min(BLOCK_SIZE, file.size - written);
                        if (sz <= 0) {
                            renameFile("TMP_" + file.name, file.name);
                            scb();
                            return; // all done
                        }
                        var sub = file.slice(written, written + sz);
                        pcb(Math.round(written * 100 / file.size));
                        written += sz;
                        fileWriter.write(sub);
                    }
                
                    fileWriter.onwrite = function() {
                        writeNext();
                    };

                    fileWriter.onerror = function(e) {
                        console.log("Failed file write: " + e.toString());
                        fcb();
                    };

                    fileWriter.onabort = function(e) {
                        console.log("aborted: " + e.toString());
                        fcb();
                    };

                    writeNext();
                })
            },
            (e) => {
                fcb();
            }
        );
    }, (e) => {
        fcb();
    });
}


// Wait for the cordova file plugin to load, before trying to sort out the videos
document.addEventListener("deviceready", function() {
    "use strict";
    
    if (window.isFilePluginReadyRaised) {
        manageVideos();
    } else {
        document.addEventListener(
            "filePluginIsReady",
            manageVideos(),
            false
        );
    }
});

/*
ANDROID-OPEN-PDF.JS
*/

// Android apps need to use a plugin to open local pdf files
// but these files first need to be moved from inside the app to
// the external data directory, because the pdf viewer doesn't have
// permission to go inside the app to look for them.

// https://www.raymondcamden.com/2016/06/26/linking-to-pdfs-in-cordova-apps
// https://github.com/pwlin/cordova-plugin-file-opener2/issues/28#issuecomment-218442994


function copyPDF(filename) {
	'use strict';
	window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + '/www/downloads/' + filename, function (fileEntry) {
	    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
	        fileEntry.copyTo(dirEntry, filename, function (newFileEntry) {
	            cordova.plugins.fileOpener2.open(newFileEntry.nativeURL, 'application/pdf');
	        });
	    });
	});
}

function preparePDFButtons() {
	var downloadPDFButtons = document.querySelectorAll('.download-pdf');
	downloadPDFButtons.forEach(function (button) {
		button.addEventListener('click', function () {
			event.preventDefault();
			var filename = event.target.href.split('/').pop();
			copyPDF(filename);
		});
	});
}

if (window.isFilePluginReadyRaised) {
	preparePDFButtons();
} else {
	document.addEventListener('filePluginIsReady', preparePDFButtons(), false);
}

