# *Natural Playgrounds Toolkit* Android app

An Android app version of the Natural Playgrounds Toolkit manual, built using Cordova. 

Features to note for building the app:

* The toolkit contains six large video files. Since the Google Play store limits the filesize on APKs to 100MB, an expansion file is used to ship the videos. This requires the [xAPKReader cordova plugin](https://github.com/erobertson42/cordova-plugin-xapkreader/tree/cordova-9).
* The toolkit also contains a number of PDF worksheets, which ship with the app (rather than being accessed online). The [file plugin](https://github.com/apache/cordova-plugin-file) and the [file-opener plugin](https://github.com/pwlin/cordova-plugin-file-opener2) are required to be able to open locally-stored PDF files in a Cordova app.
* These instructions are intended for use on MacOS or a Linux OS, and have not been tested on Windows.

These plugins have already been added to this project, so installation should not be necessary, but the installation steps are outlined below in case.

## If this is your first time...

If this is the first time you're setting up your machine to build the app, you'll need to install

* Android studio (instructions [here](https://developer.android.com/studio/install))
* Java Developer Kit 8 (instructions [here](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html))
* Cordova (instructions [here](https://cordova.apache.org/docs/en/latest/guide/cli/#installing-the-cordova-cli))

## Build

### Expansion file

The expansion file containing the original six videos has already been uploaded to the Google Play store and shipped with the first version of the app.

In the event that any of the videos for this project have been updated, you will need to create a patch file. This step is not needed if the videos have not been changed.

Download the updated video files and place them in the folder called `patch`. In order to create the patch file, run the following commands in the terminal:

`zip -0 -j patch patch/*`
`mv patch.zip patch.1.com.electricbookworks.rff.npt.obb`

This `obb` file is now ready to be uploaded to the Google Play store as a patch to the original expansion file. 

### HTML

To update the content of the app, build app-ready HTML in the `Roger-Federer-Foundation/rff-natural-playgrounds` repo. Copy the contents of the resulting `_site/app/www` into this repo's `www` folder. 

### APK

Now we can build the new app file. 

`cordova platform remove android`
`cordova platform add android@8.0.0`

This is the point where, if we need to, we should install the neccessary cordova plugins. 

`cordova plugin add cordova-plugin-file`
`cordova plugin add cordova-plugin-file-opener2`
`cordova plugin add https://github.com/erobertson42/cordova-plugin-xapkreader.git#cordova-9 --variable XAPK_PUBLIC_KEY="YOUR_GOOGLE_PLAY_LICENSE_KEY" --variable XAPK_EXPANSION_AUTHORITY="com.electricbookworks.rff.npt"`

The license key needs to come from the Google Play developers console, under Development Tools > Services and APIs in the sidebar. It looks like `MIIBIjANBgk...DAQAB`.

Now we can build the app.

`cordova build android`

The output of this command will end with the filepath of the built `apk`. You can now install this on an Android device for testing.

## Test

* Download the `apk` onto your Android device. 
* Install the app. **Do not open it yet.**
* Download the `obb` file(s) onto your device (if you have made one).
* Navigate to `Android/obb` within the file structure of the device, and create a folder called `com.electricbookworks.rff.npt`.
* Move the `obb` into this folder.
* Now you can open the app and test it. If you haven't built a new `obb`, the videos will not play.

## Release

Once you're satisfied with the app, it's time to build a signed release version to upload to the Google Play store. You can read more about app signing [here](https://developer.android.com/studio/publish/app-signing). 

You will need a few important components to build the release version:

* keystore: this is a private cryptographic key linked to the specific application. It is stored by Electric Book Works, and needs to be downloaded onto your local machine so that you can use its filepath.
* build.json: this is a JSON file that contains the path to the keystore as well as some important information and passwords. These details are kept by Electric Book Works.

You also need to increment the version number in the header of `config.xml`. Google Play will not let you upload an app with an exisiting version number.

Then run the following

`cordova build android --release`

The output of the this command will end with the filepath of the built `app-release.apk`. Signed apps cannot be tested locally (i.e. without having been downloaded from the Play store) so make sure that you are completely satisfied with your local testing before you build a release version. 

Then you'll get `app-release.apk` which can be uploaded to the Play Store. Instructions on how to do this can be found on the android developer site [here](https://developer.android.com/distribute/best-practices/launch). 