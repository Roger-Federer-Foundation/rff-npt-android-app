# *Natural Playgrounds Toolkit* Android app

An Android app version of the Natural Playgrounds Toolkit manual, built using Cordova. 

A number of Cordova plugins are required to ensure the full functionality of the app:

| Plugin | Function |
|---|---|
| cordova-plugin-androidx-adapter | Compatibilty with latest Android versions |
| cordova-plugin-file | Prerequisite for other plugins |
| cordova-plugin-filepath | Reading filepaths for file transfer |
| cordova-plugin-file-opener2 | Opening PDF files included in the app |
| cordova-plugin-file-transfer-latest | Copying files from SD card to device |
| cordova.plugins.diagnostic | Determining location of SD card |
| cordova-plugin-block-app-exit | Preventing users from accessing settings outside the managed environment |
| cordova-plugin-elk-files-share | Copying files from SD card to device |
| com-darryncampbell-cordova-plugin-intent | Required for file share |
| cordova-plugin-progressdialog | Required for file share |


## If this is your first time...

Before building the app for the first time, ensure your system includes

* Android studio [latest] (instructions [here](https://developer.android.com/studio/install))
* Java Developer Kit [11] (instructions [here](https://www.oracle.com/java/technologies/downloads/#java11))
* Cordova [latest] (instructions [here](https://cordova.apache.org/docs/en/latest/guide/cli/#installing-the-cordova-cli))

## Build

### HTML

To update the contents of the app, copy the entire `www` folder from the `Roger-Federer-Foundation/rff-npt-built-html` repo into the root of this repo.

### JavaScript

The interactivity in the app is all contained in one JavaScript file, at `www/assets/js/bundle.js`. The functionality pertaining to copying video files from an SD card is currently between lines 2493 and 2752 of this file.

Some notable features about this functionality:
- 

### APK

1. Add the correct version of cordova-android.

- `cordova platform remove android`
- `cordova platform add android@10`

2. Install the plugins.

- `cordova plugin add cordova-plugin-androidx-adapter`
- `cordova plugin add cordova-plugin-file`
- `cordova plugin add cordova-plugin-filepath`
- `cordova plugin add cordova-plugin-file-opener2`
- `cordova plugin add cordova-plugin-file-transfer-latest`
- `cordova plugin add cordova.plugins.diagnostic`
- `cordova plugin add cordova-plugin-insomnia`
- `cordova plugin add https://github.com/digitres/cordova-plugin-block-app-exit.git`
- `cordova plugin add com-darryncampbell-cordova-plugin-intent`
- `cordova plugin add cordova-plugin-progressdialog`
- `cordova plugin add https://github.com/digitres/cordova-plugin-elkFilesShare.git`

3. Build the app.

- `cordova build android` 

The output of this command will end with the filepath of the built `apk`. Install this on an Android device for testing.

## Test

First, ensure that the [ELK File Manager](https://play.google.com/store/apps/details?id=org.rff.digitres.elkfilemanager) app is installed. Open it, and grant it any necessary permissions, before continuing with testing. Then:

- Copy the `apk` onto an Android device. 
- If testing the video transfer functionality, copy the videos files listed [here](https://rff.ebw.co/URLList.json) to a folder called `npt` on an SD card, and insert the card into the device.
- Install the app.

## Release

Once you're satisfied with the app, build a signed Android App Bundle to upload to the Google Play store. Read more about app signing [here](https://developer.android.com/studio/publish/app-signing). 

A few important components are required to build the release version:

* keystore: this is a private cryptographic key linked to the specific application. It is stored by Electric Book Works, and needs to be downloaded onto your local machine so that you can use its filepath.
* build.json: this is a JSON file that contains the path to the keystore as well as some important information and passwords. These details are kept by Electric Book Works. The file `build-example.json` has been included in the repo as a template for the structure of `build.json`.

Increment the version number in the header of `config.xml`. Google Play will not let you upload an app with an exisiting version number.

Then run the following

`cordova build android --release`

The output of the this command will end with the filepath of the built `app-release.aab`. Signed apps cannot be tested locally (i.e. without having been downloaded from the Play store) so make sure that you are completely satisfied with your local testing before you build a release version. 

Then upload the `aab` to the Google Play store. Instructions on how to do this can be found on the Android developer site [here](https://play.google.com/console/about/guides/releasewithconfidence/).

## Support

For any further information or troubleshooting help, contact [it@electricbookworks.com](mailto:it@electricbookworks.com).