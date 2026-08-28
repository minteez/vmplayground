# VM Playground

Build a polished, interactive web application called “VM Lab” — a browser-based Virtual Machine Laboratory combined with a simulated Operating System playground.

The application should feel like a simplified combination of a virtualisation manager such as VirtualBox/VMware, a computer operating system desktop, and an educational operating-system laboratory. The purpose is to let users create simulated virtual machines, configure their virtual hardware, start them, watch a simulated boot process, and interact with fictional operating systems inside the browser. This is a simulation only: do not execute real virtual machines, access the host operating system, run real shell commands, access local files, or perform any potentially unsafe system operations.

CORE CONCEPT

The user should be able to:

Create a virtual machine.

Give it a name.

Select a simulated operating system.

Configure virtual hardware such as RAM, CPU cores, storage, and graphics memory.

Choose a virtual disk size.

Start the virtual machine.

Watch an animated BIOS/UEFI-style startup sequence.

Watch a simulated operating system boot sequence.

Enter an interactive simulated desktop.

Open applications inside the simulated OS.

Shut down, restart, pause, or reset the virtual machine.

Save the VM configuration in the browser.

Create snapshots of the simulated VM state.

View simulated resource usage.

Experiment with different configurations and operating systems.

The website should feel like a real technical application rather than a simple landing page.

1. OVERALL VISUAL DESIGN

Use a modern dark desktop-application interface inspired by professional virtualisation software, developer tools, operating-system settings panels, and futuristic computer laboratories.

The visual style should combine:

Dark graphite backgrounds

Deep charcoal panels

Subtle borders

Slightly rounded corners

Modern glass-like panels where appropriate

Technical interface elements

Terminal-inspired typography in selected areas

Clear icons

Smooth but restrained animations

Strong visual hierarchy

Professional spacing

High-quality responsive layouts

The interface should not look like a generic dashboard template.

The application should feel like a real piece of software called VM Lab.

Use a consistent design system throughout the entire application.

Include:

Responsive desktop layout

Tablet layout

Mobile layout

Keyboard-friendly navigation

Visible focus states

Accessible colour contrast

Semantic HTML

Reduced-motion support

Tooltips for unfamiliar technical controls

Confirmation dialogs for destructive actions

Avoid:

Excessive neon

Excessive gradients

Overly flashy animations

Fake real-world system access

Actual execution of shell commands

Access to the user's files

Any real virtualisation technology

2. APPLICATION STRUCTURE

Create the following main sections:

A. VM MANAGER

This is the main home screen after entering the application.

Display:

VM Lab logo

Application name

Navigation sidebar

“Create Virtual Machine” button

List of existing virtual machines

Recent activity

Storage overview

Quick statistics

The main dashboard should show cards such as:

Total Virtual Machines

Running VMs

Powered Off VMs

Total Simulated Storage

Snapshots Created

The VM list should show each machine as a professional card or table row.

Each VM should display:

VM name

Operating system

Status

RAM allocation

CPU cores

Storage size

Last used time

Snapshot count

Possible statuses:

Powered Off

Running

Paused

Starting

Shutting Down

Suspended

Use clear status indicators.

Each VM card should have actions:

Start

Open

Settings

Clone

Snapshot

Delete

Deleting a VM must show a confirmation dialog.

3. CREATE VIRTUAL MACHINE WIZARD

Create a multi-step VM creation wizard.

The wizard should have a clear progress indicator.

Step 1: Basic Information

Ask for:

Virtual machine name

Description

Operating system family

Example names:

Windows Longhorn Lab

MintOS Test Machine

Linux Playground

Retro Windows Lab

Experimental VM

Step 2: Operating System

Allow the user to choose from simulated operating systems.

Include fictional and historical OS profiles such as:

MintOS

A fictional modern experimental operating system created specifically for this application.

Aurora Linux

A fictional Linux-inspired system focused on customisation and development.

RetroDOS

A fictional DOS-inspired command-line operating system.

Nova Windows

A fictional modern graphical operating system inspired by contemporary desktop environments.

Longhorn Concept

A fictional early-development-inspired operating system with experimental glass-like interface concepts.

Classic Desktop

A fictional operating system inspired by older graphical desktop systems.

Each OS should have:

Name

Version

Release era

Interface type

Recommended RAM

Recommended storage

Difficulty level

Description

Visual theme

Do not directly copy copyrighted operating-system interfaces. Use original fictional designs inspired by broad eras and design concepts.

Step 3: Virtual Hardware

Allow the user to configure:

RAM

Virtual CPU cores

Virtual storage

Graphics memory

Network adapter toggle

Sound device toggle

USB controller toggle

Use sliders and dropdowns.

Display a live “Configuration Health” panel that evaluates whether the selected hardware is:

Underpowered

Balanced

Recommended

Overconfigured

For example:

“Your selected configuration should provide a smooth experience for this simulated OS.”

This is only a fictional simulation and should not claim to represent actual hardware performance.

Step 4: Virtual Disk

Allow the user to:

Create a new virtual disk

Choose disk size

Choose simulated disk type

Options:

Virtual SSD

Virtual HDD

Dynamic Disk

Fixed Disk

Show a visual storage allocation bar.

Step 5: Summary

Display a complete configuration summary:

VM name

Selected operating system

RAM

CPU cores

Storage

Graphics memory

Enabled virtual devices

Add:

Create Virtual Machine

When clicked, create the VM in local browser state.

4. VM DETAILS PAGE

When a user selects a VM, open a detailed management page.

Create a large header containing:

VM name

Operating system

Status

Power controls

Power controls:

Start

Pause

Resume

Restart

Shut Down

Force Power Off

Use realistic confirmation dialogs for actions such as Force Power Off.

Create tabs:

Overview

Console

Hardware

Storage

Snapshots

Activity

Settings

5. VM OVERVIEW

The Overview tab should show:

VM status

OS information

Uptime

Simulated CPU usage

Simulated RAM usage

Simulated storage usage

Network activity

Recent events

Use animated but subtle charts.

The metrics should be simulated and change slightly while the VM is running.

Example:

CPU Usage: 23%

Memory Usage: 2.4 GB / 4 GB

Storage Usage: 18.7 GB / 64 GB

Network Activity: 0.8 MB/s

These numbers are purely simulated.

Add a visual “Virtual Hardware” summary:

CPU

RAM

Storage

Graphics

Network

Audio

6. SIMULATED BOOT PROCESS

When the user starts a VM, do not immediately show the desktop.

Create a multi-stage boot sequence.

Stage 1: Virtual Hardware Initialisation

Display:

VM Lab Virtual BIOS

Memory test

CPU initialisation

Storage detection

Virtual device detection

Example visual messages:

“Initialising virtual processor…”

“Checking simulated memory…”

“Detecting virtual storage…”

“Initialising display adapter…”

Stage 2: Bootloader

Show a fictional bootloader interface.

For example:

VM LAB BOOT MANAGER

Select operating system:

MintOS

Press ENTER to continue

Do not use real operating-system boot screens or copyrighted logos.

Stage 3: Operating System Boot

Display a custom boot animation based on the selected fictional OS.

Each OS should have a different visual identity.

For example:

MintOS: clean modern startup animation

RetroDOS: text-based startup sequence

Aurora Linux: terminal-inspired boot process

Nova Windows: modern animated loading interface

Longhorn Concept: experimental glass-like startup

Add:

Loading progress

Boot messages

Animated logo or abstract symbol

“Press ESC to view details” option

The user should be able to skip the boot animation after it has been viewed once.

7. SIMULATED OPERATING SYSTEM DESKTOP

After booting, display a fully interactive simulated desktop.

This is the most important part of the application.

The desktop should contain:

Wallpaper

Taskbar or dock

Start menu or launcher

Desktop icons

System tray

Clock

Notifications

Window system

Users should be able to:

Open applications

Move windows

Minimise windows

Maximise windows

Close windows

Resize windows if practical

Switch between open applications

Use keyboard shortcuts

Create an original fictional interface. Do not clone Windows, macOS, or any other copyrighted operating system exactly.

8. SIMULATED APPLICATIONS

Include functional simulated applications inside the virtual OS.

File Manager

Create a fake file system.

Example folders:

Home

Documents

Downloads

Pictures

Projects

System

Applications

Users should be able to:

Navigate folders

Create folders

Create text files

Rename files

Delete simulated files

Open text files

Search the fake file system

All files must exist only in the application's simulated data layer.

Never access the user's real computer files.

Text Editor

Create a functional text editor.

Features:

New document

Open simulated file

Save simulated file

Basic text editing

Word count

Character count

Calculator

Create a working calculator inside the simulated OS.

Support:

Basic arithmetic

Decimals

Clear

Delete

Keyboard input

Settings

Create a simulated OS settings application.

Sections:

Appearance

Display

Personalisation

Sound

Network

Storage

System Information

Allow users to change:

Wallpaper

Accent colour

Theme

Interface density

Clock format

Changes should affect the simulated desktop.

System Monitor

Create a simulated task manager/system monitor.

Display:

Running applications

CPU usage

Memory usage

Storage activity

Network activity

Allow users to close simulated applications.

Terminal

Create a safe simulated terminal.

The terminal must NOT execute real commands.

It should support only predefined fictional commands such as:

help

clear

about

sysinfo

neofetch

apps

date

uptime

storage

memory

cpu

echo

history

Each command should return simulated output.

If a user types an unsupported command, display:

“Command not recognised in VM Lab simulation.”

Make it visually convincing but completely sandboxed.

9. SNAPSHOT SYSTEM

Create a snapshot feature inspired by virtual machine snapshots.

Users should be able to:

Create a snapshot

Name a snapshot

Add a description

View snapshot history

Restore a snapshot

Delete a snapshot

Display snapshots in a visual timeline.

Example:

Initial Installation
↓
Configured Desktop
↓
Installed Applications
↓
Experiment 1

When a snapshot is restored, update the simulated VM state.

Add a confirmation dialog before restoring or deleting snapshots.

10. VM CLONING

Allow users to clone an existing VM.

When cloning:

Ask for a new VM name

Allow the user to choose whether to copy snapshots

Create a new simulated VM with the same configuration

Display a progress animation while cloning.

Example:

Preparing virtual disk…

Copying simulated configuration…

Creating cloned machine…

Clone completed.

11. VM SETTINGS

Create a detailed settings panel.

Sections:

General

VM name

Description

OS profile

System

RAM

CPU cores

Boot priority

Display

Graphics memory

Resolution

Scaling

Storage

Virtual disk size

Disk type

Network

Network enabled/disabled

Simulated connection mode

Audio

Sound enabled/disabled

USB

USB controller enabled/disabled

Advanced

Reset simulated hardware

Clear simulated storage

Delete VM

Add warnings before destructive operations.

12. MULTIPLE OPERATING SYSTEMS

Create distinct visual themes for different simulated OS environments.

MintOS

Modern, clean, minimal, highly customisable.

RetroDOS

Command-line focused, monochrome terminal-style interface, keyboard-driven navigation.

Aurora Linux

Technical, modular, developer-focused, customisable panels.

Nova Windows

Familiar modern desktop concepts but with an original interface and branding.

Longhorn Concept

Experimental futuristic interface with translucent panels, visual widgets, and early-concept software design.

Classic Desktop

Retro-inspired graphical interface with a simpler layout and old-computer aesthetic.

Each OS should have:

Unique wallpaper

Unique desktop layout

Unique taskbar or launcher

Unique boot animation

Unique system settings

Unique default applications

Unique colour scheme

13. OS EXPLORATION MODE

Add a separate “Explore OS” section outside the VM manager.

This allows users to browse operating systems without creating a VM.

For every OS, display:

Description

Era

Interface style

Recommended virtual hardware

Screenshots or original UI previews

Interesting facts

Available applications

Difficulty level

Add a button:

“Create VM with this OS”

14. ACTIVITY LOG

Create a global activity log.

Examples:

VM created

VM started

VM paused

Snapshot created

Snapshot restored

VM cloned

Settings changed

Simulated application opened

Display:

Timestamp

Event type

VM name

Description

Add filtering by:

VM

Event type

Date

15. ONBOARDING EXPERIENCE

When the user first opens the application, show a short onboarding flow.

Screen 1:

“Welcome to VM Lab”

Screen 2:

“Create simulated virtual machines.”

Screen 3:

“Experiment with virtual hardware.”

Screen 4:

“Boot fictional operating systems.”

Screen 5:

“Explore interactive simulated desktops.”

Finish with:

“Create Your First VM”

Allow the user to skip onboarding.

16. DEMO MODE

Include a “Try Demo VM” button.

This should instantly create a preconfigured fictional VM called:

“MintOS Demo”

The user should be able to boot it immediately and explore the simulated desktop.

This makes the website immediately fun without requiring configuration.

17. EMPTY STATES

Design polished empty states.

For example:

No virtual machines yet.

“Your virtual laboratory is empty.”

Button:

“Create Your First VM”

For no snapshots:

“This machine has no snapshots yet.”

Button:

“Create Snapshot”

For no activity:

“Activity will appear here as you experiment.”

18. DATA PERSISTENCE

Use browser-side persistence so that simulated VMs remain available after refreshing the page.

Use local browser storage or another suitable client-side persistence mechanism.

Store:

VM configurations

VM status

Simulated files

Snapshots

Settings

Activity logs

Desktop customisation

Do not use real file-system access.

Do not execute real commands.

Do not run real virtual machines.

Everything should be a safe browser-based simulation.

19. INTERACTION QUALITY

Make every important control functional.

Avoid creating buttons that do nothing.

Examples:

Start must start the simulated boot sequence.

Pause must pause the simulated VM state.

Restart must trigger the boot process again.

Shut Down must show a shutdown animation.

Snapshot must save the current simulated state.

Restore must restore a previous simulated state.

Clone must create a new VM.

File Manager must interact with the simulated file system.

Settings must affect the simulated desktop.

Terminal must respond to supported simulated commands.

Use smooth transitions between:

VM manager

VM details

Boot screen

Simulated desktop

Applications

Settings

20. RESPONSIVE DESIGN

Desktop should be the primary experience because the application resembles a desktop virtualisation tool.

On smaller screens:

Collapse the sidebar

Use a mobile navigation menu

Stack dashboard cards

Make VM controls easily tappable

Allow the simulated desktop to scale appropriately

Make applications responsive

The interface should remain usable on phones and tablets.

21. ACCESSIBILITY

Include:

Keyboard navigation

Focus indicators

ARIA labels where necessary

Sufficient colour contrast

Reduced-motion mode

Screen-reader-friendly labels

Accessible modals

Escape key support for closing dialogs

No information conveyed by colour alone

22. FINAL EXPERIENCE

The final website should feel like an impressive interactive technical playground.

A user should be able to open the website and think:

“I can create my own virtual computer, configure its hardware, boot an operating system, open applications, use a fake terminal, create snapshots, and experiment with the entire environment.”

The website should feel more like a functional software product than a conventional website.

Prioritise:

A polished VM Manager.

A satisfying simulated boot process.

An interactive simulated desktop.

Functional simulated applications.

Snapshots and VM management.

Distinct fictional operating systems.

A professional, responsive, accessible interface.

Build the application with clean reusable components and a clear architecture so that additional fictional operating systems, applications, simulated hardware components, boot sequences, and features can easily be added in the future.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vmplayground.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/71b45586-5b0a-47b3-8270-a3468f59c866).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
