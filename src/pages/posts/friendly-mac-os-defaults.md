---
title: Friendly macOS defaults
date: 2018-03-01
---

Over the years I’ve discovered an array of OS X defaults that make my life easier and performing tasks quicker. One of the reasons I learnt Vim was because I was using my mouse far too much for repetitive tasks.

You should know what you’re doing when using the Terminal. Don’t blame me when you break something 👊.

## Developer happiness

### Faster keyboard response

```shell
defaults write NSGlobalDomain KeyRepeat -int 0.02
```

### Reduced key repeat delay

```shell
defaults write NSGlobalDomain InitialKeyRepeat -int 12
```

### UTF-8 Terminal happiness

```shell
defaults write com.apple.terminal StringEncodings -array 4
```

### Protect your code

This might not be a developer friendly default, but you can keep your code secure when your screensaver starts and you have to leave your hot desk.

```shell
defaults write com.apple.screensaver askForPassword -int 1
defaults write com.apple.screensaver askForPasswordDelay -int 0
```

## Overall nice-to-haves

These aren't developer specific but really helpful. 💯

### Silence your boot chime

```shell
sudo nvram SystemAudioVolume=" "
```

### Increase the Dock show/hide speed

If you have to use the Dock, speed up the time it animates in and out.

```shell
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock
```

### Save/Print Modals

Expanding the Save and Print modals in OS X is a repetitive task and is something you can set to always show if you know how to.

```shell
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true

defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
```

### Return of `~/Library`

Maybe you're a frequent visitor of the ~/Library folder. I always forget the ALT shortcut when in Finder to show `~/Library`.

```shell
chflags nohidden ~/Library
```

### Create prettier screenshots in OS X

Window captures come with a shadow effect by default. **You can remove it.**

```shell
defaults write com.apple.screencapture disable-shadow -bool true
```

### 'Are you sure you want to open this application?'

Open an application from the web without being asked if that's what you really want to do.

```shell
defaults write com.apple.LaunchServices LSQuarantine -bool false
```

Alternatively, you might want to allow apps downloaded from "Anywhere" allowed to be opened.

```shell
sudo spctl - master-disable
```

### Disable Time Machine annoying dialogs

You'll store your documents and photos in iCloud, your code on GitHub and your music on Spotify. Time Machine doesn't need to ask you if you want to use any storage devices as a backup drive.

```shell
defaults write com.apple.TimeMachine DoNotOfferNewDisksForBackup -bool true
```

If you've got any other Mac OS X defaults, please leave a comment to share with others. 👌
