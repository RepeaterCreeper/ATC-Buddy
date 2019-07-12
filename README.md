# ATC Buddy
![](https://img.shields.io/github/license/RepeaterCreeper/ATC-Buddy.svg?style=for-the-badge) ![](https://img.shields.io/github/repo-size/RepeaterCreeper/ATC-Buddy.svg?style=for-the-badge)

ATC Buddy is a work-in-progress desktop application that contains a suite of ATC tools for use on the VATSIM network.

The goal of this project is to increase the simplicity of controlling, lower the amount of human mistakes caused by complex 'Lines of Agreements' and 'Standard Operating Procedures', and promote a generally more pleasureable ATC experience.

### Stack
- Electron (Building desktop application)
- HTML, CSS, and JS (Front-end)
- Node.JS (Backend)

## Implemented Features

- **Basic Info Tool Information** -- All ZLA Info Tool information included by default

- **Automatic Altitude and Squawk Amendments** -- Automatically detect and change invalid altitudes and assign squawks

- **Coordinate Based Events** -- Define an area on your scope, and ATC Buddy will perform a specified action when an aircraft enters the area

## Planned Features

- **More Customizability** -- A customizable application that can be adjusted to satisfy the most practical needs for any for any unique VATSIM controller.

- **Fully Automatic Flight Plan Amendments** -- Check and validate flight plans and automatically correct it as appropriate in accordance with the LOAs and SOPs specified.

- **Facility File Editor** -- An easy and clean environment for editing complex and previously confusing alias and POF files.

- **Voice Channel Finder** -- Display the callsign of the user that is currently talking over an ATC voice channel. (Will be switched to Audio for VATSIM if they have an API)
 
- **Automatic TEC Route Update** -- Automatically check and update TEC routings for your own ARTCC, which can be used in lieu with automatic flight plan amending.

- **Centralized Portal** -- Create a service where designated facility engineers can create and upload LOA and SOP files, for use by their controllers.

## Usage

**FSD Features**
- For all FSD configuration and setup, refer to the `Settings` page within ATC-Buddy

**Coordinate Based Events**
- 1) In the VRC general settings, turn OFF the "Format mouse coordinates DEG/MIN/SEC"
- 2) Open ATC Buddy, go to Settings > Coordinate Based Events > New (+)
- 3) Configure your profile name and border type.
- 4) In VRC, to copy mouse coordinates, press and hold CTRL + ALT + SHIFT then double right click the first corner of the rectangular trigger box (the bottom left corner should be the first). Paste the coordinate set in the ATC-Buddy window, and repeat this process for next three coordinate sets. Make sure everything is separated by spaces.
- 5) Press Create
- 6) Going back to the CBE page, you can configure events for your newly created trigger box.

## Download
[Release Page](https://github.com/RepeaterCreeper/ATC-Buddy/releases)

## Manual Builds
[Electron Packager](https://github.com/electron-userland/electron-packager)
